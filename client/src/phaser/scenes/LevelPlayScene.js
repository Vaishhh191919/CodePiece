export default class LevelPlayScene extends Phaser.Scene {
  constructor() {
    super('LevelPlayScene');
  }

  init(data) {
    this.level = data.level;
  }

  create() {
    // Always show something visible immediately
    this.cameras.main.setBackgroundColor('#2d3436');
    
    // Immediate visual feedback
    this.add.text(400, 100, `Loading Level ${this.level}...`, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Programmatic navigation to React level
    this.time.delayedCall(500, () => {
      window.location.href = `/level${this.level}`;
    });
  }
}