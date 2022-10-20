import { BoxConfig, SphereConfig } from "@enable3d/common/dist/types";
import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";
import { BaseModel } from "./BaseModel";

import { IModel } from "./IModel";

interface BasicModelInfo {
  modeltype: string;
  config: BoxConfig | SphereConfig;
}

class BasicModel extends BaseModel {
  constructor(third: Third, modelInfo: BasicModelInfo) {
    super(third, modelInfo);
  }

  load() {
    const { modeltype, config } = this.modelInfo;
    this.model = this.third.make[modeltype](config);
  }

  async create(): Promise<ExtendedObject3D> {
    let cloneModel = this.model.clone();
    this.third.add.existing(cloneModel); // add to scene
    this.third.physics.add.existing(cloneModel); // add physics

    return cloneModel;
  }
}

export { BasicModel };
