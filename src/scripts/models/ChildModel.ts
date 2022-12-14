import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { BaseModel } from "./BaseModel";
import { IModel } from "./IModel";

export interface GLModelInfo {
  modelName: string;
  alias: string;
}

class ChildModel implements IModel {
  protected object: GLTF;
  protected model: ExtendedObject3D;
  protected third: Third;
  protected id: number;

  constructor(third: Third, model: ExtendedObject3D) {
    this.third = third;
    this.model = model;
  }
  getName(): string {
    return this.model.name;
  }
  getModel() {
    return this.model;
  }
  setId(id: number) {
    this.id = id;
  }
  getId(): number {
    return this.id;
  }

  async preload() {}

  async load() {}
  clone(): ExtendedObject3D {
    let scene = SkeletonUtils.clone(this.model);

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

export { ChildModel };
