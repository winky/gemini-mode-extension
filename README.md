# Gemini Mode Auto-Enabler

A Chrome extension that automatically enables your preferred mode (Thinking Mode or Pro Mode) on Google Gemini AI chat.

## Features

- Automatically selects your chosen mode when opening Gemini
- Choose between **Thinking Mode**, **Pro Mode**, or **Disabled** via the popup
- Settings are saved and synced across devices via Chrome storage
- Re-enables on new chat sessions
- Skips if the target mode is already selected
- Respects manual mode changes (won't override user's choice within the same chat)
- Supports both English and Japanese UI

## Usage

Click the extension icon in the toolbar to open the settings popup and select your preferred mode:

| Mode | Description |
|---|---|
| Thinking Mode | Automatically enables Thinking Mode for deeper responses |
| Pro Mode | Automatically enables Pro Mode for the highest-performance model |
| Disabled | No automatic mode switching |

## Installation

### From Chrome Web Store (Recommended)
*Coming soon*

### Developer Installation
1. Clone or download this repository
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Open `chrome://extensions` in Chrome
4. Enable "Developer mode" in the top right
5. Click "Load unpacked"
6. Select the `dist/` folder

## Target Users

- Gemini AI Pro plan subscribers
- Users who prefer a specific mode (Thinking or Pro) enabled by default

## Notes

- May stop working if Google updates the Gemini UI
- Thinking Mode and Pro Mode require an active Gemini Advanced subscription

## Privacy

This extension does NOT collect any user data. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## License

MIT License
