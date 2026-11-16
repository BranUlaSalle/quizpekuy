"use client";

import { useState } from "react";
import HudFrame from "./components/HudFrame";
import LoginCard from "./components/LoginCard";
import WelcomeScreen from "./components/WelcomeScreen";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Lobby from "./components/Lobby";
import GameScreen from "./components/GameScreen";

export default function Home() {
  const [screen, setScreen] = useState("login"); // login | welcome | create | join | lobby | game
  const [user, setUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);

  function handleLoginSuccess(userData) {
    setUser(userData);
    setScreen("welcome");
  }

  function handleLogout() {
    try {
      localStorage.removeItem("quizpekuy_user");
      localStorage.removeItem("quizpekuy_token");
    } catch {}
    setUser(null);
    setCurrentRoom(null);
    setScreen("login");
  }

  function handleCreateRoomNav() {
    setScreen("create");
  }

  function handleJoinRoomNav() {
    setScreen("join");
  }

  function handleRoomCreated(sala) {
    setCurrentRoom(sala);
    setScreen("lobby");
  }

  function handleRoomJoined(sala) {
    setCurrentRoom(sala);
    if (sala.estado === "jugando") {
      setScreen("game");
    } else {
      setScreen("lobby");
    }
  }

  function handleStartGame(sala) {
    setCurrentRoom(sala);
    setScreen("game");
  }

  function handleBackToWelcome() {
    setScreen("welcome");
    setCurrentRoom(null);
  }

  return (
    <main className="main-viewport">
      {/* Sci-Fi Golden HUD Side Frame Brackets */}
      <HudFrame />

      {/* Screen Views */}
      {screen === "login" && (
        <LoginCard onLoginSuccess={handleLoginSuccess} />
      )}

      {screen === "welcome" && user && (
        <WelcomeScreen
          user={user}
          onCreateRoom={handleCreateRoomNav}
          onJoinRoom={handleJoinRoomNav}
          onLogout={handleLogout}
        />
      )}

      {screen === "create" && user && (
        <CreateRoom
          user={user}
          onRoomCreated={handleRoomCreated}
          onBack={handleBackToWelcome}
        />
      )}

      {screen === "join" && user && (
        <JoinRoom
          user={user}
          onRoomJoined={handleRoomJoined}
          onBack={handleBackToWelcome}
        />
      )}

      {screen === "lobby" && user && currentRoom && (
        <Lobby
          user={user}
          sala={currentRoom}
          onStartGame={handleStartGame}
          onBack={handleBackToWelcome}
        />
      )}

      {screen === "game" && user && currentRoom && (
        <GameScreen
          user={user}
          sala={currentRoom}
          onBackToMenu={handleBackToWelcome}
        />
      )}
    </main>
  );
}
