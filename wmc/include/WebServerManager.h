// WebServerManager.h
#pragma once
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include "Config.h"
#include "DeviceController.h"

class WebServerManager {
public:
    WebServerManager(DeviceConfig& config);
    void initialize();
    void begin();
    
private:
    AsyncWebServer server;
    DeviceConfig& config;
    DeviceController deviceController;
    void setupStaticRoutes();
    void setupSettingsRoutes();
    void setupActionRoutes();
    void setupLoginRoutes();
    void setupDeviceControllerRoutes();
    String processHTMLTemplate(const String& html);
    String processIndexHTMLTemplate(const String& html) ;
    void loadAdminCredentials();
    bool checkAuthentication(AsyncWebServerRequest* request);
    bool isAuthenticated(AsyncWebServerRequest* request);
};