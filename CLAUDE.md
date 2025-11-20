# Claude Code Guide for 3D Terminals Starter

This guide is specifically for Claude Code users working with the 3D Terminals Starter template.

## Overview

This template provides a working foundation for building 3D applications with real, interactive terminals. Each 3D card can flip to reveal a fully functional bash terminal running via xterm.js + node-pty.

**Key Features:**
- 🎴 Beautiful 3D cards with flip animations
- 💻 Real working bash terminals on card backs
- 🔄 Persistent terminals (stay alive when flipped back)
- 🎨 Customizable colors, icons, and positions
- 📊 Browser console forwarding to backend (visible to Claude Code)
- 🎯 Complete debugging support via tmux

---

## Architecture

```
Frontend (React + R3F)          Backend (Node.js + WebSocket)
┌─────────────────────┐         ┌──────────────────────┐
│ Scene3D.jsx         │         │ server.js            │
│  └─ TerminalCard    │ <─WS──> │  └─ Terminal Manager │
│      └─ SimpleTerminal│        │      └─ node-pty     │
└─────────────────────┘         └──────────────────────┘
         │                                  │
         └─── Console Forwarding ──────────┘
              (via /api/console-log)
```

**Communication Flow:**
1. User clicks card → Card flips
2. SimpleTerminal spawns → WebSocket connects to ws://localhost:8129
3. Frontend sends `spawn` message with unique terminal name
4. Backend creates PTY process → Returns `terminal-spawned` with ID
5. Bidirectional I/O flows via WebSocket messages

**Terminal Lifecycle:**
- Spawned on first flip (lazy initialization)
- Stays alive but hidden when flipped back (visibility toggle)
- Destroyed only when component unmounts

---

## Debugging with Tmux

### Starting the Tmux Session

```bash
cd ~/projects/3d-terminals-starter
./start-tmux.sh
```

**Interactive prompts:**
- Enable live logs window: `y` (recommended)
- Log level: `4` (info - includes browser console)

This creates a tmux session named `3d-terminals` with:
- **Window 0 (backend)**: Backend server with all logs
- **Window 1 (frontend)**: Vite dev server
- **Window 2 (logs)**: Live backend log viewer (if enabled)

### Tmux Commands

```bash
# List all tmux sessions
tmux ls

# Attach to the 3d-terminals session
tmux attach -t 3d-terminals

# Switch between windows (while attached)
Ctrl+B, then 0    # Backend window
Ctrl+B, then 1    # Frontend window
Ctrl+B, then 2    # Logs window (if enabled)

# Detach from session (keeps running)
Ctrl+B, then D

# Kill the session
tmux kill-session -t 3d-terminals
```

### Capturing Backend Logs (For Claude Code)

Claude Code can capture tmux panes to see logs:

```bash
# Capture backend terminal output (last 100 lines)
tmux capture-pane -t 3d-terminals:backend -p -S -100

# Capture live logs window (if enabled)
tmux capture-pane -t 3d-terminals:logs -p -S -100

# Capture specific number of lines
tmux capture-pane -t 3d-terminals:backend -p -S -50  # Last 50 lines
```

### Console Forwarding

All browser console messages are automatically forwarded to the backend terminal:

```javascript
// In your frontend code:
console.log('Terminal clicked:', terminalName);
console.error('Connection failed:', error);

// Appears in backend as:
// [Browser:Scene3D.jsx:42] Terminal clicked: Terminal 1
// [Browser:SimpleTerminal.jsx:71] Connection failed: WebSocket error
```

**Log Format:** `[Browser:filename:line] message`

This makes debugging with Claude Code much easier since all logs are visible in one place via tmux capture.

---

## Adding New Cards

### Step 1: Define Card in Scene3D.jsx

Edit `/frontend/src/components/Scene3D.jsx`:

```javascript
const cards = [
  { id: 1, name: 'Terminal 1', position: [-4, 0, 0], color: '#00ff00', icon: '🚀' },
  { id: 2, name: 'Terminal 2', position: [0, 0, 0], color: '#00ffff', icon: '💻' },
  { id: 3, name: 'Terminal 3', position: [4, 0, 0], color: '#ff00ff', icon: '⚡' },

  // Add your new card:
  { id: 4, name: 'My Terminal', position: [8, 0, 0], color: '#ffaa00', icon: '🔥' },
];
```

**Properties:**
- `id`: Unique identifier (required)
- `name`: Display name shown on card front and terminal header
- `position`: [x, y, z] coordinates in 3D space
- `color`: Hex color for card glow and theme
- `icon`: Emoji icon shown on card front

### Step 2: Positioning Cards

**Spacing Guide:**
- Horizontal spacing: 4 units apart (`x` axis)
- Vertical spacing: Use `y` axis for rows
- Depth spacing: Use `z` axis for layers

**Example Layouts:**

```javascript
// Single row
[-4, 0, 0], [0, 0, 0], [4, 0, 0], [8, 0, 0]

// Two rows
[-4, 2, 0], [0, 2, 0], [4, 2, 0]   // Top row
[-4, -2, 0], [0, -2, 0], [4, -2, 0] // Bottom row

// Circular arrangement
Math.cos(angle) * radius, Math.sin(angle) * radius, 0
```

### Step 3: Customizing Card Appearance

**Change card size** (edit TerminalCard component):
```javascript
<RoundedBox args={[2.5, 3.5, 0.05]}>  // [width, height, depth]
```

**Add more info to front** (add Text components):
```javascript
<Text
  position={[0, -0.9, 0.04]}
  fontSize={0.1}
  anchorX="center"
  anchorY="middle"
>
  <meshBasicMaterial color="#ffffff" toneMapped={false} />
  {'CUSTOM TEXT'}
</Text>
```

**Change terminal working directory** (in SimpleTerminal.jsx):
```javascript
workingDir: '/home/matt/projects/my-project',
```

---

## Claude Code Skills

This template includes three specialized skills to help Claude Code work with the codebase.

### 1. xterm-js Skill

**Location:** `.claude/skills/xterm-js/`

**Use when:**
- Working with terminal functionality
- Debugging xterm.js issues
- Implementing terminal features

**Covers:**
- Terminal initialization and configuration
- WebSocket communication patterns
- Terminal themes and styling
- Input/output handling
- Common xterm.js issues

**Example:**
```bash
# Claude can reference this skill when debugging terminal issues
"The terminal isn't displaying output - can you check the xterm.js setup?"
```

### 2. react-three-fiber Skill

**Location:** `.claude/skills/react-three-fiber/`

**Use when:**
- Adding new 3D objects
- Modifying card animations
- Working with Html portals
- Debugging 3D rendering

**Covers:**
- Canvas setup and configuration
- Html portal integration (critical for terminals)
- Event handling (clicks, hovers)
- Animation patterns with useFrame
- Performance optimization
- Common R3F issues

**Example:**
```bash
# Claude can reference this skill when working on 3D features
"Add a sphere that also has a terminal on the back"
```

### 3. threejs-basics Skill

**Location:** `.claude/skills/threejs-basics/`

**Use when:**
- Working with geometries and materials
- Adjusting lighting
- Understanding 3D positioning
- Customizing visual appearance

**Covers:**
- Geometries (Box, Sphere, Torus, etc.)
- Materials (Standard, Basic, Physical)
- Lighting types and setup
- 3D math and positioning
- Common Three.js patterns

**Example:**
```bash
# Claude can reference this skill for 3D fundamentals
"Change the cards to have a metallic blue material with better lighting"
```

### Activating Skills

Claude Code automatically has access to skills in `.claude/skills/`. No activation needed - Claude will reference them when relevant to the task.

**Skill Contents:**
- `SKILL.md`: Main skill guide
- Reference documents (in skill folder)
- Code examples and patterns

---

## Common Tasks

### Change Terminal Shell

Edit `frontend/src/components/SimpleTerminal.jsx`:

```javascript
const spawnMessage = {
  type: 'spawn',
  config: {
    terminalType: 'bash',  // or 'zsh', 'fish', 'claude-code'
    name: requestedNameRef.current,
    workingDir: '/home/matt/projects/3d-terminals-starter',
  }
};
```

### Adjust Camera Position

Edit `frontend/src/components/Scene3D.jsx`:

```javascript
<Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
//                          [x, y, z]   field of view
```

### Change Background

```javascript
// Solid color
<color attach="background" args={['#1a1a2e']} />

// Remove stars
// Comment out: <Stars ... />

// Add fog
<fog attach="fog" args={['#0a0a0a', 10, 50]} />
```

### Disable Console Forwarding

Edit `frontend/src/main.jsx`:

```javascript
// Comment out:
// setupConsoleForwarding();
```

Or set production mode:
```bash
NODE_ENV=production npm run dev
```

### Change Terminal Colors

Edit `frontend/src/components/SimpleTerminal.jsx`:

```javascript
const xterm = new XTerm({
  theme: {
    background: '#0a0a0a',
    foreground: color,  // Passed from card
    cursor: color,
    // ... customize other colors
  },
});
```

---

## File Structure

```
3d-terminals-starter/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Scene3D.jsx          # Main 3D scene - ADD CARDS HERE
│   │   │   └── SimpleTerminal.jsx   # Terminal component
│   │   ├── utils/
│   │   │   └── consoleForwarder.js  # Browser → Backend logging
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── modules/
│   │   ├── terminal-registry.js     # Terminal lifecycle management
│   │   ├── unified-spawn.js         # Spawn different terminal types
│   │   └── pty-handler.js          # node-pty wrapper
│   ├── routes/
│   │   └── api.js                   # API routes (includes /api/console-log)
│   ├── server.js                    # Main WebSocket server
│   └── package.json
│
├── .claude/
│   └── skills/
│       ├── xterm-js/               # Terminal skill
│       ├── react-three-fiber/      # R3F skill
│       └── threejs-basics/         # Three.js skill
│
├── start-tmux.sh                   # Tmux session launcher
├── README.md                       # General documentation
├── QUICKSTART.md                   # 2-minute setup guide
├── DEBUGGING.md                    # Debugging guide
└── CLAUDE.md                       # This file
```

---

## Troubleshooting

### Multiple Terminals Interfering

**Symptom:** Flipping a second card makes the first terminal go offline or show wrong session.

**Cause:** Terminal name collision or shared WebSocket.

**Solution:** Each terminal creates a unique name with timestamp + random string. Verify `requestedNameRef.current` in SimpleTerminal.jsx includes both.

**Debug:**
```bash
# Check backend logs
tmux capture-pane -t 3d-terminals:backend -p -S -100 | grep "terminal-spawned"
```

### Cards Not Flipping

**Symptom:** Clicking card does nothing.

**Cause:** OrbitControls consuming click events.

**Check:** OrbitControls should not have `makeDefault={true}` or events being stopped.

**Debug:**
```javascript
// Add to Scene3D.jsx handleClick:
console.log('Card clicked:', name);
// Should appear in backend logs via console forwarding
```

### Terminal Output Not Showing

**Symptom:** Terminal spawns but output doesn't appear.

**Check:**
1. Browser console for errors (forwarded to backend)
2. Terminal ID matching in messages
3. WebSocket connection state

**Debug:**
```bash
# Backend logs show all WebSocket messages
tmux capture-pane -t 3d-terminals:backend -p -S -100 | grep "terminal-output"
```

### Terminal Shows Through Card

**Symptom:** Terminal HTML visible from card front.

**Cause:** Incorrect visibility toggle or Html portal positioning.

**Solution:** Html portal should use `visibility` CSS property, not conditional rendering. Check `hasSpawnedTerminal` vs `isFlipped` state.

---

## Best Practices

### For Claude Code Users

1. **Always use tmux** - Logs are critical for debugging
2. **Check backend logs first** - Most issues appear in backend terminal
3. **Use console.log liberally** - All logs forward to backend automatically
4. **Test one card at a time** - Easier to isolate issues
5. **Reference skills** - Claude knows about xterm, R3F, and Three.js patterns

### For Development

1. **Keep terminals unique** - Each needs unique name + ID
2. **Lazy spawn terminals** - Only create on first flip
3. **Use visibility, not mount/unmount** - Keeps terminals alive
4. **Test WebSocket connection** - Check backend is running on 8129
5. **Validate message types** - Backend uses specific message format

---

## Next Steps

**Extend the Template:**

1. **Add 3D Models**
   - Load GLB/GLTF files with `useGLTF`
   - Replace RoundedBox with custom models
   - Add animations with `mixer.update()`

2. **Multiple Terminal Types**
   - Add terminal type selection to cards
   - Support zsh, fish, claude-code, etc.
   - Custom startup commands per card

3. **Save/Load Scenes**
   - Export card configurations to JSON
   - Load layouts from file
   - Share scenes between projects

4. **Advanced Animations**
   - Card shuffle on startup
   - Hover effects with Spring animations
   - Custom flip animations (not just Y-axis)

5. **VR/AR Support**
   - Add `@react-three/xr` for VR mode
   - Hand tracking for card interaction
   - Immersive terminal experience

---

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [xterm.js API](https://xtermjs.org/docs/api/terminal/classes/terminal/)
- [node-pty](https://github.com/microsoft/node-pty)
- [Three.js Manual](https://threejs.org/manual/)

---

**Need Help?**

1. Check `DEBUGGING.md` for common issues
2. Capture tmux panes to see full logs
3. Review Claude skills for specific topics
4. Check browser console (forwarded to backend)

**Happy Building!** 🚀
