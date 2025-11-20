import React, { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, RoundedBox, Text, Float } from '@react-three/drei';
import { SimpleTerminal } from './SimpleTerminal';
import * as THREE from 'three';

// Individual 3D Card with Terminal
function TerminalCard({ position, color, name, icon = '💻' }) {
  const groupRef = useRef();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [terminalConnected, setTerminalConnected] = useState(false);
  const [hasSpawnedTerminal, setHasSpawnedTerminal] = useState(false);

  // Smooth flip animation - rotate parent group
  useFrame(() => {
    if (!groupRef.current) return;

    const targetRotation = isFlipped ? Math.PI : 0;
    groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.1;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    const newFlipState = !isFlipped;
    setIsFlipped(newFlipState);

    // Spawn terminal on first flip
    if (newFlipState && !hasSpawnedTerminal) {
      setHasSpawnedTerminal(true);
    }
  };

  const handleTerminalConnect = useCallback(() => {
    console.log('Terminal connected:', name);
    setTerminalConnected(true);
  }, [name]);

  const handleTerminalDisconnect = useCallback(() => {
    console.log('Terminal disconnected:', name);
    setTerminalConnected(false);
  }, [name]);

  return (
    <Float
      speed={1}
      rotationIntensity={0.1}
      floatIntensity={0.2}
      floatingRange={[-0.1, 0.1]}
    >
      <group position={position}>
        {/* Rotating group for flip animation */}
        <group
          ref={groupRef}
          onClick={handleClick}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
        >
          {/* FRONT CARD */}
          <group>
          {/* Front Base */}
          <RoundedBox args={[2.5, 3.5, 0.05]} radius={0.05} smoothness={4}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.8}
            />
          </RoundedBox>

          {/* Front Border Glow */}
          <RoundedBox args={[2.55, 3.55, 0.04]} radius={0.05} smoothness={4}>
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isHovered ? 0.9 : 0.6}
              side={THREE.BackSide}
              toneMapped={false}
            />
          </RoundedBox>

          {/* Card Icon */}
          <Text
            position={[0, 0.6, 0.04]}
            fontSize={0.7}
            anchorX="center"
            anchorY="middle"
          >
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
            {icon}
          </Text>

          {/* Card Name */}
          <Text
            position={[0, -0.2, 0.04]}
            fontSize={0.2}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.05}
          >
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
            {name.toUpperCase()}
          </Text>

          {/* Status */}
          <Text
            position={[0, -0.6, 0.04]}
            fontSize={0.13}
            anchorX="center"
            anchorY="middle"
          >
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
            {terminalConnected ? '🟢 ONLINE' : '⚫ OFFLINE'}
          </Text>

          {/* Click instruction */}
          <Text
            position={[0, -1.2, 0.04]}
            fontSize={0.09}
            anchorX="center"
            anchorY="middle"
          >
            <meshBasicMaterial color="#ffffff" toneMapped={false} opacity={0.7} transparent />
            {'CLICK TO FLIP'}
          </Text>
        </group>

          {/* BACK CARD */}
          <group rotation={[0, Math.PI, 0]}>
          {/* Back Base */}
          <RoundedBox args={[2.5, 3.5, 0.05]} radius={0.05} smoothness={4}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.8}
            />
          </RoundedBox>

          {/* Back Border Glow */}
          <RoundedBox args={[2.55, 3.55, 0.04]} radius={0.05} smoothness={4}>
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isHovered ? 0.9 : 0.6}
              side={THREE.BackSide}
              toneMapped={false}
            />
          </RoundedBox>

          {/* Terminal Portal - Keep alive but hide when not flipped */}
          {hasSpawnedTerminal && (
            <Html
              transform
              occlude
              distanceFactor={1.5}
              position={[0, 0, 0.04]}
              style={{
                width: '600px',
                height: '820px',
                pointerEvents: isFlipped ? 'auto' : 'none',
                visibility: isFlipped ? 'visible' : 'hidden',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#0a0a0a',
                  border: `1px solid ${color}`,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header - Clickable to flip back */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(e);
                  }}
                  style={{
                    background: color,
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: `1px solid ${color}44`,
                  }}
                >
                  <span style={{
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}>
                    {icon} {name}
                  </span>
                  <span style={{
                    color: '#000',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    ✕ CLOSE
                  </span>
                </div>

                {/* Terminal - Fills remaining space */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    pointerEvents: 'auto',
                  }}
                >
                  <SimpleTerminal
                    color={color}
                    agentName={name}
                    onConnect={handleTerminalConnect}
                    onDisconnect={handleTerminalDisconnect}
                  />
                </div>
              </div>
            </Html>
          )}
          </group>
        </group>

        {/* Glow effect when hovered */}
        {isHovered && (
          <pointLight position={[0, 0, 2]} color={color} intensity={2} distance={5} />
        )}
      </group>
    </Float>
  );
}

// Main Scene
export default function Scene3D() {
  // Define your 3D cards here
  const cards = [
    { id: 1, name: 'Terminal 1', position: [-4, 0, 0], color: '#00ff00', icon: '🚀' },
    { id: 2, name: 'Terminal 2', position: [0, 0, 0], color: '#00ffff', icon: '💻' },
    { id: 3, name: 'Terminal 3', position: [4, 0, 0], color: '#ff00ff', icon: '⚡' },
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00ffff" />

          {/* Background */}
          <color attach="background" args={['#0a0a0a']} />
          <Stars radius={100} depth={50} count={5000} factor={4} />

          {/* 3D Cards with Terminals */}
          {cards.map((card) => (
            <TerminalCard
              key={card.id}
              position={card.position}
              color={card.color}
              name={card.name}
              icon={card.icon}
            />
          ))}

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={20}
            minDistance={3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
