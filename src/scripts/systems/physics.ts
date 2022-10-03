import Phaser from "phaser";
import { Scene3D } from "@enable3d/phaser-extension";

import { defineSystem, defineQuery, hasComponent, IWorld } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Position = ComponentFactory.getInstance().getProduct("Position");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Model = ComponentFactory.getInstance().getProduct("Model");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Jump = ComponentFactory.getInstance().getProduct("Jump");
const Health = ComponentFactory.getInstance().getProduct("Health");
const Clicked = ComponentFactory.getInstance().getProduct("Clicked");

import AvoidDrop from "../components/AvoidDrop";
import Player from "../components/Player";
import { ModelFactory } from "../ModelFactory";

export default function handlePhysicsSystem(scene: Scene3D) {
  const modelQuery = defineQuery([Position, Rotation, Velocity, Health, Model]);

  function getJumpInfo(world: IWorld, id: number) {
    let jumpStrength: number = 0;
    let isJumping: number = 0;
    let isGrounded: number = 0;
    let hasJump: boolean = false;

    if (hasComponent(world, Jump, id)) {
      jumpStrength = Jump.strength[id];
      isJumping = Jump.isJumping[id];
      isGrounded = Jump.isGrounded[id];
      hasJump = true;
    } else {
      hasJump = false;
    }
    return { jumpStrength, isJumping, isGrounded, hasJump };
  }

  function getAvoidDropInfo(world: IWorld, id: number) {
    let dropHeight: number = 0;
    let triggered: number = 0;
    let hasAvoidDrop = false;

    if (hasComponent(world, Jump, id)) {
      dropHeight = AvoidDrop.height[id];
      triggered = AvoidDrop.triggered[id];

      hasAvoidDrop = true;
    }
    return { hasAvoidDrop, dropHeight, triggered };
  }

  function getClickedInfo(world: IWorld, id: number) {
    let check: boolean = false;

    if (hasComponent(world, Clicked, id)) {
      if (Clicked.check[id] === 1) {
        check = true;
      }
    }
    return { check };
  }

  // function registerRaycast(scene) {
  //   const raycaster = new THREE.Raycaster();

  //   scene.input.on("pointerdown", () => {
  //     const { x, y } = scene.getPointer();

  //     raycaster.setFromCamera({ x, y }, scene.third.camera);

  //     const intersection = raycaster.intersectObjects(blocks);

  //     if (intersection.length > 0) {
  //       const block = intersection[0].object;
  //       scene.selected = block;
  //       scene.selected?.body.setCollisionFlags(2);

  //       scene.mousePosition.copy(intersection[0].point);
  //       scene.blockOffset.subVectors(
  //         scene.selected.position,
  //         scene.mousePosition
  //       );
  //     }

  //     scene.prev = { x, y };
  //   });

  //   scene.input.on("pointerup", () => {
  //     scene.selected?.body.setCollisionFlags(0);
  //     scene.selected = null;
  //   });
  // }

  // function getPointer(scene) {
  //   // calculate mouse position in normalized device coordinates
  //   // (-1 to +1) for both components
  //   const pointer = scene.input.activePointer;
  //   const x = (pointer.x / scene.cameras.main.width) * 2 - 1;
  //   const y = -(pointer.y / scene.cameras.main.height) * 2 + 1;
  //   return { x, y };
  // }

  return defineSystem((world: IWorld) => {
    const entities = modelQuery(world);
    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      const model = ModelFactory.getInstance().getModel(id);
      if (!model) {
        // log an error
        continue;
      }

      const rotationX = Rotation.x[id];
      const speed = Velocity.speed[id];

      const rotation = model.getWorldDirection(model.rotation.toVector3());
      model.body.setAngularVelocityY(rotationX);

      const theta = Math.atan2(rotation.x, rotation.z);

      const x = Math.sin(theta) * speed,
        y = model.body.velocity.y,
        z = Math.cos(theta) * speed;

      if (AvoidDrop.triggered[id] === 0) {
        model.body.setVelocity(x, y, z);
      } else {
        model.body.setVelocity(0, 0, 0);
      }

      Velocity.speed[id] = 0;

      const { jumpStrength, isJumping, isGrounded, hasJump } = getJumpInfo(
        world,
        id
      );
      if (hasJump && isGrounded) {
        if (isJumping) {
          model.body.applyForceY(jumpStrength);
          Jump.isJumping[id] = 0;
        }
      }
    }

    return world;
  });
}
