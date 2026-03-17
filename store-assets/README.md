# Chrome Web Store Assets

## Required Files

### 1. Icons
- **icon_128x128.png** - Store icon (required)

### 2. Promotional Images
- **small_promo_440x280.png** - Small promotional tile (recommended)
- **large_promo_920x680.png** - Marquee tile (optional)
- **marquee_1400x560.png** - Marquee image (optional)

### 3. Screenshots
- **screenshot_1.png** - Popup UI showing mode selection
- **screenshot_2.png** - Gemini chat with Thinking Mode enabled
- Size: 1280x800 or 640x400 recommended
- Minimum 1, maximum 5

## Store Listing Information

### Name (max 45 characters)
Gemini Mode Auto-Enabler

### Summary (max 132 characters)
Automatically enables Thinking Mode or Pro Mode on Google Gemini AI chat. Choose your preferred mode via the popup.

### Detailed Description
```
A simple utility for Gemini AI Pro plan users.

【Features】
• Choose between Thinking Mode, Pro Mode, or Disabled via the popup
• Automatically applies your chosen mode when opening Gemini
• Re-enables on new chat sessions
• Skips if the target mode is already selected
• Respects manual mode changes within the same chat

【Who is this for?】
• Gemini AI Pro plan subscribers
• Users who prefer a specific mode (Thinking or Pro) enabled by default
• Those who want to skip manual mode switching every session

【Privacy】
This extension does NOT collect any user data.
Your mode preference is stored locally using Chrome's built-in storage and is never sent anywhere.

【Supported Languages】
English and Japanese UI
```

### Category
Productivity

---

## Permission Justifications

Chrome Web Store の申請時に「権限の理由」欄へ記載する文章です。

### `storage` 権限

**日本語:**
> ポップアップで選択したモード設定（思考モード・Proモード・無効のいずれか）を保存・復元するために使用します。設定は `chrome.storage.sync` に保存され、ユーザーのデバイス間で同期されます。収集・送信するユーザーデータはありません。

**English:**
> Used to save and restore the user's preferred mode setting (Thinking Mode, Pro Mode, or Disabled) selected in the extension popup. The setting is stored via `chrome.storage.sync` for cross-device sync. No user data is collected or transmitted externally.
