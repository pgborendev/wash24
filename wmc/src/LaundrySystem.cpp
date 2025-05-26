#include "LaundrySystem.h"

LaundrySystem::LaundrySystem() : wifi(config), webServer(config) {}

void LaundrySystem::setup() {
    delay(1000); // Allow serial to stabilize
    
    if (!SPIFFS.begin(true)) {
        Serial.println("ERROR: SPIFFS Mount Failed");
        while (1) delay(1000);
    }

    if (!SPIFFS.exists("/login.html")) {
        Serial.println("ERROR: Missing login.html");
        while(1) delay(1000);
    }

    config.load();
    hardware.initialize();
    wifi.initialize();
    webServer.initialize();
    webServer.begin();

    Serial.println("System initialized");
}

void LaundrySystem::loop() {
    // Main application loop would go here
}