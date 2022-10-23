import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { BaseModel } from "./BaseModel";

export interface GLModelInfo {
  modelName: string;
  alias: string;
}

class GLModel extends BaseModel {
  protected object: GLTF;
  constructor(third: Third, modelInfo: GLModelInfo) {
    super(third, modelInfo);
  }

  async preload() {}

  async load() {
    const { modelName, alias } = this.modelInfo;
    this.object = await this.third.load.gltf(modelName);

    const scene = this.object.scenes[0];
  }
  clone(): ExtendedObject3D {
    let scene = SkeletonUtils.clone(this.object.scene);

    const cloneModel = new ExtendedObject3D();
    cloneModel.frustumCulled = true;
    cloneModel.add(scene);
    cloneModel.castShadow = cloneModel.receiveShadow = false;

    return cloneModel;
  }

  async create(position: THREE.Vector3): Promise<ExtendedObject3D> {
    const cloneModel = this.clone();

    cloneModel.position.set(position.x, position.y, position.z);

    this.third.add.existing(cloneModel);

    cloneModel.traverse((child) => {
      if (child.isMesh) {
        this.third.physics.add.existing(child, {
          shape: "concave",
          mass: 0,
          collisionFlags: 1,
          autoCenter: false,
        });
      }
    });

    return cloneModel;
  }
}

export { GLModel };
