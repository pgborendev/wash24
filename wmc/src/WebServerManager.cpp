#include "WebServerManager.h"

WebServerManager::WebServerManager(DeviceConfig& config) : server(80), config(config), deviceController(deviceController) {}

void WebServerManager::initialize() {
    setupStaticRoutes();
    setupLoginRoutes();
    setupSettingsRoutes();
    setupActionRoutes();
    setupDeviceControllerRoutes();
}

void WebServerManager::begin() {
    server.begin();
    Serial.println("HTTP server started");
}

void WebServerManager::setupStaticRoutes() 
{
    server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(SPIFFS, "/css/style.css", "text/css");
    });

    server.on("/", HTTP_GET, [this](AsyncWebServerRequest* request) {
        if (!checkAuthentication(request)) return;

        File file = SPIFFS.open("/index.html", "r");
        if (!file) {
            request->send(500, "text/plain", "Failed to open file");
            return;
        }

        String html = processIndexHTMLTemplate(file.readString());
        file.close();
        request->send(200, "text/html", html);
    });
}

void WebServerManager::setupSettingsRoutes() {
    server.on("/setting", HTTP_GET, [this](AsyncWebServerRequest *request) {
        if (!checkAuthentication(request)) return;
        File file = SPIFFS.open("/setting.html", "r");
        if (!file) {
            request->send(500, "text/plain", "Failed to open file");
            return;
        }
        
        String html = processHTMLTemplate(file.readString());
        file.close();
        request->send(200, "text/html", html);
    });

    server.on("/save_settings", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (!checkAuthentication(request)) return;
        Serial.println("Save Setting is called");
        DeviceConfig::Settings newSettings = config.getSettings();
        if (request->hasParam("device_name", true)) 
            newSettings.deviceName = request->getParam("device_name", true)->value();
        if (request->hasParam("wifi_ssid", true)) 
            newSettings.wifiSSID = request->getParam("wifi_ssid", true)->value();
        if (request->hasParam("wifi_pass", true)) 
            newSettings.wifiPass = request->getParam("wifi_pass", true)->value();
        if (request->hasParam("api_url", true)) 
            newSettings.apiUrl = request->getParam("api_url", true)->value();
        if (request->hasParam("client_id", true)) 
            newSettings.clientId = request->getParam("client_id", true)->value();
        if (request->hasParam("api_key", true)) 
            newSettings.apiKey = request->getParam("api_key", true)->value();
        if (request->hasParam("device_type", true)) 
            newSettings.deviceType = request->getParam("device_type", true)->value();
        if (request->hasParam("admin_user", true)) 
            newSettings.adminUser = request->getParam("admin_user", true)->value();
        if (request->hasParam("admin_pass", true)) 
            newSettings.adminPassword = request->getParam("admin_pass", true)->value();
        
        config.save(newSettings);
        request->redirect("/");
    });
}



void WebServerManager::setupActionRoutes() {
    server.on("/reboot", HTTP_GET, [this](AsyncWebServerRequest *request) {
        if (!checkAuthentication(request)) return;
        request->send(200, "text/plain", "Rebooting...");
        delay(1000);
        ESP.restart();
    });

    server.on("/factory_reset", HTTP_GET, [this](AsyncWebServerRequest *request) {
        if (!checkAuthentication(request)) return;
        String response = "<html><body><h1>Factory Resetting...</h1>"
                         "<script>setTimeout(() => location.href='/', 5000)</script>"
                         "</body></html>";
        request->send(200, "text/html", response);
        config.factoryReset();
        delay(1000);
        ESP.restart();
    });
}

void WebServerManager::setupLoginRoutes() {
    // Serve the login page
    server.on("/login", HTTP_GET, [](AsyncWebServerRequest* request) {
        request->send(SPIFFS, "/login.html", "text/html");
    });

    // Handle login form submission
    server.on("/login", HTTP_POST, [this](AsyncWebServerRequest* request) {
        const auto& settings = config.getSettings();

        // Verify parameters
        if (!request->hasParam("username", true) || !request->hasParam("password", true)) {
            request->send(400, "text/plain", "Missing credentials");
            return;
        }

        // Get credentials from the form
        String inputUser = request->getParam("username", true)->value();
        String inputPass = request->getParam("password", true)->value();

        // Validate credentials
        if (inputUser == settings.adminUser && inputPass == settings.adminPassword) {
            // Set a session cookie and redirect to the home page
            AsyncWebServerResponse* response = request->beginResponse(302); // 302 Redirect
            response->addHeader("Set-Cookie", "session=logged_in; Path=/; HttpOnly");
            response->addHeader("Location", "/"); // Redirect to home page
            request->send(response);

            Serial.println("Auth SUCCESS! Redirecting to home page.");
            return;
        }

        // Authentication failed
        Serial.println("Auth FAILED!");
        request->send(401, "text/plain", "Invalid username or password");
    });

    // Handle logout
    server.on("/logout", HTTP_GET, [this](AsyncWebServerRequest* request) {
        if (!checkAuthentication(request)) return;
        AsyncWebServerResponse* response = request->beginResponse(302);
        response->addHeader("Set-Cookie", "session=; Location=/; HttpOnly; Max-Age=0");
        response->addHeader("Location", "/login"); // Redirect to login page
        request->send(response);
    });
}

void WebServerManager::setupDeviceControllerRoutes() {
    server.on("/power_on", HTTP_GET, [this](AsyncWebServerRequest* request) {
        if (!checkAuthentication(request)) return;
        deviceController.pressPowerButton();
        request->redirect("/"); // Redirect back to the home page
    });

    server.on("/power_off", HTTP_GET, [this](AsyncWebServerRequest* request) {
        if (!checkAuthentication(request)) return;
    
        deviceController.pressPowerButton();
        request->redirect("/"); // Redirect back to the home page
    });

    server.on("/start", HTTP_GET, [this](AsyncWebServerRequest* request) {
        if (!checkAuthentication(request)) return;
        deviceController.pressStartButton();
        request->redirect("/"); // Redirect back to the home page
    });

    server.on("/program", HTTP_GET, [this](AsyncWebServerRequest* request) {
        if (!checkAuthentication(request)) return;

        // Check if the "select" query parameter is provided
        if (request->hasParam("select")) {
            String selectParam = request->getParam("select")->value();
            int selectingProgram = selectParam.toInt(); // Convert the parameter to an integer

            // Validate the program index
            if (selectingProgram >= DeviceController::FUZZY && selectingProgram <= DeviceController::TUBE_CLEANING) {
                deviceController.pressProgramButton(selectingProgram); // Call the function with the selected program
            } else {
                Serial.println("Invalid program index received.");
            }
        } else {
            Serial.println("No program index provided.");
        }

        request->redirect("/"); // Redirect back to the home page
    });

    server.on("/pause", HTTP_GET, [this](AsyncWebServerRequest* request) {
        if (!checkAuthentication(request)) return;
        // Pause the washing cycle
        deviceController.pressStartButton();
        Serial.println("Pausing washing cycle...");
        request->redirect("/"); // Redirect back to the home page
    });

    server.on("/resume", HTTP_GET, [this](AsyncWebServerRequest* request) {
        if (!checkAuthentication(request)) return;
        deviceController.pressStartButton(); // Resume the washing cycle
        Serial.println("Resuming washing cycle...");
        request->redirect("/"); // Redirect back to the home page
    });

}

String WebServerManager::processHTMLTemplate(const String& html) {
    String processed = html;
    const auto& settings = config.getSettings();
    
    processed.replace("%DEVICE_NAME%", settings.deviceName);
    processed.replace("%WIFI_SSID%", settings.wifiSSID);
    processed.replace("%WIFI_PASS%", settings.wifiPass);
    processed.replace("%API_URL%", settings.apiUrl);
    processed.replace("%CLIENT_ID%", settings.clientId);
    processed.replace("%API_KEY%", settings.apiKey);

    processed.replace("%ADMIN_USER%", settings.adminUser);
    processed.replace("%ADMIN_PASS%", settings.adminPassword);
    
    processed.replace("%WASHING_MACHINE_SELECTED%", 
                     settings.deviceType == "washing_machine" ? "selected" : "");
    processed.replace("%VENDING_MACHINE_SELECTED%", 
                     settings.deviceType == "vending_machine" ? "selected" : "");
    processed.replace("%DRYER_MACHINE_SELECTED%", 
                     settings.deviceType == "dryer_machine" ? "selected" : "");
    
    return processed;
}

String WebServerManager::processIndexHTMLTemplate(const String& html) {
    String processed = html;
    const auto& settings = config.getSettings();

    // Replace placeholders with settings values
    processed.replace("%DEVICE_NAME%", settings.deviceName);
    processed.replace("%WIFI_SSID%", settings.wifiSSID);
    processed.replace("%API_URL%", settings.apiUrl);
    processed.replace("%CLIENT_ID%", settings.clientId);
    processed.replace("%API_KEY%", settings.apiKey);

    // Replace placeholders with network status
    processed.replace("%WIFI_STATUS%", WiFi.isConnected() ? "Connected" : "Disconnected");
    processed.replace("%IP_ADDRESS%", WiFi.localIP().toString());
    processed.replace("%SUBNET_MASK%", WiFi.subnetMask().toString());

    // Replace placeholder with washing machine status
    String machineStatus;
    String controlButtons;
    switch (deviceController.getStatus()) {
        case DeviceController::POWER_OFF:
            machineStatus = "Power Off";
            controlButtons = "<button type='button' class='btn btn-green' onclick=\"location.href='/power_on'\">Power On</button>";
            break;
        case DeviceController::POWER_ON:
            machineStatus = "Power On";
            controlButtons = "<button type='button' class='btn btn-red' onclick=\"location.href='/power_off'\">Power Off</button>"
                             "<button type='button' class='btn btn-primary' onclick=\"location.href='/start'\">Start</button>";
            break;
        case DeviceController::RUN:
            machineStatus = "Run";
            controlButtons = "<button type='button' class='btn btn-red' onclick=\"location.href='/power_off'\">Power Off</button>"
                             "<button type='button' class='btn btn-blue' onclick=\"location.href='/pause'\">Pause</button>";
            break;
        case DeviceController::PAUSE:
            machineStatus = "Paused";
            controlButtons = "<button type='button' class='btn btn-red' onclick=\"location.href='/power_off'\">Power Off</button>"
                             "<button type='button' class='btn btn-yellow' onclick=\"location.href='/resume'\">Resume</button>";
            break;
    }

    // Dynamically generate program buttons

    processed.replace("%MACHINE_STATUS%", machineStatus);
    processed.replace("%CONTROL_BUTTONS%", controlButtons);

    Serial.println("Machine Status: " + machineStatus);

    if (deviceController.getStatus() == DeviceController::POWER_ON) {
        String programButtons = "<div class='content-section'>";
        programButtons += "<h2>Select Program:</h2>";
        programButtons += "<div class='controlButtons'>";

        int currentProgram = static_cast<int>(deviceController.getCurrentProgram());

        for (int program = DeviceController::FUZZY; program <= DeviceController::TUBE_CLEANING; ++program) {
            String programName;
            String buttonClass = (program == currentProgram) ? "btn btn-green" : "btn btn-gray";

            switch (program) {
                case DeviceController::FUZZY: programName = "Fuzzy"; break;
                case DeviceController::WOOL: programName = "Wool"; break;
                case DeviceController::QUICK_WASH: programName = "Quick Wash"; break;
                case DeviceController::JEANS: programName = "Jeans"; break;
                case DeviceController::SMART_CLEAN: programName = "Smart Clean"; break;
                case DeviceController::SILENT: programName = "Silent"; break;
                case DeviceController::FAVORITE: programName = "Favorite"; break;
                case DeviceController::TUBE_CLEANING: programName = "Tube Cleaning"; break;
            }

            programButtons += "<button type='button' class='" + buttonClass + "' onclick=\"location.href='/program?select=" + String(program) + "'\">" + programName + "</button>";
        }

        programButtons += "</div>";
        programButtons += "</div>";
        processed.replace("%PROGRAM_SECTION%", programButtons);
    } else {
        processed.replace("%PROGRAM_SECTION%", "<p>No program available. Power is off.</p>");
    }

    return processed;
}

bool WebServerManager::isAuthenticated(AsyncWebServerRequest* request) {
    if (request->hasHeader("Cookie")) {
        String cookie = request->header("Cookie");
        Serial.printf("Cookie Header: %s\n", cookie.c_str()); // Debugging
        if (cookie.indexOf("session=logged_in") != -1) {
            return true; // User is authenticated
        }
    }
    return false; // User is not authenticated
}

bool WebServerManager::checkAuthentication(AsyncWebServerRequest* request) {
    if (!isAuthenticated(request)) {
        request->redirect("/login");
        return false; // User is not authenticated
    }
    return true; // User is authenticated
}