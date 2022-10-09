import { ExtendedObject3D, Scene3D } from "@enable3d/phaser-extension";

import { createWorld } from "bitecs";

import type { IWorld, System } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

import { EntityFactory } from "../entities/Entityfactory";
import { SystemHandler } from "../systems/SystemsHandler";



export default class MainScene extends Scene3D {
  private world!: IWorld;
  private systemHandler!: SystemHandler;

  constructor() {
    super({ key: "MainScene" });
  }

  init() {
    this.accessThirdDimension();
  }


  createScene(callback) {
    /**
             * Medieval Fantasy Book by Pixel (https://sketchfab.com/stefan.lengyel1)
             * https://sketchfab.com/3d-models/medieval-fantasy-book-06d5a80a04fc4c5ab552759e9a97d91a
             * Attribution 4.0 International (CC BY 4.0)
             */
    this.third.load.gltf('/assets/models/book.glb').then(object => {
      const scene = object.scenes[0]

      const book = new ExtendedObject3D()
      book.name = 'scene'
      book.add(scene)
      this.third.add.existing(book)

      // add animations
      // sadly only the flags animations works
      // object.animations.forEach((anim, i) => {
      //   book.mixer = this.third.animationMixers.create(book)
      //   // overwrite the action to be an array of actions
      //   book.action = []
      //   book.action[i] = book.mixer.clipAction(anim)
      //   book.action[i].play()
      // })

      book.traverse(child => {
        if (child.isMesh) {
          child.castShadow = child.receiveShadow = false
          // child.material.metalness = 0
          // child.material.roughness = 1

          if (/mesh/i.test(child.name)) {
            this.third.physics.add.existing(child, {
              shape: 'concave',
              mass: 0,
              collisionFlags: 1,
              autoCenter: false
            })
            child.body.setAngularFactor(0, 0, 0)
            child.body.setLinearFactor(0, 0, 0)
          }
        }
      })

      if (callback) {
        callback()
      }
    })
  }

  createPlayer() {
    EntityFactory.getInstance().instantiateProduct("Player", this.world);
  }

  createNPC(width, height) {
    EntityFactory.getInstance().instantiateProduct("NPC", this.world, {
      width,
      height,
    });
  }

  create() {
    const { width, height } = this.scale;

    // creates a nice scene
    this.third.warpSpeed();


    this.third.physics.debug?.enable();
    this.third.physics.debug?.mode(1);

    this.world = createWorld();

    // enable physics debugging
    let instance = this
    this.createScene(function () {
      instance.createPlayer();
      // for (let i = 0; i < 5; ++i) {
      instance.createNPC(10, 10);
      // }

    })


    this.systemHandler = SystemHandler.getInstance(this);

  }

  update() {
    this.systemHandler.updateSystems(this.world);
  }
}
