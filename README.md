# 3D Terminals Starter

A ready-to-use starter template for creating **3D scenes with working terminals**. Click any 3D object to flip it and access a real bash terminal running in 3D space!

## ✨ Features

- 🎮 **Interactive 3D Objects** - Click to flip and reveal terminals
- 💻 **Real Working Terminals** - Full bash access via xterm.js + node-pty
- 🎨 **React Three Fiber** - Modern 3D with React
- 🔄 **Persistent Terminals** - Terminals stay alive when you flip back
- 🌟 **Beautiful Visuals** - Stars, lighting, and glow effects
- 📦 **Complete Backend** - WebSocket server with terminal management

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend will run on ws://localhost:8129
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

### 3. Use It!

1. Open `http://localhost:5173` in your browser
2. Click any colored cube to flip it
3. A real terminal will appear on the back!
4. Type commands: `ls`, `pwd`, `echo "Hello 3D!"`
5. Click the header to flip back
6. Terminal stays alive in the background!

## 📁 Project Structure

```
3d-terminals-starter/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Scene3D.jsx       # Main 3D scene
│   │   │   └── SimpleTerminal.jsx # Terminal component
│   │   ├── App.jsx               # App wrapper
│   │   ├── App.css               # Styles
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   └── index.html
│
└── backend/
    ├── modules/                   # Terminal management
    ├── routes/                    # API routes
    ├── server.js                  # WebSocket server
    └── package.json
```

## 🎨 Customizing

### Add More 3D Objects

Edit `frontend/src/components/Scene3D.jsx`:

```javascript
const objects = [
  { id: 1, name: 'Terminal 1', position: [-3, 0, 0], color: '#00ff00' },
  { id: 2, name: 'Terminal 2', position: [0, 0, 0], color: '#00ffff' },
  { id: 3, name: 'Terminal 3', position: [3, 0, 0], color: '#ff00ff' },
  // Add your own!
  { id: 4, name: 'My Terminal', position: [6, 0, 0], color: '#ffaa00' },
];
```

### Change 3D Object Type

Replace `<boxGeometry>` in `TerminalCube`:

```javascript
// Sphere
<sphereGeometry args={[1, 32, 32]} />

// Torus
<torusGeometry args={[1, 0.4, 16, 100]} />

// Custom model
<primitive object={yourModel} />
```

### Change Terminal Shell

Edit `frontend/src/components/SimpleTerminal.jsx`:

```javascript
const spawnMessage = {
  type: 'spawn',
  config: {
    terminalType: 'bash',              // or 'zsh', 'fish'
    name: `${agentName}-terminal`,
    workingDir: '/home/matt',          // Change working directory
  }
};
```

## 🐛 Debugging Features

This template includes **browser console forwarding** optimized for Claude Code debugging!

All `console.log()`, `console.error()`, etc. are automatically forwarded to the backend terminal:

```
[Browser:Scene3D.jsx:42] Terminal clicked: Terminal 1
[Browser:SimpleTerminal.jsx:71] Connected to tabz backend
```

### Quick Start with Tmux

```bash
./start-tmux.sh
```

Creates a tmux session with backend + frontend in split panes. Claude Code can see all logs via tmux capture-pane!

**See [DEBUGGING.md](DEBUGGING.md) for full debugging guide.**

## 🔧 Advanced Usage

### Running Claude Code in 3D

The terminals are real bash shells, so you can run anything:

```bash
# In a 3D terminal
claude --help

# Start an AI coding session in 3D!
claude
```

### Adding More Terminal Types

The backend supports multiple terminal types. Edit the spawn config:

```javascript
terminalType: 'claude-code'  // Spawns Claude Code directly!
terminalType: 'bash'         // Regular bash
terminalType: 'opencode'     // OpenCode
```

See `backend/modules/unified-spawn.js` for all available types.

## 🎯 How It Works

1. **Frontend** - React Three Fiber renders 3D scene
2. **Click Handler** - Flips object and spawns terminal (once)
3. **WebSocket** - Connects to backend at `ws://localhost:8129`
4. **node-pty** - Backend spawns real terminal process
5. **Terminal I/O** - Bidirectional communication via WebSocket
6. **Persistence** - Terminal hidden when flipped, not destroyed

## 🐛 Troubleshooting

**Terminals don't connect:**
- Make sure backend is running on port 8129
- Check browser console for WebSocket errors
- Verify backend .env file (copy from .env.example)

**Can't type in terminal:**
- Click directly on the terminal area to focus
- Check that the card is fully flipped
- Try flipping back and forth again

**Terminals disconnect immediately:**
- Backend's grace period might be too short
- Check backend logs for PTY errors
- Make sure to type something within 30 seconds

## 📚 Learn More

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [xterm.js Docs](https://xtermjs.org/)
- [node-pty](https://github.com/microsoft/node-pty)

## 🎉 Built With

This starter is based on the working 3D terminals from the 3dMatrixCards project, created with Claude Code.

**Frontend:**
- React 18
- React Three Fiber
- @react-three/drei
- xterm.js
- Vite

**Backend:**
- Node.js
- Express
- WebSocket (ws)
- node-pty
- Terminal management system

## 💡 Ideas for Extension

- Add different 3D models (GLB/GLTF)
- Multiple terminal types per object
- Drag & drop to rearrange objects
- Save/load scene configurations
- VR/AR support
- Collaborative multi-user terminals
- Terminal themes and customization

---

**Ready to build something amazing?** Start customizing Scene3D.jsx and make it your own! 🚀
