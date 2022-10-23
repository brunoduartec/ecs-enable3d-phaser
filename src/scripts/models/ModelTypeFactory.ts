import { ExtendedObject3D, THREE } from "@enable3d/phaser-extension";
import { Concretefactory } from "../ConcreteFactory";
import { IModel } from "./IModel";

class ModelTypeFactory extends Concretefactory {
  private static instance: ModelTypeFactory;
  private previousId: number;
  private models = new Map<string, IModel>();

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    super();
    this.previousId = 0;
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): ModelTypeFactory {
    if (!ModelTypeFactory.instance) {
      ModelTypeFactory.instance = new ModelTypeFactory();
    }

    return ModelTypeFactory.instance;
  }

  public addModel(alias: string, model: IModel) {
    model.setId(this.previousId);
    this.models.set(alias, model);

    this.previousId++;
  }

  public getModel(alias: string): IModel | undefined {
    const model = this.models?.get(alias);

    return model;
  }

  public getModelId(alias: string): number {
    const model = this.getModel(alias);
    return model?.getId() || 0;
  }

  public getModelById(id: number): IModel | undefined {
    for (let [key, value] of this.models) {
      if (value.getId() === id) {
        return value;
      }
    }
    return undefined;
  }

  public async createById(
    id: number,
    position: THREE.Vector3
  ): Promise<ExtendedObject3D | undefined> {
    const modelTemplate = this.getModelById(id);
    try {
      let model = await modelTemplate?.create(position);
      if (model) {
        return model;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  public async create(
    alias: string,
    position: THREE.Vector3 = new THREE.Vector3()
  ): Promise<ExtendedObject3D | undefined> {
    const modelTemplate = this.models?.get(alias);
    try {
      let model = await modelTemplate?.create(position);
      if (model) {
        return model;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  public removeModel(alias: string): IModel | undefined {
    const model = this.getModel(alias);
    this.models.delete(alias);
    return model;
  }
}

export { ModelTypeFactory };
