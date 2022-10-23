import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";
import { GLModel, GLModelInfo } from "./glModel";

class PlayerModel extends GLModel {
  constructor(third: Third, modelInfo: GLModelInfo) {
    super(third, modelInfo);
  }

  async create(position: THREE.Vector3): Promise<ExtendedObject3D> {
    let cloneModel = this.clone();

    cloneModel.position.set(position.x, position.y, position.z);

    // cloneModel.traverse((child) => {
    //   if (child.isMesh) {
    //     child.castShadow = child.receiveShadow = true;
    //   }
    // });

    /**
     * Animations
     */
    this.third.animationMixers.add(cloneModel.anims.mixer);

    this.object.animations.forEach((animation) => {
      if (animation.name) {
        cloneModel.anims.add(animation.name, animation);
      }
    });

    // cloneModel.animation.play("idle");
    cloneModel.anims.play("idle");

    /**
     * Add the player to the scene with a body
     */
    this.third.add.existing(cloneModel, {
      standard: { metalness: 0, roughness: 1 },
    });
    // // this.third.add.existing(cloneModel);
    this.third.physics.add.existing(cloneModel, {
      shape: "sphere",
      radius: 0.25,
      width: 0.5,
      offset: { y: -0.25 },
    });
    cloneModel.body.setFriction(0.8);
    cloneModel.body.setAngularFactor(0, 0, 0);

    // // https://docs.panda3d.org/1.10/python/programming/physics/bullet/ccd
    cloneModel.body.setCcdMotionThreshold(1e-7);
    cloneModel.body.setCcdSweptSphereRadius(0.25);

    return cloneModel;
  }
}

export { PlayerModel };
