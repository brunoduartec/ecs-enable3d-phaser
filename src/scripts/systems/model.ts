import Phaser from "phaser";
import { Scene3D } from "@enable3d/phaser-extension";
import { ExtendedObject3D } from "@enable3d/common/dist/extendedObject3D";

import {
  defineSystem,
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent,
  IWorld,
} from "bitecs";

import Position from "../components/Position";
import Velocity from "../components/Velocity";
import Model, { ModelTypes } from "../components/Model";
import Rotation from "../components/Rotation";
import Jump from "../components/Jump";
import Health from "../components/Health";
import Clicked from "../components/Clicked";
import THREE from "three";

export default function createModelSystem(scene: Scene3D) {
  const modelsById = new Map<number, ExtendedObject3D>();

  const modelQuery = defineQuery([Position, Rotation, Velocity, Health, Model]);

  const modelQueryEnter = enterQuery(modelQuery);
  const modelQueryExit = exitQuery(modelQuery);

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

  function getClickedInfo(world: IWorld, id: number) {
    let check: boolean = false;

    if (hasComponent(world, Clicked, id)) {
      if (Clicked.check[id] === 1) {
        check = true;
      }
    }
    return { check };
  }

  function addJumpSensor(
    scene,
    item,
    id,
    xPosition: number,
    yPosition: number,
    zPosition: number,
    height: number
  ) {
    const jumpSensor = new ExtendedObject3D();

    jumpSensor.position.set(xPosition, yPosition - 0.5 * height, zPosition);
    scene.third.physics.add.existing(jumpSensor, {
      mass: 1e-8,
      shape: "box",
      width: 0.2,
      height: 0.2,
      depth: 0.2,
    });
    jumpSensor.body.setCollisionFlags(4);

    // connect jumpSensor to robot
    scene.third.physics.add.constraints.lock(item.body, jumpSensor.body);

    jumpSensor.body.on.collision((otherObject, event) => {
      if (event !== "end") {
        Jump.isGrounded[id] = 1;
        item.userData.onGround = true;
      } else {
        item.userData.onGround = false;
        Jump.isGrounded[id] = 0;
      }
    });
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

  function getPointer(scene) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const pointer = scene.input.activePointer;
    const x = (pointer.x / scene.cameras.main.width) * 2 - 1;
    const y = -(pointer.y / scene.cameras.main.height) * 2 + 1;
    return { x, y };
  }

  return defineSystem((world: IWorld) => {
    const entitiesEntered = modelQueryEnter(world);

    for (let i = 0; i < entitiesEntered.length; ++i) {
      const id = entitiesEntered[i];
      const modelId = Model.modelType[id];
      const width = Model.width[id];
      const height = Model.height[id];
      const model = ModelTypes[modelId];

      const physicBody = scene.third.physics.add[model]({
        width: width,
        height: height,
        x: Position.x[id],
        y: Position.y[id],
        z: Position.z[id],
      });

      physicBody.body.setLinearFactor(1, 1, 0);
      physicBody.body.setAngularFactor(0, 0, 0);
      // physicBody.body.setFriction(0);

      const { hasJump } = getJumpInfo(world, id);
      if (hasJump) {
        addJumpSensor(
          scene,
          physicBody,
          id,
          Position.x[id],
          Position.y[id],
          Position.z[id],
          height
        );
      }

      modelsById.set(id, physicBody);
    }

    const entities = modelQuery(world);
    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      const model = modelsById.get(id);
      if (!model) {
        // log an error
        continue;
      }

      const velocityX = Velocity.x[id];
      const velocityY = Velocity.y[id];
      const velocityZ = Velocity.z[id];

      model.body.setVelocityX(velocityX);
      model.body.setVelocityZ(velocityZ);

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

      // model.body.setVelocity(velocityX, 0, velocityZ);
    }

    const entitiesExited = modelQueryExit(world);
    for (let i = 0; i < entitiesExited.length; ++i) {
      console.log("Removeu", i);
      const id = entitiesExited[i];

      const objectToDestroy = modelsById.get(id);

      if (!objectToDestroy) {
        // log an error
        continue;
      }

      objectToDestroy.userData.dead = true;
      objectToDestroy.visible = false;
      scene.third.physics.destroy(objectToDestroy);
    }

    return world;
  });
}
