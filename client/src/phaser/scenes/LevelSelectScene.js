export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super("LevelSelectScene");
  }

  create() {
    const { width } = this.sys.game.config;
    const levels = [1, 2, 3, 4, 5];

    levels.forEach((level, idx) => {
      const isUnlocked = level === 1 || localStorage.getItem(`level${level - 1}_cleared`) === "true";

      const label = isUnlocked ? `Level ${level}` : `🔒 Level ${level}`;
      const color = isUnlocked ? "#00ff00" : "#888";

      const levelText = this.add.text(width / 2, 100 + idx * 60, label, {
        fontSize: "24px",
        color,
        backgroundColor: "#222",
        padding: { x: 20, y: 10 },
      }).setOrigin(0.5).setInteractive();

      if (isUnlocked) {
        levelText.on("pointerdown", () => {
          this.scene.start("LevelPlayScene", { level });
        });
      }
    });
  }
}
