#include "Config.h"

DeviceConfig::DeviceConfig() {
    load();
}

void DeviceConfig::load() {
    preferences.begin("settings", true);
    currentSettings.deviceName = preferences.getString("deviceName", "");
    currentSettings.wifiSSID = preferences.getString("wifiSSID", "");
    currentSettings.wifiPass = preferences.getString("wifiPass", "");
    currentSettings.apiUrl = preferences.getString("apiUrl", "");
    currentSettings.clientId = preferences.getString("clientId", "");
    currentSettings.apiKey = preferences.getString("apiKey", "");
    currentSettings.deviceType = preferences.getString("deviceType", "");
    currentSettings.adminUser = preferences.getString("adminUser", "admin");
    currentSettings.adminPassword = preferences.getString("adminPassword", "admin");
    preferences.end();
}

void DeviceConfig::save(const Settings& newSettings) {
    preferences.begin("settings", false);
    preferences.putString("deviceName", newSettings.deviceName);
    preferences.putString("wifiSSID", newSettings.wifiSSID);
    preferences.putString("wifiPass", newSettings.wifiPass);
    preferences.putString("apiUrl", newSettings.apiUrl);
    preferences.putString("clientId", newSettings.clientId);
    preferences.putString("apiKey", newSettings.apiKey);
    preferences.putString("deviceType", newSettings.deviceType);
    preferences.putString("adminUser", newSettings.adminUser);
    preferences.putString("adminPassword", newSettings.adminPassword);
    preferences.end();
    currentSettings = newSettings;
}

void DeviceConfig::factoryReset() {
    preferences.begin("settings", false);
    preferences.clear();
    preferences.end();
    currentSettings = Settings();
}

const DeviceConfig::Settings& DeviceConfig::getSettings() const {
    return currentSettings;
}