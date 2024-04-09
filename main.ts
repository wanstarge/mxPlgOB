/**
 * @copyright (C),2024, wanxingge
 * @file       main.ts
 * @date       2024-04-09 14:44:24
 * @author     wanxingge
 * @memberof   wanxingge@foxmail.com
 * @note       
*/
/*------------------------Import-------------------------*/
import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
/*-----------------------Interface------------------------*/

interface regexSetting {
	regexName: string;
	srcRegex: string;
	destRegex: string;
}

interface mxPlgSettings {
	regexSettings: Array<{
		regexName: string;
		srcRegex: string;
		destRegex: string;
	}>;
	count: number;
}

/*--------------------Global Variable---------------------*/
var DEFAULT_SETTINGS = {
	regexSettings: [
		{
			regexName: "Wiki2MdForImg",
			srcRegex: "![[(.*)/(.*?)(|.*)?]]",
			destRegex: "![$2$3]($1/$2)",
		},
		{
			regexName: "Wiki2MdForArt",
			srcRegex: "[[(.*?)(#.*?)?(?:|(.*?))?]]",
			destRegex: "[$3]($1$2)",
		},
		{
			regexName: "Md2WikiForImg",
			srcRegex: "![.*?([|].*?)?]((.*?))",
			destRegex: "![[$2$1]]",
		},
		{
			regexName: "Md2WikiForArt",
			srcRegex: "[(.*?)]((.*?))",
			destRegex: "[[$2|$1]]",
		},
	],
	count: 4,
};

/*-----------------------Base Class------------------------*/
/**
 * @brief   setting tab
 */

/*-----------------------Main Class------------------------*/

export default class mxPlg extends Plugin {
	settings: mxPlgSettings;
	pathToRuleSettings = this.app.vault.configDir;
	dataFile = "/regexData.json";

	log(message?: any, ...optionalParams: any[]) {
		// comment this to disable logging
		console.log("[mxPlg]: " + message);
	}
	async onload() {
        this.log("loading.......");
		await this.loadSettings();
        this.log(this.settings.regexSettings[0].srcRegex,this.settings.regexSettings[0].destRegex);
	} 
    onunload(): void {
        this.saveSettings();
    }
	async resetToDefaults() {
		this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
		await this.saveSettings();
		new Notice("Settings have been reset to defaults.");
	}
	async loadSettings() {
		try {
            this.settings = Object.assign(
				{},
				DEFAULT_SETTINGS,
				await this.loadData()
			);
		} catch (e) {
			console.error("Error loading settings:", e);
			// await this.resetToDefaults();
		}
	}
	async saveSettings() {
		await this.saveData(this.settings);
        this.log("settings has been saved");
	}
}

class mxPlgSettingTab extends PluginSettingTab {
	plugin: mxPlg;
	constructor(app: App, plugin: mxPlg) {
		super(app, plugin);
	}
    display() {
        
    }
}