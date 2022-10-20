import { ExtendedObject3D } from "@enable3d/phaser-extension";
import { Concretefactory } from "./ConcreteFactory";

class ModelFactory extends Concretefactory {
  private static instance: ModelFactory;

  private models = new Map<number, ExtendedObject3D>();

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    super();
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): ModelFactory {
    if (!ModelFactory.instance) {
      ModelFactory.instance = new ModelFactory();
    }

    return ModelFactory.instance;
  }

  public addModel(id: number, model: ExtendedObject3D) {
    this.models.set(id, model);
  }

  public getModels() {
    return this.models;
  }

  public getModel(id: number): ExtendedObject3D | undefined {
    const model = this.models?.get(id);

    return model;
  }

  public removeModel(id: number): ExtendedObject3D | undefined {
    const model = this.getModel(id);
    this.models.delete(id);
    return model;
  }
}

export { ModelFactory };
