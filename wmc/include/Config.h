// Config.h
#pragma once
#include <Preferences.h>
#include <Arduino.h>

class DeviceConfig {
public:
    struct Settings {
        String deviceName;
        String wifiSSID;
        String wifiPass;
        String apiUrl;
        String clientId;
        String apiKey;
        String deviceType;
        String adminUser = "admin";
        String adminPassword = "admin";
    };

    DeviceConfig();
    void load();
    void save(const Settings& newSettings);
    void factoryReset();
    const Settings& getSettings() const;

private:
    Preferences preferences;
    Settings currentSettings;
};