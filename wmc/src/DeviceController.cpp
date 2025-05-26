#include "DeviceController.h"
#include <esp_task_wdt.h>

DeviceController::DeviceController() {}

void DeviceController::initialize() {
    pinMode(POWER_BTN_PIN, OUTPUT);
    pinMode(START_BTN_PIN, OUTPUT);
    pinMode(PROGRAM_BTN_PIN, OUTPUT);
    // pinMode(WATER_LEVEL_BTN_PIN, OUTPUT);
    // pinMode(WASH_BTN_PIN, OUTPUT);
    // pinMode(RINSE_BTN_PIN, OUTPUT);
    // pinMode(SPIN_BTN_PIN, OUTPUT);

    digitalWrite(POWER_BTN_PIN, LOW);
    digitalWrite(START_BTN_PIN, LOW);
    
    digitalWrite(PROGRAM_BTN_PIN, LOW);

    ledcSetup(0, 5000, 8);

    // ledcAttachPin(BUZZER_PIN, 0);
}

void tubeCleaning() {
    
}

void DeviceController::handleButtonPress(int pin) {
    digitalWrite(pin, HIGH);
    delay(BUTTON_PRESS_DURATION);
    digitalWrite(pin, LOW);
    delay(BUTTON_PRESS_DURATION);
}

void DeviceController::pressPowerButton() {
    if (status == POWER_OFF) {
        Serial.println("Powering on...");
        handleButtonPress(POWER_BTN_PIN);
        setStatus(POWER_ON);
    } else {
        Serial.println("Powering off...");
        handleButtonPress(POWER_BTN_PIN);
        setStatus(POWER_OFF);
    }
}

void DeviceController::pressProgramButton() {
    if (status == POWER_ON) {
        Serial.println("Starting tube cleaning...");
        handleButtonPress(PROGRAM_BTN_PIN); 
    } else {
        Serial.println("Tube cleaning not available in this mode.");
    }
}

void DeviceController::pressProgramButton(int selectingProgram) {
    if (selectingProgram < FUZZY || selectingProgram > TUBE_CLEANING) {
        // Invalid program, return without doing anything
        return;
    }

    while (currentProgram != static_cast<Programs>(selectingProgram)) {
        // Simulate pressing the program button
        handleButtonPress(PROGRAM_BTN_PIN);
       

        // Update the current program (simulate cycling through programs)
        currentProgram = static_cast<Programs>((currentProgram + 1) % (TUBE_CLEANING + 1));
        Serial.print("Switching to program: ");
        Serial.println(currentProgram);

        // Feed the watchdog to prevent it from triggering
        esp_task_wdt_reset();
    }
}

void DeviceController::pressStartButton() {
    if (status == POWER_ON) {
        Serial.println("Starting washing cycle...");
        handleButtonPress(START_BTN_PIN);
        status = RUN;
    } else if (status == RUN) {
        Serial.println("Pausing washing cycle...");
        handleButtonPress(START_BTN_PIN);
        status = PAUSE;
    } else if (status == PAUSE) {
        Serial.println("Resuming washing cycle...");
        handleButtonPress(START_BTN_PIN);
        status = RUN;
    }

}

void DeviceController::startWashingCycle() {
   
}

void DeviceController::setStatus(Status newStatus) {
    status = newStatus;

    if (status == POWER_OFF) {
        currentProgram = static_cast<Programs>(-1); // Set program to null (invalid state)
    } else if (status == POWER_ON) {
        currentProgram = FUZZY; // Reset program to FUZZY when powered on
    }
}


// void DeviceController::playSound(int melody[], size_t melodySize, int noteDuration) {
//     for (size_t i = 0; i < melodySize; i++) {
//         tone(BUZZER_PIN, melody[i], noteDuration);
//         delay(noteDuration * 1.3);
//     }
//     noTone(BUZZER_PIN);
// }

// void DeviceController::pulseSound() {
//     int melody[] = {NOTE_E5, NOTE_G5, NOTE_C5};
//     playSound(melody, sizeof(melody)/sizeof(melody[0]), 150);
// }

// void DeviceController::startSound() {
//     int melody[] = {NOTE_C4, NOTE_E4, NOTE_G4, NOTE_C5, NOTE_G4};
//     playSound(melody, sizeof(melody)/sizeof(melody[0]), 150);
// }

// void DeviceController::singleBeep() {
//     tone(BUZZER_PIN, NOTE_C4, 500);
//     delay(500);
//     noTone(BUZZER_PIN);
// }