export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("logo", "/logo.png"); // put a logo in /public
  }

  create() {
    this.scene.start("MenuScene");
  }
}
