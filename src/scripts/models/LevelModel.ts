import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";
import { IWorld } from "bitecs";
import Position from "../components/Position";
import { EntityFactory } from "../entities/Entityfactory";
import { ChildModel } from "./childModel";
import { GLModel, GLModelInfo } from "./glModel";
import { ModelTypeFactory } from "./ModelTypeFactory";

class LevelModel extends GLModel {
  protected world: IWorld;
  constructor(third: Third, modelInfo: GLModelInfo, world: IWorld) {
    super(third, modelInfo);

    this.world = world;
  }

  async create(): Promise<ExtendedObject3D> {
    const cloneModel = this.clone();
    console.log("ENTROU");

    const scale = 2;

    cloneModel.scale.set(scale, scale, scale);
    cloneModel.castShadow = false;
    this.third.add.existing(cloneModel);

    this.object.animations.forEach((anim, i) => {
      let mixer = this.third.animationMixers.create(cloneModel);
      mixer.clipAction(anim).play();
    });

    cloneModel.traverse((child) => {
      const childName = child.userData.name;
      // const template = ModelTypeFactory.getInstance().getModel(childName);

      // if (!template) {
      //   const newModel = new ChildModel(this.third, child);
      //   ModelTypeFactory.getInstance().addModel(childName, newModel);
      // }

      if (childName === "Star") {
        console.log("Star");
        const starId = EntityFactory.getInstance().instantiateProduct(
          "Star",
          this.world,
          {
            position: {
              x: child.position.x * scale,
              y: child.position.y * scale,
              z: child.position.z * scale,
            },
          }
        );

        console.log("Setou a posição", starId, child.position);
      }

      if (child.isMesh) {
        child.castShadow = child.receiveShadow = false;

        // child.material.metalness = 0;
        // child.material.roughness = 1;

        // if (/mesh/i.test(child.name)) {
        this.third.physics.add.existing(child, {
          shape: "concave",
          mass: 0,
          collisionFlags: 1,
          autoCenter: false,
        });

        child.body.setAngularFactor(0, 0, 0);
        child.body.setLinearFactor(0, 0, 0);
        // }
      }
    });
    return cloneModel;
  }
}

export { LevelModel };
