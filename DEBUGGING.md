# Debugging Guide for 3D Terminals

This template includes powerful debugging features optimized for Claude Code.

## 🔍 Browser Console Forwarding

All browser console logs are automatically forwarded to the backend terminal, making debugging with Claude Code much easier!

### How It Works

1. **Frontend** (`src/utils/consoleForwarder.js`) intercepts all console methods
2. **Batches** logs and sends them to backend every 100ms
3. **Backend** (`routes/api.js`) receives logs and prints them to terminal
4. **Claude** can see the logs via tmux capture-pane!

### What Gets Forwarded

All console methods are forwarded:
- `console.log()` - General logging
- `console.error()` - Errors
- `console.warn()` - Warnings
- `console.info()` - Info messages
- `console.debug()` - Debug messages

### Log Format

Backend logs show:
```
[Browser:Scene3D.jsx:42] Terminal clicked: Terminal 1
[Browser:SimpleTerminal.jsx:71] Connected to tabz backend
[Browser] Terminal spawned: Object
```

The format is: `[Browser:filename:line] message`

### Benefits for Claude Code

✅ **See browser errors** in backend terminal (visible to Claude)
✅ **Track execution flow** across frontend/backend
✅ **Debug 3D interactions** (clicks, hovers, animations)
✅ **Monitor terminal connections** and WebSocket messages
✅ **Identify source files** automatically from stack traces

## 🎯 Using start-tmux.sh

The included `start-tmux.sh` script sets up a tmux session optimized for debugging:

### Running It

```bash
./start-tmux.sh
```

This creates a tmux session with panes for:
- Backend server
- Frontend dev server
- Additional terminal for commands

### Benefits

- **All logs in one view** - Backend + forwarded browser logs
- **Claude can see everything** - tmux capture-pane gives Claude full context
- **Easy navigation** - Switch between panes with tmux keybindings
- **Persistent** - Sessions survive disconnects

### Tmux Basics

```bash
# Switch panes
Ctrl+b → arrow keys

# Detach from session
Ctrl+b → d

# Reattach
tmux attach

# Kill session
tmux kill-session
```

## 🐛 Common Debugging Scenarios

### Terminal Won't Connect

**Check browser console (auto-forwarded to backend):**
```
[Browser:SimpleTerminal.jsx:71] Connected to tabz backend
[Browser:SimpleTerminal.jsx:92] Terminal spawned: Object
```

**If not seeing these:**
1. Check backend is running on port 8129
2. Check WebSocket connection in browser DevTools → Network → WS
3. Look for errors in backend terminal

### Can't Type in Terminal

**Check browser console:**
```
[Browser:SimpleTerminal.jsx:150] Terminal input: data
```

**If not seeing this:**
1. Click directly on terminal area to focus
2. Check `pointerEvents` in browser inspector
3. Verify terminal is flipped (check `isFlipped` state)

### 3D Object Click Not Working

**Check browser console:**
```
[Browser:Scene3D.jsx:54] Card clicked: Terminal 1 isFlipped: false
```

**If not seeing this:**
1. OrbitControls might be consuming clicks
2. Check `stopPropagation()` is being called
3. Verify mesh has `onClick` handler

### Performance Issues

**Monitor in backend terminal:**
```
[Browser:Scene3D.jsx:32] Frame render took 45ms
```

Add custom logging to track performance:
```javascript
const start = performance.now();
// ... code ...
console.log('Operation took', performance.now() - start, 'ms');
```

## 📊 Advanced Debugging

### Custom Source Tracking

The console forwarder automatically extracts source file and line number:

```javascript
// This log:
console.log('Terminal connected');

// Shows as:
[Browser:MyComponent.jsx:42] Terminal connected
```

### Structured Logging

For complex objects, the forwarder formats them compactly:

```javascript
console.log('Terminal data:', { id: 123, name: 'Test', props: {...} });
// Shows as:
[Browser:Scene3D.jsx:56] Terminal data: {id, name, props...}
```

### Error Stack Traces

Full error stack traces are forwarded:

```javascript
try {
  // ...
} catch (error) {
  console.error('Failed:', error);
  // Shows: [Browser:Scene3D.jsx:89] Failed: Error: Something went wrong
}
```

## 💡 Debugging Tips

### 1. Add Strategic Logs

```javascript
const handleClick = (e) => {
  console.log('Click handler called:', { isFlipped, hasTerminal });
  e.stopPropagation();
  // ...
};
```

### 2. Monitor State Changes

```javascript
useEffect(() => {
  console.log('isFlipped changed:', isFlipped);
}, [isFlipped]);
```

### 3. Track WebSocket Messages

```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('WS message:', message.type, message);
  // ...
};
```

### 4. Debug 3D Positioning

```javascript
useFrame(() => {
  if (meshRef.current) {
    console.log('Mesh position:', meshRef.current.position.toArray());
  }
});
```

## 🛠️ Disabling Console Forwarding

Console forwarding only runs in development mode. To disable it:

```javascript
// src/main.jsx
// Comment out this line:
// setupConsoleForwarding();
```

Or set production mode:
```bash
NODE_ENV=production npm run dev
```

## 📚 Related Files

- `frontend/src/utils/consoleForwarder.js` - Console interception
- `backend/routes/api.js` - `/api/console-log` endpoint
- `start-tmux.sh` - Tmux session setup
- `backend/modules/logger.js` - Backend logging

---

**Happy Debugging!** 🎉

With console forwarding + tmux + Claude Code, debugging 3D terminals is much easier!
