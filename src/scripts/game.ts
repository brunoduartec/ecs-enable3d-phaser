import * as Phaser from "phaser";
import { enable3d, Canvas, PhysicsLoader } from "@enable3d/phaser-extension";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  // forceSingleUpdate :false,
  scene: [PreloadScene, MainScene],
  ...Canvas({ antialias: false }),
};

window.addEventListener("load", () => {
  enable3d(() => new Phaser.Game(config)).withPhysics("/assets/ammo/kripken");
});
