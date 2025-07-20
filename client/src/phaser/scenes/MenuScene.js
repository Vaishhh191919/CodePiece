export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    // Load assets with correct paths
    this.load.image('bg', '/assets/ui/background.png');
    this.load.image('particle', '/assets/ui/glow.png');
    
    // Load audio files with correct format
    this.load.audio('select', [
      '/assets/sfx/select.mp3',
      '/assets/sfx/select.ogg'  // Fallback format
    ]);
    this.load.audio('hover', [
      '/assets/sfx/hover.mp3',
      '/assets/sfx/hover.ogg'   // Fallback format
    ]);
  }

  create() {
    // Set background
    this.bg = this.add.image(400, 300, 'bg')
      .setDisplaySize(800, 600)
      .setAlpha(0.8);
    
    // Modern particle system (Phaser 3.60+ compatible)
    this.particles = this.add.particles(0, 0, 'particle', {
      frame: 0,
      scale: { start: 0.1, end: 0 },
      blendMode: 'ADD',
      emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 0, 800, 600) },
      frequency: 100
    });

    // Create title
    this.add.text(400, 80, 'CODEPIECE', {
      fontSize: '72px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#6c5ce7',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Create level buttons
    this.createLevelButtons();
  }

  createLevelButtons() {
    const levels = [1, 2, 3, 4, 5];
    
    levels.forEach((level, i) => {
      const yPos = 180 + (i * 100);
      const unlocked = level === 1 || localStorage.getItem(`level${level-1}_cleared`) === 'true';
      
      const btn = this.add.rectangle(400, yPos, 450, 80, 0xffffff, 0.1)
        .setStrokeStyle(2, 0xffffff, 0.3)
        .setInteractive({ useHandCursor: true });
      
      // Level text
      this.add.text(400, yPos-10, `LEVEL ${level}`, {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff'
      }).setOrigin(0.5);
      
      // Status text
      this.add.text(400, yPos+20, unlocked ? 'Ready to play' : 'Locked', {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: unlocked ? '#55efc4' : '#ff7675'
      }).setOrigin(0.5);

      if (unlocked) {
        btn.on('pointerover', () => {
          this.sound.play('hover');
          btn.setFillStyle(0x6c5ce7, 0.3);
        });
        
        btn.on('pointerout', () => {
          btn.setFillStyle(0xffffff, 0.1);
        });
        
        btn.on('pointerdown', () => {
          this.sound.play('select');
          this.cameras.main.fadeOut(300);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            window.location.href = `/level${level}`;
          });
        });
      }
    });
  }
}