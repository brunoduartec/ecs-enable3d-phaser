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
import AvoidDrop from "./AvoidDrop";
import View from "./View";
import Target from "./Target";
import ThirdPersonCamera from "./ThirdPersonCamera";
import ShouldAddSensor from "./ShouldAddSensor";
import Star from "./Star";

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
    this.addProduct("AvoidDrop", AvoidDrop);
    this.addProduct("View", View);
    this.addProduct("Target", Target);
    this.addProduct("ThirdPersonCamera", ThirdPersonCamera);
    this.addProduct("ShouldAddSensor", ShouldAddSensor);
    this.addProduct("Star", Star);
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
