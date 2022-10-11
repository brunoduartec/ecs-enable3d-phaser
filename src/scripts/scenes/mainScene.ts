import { ExtendedObject3D, Scene3D, THREE } from "@enable3d/phaser-extension";

import { createWorld } from "bitecs";

import type { IWorld } from "bitecs";

import { EntityFactory } from "../entities/Entityfactory";
import { SystemHandler } from "../systems/SystemsHandler";
import { Object3D, Vector3 } from "three";
import { ModelFactory } from "../ModelFactory";

export default class MainScene extends Scene3D {
  private world!: IWorld;
  private systemHandler!: SystemHandler;
  private playerId: number;
  private camera: THREE.Object3D;

  constructor() {
    super({ key: "MainScene" });
  }

  init() {
    this.accessThirdDimension();
    // this.third.renderer.outputEncoding = THREE.LinearEncoding;
  }

  async createScene() {
    /**
     * Medieval Fantasy Book by Pixel (https://sketchfab.com/stefan.lengyel1)
     * https://sketchfab.com/3d-models/medieval-fantasy-book-06d5a80a04fc4c5ab552759e9a97d91a
     * Attribution 4.0 International (CC BY 4.0)
     */
    let object = await this.third.load.gltf("/assets/models/book.glb");

    const scene = object.scenes[0];

    const book = new ExtendedObject3D();
    book.name = "scene";
    book.add(scene);
    this.third.add.existing(book);

    // add animations
    // sadly only the flags animations works
    // object.animations.forEach((anim, i) => {
    //   book.mixer = this.third.animationMixers.create(book)
    //   // overwrite the action to be an array of actions
    //   book.action = []
    //   book.action[i] = book.mixer.clipAction(anim)
    //   book.action[i].play()
    // })

    book.traverse((child) => {
      if (child.isMesh) {
        console.log("Adicionou", child.name);
        child.castShadow = child.receiveShadow = false;
        // child.material.metalness = 0
        // child.material.roughness = 1

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
  }

  createPlayer() {
    return EntityFactory.getInstance().instantiateProduct("Player", this.world);
  }

  createNPC(width, height) {
    return EntityFactory.getInstance().instantiateProduct("NPC", this.world, {
      width,
      height,
    });
  }

  createCamera(thirdCameraPosition, position: Vector3 | undefined) {
    const cameraPosition = position || new Vector3();
    const deltaY = 2;
    // default camera
    this.third.camera.position.set(
      cameraPosition.x,
      cameraPosition.y + deltaY,
      cameraPosition.z
    );
    const followCam = new THREE.Object3D();
    // copies the position of the default camera
    followCam.position.copy(thirdCameraPosition);

    return followCam;
  }

  async create() {
    const { width, height } = this.scale;

    // creates a nice scene
    // this.third.warpSpeed();
    const { lights } = await this.third.warpSpeed("-ground");
    // const { hemisphereLight, ambientLight, directionalLight } = lights;
    const intensity = 10;
    if (lights) {
      lights.hemisphereLight.intensity = intensity;
      // lights?.hemisphereLight.intensity = intensity;
      lights.ambientLight.intensity = intensity;
      lights.directionalLight.intensity = intensity;
    }

    this.third.physics.debug?.enable();
    this.third.physics.debug?.mode(1);

    this.world = createWorld();

    // enable physics debugging
    let instance = this;

    await this.createScene();

    const playerId = instance.createPlayer();

    this.playerId = playerId;
    const model = ModelFactory.getInstance().getModel(playerId);
    this.camera = this.createCamera(
      this.third.camera.position,
      model?.position
    );

    model?.add(this.camera);
    // for (let i = 0; i < 5; ++i) {
    //   instance.createNPC(10, 10);
    // }

    this.systemHandler = SystemHandler.getInstance(this);
  }

  update() {
    if (this?.systemHandler?.updateSystems)
      this.systemHandler.updateSystems(this.world);

    console.log("Camera", this.camera);
    if (this.camera) {
      const model = ModelFactory.getInstance().getModel(this.playerId);
      const posToFollow = model?.position || new Vector3();

      console.log("Camera", this.camera);
      this.camera.position.set(posToFollow.x, posToFollow.y, posToFollow.z);
      // this.third.camera.lookAt(posToFollow.x, posToFollow.y + 3, posToFollow.z);
    }
  }
}
