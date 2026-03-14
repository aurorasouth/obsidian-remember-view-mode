
[![GitHub Release](https://img.shields.io/github/v/release/aurorasouth/obsidian-remember-view-mode)](https://github.com/aurorasouth/obsidian-remember-view-mode/releases)
[![License: MIT](https://img.shields.io/github/license/aurorasouth/obsidian-remember-view-mode)](https://github.com/aurorasouth/obsidian-remember-view-mode/blob/master/LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/aurorasouth)


# Remember View Mode
Remembers and restores the view mode for each note individually. Switch back to a note and it'll open in whichever mode you were using last (editing or reading).
## How it works
When there is a **`layout-change`** event the view mode is stored in `<Vault>/.obsidian/plugins/remember-view-mode/data.json`:
```json
{
  "rememberViewMode": true,
  "fileViewModes": {
    "your-note.md": "source",
    "your-note2.md": "preview",
    "inbox.md": "source"
  }
}
```
When there is an **`active-leaf-change`** or **`file-open`** event the plugin checks whether you have a saved view mode for it and restores it automatically.
