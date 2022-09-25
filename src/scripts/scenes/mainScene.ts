import { Scene3D } from "@enable3d/phaser-extension";

import { createWorld } from "bitecs";

import type { IWorld, System } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

import { EntityFactory } from "../entities/Entityfactory";

import { SystemHandler } from "../systems/SystemsHandler";

const Jump = ComponentFactory.getInstance().getProduct("Jump");
const Position = ComponentFactory.getInstance().getProduct("Position");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Player = ComponentFactory.getInstance().getProduct("Player");
const NPC = ComponentFactory.getInstance().getProduct("NPC");
const Input = ComponentFactory.getInstance().getProduct("Input");
const Clicked = ComponentFactory.getInstance().getProduct("Clicked");
const Health = ComponentFactory.getInstance().getProduct("Health");

import createMovementSystem from "../systems/movement";
import createModelSystem from "../systems/model";
import createPlayerSystem from "../systems/player";
import checkLifeSystem from "../systems/life";
import createNPCSystem from "../systems/npc";

export default class MainScene extends Scene3D {
  private world!: IWorld;
  private playerSystem!: System;
  private cpuSystem!: System;
  private movementSystem!: System;
  private modelSystem!: System;
  private checkLifeSystem!: System;
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

    for (let i = 0; i < 5; ++i) {
      this.createNPC(10, 10);
    }
  }

  update() {
    this.systemHandler.updateSystems(this.world);
  }
}
