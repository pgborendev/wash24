// src/seed/seed.command.ts
import { Command, Console } from "nestjs-console";
import { SeedService } from "./seed.service";

@Console()
export class SeedCommand {
	constructor(private readonly seedService: SeedService) {}

	@Command({
		command: "seed:roles",
		description: "Seed initial default data to database",
	})
	async seedRoles() {
		console.log("Starting role seeding default data...");
		await this.seedService.seedDefaultData();
	}
}
