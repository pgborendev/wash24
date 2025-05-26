#include <Arduino.h>
#include "LaundrySystem.h"
#include "DisplayManager.h"

LaundrySystem laundrySystem;
DisplayManager displayManager;

void setup() {
    Serial.begin(115200);

    if (!displayManager.initialize()) {
        Serial.println("Failed to initialize display. Halting.");
        while (true); // Halt if the display fails to initialize
    }

    laundrySystem.setup();
}

void loop() {
    laundrySystem.loop();
    displayManager.displayNeZha();
    // displayManager.clear(); // Clear the display before printing new messages
    // displayManager.println("Wash24", 2, 0, 5);
    // displayManager.println("Welcome!", 2, 0, 30);
    delay(5000); // Display for 5 seclsonds
}