import { IWorld } from "bitecs";

import createMovementSystem from "./movement";
import createModelSystem from "./model";
import createPlayerSystem from "./player";
import checkLifeSystem from "./life";
import createNPCSystem from "./npc";
import chasePlayerSystem from "./chaseplayer";
import handlePhysicsSystem from "./physics";

class SystemHandler {
  private static instance: SystemHandler;
  private systems: any;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(scene) {
    this.systems = [];

    const keys = {
      left: scene.input.keyboard.addKey("a"),
      right: scene.input.keyboard.addKey("d"),
      up: scene.input.keyboard.addKey("w"),
      down: scene.input.keyboard.addKey("s"),
      jump: scene.input.keyboard.addKey("SPACE"),
    };

    this.systems.push(createPlayerSystem(keys));
    this.systems.push(createNPCSystem(scene));
    this.systems.push(chasePlayerSystem(scene));

    this.systems.push(createMovementSystem());
    this.systems.push(createModelSystem(scene));
    this.systems.push(checkLifeSystem());
    this.systems.push(handlePhysicsSystem(scene));
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(scene): SystemHandler {
    if (!SystemHandler.instance) {
      SystemHandler.instance = new SystemHandler(scene);
    }

    return SystemHandler.instance;
  }

  public updateSystems(world: IWorld) {
    for (let index = 0; index < this.systems.length; index++) {
      const system = this.systems[index];
      system(world);
    }
  }
}

export { SystemHandler };
