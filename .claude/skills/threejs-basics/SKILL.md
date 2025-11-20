# Three.js Basics Skill

Core Three.js knowledge for 3D terminal projects.

## Overview

Three.js is a JavaScript 3D library. When using React Three Fiber, these concepts still apply but with React abstractions.

## Core Components

### Scene
```javascript
const scene = new THREE.Scene();
```
In R3F: Handled by `<Canvas>`

### Camera
```javascript
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 2, 10);
```
In R3F: `<Canvas camera={{ position: [0, 2, 10], fov: 75 }} />`

### Renderer
Handled automatically by React Three Fiber

## Geometries

### Common Shapes
```jsx
<boxGeometry args={[width, height, depth]} />
<sphereGeometry args={[radius, segments, segments]} />
<planeGeometry args={[width, height]} />
<torusGeometry args={[radius, tube, radialSegments, tubularSegments]} />
<cylinderGeometry args={[radiusTop, radiusBottom, height]} />
```

## Materials

### Standard Material (Most Common)
```jsx
<meshStandardMaterial
  color="#ff0000"
  emissive="#ff0000"
  emissiveIntensity={0.5}
  roughness={0.5}
  metalness={0.5}
/>
```

### Basic Material (No Lighting)
```jsx
<meshBasicMaterial
  color="#00ff00"
  transparent={true}
  opacity={0.5}
/>
```

### Physical Material (Most Realistic)
```jsx
<meshPhysicalMaterial
  color="#0000ff"
  roughness={0.1}
  metalness={0.9}
  clearcoat={1}
/>
```

## Lighting

### Essential Lights
```jsx
// General illumination
<ambientLight intensity={0.3} />

// Main light
<directionalLight position={[10, 10, 5]} intensity={1} />

// Accent/colored light
<pointLight position={[0, 0, 0]} color="#00ffff" intensity={0.5} />
```

### Lighting Setup for Terminals
```jsx
<ambientLight intensity={0.3} />
<directionalLight position={[10, 10, 5]} intensity={1} />
<pointLight position={[-10, -10, -5]} intensity={0.5} color="#00ffff" />
```

## Positioning & Rotation

### Position
```jsx
position={[x, y, z]}
// Example: position={[0, 0, 0]} is center
```

### Rotation
```jsx
rotation={[x, y, z]} // In radians
// Example: rotation={[0, Math.PI, 0]} is 180° on Y axis
```

### Scale
```jsx
scale={[x, y, z]}
// Example: scale={[2, 2, 2]} doubles size
// Example: scale={1.5} applies to all axes
```

## Groups

```jsx
<group position={[0, 1, 0]} rotation={[0, Math.PI / 4, 0]}>
  <mesh>...</mesh>
  <mesh>...</mesh>
</group>
```

## Colors

### Hex Colors
```jsx
color="#00ff00"  // Green
color={0x00ff00} // Also green (in JS objects)
```

### Named Colors
```jsx
color="hotpink"
color="skyblue"
```

## Performance

### Optimize Geometries
- Reduce segment count where possible
- Share geometries between meshes
- Use LOD (Level of Detail) for distant objects

### Optimize Materials
- Reuse materials
- Minimize transparent materials
- Use basic materials where lighting isn't needed

## Common Patterns for 3D Terminals

### Emissive Glow Effect
```jsx
<meshStandardMaterial
  color={terminalColor}
  emissive={terminalColor}
  emissiveIntensity={isActive ? 0.5 : 0.2}
/>
```

### Hover Effect
```jsx
const [isHovered, setIsHovered] = useState(false);

<mesh
  scale={isHovered ? 1.2 : 1}
  onPointerOver={() => setIsHovered(true)}
  onPointerOut={() => setIsHovered(false)}
>
```

### Status Indicator via Color
```jsx
<meshStandardMaterial
  color={isConnected ? '#00ff00' : '#ff0000'}
  emissive={isConnected ? '#00ff00' : '#ff0000'}
  emissiveIntensity={0.5}
/>
```

## Coordinate System

- **X**: Left (-) to Right (+)
- **Y**: Down (-) to Up (+)
- **Z**: Back (-) to Front (+)

Typical camera: `position={[0, 2, 10]}` (elevated, back from center)

## Resources

- Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/
- Journey: https://threejs-journey.com/
