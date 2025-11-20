# React Three Fiber Skill

Expert guide for React Three Fiber development in 3D terminals projects.

## Overview

React Three Fiber (R3F) is a React renderer for Three.js. Use this skill when working with 3D scenes in React applications.

## Core Concepts

### Canvas Setup
```jsx
import { Canvas } from '@react-three/fiber';

<Canvas
  camera={{ position: [0, 2, 10], fov: 50 }}
  gl={{ antialias: true }}
>
  {/* 3D content here */}
</Canvas>
```

### 3D Objects
```jsx
function Box() {
  const meshRef = useRef();

  // Animation loop
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

### Events
```jsx
<mesh
  onClick={(e) => console.log('clicked')}
  onPointerOver={(e) => setHovered(true)}
  onPointerOut={(e) => setHovered(false)}
>
```

## Common Patterns

### Drei Helpers
```jsx
import { OrbitControls, Html, Stars, Sky } from '@react-three/drei';

// Camera controls
<OrbitControls />

// HTML in 3D space
<Html position={[0, 0, 0]}>
  <div>HTML content</div>
</Html>

// Environment
<Stars />
<Sky />
```

### State Management
```jsx
const [isFlipped, setIsFlipped] = useState(false);

// Use state to control 3D object appearance
<meshStandardMaterial
  color={isFlipped ? 'red' : 'blue'}
  emissive={color}
  emissiveIntensity={isHovered ? 0.5 : 0.2}
/>
```

### Html Portals for Terminals
```jsx
<Html
  transform
  distanceFactor={3}
  position={[0, 0, 1.1]}
  style={{
    width: '400px',
    height: '300px',
    pointerEvents: isFlipped ? 'auto' : 'none',
    visibility: isFlipped ? 'visible' : 'hidden',
  }}
>
  <YourTerminalComponent />
</Html>
```

## Performance Tips

1. **Use refs for animations** - Avoid re-renders
2. **useCallback for handlers** - Prevent infinite loops
3. **Conditional rendering** - Only render what's needed
4. **Suspense** - Lazy load heavy components

## Event Handling with OrbitControls

```jsx
// Prevent OrbitControls from consuming clicks
<mesh onClick={(e) => {
  e.stopPropagation();
  handleClick();
}} />
```

## Common Issues

### Clicks Not Working
- Check OrbitControls isn't consuming events
- Verify pointer events CSS
- Use `e.stopPropagation()` when needed

### Terminals Not Visible
- Check `visibility` CSS property
- Verify `pointerEvents` setting
- Ensure Html portal has correct `distanceFactor`

### Performance Issues
- Use `useFrame` carefully
- Limit number of Html portals
- Check geometry complexity

## Integration with Terminals

### Pattern for Flippable Objects with Terminals
```jsx
function ObjectWithTerminal({ position, color, name }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasSpawnedTerminal, setHasSpawnedTerminal] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
    if (!hasSpawnedTerminal) setHasSpawnedTerminal(true);
  };

  return (
    <group position={position}>
      <mesh onClick={handleClick}>
        <boxGeometry />
        <meshStandardMaterial color={color} />
      </mesh>

      {hasSpawnedTerminal && (
        <Html
          style={{ visibility: isFlipped ? 'visible' : 'hidden' }}
        >
          <Terminal />
        </Html>
      )}
    </group>
  );
}
```

## Resources

- Docs: https://docs.pmnd.rs/react-three-fiber
- Drei: https://github.com/pmndrs/drei
- Examples: https://docs.pmnd.rs/react-three-fiber/getting-started/examples
