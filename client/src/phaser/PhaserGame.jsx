// phaser/PhaserGame.jsx - Simplified version
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import MenuScene from "./scenes/MenuScene";

const PhaserGame = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainer.current,
      scene: [MenuScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      // Disable unused systems
      physics: { default: null }, // No physics if not needed
      render: { pixelArt: false, antialias: true },
      audio: { noAudio: true } // Disable if not using audio
    };

    const game = new Phaser.Game(config);

    return () => game.destroy(true);
  }, []);

  return <div ref={gameContainer} className="mx-auto w-[800px] h-[600px]" />;
};

export default PhaserGame;