#include "WiFiManager.h"

const char* WiFiManager::AP_SSID = "ESP32_Washer_Setup";
const char* WiFiManager::AP_PASSWORD = "12345678";

WiFiManager::WiFiManager(DeviceConfig& config) : config(config) {}

void WiFiManager::initialize() {
    // Case 1: No credentials configured -> Start AP immediately
    if (config.getSettings().wifiSSID.isEmpty()) {
        startAccessPoint();
        return;
    }

    // Case 2: Try connecting to WiFi
    Serial.println("Connecting to WiFi: " + config.getSettings().wifiSSID);
    
    WiFi.mode(WIFI_STA);
    WiFi.begin(config.getSettings().wifiSSID.c_str(), config.getSettings().wifiPass.c_str());
    
    unsigned long startTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startTime < 10000) {
        delay(500);
        Serial.print(".");
    }

    // Case 2a: Connection successful
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
        return;
    }

    // Case 2b: Connection failed -> Fall back to AP
    Serial.println("\nERROR: WiFi Connection Failed");
    startAccessPoint();
}

void WiFiManager::startAccessPoint() {
    Serial.println("Starting in Access Point Mode");
    
    IPAddress localIP(192, 168, 0, 1);
    IPAddress gateway(192, 168, 0, 1);
    IPAddress subnet(255, 255, 255, 0);
    
    if (!WiFi.softAPConfig(localIP, gateway, subnet)) {
        Serial.println("ERROR: AP Config Failed");
    }
    
    if (!WiFi.softAP(AP_SSID, AP_PASSWORD)) {
        Serial.println("ERROR: AP Start Failed");
        return; // Critical failure
    }
    
    apMode = true;
    Serial.println("AP IP: " + WiFi.softAPIP().toString());
}

bool WiFiManager::isConnected() const {
    return WiFi.status() == WL_CONNECTED;
}

String WiFiManager::getIPAddress() const {
    return apMode ? WiFi.softAPIP().toString() : WiFi.localIP().toString();
}