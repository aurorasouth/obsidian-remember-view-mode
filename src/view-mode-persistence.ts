import { MarkdownView, type TFile, type WorkspaceLeaf } from "obsidian";
import type RememberViewModePlugin from "./main";
import type { ViewMode } from "./settings";

const SAVE_SUPPRESS_AFTER_RESTORE_MS = 400;
const LAYOUT_SAVE_DEBOUNCE_MS = 150;

function getActiveMarkdownLeaf(plugin: RememberViewModePlugin): WorkspaceLeaf | null {
	return plugin.app.workspace.getActiveViewOfType(MarkdownView)?.leaf ?? null;
}

function writeModeToSettings(plugin: RememberViewModePlugin, leaf: WorkspaceLeaf | null): void {
	if (!leaf) return;
	const view = leaf.view as MarkdownView | undefined;
	if (!view?.getMode || !view.file) return;
	const mode = view.getMode();
	if (mode === "source" || mode === "preview") {
		plugin.settings.fileViewModes[view.file.path] = mode;
		void plugin.saveSettings();
	}
}

export function registerViewModePersistence(plugin: RememberViewModePlugin): void {
	let lastRestoredPath: string | null = null;
	let lastRestoredTime = 0;

	const saveModeForLeaf = (leaf: WorkspaceLeaf | null) => {
		if (!leaf || !plugin.settings.rememberViewMode) return;
		const view = leaf.view as MarkdownView | undefined;
		if (!view?.getMode || !view.file) return;
		if (
			lastRestoredPath === view.file.path &&
			Date.now() - lastRestoredTime < SAVE_SUPPRESS_AFTER_RESTORE_MS
		) {
			return;
		}
		writeModeToSettings(plugin, leaf);
	};

	const applyModeToLeaf = (leaf: WorkspaceLeaf, saved: ViewMode, view: MarkdownView) => {
		const current = view.getMode();
		if (saved === current) return;
		const state = leaf.getViewState();
		const stateState = state.state && typeof state.state === "object" ? state.state : {};
		const newState = {
			...state,
			state: { ...stateState, mode: saved },
		};
		void leaf.setViewState(newState);
		lastRestoredPath = view.file?.path ?? null;
		lastRestoredTime = Date.now();
	};

	const restoreModeForLeaf = (leaf: WorkspaceLeaf | null, defer: boolean) => {
		if (!leaf || !plugin.settings.rememberViewMode) return;
		const view = leaf.view as MarkdownView | undefined;
		if (!view?.getMode || !view.file) return;
		const saved = plugin.settings.fileViewModes[view.file.path];
		if (!saved) return;
		const run = () => applyModeToLeaf(leaf, saved, view);
		if (defer) {
			setTimeout(run, 0);
		} else {
			run();
		}
	};

	let layoutSaveTimeout: ReturnType<typeof setTimeout> | null = null;
	plugin.registerEvent(
		plugin.app.workspace.on("layout-change", () => {
			if (layoutSaveTimeout !== null) clearTimeout(layoutSaveTimeout);
			layoutSaveTimeout = setTimeout(() => {
				layoutSaveTimeout = null;
				saveModeForLeaf(getActiveMarkdownLeaf(plugin));
			}, LAYOUT_SAVE_DEBOUNCE_MS);
		})
	);
	plugin.register(() => {
		if (layoutSaveTimeout !== null) clearTimeout(layoutSaveTimeout);
	});

	plugin.registerEvent(
		plugin.app.workspace.on("active-leaf-change", (leaf: WorkspaceLeaf | null) => {
			restoreModeForLeaf(leaf, true);
		})
	);

	plugin.registerEvent(
		plugin.app.workspace.on("file-open", (file: TFile | null) => {
			if (!file || !plugin.settings.rememberViewMode) return;
			const leaf = getActiveMarkdownLeaf(plugin);
			const view = leaf?.view as MarkdownView | undefined;
			if (view?.file?.path === file.path) {
				restoreModeForLeaf(leaf, true);
			}
		})
	);

	restoreModeForLeaf(getActiveMarkdownLeaf(plugin), true);
}

export function saveActiveLeafMode(plugin: RememberViewModePlugin): void {
	if (!plugin.settings.rememberViewMode) return;
	writeModeToSettings(plugin, getActiveMarkdownLeaf(plugin));
}
