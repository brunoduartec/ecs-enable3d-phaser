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
  private usePlayerCamera: boolean;

  constructor() {
    super({ key: "MainScene" });

    this.usePlayerCamera = false;
  }

  init() {
    this.accessThirdDimension();
  }

  async preload() {
    await this.third.load.preload("book", "/assets/models/book.glb"); // change 'plataform' for what you want

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

    // const sceneModel = new BookModel(this.third, {
    //   modelName: "/assets/models/book.glb",
    //   alias: "book",
    // });
    // await sceneModel.load();

    // ModelTypeFactory.getInstance().addModel("book", sceneModel);

    const boxManModel = new PlayerModel(this.third, {
      modelName: "/assets/models/Character.gltf",
      alias: "character",
    });
    await boxManModel.load();

    ModelTypeFactory.getInstance().addModel("character", boxManModel);

    const EnemyModel = new PlayerModel(this.third, {
      modelName: "/assets/models/Enemy.gltf",
      alias: "enemy",
    });
    await EnemyModel.load();

    ModelTypeFactory.getInstance().addModel("enemy", EnemyModel);
  }

  async createScene() {
    // await ModelTypeFactory.getInstance().create("book");
    // const plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(10, 20, 10, 10),

    // );

    // const geometry = new THREE.PlaneGeometry(5, 5, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1e601c,
    });

    const plane = this.third.add.plane(
      {
        width: 5000,
        height: 5000,
      },
      material
    );

    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;

    this.third.add.existing(plane);
    this.third.physics.add.existing(plane, { shape: "convexMesh", mass: 0 }); // see https://github.com/enable3d/enable3d/issues/75
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

  updatePlayerCamera() {
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

      this.third.camera.position.set(px - dx, py - dy, pz - dz);
      this.third.camera.lookAt(px, py, pz);
      // this.third.camera.lookAt(posToFollow.x, posToFollow.y + 3, posToFollow.z);
    }
  }

  _LoadSky() {
    const _VS = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

    const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;

    let hemisphereColor = new THREE.Color(0.6, 1, 0.6);

    this.third.lights.hemisphereLight({
      intensity: 0.2,
      skyColor: hemisphereColor,
    });

    const uniforms = {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    };
    uniforms["topColor"].value.copy(hemisphereColor);

    // this.third.fo

    // this._scene.fog.color.copy(uniforms["bottomColor"].value);

    const skyGeo = new THREE.BufferGeometry();
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: _VS,
      fragmentShader: _FS,
      side: THREE.BackSide,
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.third.add.mesh(sky);
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

    // this.third.haveSomeFun();
    const { lights } = await this.third.warpSpeed("-ground");
    // const { hemisphereLight, ambientLight, directionalLight } = lights;

    // this.initLight(lights);
    this._LoadSky();
    // enable physics debugging
    this.third.physics.debug?.enable();
    this.third.physics.debug?.mode(1);

    let instance = this;

    await this.initModels();
    await this.createScene();

    this.world = createWorld();
    const playerId = instance.createPlayer();

    this.playerId = playerId;

    if (this.usePlayerCamera) {
      this.addPlayerCamera();
    }

    for (let i = 0; i < 25; ++i) {
      instance.createNPC(10, 10);
    }

    this.systemHandler = SystemHandler.getInstance(this);
  }

  update() {
    if (this?.systemHandler?.updateSystems)
      this.systemHandler.updateSystems(this.world);

    if (this.usePlayerCamera) {
      this.updatePlayerCamera();
    }
  }
}
