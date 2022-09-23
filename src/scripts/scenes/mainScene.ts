import { Scene3D } from "@enable3d/phaser-extension";

import { createWorld, addEntity, addComponent } from "bitecs";

import type { IWorld, System } from "bitecs";

import Position from "../components/Position";
import Velocity from "../components/Velocity";
import Model, { ModelTypes } from "../components/Model";
import Rotation from "../components/Rotation";
import Player from "../components/Player";
import CPU from "../components/CPU";
import Input from "../components/Input";

import createMovementSystem from "../systems/movement";
import createModelSystem from "../systems/model";
import createPlayerSystem from "../systems/player";
import createCPUSystem from "../systems/cpu";

interface keysProps {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export default class MainScene extends Scene3D {
  private world!: IWorld;
  private playerSystem!: System;
  private cpuSystem!: System;
  private movementSystem!: System;
  private modelSystem!: System;
  private keys: keysProps;

  constructor() {
    super({ key: "MainScene" });
  }

  init() {
    this.accessThirdDimension();
  }

  createPlayerTank() {
    // create the player tank
    const blueTank = addEntity(this.world);
    addComponent(this.world, Position, blueTank);
    addComponent(this.world, Velocity, blueTank);
    addComponent(this.world, Rotation, blueTank);
    addComponent(this.world, Model, blueTank);
    addComponent(this.world, Player, blueTank);
    addComponent(this.world, Input, blueTank);
    Position.x[blueTank] = 1;
    Position.y[blueTank] = 10;
    Position.z[blueTank] = 0;

    Model.modelType[blueTank] = ModelTypes.box;
    Model.width[blueTank] = 1;
    Model.height[blueTank] = 1;
    Input.speed[blueTank] = 2;
  }

  createEnemyTank(width, height) {
    const tank = addEntity(this.world);

    addComponent(this.world, Position, tank);
    Position.x[tank] = Phaser.Math.Between(width * 0.25, width * 0.75);
    Position.y[tank] = 0;
    Position.z[tank] = Phaser.Math.Between(height * 0.25, height * 0.75);

    addComponent(this.world, Velocity, tank);
    addComponent(this.world, Rotation, tank);

    addComponent(this.world, Model, tank);
    Model.modelType[tank] = ModelTypes.sphere;

    addComponent(this.world, CPU, tank);
    CPU.timeBetweenActions[tank] = Phaser.Math.Between(0, 500);

    addComponent(this.world, Input, tank);
    Input.speed[tank] = 3;
  }

  create() {
    const { width, height } = this.scale;

    // creates a nice scene
    this.third.warpSpeed();

    this.world = createWorld();

    this.createPlayerTank();

    this.keys = {
      left: this.input.keyboard.addKey("a"),
      right: this.input.keyboard.addKey("d"),
      up: this.input.keyboard.addKey("w"),
      down: this.input.keyboard.addKey("s"),
    };

    // create the systems
    this.playerSystem = createPlayerSystem(this.keys);
    this.cpuSystem = createCPUSystem(this);
    this.movementSystem = createMovementSystem();
    this.modelSystem = createModelSystem(this);

    for (let i = 0; i < 10; ++i) {
      this.createEnemyTank(10, 10);
    }

    // adds a box
    // this.third.add.box({ x: 1, y: 2 });

    // const box = this.third.physics.add.box(
    //   {
    //     x: 1,
    //     y: 2,
    //     z: 10,
    //     width: 5,
    //     height: 3,
    //     depth: 1,
    //     mass: 2,
    //     collisionFlags: 0,
    //   },
    //   { lambert: { color: "red", transparent: true, opacity: 0.5 } }
    // );

    // // adds a box with physics
    // this.third.physics.add.box({ x: -1, y: 2 });

    // throws some random object on the scene
    // this.third.haveSomeFun()
  }

  update() {
    // run each system in desired order
    this.playerSystem(this.world);
    this.cpuSystem(this.world);

    this.movementSystem(this.world);

    this.modelSystem(this.world);
  }
}
