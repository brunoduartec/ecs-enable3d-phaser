import { Scene3D } from "@enable3d/phaser-extension";

import { createWorld } from "bitecs";

import type { IWorld, System } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

import { EntityFactory } from "../entities/Entityfactory";
import { SystemHandler } from "../systems/SystemsHandler";

export default class MainScene extends Scene3D {
  private world!: IWorld;
  private systemHandler!: SystemHandler;

  constructor() {
    super({ key: "MainScene" });
  }

  init() {
    this.accessThirdDimension();
  }

  createPlayer() {
    EntityFactory.getInstance().instantiateProduct("Player", this.world);
  }

  createNPC(width, height) {
    EntityFactory.getInstance().instantiateProduct("NPC", this.world, {
      width,
      height,
    });
  }

  create() {
    const { width, height } = this.scale;

    // creates a nice scene
    this.third.warpSpeed();

    this.third.physics.debug?.enable();
    this.third.physics.debug?.mode(1);

    this.world = createWorld();

    // enable physics debugging

    this.createPlayer();

    this.systemHandler = SystemHandler.getInstance(this);

    // for (let i = 0; i < 5; ++i) {
    this.createNPC(10, 10);
    // }
  }

  update() {
    this.systemHandler.updateSystems(this.world);
  }
}
