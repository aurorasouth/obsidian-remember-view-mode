import {App, PluginSettingTab, Setting} from "obsidian";
import type RememberViewModePlugin from "./main";

export type ViewMode = 'source' | 'preview';

export interface RememberViewModeSettings {
	rememberViewMode: boolean;
	fileViewModes: Record<string, ViewMode>;
}

export const DEFAULT_SETTINGS: RememberViewModeSettings = {
	rememberViewMode: true,
	fileViewModes: {},
}

export class RememberViewModeSettingTab extends PluginSettingTab {
	plugin: RememberViewModePlugin;

	constructor(app: App, plugin: RememberViewModePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	/** Build the settings tab UI (toggle for remember view mode). */
	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Remember view mode')
			.setDesc('Automatically remember and restore edit/preview mode for each note.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.rememberViewMode)
				.onChange(async (value) => {
					this.plugin.settings.rememberViewMode = value;
					await this.plugin.saveSettings();
				}));
	}
}
