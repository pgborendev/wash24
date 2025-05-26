// HardwareController.h
#pragma once
#include <Arduino.h>
#include "pitches.h"

class DeviceController {
public:
    enum Pins {
        POWER_BTN_PIN = 23,
        START_BTN_PIN = 19,
        PROGRAM_BTN_PIN = 18,
        // WATER_LEVEL_BTN_PIN = 19,
        // WASH_BTN_PIN = 18,
        // RINSE_BTN_PIN = 5,
        // SPIN_BTN_PIN = 4
    };

    enum Programs {
        FUZZY = 0,
        WOOL = 1,
        QUICK_WASH = 2,
        JEANS = 3,
        SMART_CLEAN = 4,
        SILENT = 5,
        FAVORITE = 6,
        TUBE_CLEANING = 7
    };

    enum Status {
        POWER_OFF,
        POWER_ON,
        PAUSE,
        RUN
    };

    DeviceController();
    void initialize();
    void handleButtonPress(int pin);
    void startWashingCycle();

    void pressPowerButton();
    void pressStartButton();
    void pressProgramButton();
    void pressProgramButton(int selectingProgram); // New function declaration
    void tubeCleaning();
    void setStatus(Status newStatus); // New method to handle status changes
    Status getStatus() const { return status; }
    Programs getCurrentProgram() const { return currentProgram; }

private:
    Status status = POWER_OFF; 
    Programs currentProgram = FUZZY; 
    static const unsigned long BUTTON_PRESS_DURATION = 500;
    static const unsigned long WASH_CYCLE_DELAY = 1000;
};



// void playSound(int melody[], size_t melodySize, int noteDuration);
// void pulseSound();
// void startSound();
// void singleBeep();