# Quick Start Guide

Get your 3D terminals running in **2 minutes**!

## Step 1: Install

```bash
cd ~/projects/3d-terminals-starter

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Step 2: Run

**Terminal 1:**
```bash
cd ~/projects/3d-terminals-starter/backend
npm run dev
```

**Terminal 2:**
```bash
cd ~/projects/3d-terminals-starter/frontend
npm run dev
```

## Step 3: Use

1. Open **http://localhost:5173**
2. **Click a cube** to flip it
3. **See a real terminal** on the back!
4. **Type commands**: `ls`, `pwd`, `whoami`
5. **Click header** to flip back

## That's It!

The terminal stays alive when you flip back. Flip again to continue where you left off.

---

## What's Running

- **Backend**: `ws://localhost:8129` - WebSocket + terminal management
- **Frontend**: `http://localhost:5173` - 3D scene with React Three Fiber

## Debugging

All browser console logs are automatically forwarded to the backend terminal!

Use **tmux** for best debugging experience:
```bash
./start-tmux.sh
```

See **[DEBUGGING.md](DEBUGGING.md)** for complete debugging guide.

## Next Steps

Edit `frontend/src/components/Scene3D.jsx` to:
- Add more cubes
- Change colors
- Use different 3D shapes
- Customize terminal behavior

See **README.md** for full documentation!
