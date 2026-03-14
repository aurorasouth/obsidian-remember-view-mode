import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, RememberViewModeSettings, RememberViewModeSettingTab } from "./settings";
import { registerViewModePersistence, saveActiveLeafMode } from "./view-mode-persistence";

export default class RememberViewModePlugin extends Plugin {
	settings: RememberViewModeSettings;

	async onload() {
		await this.loadSettings();

		registerViewModePersistence(this);

		this.addSettingTab(new RememberViewModeSettingTab(this.app, this));
	}

	onunload() {
		void saveActiveLeafMode(this);
	}

	async loadSettings() {
		const data = (await this.loadData()) as Partial<RememberViewModeSettings> & { persistViewModePerFile?: boolean } | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);

		if (data && "persistViewModePerFile" in data) {
			this.settings.rememberViewMode = data.persistViewModePerFile ?? DEFAULT_SETTINGS.rememberViewMode;
			delete (this.settings as unknown as Record<string, unknown>).persistViewModePerFile;
		}
		if (typeof this.settings.fileViewModes !== "object" || this.settings.fileViewModes === null) {
			this.settings.fileViewModes = {};
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
