"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Player } from "@/hooks/use-players";

/**
 * MULTIPLAYER SPACESHIP MOVEMENT SYSTEM EXPLANATION:
 * 
 * === HOW SPACESHIP MOVEMENT WORKS ===
 * 1. Local Player Movement (in spaceship.tsx):
 *    - Uses keyboard/touch controls to detect input (WASD, Arrow keys, touch buttons)
 *    - Applies physics-based movement with velocity and rotation
 *    - Updates position based on thrust direction and velocity damping
 *    - Sends position updates to other players via socket
 * 
 * 2. Remote Player Movement (this file):
 *    - Receives position data from other players via socket
 *    - Interpolates smoothly between received positions for fluid movement
 *    - Renders visual effects (engine flames) based on movement state
 * 
 * === DATA NEEDED FROM OTHER PLAYERS ===
 * The Player interface contains all essential movement data:
 * - position: {x, y, z} - Current 3D world coordinates
 * - rotation: {x, y, z} - Current euler rotation angles (pitch, yaw, roll)
 * - velocity: {x, y, z} - Current movement velocity vector (for effects)
 * - isMovingForward: boolean - Whether player is actively thrusting forward
 * - timestamp: number - When this data was sent (for lag compensation)
 * - id: string - Unique player identifier
 * 
 * === MOVEMENT PHYSICS BREAKDOWN ===
 * - Thrust: Applied in the direction the spaceship is facing
 * - Rotation: Independent pitch/yaw/roll controls
 * - Banking: Ships tilt when turning (roll effect)
 * - Damping: Velocity gradually decreases without input (space friction)
 * - Speed Limiting: Maximum velocity cap to prevent infinite acceleration
 * 
 * === VISUAL EFFECTS TIED TO MOVEMENT ===
 * - Engine Flames: Visible only when isMovingForward is true
 * - Trail Lines: Appear after sustained forward movement
 * - Banking Animation: Ship tilts during turns based on rotation
 * - Smooth Interpolation: Prevents jerky movement from network updates
 */

interface OtherPlayerProps {
  player: Player; // Contains all movement and state data from remote player
}

export function OtherPlayer({ player }: OtherPlayerProps) {
  // Load the 3D spaceship model (same model used by all players)
  const { scene } = useGLTF("/models/spaceship.glb");
  
  // Reference to the spaceship group for position/rotation updates
  const shipRef = useRef<THREE.Group>(null);
  
  // References to engine flame effects (4 engines per spaceship)
  const fireRefs = useRef<THREE.Group[]>([]);
  
  // Initialize the fireRefs array to prevent undefined references
  // Each spaceship has 4 engine flames positioned at the back
  useEffect(() => {
    fireRefs.current = new Array(4).fill(null);
  }, []);
  
  // Use the player's actual color from their profile
  const playerColor = useMemo(() => {
    return new THREE.Color(player.color);
  }, [player.color]);

  // Clone the spaceship scene for this player
  // Each player needs their own instance to apply unique materials/colors
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    
    // Apply a unique tint to distinguish this player from others
    // Traverse through all mesh children in the 3D model
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const originalMaterial = child.material as THREE.MeshStandardMaterial;
        const newMaterial = originalMaterial.clone();
        
        // Tint the material with the player's unique color
        newMaterial.color.multiply(playerColor);
        newMaterial.emissive = playerColor.clone().multiplyScalar(0.1);
        
        child.material = newMaterial;
      }
    });
    
    return cloned;
  }, [scene, playerColor]);

  /**
   * SMOOTH INTERPOLATION SYSTEM:
   * 
   * Network updates arrive at irregular intervals (50ms throttled)
   * To create smooth movement, we interpolate between the current position
   * and the target position received from the network.
   * 
   * This prevents:
   * - Jerky/stuttering movement
   * - Teleportation between positions
   * - Visual artifacts from network lag
   */
  
  // Target values for smooth interpolation
  const targetPosition = useRef(new THREE.Vector3());
  const targetRotation = useRef(new THREE.Euler());

  // Update interpolation targets when new player data arrives from network
  // This happens whenever another player moves and sends their position
  useEffect(() => {
    // Set new target position from received player data
    targetPosition.current.set(
      player.position.x,
      player.position.y,
      player.position.z
    );
    
    // Set new target rotation from received player data
    targetRotation.current.set(
      player.rotation.x,  // Pitch (looking up/down)
      player.rotation.y,  // Yaw (turning left/right)
      player.rotation.z   // Roll (banking in turns)
    );
  }, [player.position, player.rotation]);

  /**
   * FRAME-BY-FRAME UPDATE LOOP:
   * 
   * This runs every frame (60fps) to smoothly animate the spaceship
   * between network position updates. The interpolation creates fluid
   * movement even though network data only arrives every 50ms.
   */
  useFrame((_, dt) => {
    if (!shipRef.current) return;

    /**
     * SMOOTH POSITION INTERPOLATION:
     * 
     * lerp() gradually moves from current position to target position
     * dt * 8 = interpolation speed (higher = faster, lower = smoother)
     * 
     * This ensures the spaceship smoothly glides to received positions
     * rather than jumping/teleporting instantly.
     */
    shipRef.current.position.lerp(targetPosition.current, dt * 8);
    
    /**
     * SMOOTH ROTATION INTERPOLATION:
     * 
     * Each rotation axis (x=pitch, y=yaw, z=roll) is interpolated separately
     * This creates smooth turning and banking animations.
     * 
     * MathUtils.lerp() handles the mathematical interpolation between angles
     */
    shipRef.current.rotation.x = THREE.MathUtils.lerp(
      shipRef.current.rotation.x,
      targetRotation.current.x,  // Target pitch angle
      dt * 8
    );
    shipRef.current.rotation.y = THREE.MathUtils.lerp(
      shipRef.current.rotation.y,
      targetRotation.current.y,  // Target yaw angle
      dt * 8
    );
    shipRef.current.rotation.z = THREE.MathUtils.lerp(
      shipRef.current.rotation.z,
      targetRotation.current.z,  // Target roll angle
      dt * 8
    );

    /**
     * ENGINE FLAME ANIMATION SYSTEM:
     * 
     * The flames are controlled by the 'isMovingForward' boolean
     * This boolean is set by the remote player's input state:
     * - true: Player is pressing forward key/button (W, ↑, or touch)
     * - false: Player is not actively thrusting
     * 
     * Visual Effects Based on Movement:
     * - Flames appear/disappear instantly (no flickering)
     * - Animated scaling creates realistic flame movement
     * - Each engine flame has slight offset timing for realism
     */
    fireRefs.current.forEach((fire, i) => {
      if (!fire) return;
      
      // Engine flame visibility logic
      if (!player.isMovingForward) {
        // Player is NOT thrusting - hide all flames immediately
        fire.visible = false;
        fire.scale.setScalar(0);
      } else {
        // Player IS thrusting - show animated flames
        fire.visible = true;
        
        // Create realistic flame animation with slight oscillation
        const oscillation = Math.sin(Date.now() * 0.004 + i * 0.8) * 0.1;
        const scale = 0.9 + oscillation;  // Scale between 0.8 and 1.0
        fire.scale.setScalar(scale);
      }
    });
  });

  // Debug logging to monitor multiplayer data flow
  // This helps developers understand what data is being received
  useEffect(() => {
    console.log(`Rendering other player: ${player.username} (${player.id.slice(-4)}) at position:`, player.position);
    console.log(`Player ${player.username} isMovingForward:`, player.isMovingForward);
  }, [player.id, player.username, player.isMovingForward]);

  /**
   * ENGINE FIRE COMPONENT:
   * 
   * Creates individual engine flame effects for each thruster
   * Each spaceship has 4 engines positioned at the rear
   * 
   * Component Structure:
   * - Outer cone: Main flame body (player's color)
   * - Inner cone: Flame core (player's color)
   * - Point light: Illuminates surrounding area
   * 
   * Position: Passed as prop to place at specific engine locations
   * Index: Used to store reference for animation control
   * Color: Player's chosen color for flames
   */
  const EngineFire = ({ pos, idx, color }: { pos: [number, number, number]; idx: number; color: THREE.Color }) => {
    const ref = useRef<THREE.Group>(null);
    
    // Store reference in fireRefs array for animation control
    useFrame(() => {
      if (ref.current && fireRefs.current) {
        fireRefs.current[idx] = ref.current;
      }
    });

    return (
      <group ref={ref} position={pos} visible={false} scale={0}>
        {/* Main flame body - larger, outer cone */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.3, 2, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
        
        {/* Flame core - smaller, inner cone for intensity */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.25]}>
          <coneGeometry args={[0.15, 1.5, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
        
        {/* Light emission from engine flame */}
        <pointLight color={color} intensity={0.8} distance={8} />
      </group>
    );
  };

  return (
    <group ref={shipRef}>
      {/* Debug sphere to show player position */}
      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial color={playerColor} transparent opacity={0.8} />
      </mesh>
      
      {/* Player Spaceship */}
      <primitive object={clonedScene} scale={0.5} />
      
      {/* Player name tag floating above */}
      <group position={[0, 3, 0]}>
        {/* Background plane for better text readability */}
        <mesh>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Player name text */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.2}
          color={playerColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {player.username}
        </Text>
      </group>
      
      {/* Engine flames - positioned same as main spaceship */}
      <EngineFire pos={[-0.6, 0.5, 2.2]} idx={0} color={playerColor} />
      <EngineFire pos={[-0.3, 0.5, 2.2]} idx={1} color={playerColor} />
      <EngineFire pos={[0.3, 0.5, 2.2]} idx={2} color={playerColor} />
      <EngineFire pos={[0.6, 0.5, 2.2]} idx={3} color={playerColor} />
    </group>
  );
}

// Component to render all other players
interface MultiplayerPlayersProps {
  playersMap: Map<string, Player>;
}

export function MultiplayerPlayers({ playersMap }: MultiplayerPlayersProps) {
  // Convert map to array only for rendering, but use stable keys
  const playerEntries = Array.from(playersMap.entries());
  
  return (
    <>
      {playerEntries.map(([playerId, player]) => (
        <OtherPlayer key={playerId} player={player} />
      ))}
    </>
  );
}
