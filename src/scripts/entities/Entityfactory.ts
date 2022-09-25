import { IWorld } from "bitecs";
import { Concretefactory } from "../ConcreteFactory";

import { NPC } from "./NPC";
import { Player } from "./Player";

class EntityFactory extends Concretefactory {
  private static instance: EntityFactory;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    super();

    this.addProduct("Player", Player);
    this.addProduct("NPC", NPC);
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): EntityFactory {
    if (!EntityFactory.instance) {
      EntityFactory.instance = new EntityFactory();
    }

    return EntityFactory.instance;
  }

  public instantiateProduct(name: string, world: IWorld, props?: any) {
    const Product: any = this.getProduct(name);
    const product = new Product();

    product.create(world, props);
  }
}

export { EntityFactory };
