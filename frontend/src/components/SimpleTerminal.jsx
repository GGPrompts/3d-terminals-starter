import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import '@xterm/xterm/css/xterm.css';

export function SimpleTerminal({ color = '#00ff00', agentName = 'Agent', onConnect, onDisconnect }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const wsRef = useRef(null);
  const terminalIdRef = useRef(null);
  const requestedNameRef = useRef(`${agentName}-terminal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const xterm = new XTerm({
      theme: {
        background: '#0a0a0a',
        foreground: color,
        cursor: color,
        cursorAccent: '#0a0a0a',
        black: '#000000',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#bd93f9',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#bfbfbf',
        brightBlack: '#4d4d4d',
        brightRed: '#ff6e67',
        brightGreen: '#5af78e',
        brightYellow: '#f4f99d',
        brightBlue: '#caa9fa',
        brightMagenta: '#ff92d0',
        brightCyan: '#9aedfe',
        brightWhite: '#e6e6e6',
      },
      fontSize: 14,
      fontFamily: 'monospace',
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const unicode11Addon = new Unicode11Addon();

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);
    xterm.loadAddon(unicode11Addon);

    xterm.open(terminalRef.current);

    // Activate Unicode 11 support for proper character width handling in TUI apps
    xterm.unicode.activeVersion = '11';

    // Auto-focus terminal for keyboard input
    setTimeout(() => {
      if (terminalRef.current) {
        const textarea = terminalRef.current.querySelector('.xterm-helper-textarea');
        if (textarea) {
          textarea.focus();
        }
      }
    }, 200);

    // Connect to tabz simplified backend WebSocket
    const ws = new WebSocket('ws://localhost:8129');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to tabz backend');
      xterm.writeln('\x1b[1;32m✓ Connected to terminal backend\x1b[0m');
      xterm.writeln('\x1b[1;90mSpawning bash session...\x1b[0m');

      // Notify parent of connection
      if (onConnect) onConnect();

      // Create a new terminal session using correct message format with unique name
      const spawnMessage = {
        type: 'spawn',
        config: {
          terminalType: 'bash',
          name: requestedNameRef.current,
          workingDir: '/home/matt/projects/3d-terminals-starter',
        }
      };

      console.log('Sending spawn message:', spawnMessage);
      ws.send(JSON.stringify(spawnMessage));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Handle terminal spawned response - only accept if it's for THIS terminal
        if (message.type === 'terminal-spawned') {
          // Verify this spawn message is for us
          if (message.data.name !== requestedNameRef.current) {
            console.log('Ignoring spawn for different terminal:', message.data.name, 'vs', requestedNameRef.current);
            return;
          }

          terminalIdRef.current = message.data.id;
          console.log('Terminal spawned:', message.data);
          console.log('Terminal ID:', terminalIdRef.current);
          console.log('Terminal name:', message.data.name);
          console.log('Session name:', message.data.sessionName);
          xterm.writeln(`\x1b[1;36m✓ Terminal ready: ${agentName}\x1b[0m`);
          xterm.writeln(`\x1b[1;33mSession: ${message.data.sessionName || message.data.id}\x1b[0m`);

          // Send resize after spawn
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'resize',
                terminalId: terminalIdRef.current,
                cols: xterm.cols,
                rows: xterm.rows,
              }));
            }
          }, 100);
        }

        // Handle terminal output - backend sends 'terminal-output' not 'output'
        if (message.type === 'terminal-output' || message.type === 'output') {
          if (message.terminalId === terminalIdRef.current) {
            xterm.write(message.data);
          } else {
            console.log('Received output for different terminal:', message.terminalId, 'vs', terminalIdRef.current);
          }
        }

        // Log other message types for debugging
        if (message.type !== 'output' && message.type !== 'terminal-output' && message.type !== 'terminal-spawned' && message.type !== 'memory-stats') {
          console.log('Received message:', message.type, message);
        }
      } catch (e) {
        // Might be raw data
        xterm.write(event.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      xterm.writeln('\r\n\x1b[1;31m✗ Connection failed to tabz backend\x1b[0m');
      if (onDisconnect) onDisconnect();
    };

    ws.onclose = () => {
      console.log('Disconnected from tabz backend');
      xterm.writeln('\r\n\x1b[1;33m⚠ Connection closed\x1b[0m');
      if (onDisconnect) onDisconnect();
    };

    // Handle terminal input - send to backend
    xterm.onData((data) => {
      if (ws.readyState === WebSocket.OPEN && terminalIdRef.current) {
        ws.send(JSON.stringify({
          type: 'command',
          terminalId: terminalIdRef.current,
          command: data,
        }));
      }
    });

    // Fit terminal to container
    setTimeout(() => {
      try {
        fitAddon.fit();
      } catch (e) {
        console.log('Fit failed:', e);
      }
    }, 100);

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (onDisconnect) onDisconnect();
      xterm.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [color, agentName, onConnect, onDisconnect]);

  return (
    <div
      ref={terminalRef}
      onClick={(e) => {
        e.stopPropagation();
        // Ensure terminal gets focus on click
        if (terminalRef.current) {
          const textarea = terminalRef.current.querySelector('.xterm-helper-textarea');
          if (textarea) {
            textarea.focus();
          }
        }
      }}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'text',
      }}
    />
  );
}
