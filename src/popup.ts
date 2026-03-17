// ============================================================
// Gemini Mode Auto-Enabler - Popup Script
// ============================================================

type PopupTargetMode = 'thinking' | 'pro' | 'off';

const STATUS_KEYS: Record<PopupTargetMode, string> = {
  thinking: 'statusThinking',
  pro: 'statusPro',
  off: 'statusOff',
};

// Apply Chrome i18n translations to all [data-i18n] elements
function applyI18n(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset['i18n'];
    if (key) {
      const msg = chrome.i18n.getMessage(key);
      if (msg) el.textContent = msg;
    }
  });
}

function updateUI(mode: PopupTargetMode): void {
  const options = document.querySelectorAll<HTMLElement>('.mode-option');
  options.forEach((option) => {
    const value = option.dataset['value'] as PopupTargetMode;
    if (value === mode) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
    const radio = option.querySelector<HTMLInputElement>('input[type="radio"]');
    if (radio) radio.checked = value === mode;
  });

  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  if (statusDot && statusText) {
    if (mode === 'off') {
      statusDot.classList.add('off');
    } else {
      statusDot.classList.remove('off');
    }
    const label = chrome.i18n.getMessage(STATUS_KEYS[mode]);
    statusText.textContent = label || mode;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyI18n();

  chrome.storage.sync.get({ targetMode: 'thinking' }, (result) => {
    const mode = result['targetMode'] as PopupTargetMode;
    updateUI(mode);
  });

  const modeList = document.getElementById('modeList');
  if (modeList) {
    modeList.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'radio' && target.name === 'mode') {
        const mode = target.value as PopupTargetMode;
        chrome.storage.sync.set({ targetMode: mode });
        updateUI(mode);
      }
    });
  }
});
