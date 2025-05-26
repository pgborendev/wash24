#pragma once

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// OLED display configuration
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C
#define OLED_SDA 21
#define OLED_SCL 22

class DisplayManager {
public:
    DisplayManager();
    bool initialize();
    void clear();
    void displayNeZha();
    void printMessage(const String& message, int textSize = 1, int x = 0, int y = 0);
    void println(const String& message, int textSize = 1, int x = 0, int y = 0); // New method

private:
    Adafruit_SSD1306 display;
    static const uint8_t epd_bitmap_nezha[];
};