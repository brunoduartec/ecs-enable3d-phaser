import Phaser from "phaser";
import { Scene3D } from "@enable3d/phaser-extension";

import { defineSystem, defineQuery, hasComponent, IWorld, Changed } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Player = ComponentFactory.getInstance().getProduct("Player");
const Position = ComponentFactory.getInstance().getProduct("Position");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const AvoidDrop = ComponentFactory.getInstance().getProduct("AvoidDrop");
const Model = ComponentFactory.getInstance().getProduct("Model");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Jump = ComponentFactory.getInstance().getProduct("Jump");
const Health = ComponentFactory.getInstance().getProduct("Health");
const Clicked = ComponentFactory.getInstance().getProduct("Clicked");

import { ModelFactory } from "../ModelFactory";
import { Vector3 } from "three";

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

  function tryApplyJump(world, id, model) {
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

  function updatePosition(id, position) {
    Position.x[id] = position.x
    Position.y[id] = position.y
    Position.z[id] = position.z
  }

  return defineSystem((world: IWorld) => {
    const entities = modelQuery(world);
    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      const model = ModelFactory.getInstance().getModel(id);
      if (!model) {
        // log an error
        continue;
      }

      updatePosition(id, model.position)

      const rotationX = Rotation.x[id];
      const speed = Velocity.speed[id];

      model.body.setAngularVelocityY(rotationX);
      const rotation = model.getWorldDirection(model.rotation.toVector3());
      const theta = Math.atan2(rotation.x, rotation.z);

      const x = Math.sin(theta) * speed,
        y = model.body.velocity.y,
        z = Math.cos(theta) * speed;

      if (AvoidDrop.triggered[id] === 0) {
        model.body.setVelocity(x, y, z);
      } else {
        model.body.setVelocity(0, 0, 0);
      }

      // Velocity.speed[id] = 0;
      // Rotation.x[id] = 0;

      tryApplyJump(world, id, model)
    }

    return world;
  });
}
