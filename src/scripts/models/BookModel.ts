import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";
import { GLModel, GLModelInfo } from "./glModel";

class BookModel extends GLModel {
  constructor(third: Third, modelInfo: GLModelInfo) {
    super(third, modelInfo);
  }

  async create(): Promise<ExtendedObject3D> {
    const cloneModel = this.clone();

    cloneModel.scale.set(2, 2, 2);
    cloneModel.castShadow = false;
    this.third.add.existing(cloneModel);

    this.object.animations.forEach((anim, i) => {
      let mixer = this.third.animationMixers.create(cloneModel);
      mixer.clipAction(anim).play();
    });

    cloneModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = child.receiveShadow = false;

        // child.material = new Material()
        // child.material.metalness = 0;
        // child.material.roughness = 1;

        if (/mesh/i.test(child.name)) {
          this.third.physics.add.existing(child, {
            shape: "concave",
            mass: 0,
            collisionFlags: 1,
            autoCenter: false,
          });
          child.body.setAngularFactor(0, 0, 0);
          child.body.setLinearFactor(0, 0, 0);
        }
      }
    });
    return cloneModel;
  }
}

export { BookModel };
