// LaundrySystem.h
#pragma once
#include <stdint.h>
#include <Arduino.h>
#include "pitches.h"
#include "Config.h"
#include "DeviceController.h"
#include "WiFiManager.h"
#include "WebServerManager.h"

class LaundrySystem {
public:
    LaundrySystem();
    void setup();
    void loop();

private:
    DeviceConfig config;
    DeviceController hardware;
    WiFiManager wifi;
    WebServerManager webServer;
};