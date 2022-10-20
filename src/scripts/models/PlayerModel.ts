import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";
import { GLModel, GLModelInfo } from "./glModel";

class PlayerModel extends GLModel {
  constructor(third: Third, modelInfo: GLModelInfo) {
    super(third, modelInfo);
  }

  async load() {
    const { modelName, alias } = this.modelInfo;
    this.object = await this.third.load.gltf(modelName);

    const scene = this.object.scene.children[0];

    const model = new ExtendedObject3D();
    this.model = model;

    this.model.name = alias;
    // this.model.rotateY(Math.PI + 0.1); // a hack
    this.model.add(scene);

    // this.model.rotation.set(0, Math.PI * 1.5, 0);
    // this.man.position.set(35, -3.5, 0)
  }

  async create(): Promise<ExtendedObject3D> {
    let cloneModel = this.model;

    // this.third.add.existing(cloneModel);

    // cloneModel.rotateY(Math.PI + 0.1); // a hack
    // cloneModel.rotation.set(0, Math.PI * 1.5, 0);
    // cloneModel.position.set(35, -3.5, 0);
    // add shadow
    cloneModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = child.receiveShadow = true;
        // this.third.physics.add.existing(child, {
        //   shape: "concave",
        //   mass: 0,
        //   collisionFlags: 1,
        //   autoCenter: false,
        // });

        // https://discourse.threejs.org/t/cant-export-material-from-blender-gltf/12258

        // child.material.roughness = 1;
        // child.material.metalness = 0;

        console.log(child.material);
      }
    });

    /**
     * Animations
     */
    this.third.animationMixers.add(cloneModel.anims.mixer);

    this.object.animations.forEach((animation) => {
      if (animation.name) {
        console.log("Adiionou Animação", animation.name);

        cloneModel.anims.add(animation.name, animation);
      }
    });

    // console.log(cloneModel.animation.get("idle"));

    console.log("Anims", cloneModel.anims);
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
