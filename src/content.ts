// ============================================================
// Gemini Thinking Mode Auto-Enabler - Content Script
// Supports both English and Japanese UI
// ============================================================

const DEBUG = false;
const log = (...args: unknown[]): void => {
  if (DEBUG) console.debug('[Gemini TME]', ...args);
};

// Mode names in different languages
const MODE_NAMES = {
  thinking: ['思考モード', 'Thinking'],
  fast: ['高速モード', 'Fast'],
  pro: ['Pro'],
} as const;

// New chat button labels
const NEW_CHAT_LABELS = [
  '新しいチャット',
  'New chat',
  'チャットを新規作成',
  'Start new chat',
] as const;

// Session state
interface SessionState {
  hasTriggered: boolean;
  lastChatId: string | null;
  buttonObserver: MutationObserver | null;
  maxAttempts: number;
  attemptCount: number;
}

const state: SessionState = {
  hasTriggered: false,
  lastChatId: null,
  buttonObserver: null,
  maxAttempts: 30,
  attemptCount: 0,
};

// ---- Helper: Check if text matches any of the given patterns ----
function matchesAny(text: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => text === pattern || text.startsWith(pattern));
}

// ---- Helper: Check if text contains any of the given patterns ----
function containsAny(text: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => text.includes(pattern));
}

// ---- URL exclusion check ----
function isExcludedPage(): boolean {
  const path = window.location.pathname;
  if (path.includes('/gems/')) {
    log('Excluded: /gems/ directory');
    return true;
  }
  return false;
}

// ---- Extract Chat ID ----
function getCurrentChatId(): string {
  const url = new URL(window.location.href);
  // /app/c/abc123 format
  const pathMatch = url.pathname.match(/\/app(?:\/c)?\/([a-zA-Z0-9_-]+)/);
  if (pathMatch) return pathMatch[1];
  // Query parameter format
  return url.searchParams.get('chat') || 'new_chat';
}

// ---- Check if current mode is Thinking Mode ----
function isThinkingMode(modeText: string): boolean {
  return matchesAny(modeText, MODE_NAMES.thinking);
}

// ---- Check if text is a known mode name ----
function isKnownMode(text: string): boolean {
  const allModes = [...MODE_NAMES.thinking, ...MODE_NAMES.fast, ...MODE_NAMES.pro];
  return matchesAny(text, allModes);
}

// ---- Dropdown info interface ----
interface DropdownInfo {
  button: Element;
  currentMode: string;
}

// ---- Find mode selection dropdown button ----
function findModeDropdownButton(): DropdownInfo | null {
  const buttons = document.querySelectorAll('button, [role="button"]');

  for (const btn of buttons) {
    const text = btn.textContent?.trim() || '';
    // Dropdown trigger button (displays current mode)
    if (isKnownMode(text)) {
      log('Dropdown button found:', text);
      return { button: btn, currentMode: text };
    }
  }

  // Search by aria-label or title
  for (const btn of buttons) {
    const label = btn.getAttribute('aria-label') || btn.getAttribute('title') || '';
    if (label.includes('モード選択') || label.toLowerCase().includes('mode select')) {
      const text = btn.textContent?.trim() || '';
      log('Dropdown button found (aria-label):', text);
      return { button: btn, currentMode: text };
    }
  }

  return null;
}

// ---- Find "Thinking Mode" option in dropdown menu ----
function findThinkingModeOption(): Element | null {
  // Look for menu items (role="menuitem" or role="option")
  const menuItems = document.querySelectorAll(
    '[role="menuitem"], [role="option"], [role="menuitemradio"], mat-option, .mat-mdc-option'
  );

  for (const item of menuItems) {
    const text = item.textContent?.trim() || '';
    if (containsAny(text, MODE_NAMES.thinking)) {
      log('Thinking mode option found');
      return item;
    }
  }

  // Fallback: any clickable element containing thinking mode text
  const allElements = document.querySelectorAll('*');
  for (const el of allElements) {
    const text = el.textContent?.trim() || '';
    // Element with direct child text starting with thinking mode name
    if (matchesAny(text, MODE_NAMES.thinking) && el.children.length <= 2) {
      const style = window.getComputedStyle(el);
      if (
        style.cursor === 'pointer' ||
        (el as HTMLElement).onclick ||
        el.hasAttribute('tabindex')
      ) {
        log('Thinking mode option found (fallback)');
        return el;
      }
    }
  }

  return null;
}

// ---- Execute click ----
function clickElement(element: Element): boolean {
  try {
    (element as HTMLElement).click();
    log('Click executed (.click())');
    return true;
  } catch (e) {
    log('Click failed:', e);
  }

  try {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    log('Click executed (dispatchEvent)');
    return true;
  } catch (e) {
    log('dispatchEvent failed:', e);
  }

  return false;
}

// ---- Main enable logic ----
function attemptEnableThinkingMode(): void {
  if (isExcludedPage()) return;

  const chatId = getCurrentChatId();
  if (chatId !== state.lastChatId) {
    log('New chat detected:', chatId);
    state.hasTriggered = false;
    state.lastChatId = chatId;
    state.attemptCount = 0;
  }

  if (state.hasTriggered) {
    log('Already triggered for this chat, skipping');
    return;
  }

  startModeSelection();
}

function startModeSelection(): void {
  if (state.buttonObserver) {
    state.buttonObserver.disconnect();
  }

  state.attemptCount = 0;

  // Immediate check
  if (trySelectThinkingMode()) return;

  // Watch for dynamic content with MutationObserver
  state.buttonObserver = new MutationObserver(() => {
    state.attemptCount++;
    if (state.attemptCount > state.maxAttempts) {
      log('Max attempts reached, stopping');
      state.buttonObserver?.disconnect();
      return;
    }
    trySelectThinkingMode();
  });

  state.buttonObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Timeout
  setTimeout(() => {
    state.buttonObserver?.disconnect();
    log('Observer timeout');
  }, 15000);
}

function trySelectThinkingMode(): boolean {
  // Step 1: Find dropdown button
  const dropdownInfo = findModeDropdownButton();
  if (!dropdownInfo) {
    log('Dropdown button not found...');
    return false;
  }

  // Skip if thinking mode is already selected
  if (isThinkingMode(dropdownInfo.currentMode)) {
    log('Thinking mode already selected');
    state.hasTriggered = true;
    state.buttonObserver?.disconnect();
    return true;
  }

  log('Current mode:', dropdownInfo.currentMode, '-> switching to Thinking Mode');

  // Step 2: Open dropdown
  clickElement(dropdownInfo.button);

  // Step 3: Wait for menu to open, then click "Thinking Mode"
  setTimeout(() => {
    selectThinkingModeFromMenu();
  }, 300);

  return true;
}

function selectThinkingModeFromMenu(): void {
  const option = findThinkingModeOption();
  if (option) {
    log('Clicking thinking mode option');
    clickElement(option);
    state.hasTriggered = true;
    state.buttonObserver?.disconnect();
    log('Thinking mode enabled successfully!');
  } else {
    log('Thinking mode option not found, retrying...');
    // Retry
    setTimeout(() => {
      const retryOption = findThinkingModeOption();
      if (retryOption) {
        clickElement(retryOption);
        state.hasTriggered = true;
        state.buttonObserver?.disconnect();
        log('Thinking mode enabled successfully! (retry)');
      } else {
        log('Thinking mode option not found, giving up');
        // Press Escape to close menu
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      }
    }, 500);
  }
}

// ---- Navigation detection ----
function setupNavigationDetection(): void {
  let lastUrl = window.location.href;

  // Hook History API
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args: Parameters<typeof originalPushState>) {
    originalPushState.apply(this, args);
    setTimeout(attemptEnableThinkingMode, 500);
  };

  history.replaceState = function (...args: Parameters<typeof originalReplaceState>) {
    originalReplaceState.apply(this, args);
    setTimeout(attemptEnableThinkingMode, 500);
  };

  // popstate
  window.addEventListener('popstate', () => {
    setTimeout(attemptEnableThinkingMode, 500);
  });

  // URL polling (fallback)
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      attemptEnableThinkingMode();
    }
  }, 1000);
}

// ---- "New chat" button listener ----
function setupNewChatListener(): void {
  const observer = new MutationObserver(() => {
    const buttons = document.querySelectorAll('button, [role="button"], a');
    for (const btn of buttons) {
      const text = btn.textContent?.trim() || '';
      const htmlBtn = btn as HTMLElement;
      if (containsAny(text, NEW_CHAT_LABELS) && !htmlBtn.dataset.geminiTmeListenerAttached) {
        htmlBtn.dataset.geminiTmeListenerAttached = 'true';
        btn.addEventListener('click', () => {
          log('New chat button clicked');
          state.hasTriggered = false;
          state.lastChatId = null;
          setTimeout(attemptEnableThinkingMode, 1000);
        });
        log('Listener attached to new chat button');
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// ---- Initialize ----
function init(): void {
  log('Initializing...');

  if (isExcludedPage()) {
    log('Excluded page, skipping initialization');
    return;
  }

  setupNavigationDetection();
  setupNewChatListener();

  // Initial attempt
  if (document.readyState === 'complete') {
    setTimeout(attemptEnableThinkingMode, 1000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(attemptEnableThinkingMode, 1500);
    });
  }
}

// Run
init();
