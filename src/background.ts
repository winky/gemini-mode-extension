// ============================================================
// Gemini Thinking Mode Auto-Enabler - Background Service Worker
// ============================================================

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Gemini TME] Extension installed');
    // Set default mode to 'thinking' on first install
    chrome.storage.sync.set({ targetMode: 'thinking' });
  } else if (details.reason === 'update') {
    console.log('[Gemini TME] Extension updated - version:', chrome.runtime.getManifest().version);
  }
});

// Handle browser startup
chrome.runtime.onStartup.addListener(() => {
  console.log('[Gemini TME] Browser started');
});

// Message interface
interface LogMessage {
  type: 'LOG';
  data: unknown;
}

// Handle messages from content script (for debugging)
chrome.runtime.onMessage.addListener(
  (message: LogMessage, _sender: chrome.runtime.MessageSender, _sendResponse: () => void) => {
    if (message.type === 'LOG') {
      console.log('[Gemini TME Content]', message.data);
    }
    return false;
  }
);
