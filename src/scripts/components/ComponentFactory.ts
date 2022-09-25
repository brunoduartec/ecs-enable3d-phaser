import { Concretefactory } from "../ConcreteFactory";

import Position from "./Position";
import Velocity from "./Velocity";
import Jump from "./Jump";
import Model from "./Model";
import Rotation from "./Rotation";
import Player from "./Player";
import NPC from "./NPC";
import Input from "./Input";
import Clicked from "./Clicked";
import Health from "./Health";

class ComponentFactory extends Concretefactory {
  private static instance: ComponentFactory;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    super();
    this.addProduct("Position", Position);
    this.addProduct("Velocity", Velocity);
    this.addProduct("Jump", Jump);
    this.addProduct("Model", Model);
    this.addProduct("Rotation", Rotation);
    this.addProduct("Player", Player);
    this.addProduct("NPC", NPC);
    this.addProduct("Input", Input);
    this.addProduct("Clicked", Clicked);
    this.addProduct("Health", Health);
    this.addProduct("Model", Model);
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): ComponentFactory {
    if (!ComponentFactory.instance) {
      ComponentFactory.instance = new ComponentFactory();
    }

    return ComponentFactory.instance;
  }
}

export { ComponentFactory };
