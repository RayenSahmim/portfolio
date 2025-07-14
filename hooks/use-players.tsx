"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSocket } from "@/contexts/socket-context";
import * as THREE from "three";

export interface Player {
  id: string;
  username: string;
  color: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  isMovingForward: boolean;
  timestamp: number;
}

export function usePlayers() {
  const { socket, connected } = useSocket();
  const [players, setPlayers] = useState<Map<string, Player>>(new Map());
  const [isInSpaceExplorer, setIsInSpaceExplorer] = useState(false);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Join space explorer session
  const joinSpaceExplorer = useCallback((playerInfo?: { username: string; color: string }) => {
    if (socket && connected) {
      if (playerInfo) {
        socket.emit("join-space-explorer", {
          username: playerInfo.username,
          color: playerInfo.color,
          timestamp: Date.now()
        });
      }
      setIsInSpaceExplorer(true);
    }
  }, [socket, connected]);

  // Leave space explorer session
  const leaveSpaceExplorer = useCallback((playerInfo?: { username: string }) => {
    if (socket && connected) {
      if (playerInfo) {
        socket.emit("leave-space-explorer", {
          username: playerInfo.username,
          timestamp: Date.now()
        });
      } else {
        socket.emit("leave-space-explorer");
      }
      setIsInSpaceExplorer(false);
      setPlayers(new Map()); // Clear other players when leaving
    }
  }, [socket, connected]);

  // Update local player position
  const updatePlayerPosition = useCallback((
    position: THREE.Vector3,
    rotation: THREE.Euler,
    velocity: THREE.Vector3,
    isMovingForward: boolean
  ) => {
    if (!socket || !connected || !isInSpaceExplorer) return;

    const now = Date.now();
    // Throttle updates to 20 times per second (50ms)
    if (now - lastUpdateRef.current < 50) return;
    
    lastUpdateRef.current = now;

    const playerData = {
      position: {
        x: position.x,
        y: position.y,
        z: position.z
      },
      rotation: {
        x: rotation.x,
        y: rotation.y,
        z: rotation.z
      },
      velocity: {
        x: velocity.x,
        y: velocity.y,
        z: velocity.z
      },
      isMovingForward,
      timestamp: now
    };

    socket.emit("player-update", playerData);
  }, [socket, connected, isInSpaceExplorer]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handlePlayersUpdate = (playersList: Player[]) => {
      const playersMap = new Map<string, Player>();
      playersList.forEach(player => {
        if (player.id !== socket.id) { // Don't include ourselves
          playersMap.set(player.id, player);
        }
      });
      setPlayers(playersMap);
      // If we receive a players update, it means we're in the space explorer
      if (playersList.some(p => p.id === socket.id)) {
        setIsInSpaceExplorer(true);
      }
    };

    const handlePlayerJoined = (player: Player) => {
      if (player.id !== socket.id) {
        setPlayers(prev => new Map(prev.set(player.id, player)));
      }
    };

    const handlePlayerMoved = (player: Player) => {
      if (player.id !== socket.id) {
        setPlayers(prev => new Map(prev.set(player.id, player)));
      }
    };

    const handlePlayerLeft = (playerId: string) => {
      setPlayers(prev => {
        const newMap = new Map(prev);
        newMap.delete(playerId);
        return newMap;
      });
    };

    const handleSpaceExplorerPlayers = (playersList: Player[]) => {
      const playersMap = new Map<string, Player>();
      playersList.forEach(player => {
        if (player.id !== socket.id) {
          playersMap.set(player.id, player);
        }
      });
      setPlayers(playersMap);
      // If we receive space explorer players, it means we're in the space explorer
      setIsInSpaceExplorer(true);
    };

    // Register event listeners
    socket.on("players-update", handlePlayersUpdate);
    socket.on("player-joined", handlePlayerJoined);
    socket.on("player-moved", handlePlayerMoved);
    socket.on("player-left", handlePlayerLeft);
    socket.on("space-explorer-players", handleSpaceExplorerPlayers);

    // Cleanup
    return () => {
      socket.off("players-update", handlePlayersUpdate);
      socket.off("player-joined", handlePlayerJoined);
      socket.off("player-moved", handlePlayerMoved);
      socket.off("player-left", handlePlayerLeft);
      socket.off("space-explorer-players", handleSpaceExplorerPlayers);
    };
  }, [socket]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (isInSpaceExplorer) {
        leaveSpaceExplorer();
      }
    };
  }, [isInSpaceExplorer, leaveSpaceExplorer]);

  return {
    playersMap: players,
    joinSpaceExplorer,
    leaveSpaceExplorer,
    updatePlayerPosition,
    isInSpaceExplorer,
    setIsInSpaceExplorer,
    connected
  };
}
