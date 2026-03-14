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

##
<br>
<div align="center">
  <a href="https://www.buymeacoffee.com/aurorasouth" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;">
  </a>
</div>
