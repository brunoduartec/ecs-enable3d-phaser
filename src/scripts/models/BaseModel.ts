import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";

import { IModel } from "./IModel";
class BaseModel implements IModel {
  protected model: ExtendedObject3D;
  protected modelInfo: any;
  protected third: Third;
  protected _id: number;

  constructor(third: Third, modelInfo: any) {
    this.modelInfo = modelInfo;
    this._id = modelInfo.id || 0;
    this.third = third;
  }
  getName(): string {
    return this.model.userData.eid || this.model.uuid;
  }
  setId(id: number) {
    this._id = id;
  }
  async create(position: THREE.Vector3): Promise<any> {
    throw new Error("Method not implemented.");
  }
  load() {
    throw new Error("Method not implemented.");
  }

  getModel(): ExtendedObject3D {
    throw new Error("Method not implemented.");
  }

  getId(): number {
    return this._id;
  }
}

export { BaseModel };
