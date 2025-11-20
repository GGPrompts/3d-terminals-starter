# Claude Skills for 3D Terminals

This directory contains Claude Code skills to assist with development of 3D terminal applications.

## Available Skills

### 1. xterm-js
**Location:** `./xterm-js/SKILL.md`

Expert guidance for xterm.js terminal integration, including:
- Terminal initialization and configuration
- WebSocket communication patterns
- Input/output handling
- Addons (FitAddon, WebLinksAddon, etc.)
- React integration patterns
- Common issues and solutions

**Use when:** Working with terminal components, WebSocket connections, or xterm.js features.

### 2. react-three-fiber
**Location:** `./react-three-fiber/SKILL.md`

Comprehensive guide for React Three Fiber (R3F) development:
- Canvas setup and configuration
- 3D object creation and manipulation
- Event handling in 3D space
- Drei helper components
- Html portals for embedding React components
- Performance optimization
- Terminal integration patterns

**Use when:** Building 3D scenes, handling 3D events, or integrating terminals with 3D objects.

### 3. threejs-basics
**Location:** `./threejs-basics/SKILL.md`

Core Three.js concepts and patterns:
- Geometries and materials
- Lighting setup
- Positioning and rotation
- Colors and effects
- Performance tips
- Common patterns for 3D terminals

**Use when:** Need to understand Three.js fundamentals, materials, lighting, or 3D math.

## How to Use Skills

### In Claude Code

Skills are automatically available when you're working in this project. Claude Code will reference them when relevant to your questions or tasks.

### Invoking Skills

You can explicitly invoke a skill:
```
Can you help me with xterm.js terminal configuration?
```

Or reference specific patterns:
```
Show me how to create an Html portal in React Three Fiber for a terminal
```

### Combining Skills

The skills work together for 3D terminal development:
```
I need to create a rotating cube that shows a terminal when clicked.
Use react-three-fiber for the cube and xterm-js for the terminal.
```

## Skill Organization

Each skill contains:
- **Overview**: What the skill covers
- **Core Concepts**: Fundamental patterns
- **Common Patterns**: Frequently used code examples
- **Integration**: How it works with other technologies
- **Troubleshooting**: Common issues and solutions
- **Resources**: Links to documentation

## Development Workflow

1. **Planning**: Use `react-three-fiber` to understand 3D scene structure
2. **3D Objects**: Use `threejs-basics` for materials and lighting
3. **Terminals**: Use `xterm-js` for terminal integration
4. **Integration**: Combine patterns from all skills
5. **Debugging**: Reference troubleshooting sections

## Example Use Cases

### Creating a New 3D Object with Terminal
1. Check `react-three-fiber` for Html portal pattern
2. Check `xterm-js` for terminal component setup
3. Check `threejs-basics` for material/lighting

### Fixing Terminal Input Issues
1. Check `xterm-js` for focus patterns
2. Check `react-three-fiber` for pointer events
3. Check troubleshooting sections

### Performance Optimization
1. Check `react-three-fiber` for performance tips
2. Check `threejs-basics` for geometry optimization
3. Check `xterm-js` for terminal rendering

## Updating Skills

To add or update skills:
1. Create a new folder in `.claude/skills/`
2. Add a `SKILL.md` file
3. Include relevant patterns and examples
4. Update this README

## Resources

- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Three.js: https://threejs.org/
- xterm.js: https://xtermjs.org/
- Drei: https://github.com/pmndrs/drei

---

These skills were curated for the 3D Terminals Starter project. Use them to accelerate development and solve common issues!
