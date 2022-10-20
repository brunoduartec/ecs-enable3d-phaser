import {
  Scene3D,
  THREE,
  ThirdPersonControls,
} from "@enable3d/phaser-extension";

import { createWorld } from "bitecs";

import type { IWorld } from "bitecs";

import { EntityFactory } from "../entities/Entityfactory";
import { SystemHandler } from "../systems/SystemsHandler";
import { Vector3 } from "three";
import { ModelFactory } from "../ModelFactory";
import Position from "../components/Position";
import { ModelTypeFactory } from "../models/ModelTypeFactory";
import { BasicModel } from "../models/BasicModel";
import { GLModel } from "../models/glModel";
import { BookModel } from "../models/BookModel";
import { PlayerModel } from "../models/PlayerModel";

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
  }

  async preload() {
    await this.third.load.preload(
      "toon_cat_free",
      "/assets/models/toon_cat_free.glb"
    ); // change 'plataform' for what you want

    // await this.third.load.preload("book", "/assets/models/book.glb");
    // await this.initModels();
  }

  async initModels() {
    const boxModel = new BasicModel(this.third, {
      modeltype: "box",
      config: {
        width: 1,
        height: 1,
      },
    });
    await boxModel.load();

    ModelTypeFactory.getInstance().addModel("box", boxModel);

    const sphereModel = new BasicModel(this.third, {
      modeltype: "sphere",
      config: {
        width: 1,
        height: 1,
      },
    });
    await sphereModel.load();

    ModelTypeFactory.getInstance().addModel("sphere", sphereModel);

    const sceneModel = new BookModel(this.third, {
      modelName: "/assets/models/book.glb",
      alias: "book",
    });
    await sceneModel.load();

    ModelTypeFactory.getInstance().addModel("book", sceneModel);

    const boxManModel = new PlayerModel(this.third, {
      modelName: "/assets/models/box_man.glb",
      alias: "man",
    });
    await boxManModel.load();

    ModelTypeFactory.getInstance().addModel("man", boxManModel);

    const playerModel = new PlayerModel(this.third, {
      modelName: "/assets/models/player.glb",
      alias: "player",
    });
    await playerModel.load();

    ModelTypeFactory.getInstance().addModel("player", playerModel);

    const dragonSceneModel = new GLModel(this.third, {
      modelName: "/assets/models/dragon_attack_aftermath.glb",
      alias: "dragon_attack_aftermath",
    });
    await dragonSceneModel.load();

    ModelTypeFactory.getInstance().addModel(
      "dragon_attack_aftermath",
      dragonSceneModel
    );

    const cat = new PlayerModel(this.third, {
      modelName: "toon_cat_free",
      alias: "toon_cat_free",
    });
    await cat.load();

    ModelTypeFactory.getInstance().addModel("toon_cat_free", cat);

    const wolf = new GLModel(this.third, {
      modelName: "/assets/models/Wolf-Blender-2.82a.glb",
      alias: "Wolf-Blender-2.82a",
    });
    await wolf.load();

    ModelTypeFactory.getInstance().addModel("wolf", wolf);
  }

  async createScene() {
    await ModelTypeFactory.getInstance().create("book");
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

  createCamera(thirdCameraPosition, position: THREE.Vector3 | undefined) {
    const cameraPosition = position || new THREE.Vector3();
    const lookAt =
      cameraPosition.add(new THREE.Vector3(10, 200, 0)) || new THREE.Vector3();
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

    this.third.camera.lookAt(lookAt);

    return followCam;
  }

  addPlayerCamera() {
    const model = ModelFactory.getInstance().getModel(this.playerId);
    this.camera = this.createCamera(
      this.third.camera.position,
      model?.position
    );

    this.camera.position.copy(this.third.camera.position);
    model?.add(this.camera);
  }

  initLight(lights) {
    const intensity = 5;
    if (lights) {
      lights.hemisphereLight.intensity = intensity;
      // lights?.hemisphereLight.intensity = intensity;
      lights.ambientLight.intensity = intensity;
      lights.directionalLight.intensity = intensity;
    }
  }

  async create() {
    const { width, height } = this.scale;

    // creates a nice scene
    // this.third.warpSpeed();
    const { lights } = await this.third.warpSpeed("-ground");
    // const { hemisphereLight, ambientLight, directionalLight } = lights;

    this.initLight(lights);
    // enable physics debugging
    // this.third.physics.debug?.enable();
    // this.third.physics.debug?.mode(1);

    let instance = this;

    await this.initModels();
    await this.createScene();

    this.world = createWorld();
    const playerId = instance.createPlayer();

    this.playerId = playerId;

    this.addPlayerCamera();

    // for (let i = 0; i < 5; ++i) {
    // instance.createNPC(10, 10);
    // }

    this.systemHandler = SystemHandler.getInstance(this);
  }

  update() {
    if (this?.systemHandler?.updateSystems)
      this.systemHandler.updateSystems(this.world);
    const model = ModelFactory.getInstance().getModel(this.playerId);
    if (this.camera && model) {
      const rotation = model.getWorldDirection(
        new THREE.Vector3()?.setFromEuler?.(model.rotation)
      );
      const theta = Math.atan2(rotation.x, rotation.z);

      const delta = 5;

      const dx = Math.sin(theta) * delta,
        dy = -delta * 0.5,
        dz = Math.cos(theta) * delta;

      const px = Position.x[this.playerId];
      const py = Position.y[this.playerId];
      const pz = Position.z[this.playerId];

      // console.log("Camera", { camera: this.camera, {px,py,pz} });
      this.third.camera.position.set(px - dx, py - dy, pz - dz);
      this.third.camera.lookAt(px, py, pz);
      // this.third.camera.lookAt(posToFollow.x, posToFollow.y + 3, posToFollow.z);
    }
  }
}
