/**
 * Console Forwarder - Pipes browser console logs to backend terminal
 * Optimized for Claude Code debugging via tmux capture-pane
 */

const BACKEND_URL = 'http://localhost:8129';
let logBuffer = [];
let flushTimer = null;

// Extract source file/line from stack trace
function getSource() {
  try {
    const stack = new Error().stack;
    if (!stack) return undefined;

    // Get first non-forwarder line from stack
    const lines = stack.split('\n');
    const relevantLine = lines.find(line =>
      line.includes('.jsx') || line.includes('.js')
    );

    if (relevantLine) {
      // Extract filename:line from stack (e.g., "Scene3D.jsx:123")
      const match = relevantLine.match(/([^/\\]+\.jsx?):(\d+)/);
      if (match) return `${match[1]}:${match[2]}`;
    }
  } catch (e) {
    // Silent fail
  }
  return undefined;
}

// Format args for compact, readable output
function formatArgs(args) {
  return args.map(arg => {
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';

    // For objects, try to make compact
    try {
      if (arg instanceof Error) {
        return `Error: ${arg.message}`;
      }

      // Small objects - inline
      const json = JSON.stringify(arg);
      if (json.length < 80) return json;

      // Large objects - just type/keys
      if (Array.isArray(arg)) {
        return `Array(${arg.length})`;
      }

      const keys = Object.keys(arg);
      return `{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}}`;
    } catch (e) {
      return '[Object]';
    }
  }).join(' ');
}

// Send logs in batches (reduces network overhead)
function flushLogs() {
  if (logBuffer.length === 0) return;

  const batch = [...logBuffer];
  logBuffer = [];

  fetch(`${BACKEND_URL}/api/console-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logs: batch })
  }).catch(() => {
    // Silent fail - backend might not be running
  });
}

function queueLog(level, args) {
  const message = formatArgs(args);
  const source = getSource();

  logBuffer.push({
    level,
    message,
    timestamp: Date.now(),
    ...(source && { source })
  });

  // Flush after 100ms (batch multiple logs)
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flushLogs, 100);
}

export function setupConsoleForwarding() {
  // Only in development mode
  if (import.meta.env.PROD) return;

  // Store originals
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;
  const originalDebug = console.debug;

  // Override console methods
  console.log = (...args) => {
    originalLog(...args);
    queueLog('log', args);
  };

  console.error = (...args) => {
    originalError(...args);
    queueLog('error', args);
  };

  console.warn = (...args) => {
    originalWarn(...args);
    queueLog('warn', args);
  };

  console.info = (...args) => {
    originalInfo(...args);
    queueLog('info', args);
  };

  console.debug = (...args) => {
    originalDebug(...args);
    queueLog('debug', args);
  };

  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    flushLogs();
  });

  console.log('[ConsoleForwarder] Browser logs forwarding to backend terminal');
}
