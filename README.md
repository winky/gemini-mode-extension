# Gemini Thinking Mode Auto-Enabler

A Chrome extension that automatically enables "Thinking Mode" on Google Gemini AI chat.

## Features

- Automatically selects "Thinking Mode" when opening Gemini
- Re-enables on new chat sessions
- Skips if already in Thinking Mode
- Respects manual mode changes (won't override user's choice within the same chat)

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
- Users who prefer "Thinking Mode" responses by default

## Notes

- May stop working if Google updates the Gemini UI
- Supports both English and Japanese UI

## Privacy

This extension does NOT collect any user data. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## License

MIT License
