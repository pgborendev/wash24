// WiFiManager.h
#pragma once
#include <WiFi.h>
#include <Arduino.h>
#include <pins_arduino.h>
#include "Config.h"

class WiFiManager {
public:
    WiFiManager(DeviceConfig& config);
    void initialize();
    bool isConnected() const;
    String getIPAddress() const;
    void startAccessPoint(); 
    

private:
    static const char* AP_SSID;
    static const char* AP_PASSWORD;
    
    DeviceConfig& config;
    bool apMode = false;
};