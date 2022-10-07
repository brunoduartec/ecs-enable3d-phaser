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

import { ComponentFactory } from "../components/ComponentFactory";

const Position = ComponentFactory.getInstance().getProduct("Position");
const Model = ComponentFactory.getInstance().getProduct("Model");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const AvoidDrop = ComponentFactory.getInstance().getProduct("AvoidDrop");

const Jump = ComponentFactory.getInstance().getProduct("Jump");
const View = ComponentFactory.getInstance().getProduct("View");
const Clicked = ComponentFactory.getInstance().getProduct("Clicked");


import { ModelTypes } from "../components/Model";
import { ModelFactory } from "../ModelFactory";

export default function createModelSystem(scene: Scene3D) {
  const modelQuery = defineQuery([Position, Rotation, Model]);

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

  function getAvoidDropInfo(world: IWorld, id: number) {
    let dropHeight: number = 0;
    let triggered: number = 0;
    let hasAvoidDrop = false;

    if (hasComponent(world, AvoidDrop, id)) {
      dropHeight = AvoidDrop.height[id];
      triggered = AvoidDrop.triggered[id];

      hasAvoidDrop = true;
    }
    return { hasAvoidDrop, dropHeight, triggered };
  }

  function getViewInfo(world: IWorld, id: number) {
    let viewLength = 0;
    let fov = 0;
    let hasView = false;

    if (hasComponent(world, View, id)) {
      viewLength = View.length[id];
      fov = View.fov[id];
      hasView = true;
    }
    return { hasView, viewLength, fov };
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

  function addSensor(
    scene,
    item,
    name: string,
    xPosition: number,
    yPosition: number,
    zPosition: number,
    collisionCallback,
    sensorObject: any = {
      mass: 1e-8,
      shape: "box",
      width: 0.2,
      height: 0.2,
      depth: 0.2,
    },
    shouldRotate = false
  ) {
    const sensor = new ExtendedObject3D();
    sensor.name = name;

    if (shouldRotate) sensor.rotation.set(-Math.PI / 2, 0, 0);
    sensor.position.set(xPosition, yPosition, zPosition);

    scene.third.physics.add.existing(sensor, sensorObject);
    sensor.body.setCollisionFlags(4);
    sensor.castShadow = sensor.receiveShadow = false;

    // connect sensor to robot
    scene.third.physics.add.constraints.lock(item.body, sensor.body);

    sensor.body.on.collision((otherObject, event) => {
      if (collisionCallback) {
        collisionCallback(otherObject, event);
      }
    });

    return sensor;
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

      physicBody.userData.eid = id;

      const { hasJump } = getJumpInfo(world, id);
      if (hasJump) {
        addSensor(
          scene,
          physicBody,
          `${physicBody.name}_sensor_jump`,
          Position.x[id],
          Position.y[id] - 0.5 * height,
          Position.z[id],
          (otherObject, event) => {
            if (event !== "end") {
              Jump.isGrounded[id] = 1;
              physicBody.userData.onGround = true;
            } else {
              physicBody.userData.onGround = false;
              Jump.isGrounded[id] = 0;
            }
          }
        );
      }

      const { hasAvoidDrop, dropHeight } = getAvoidDropInfo(world, id);
      if (hasAvoidDrop) {
        const dropSensorObject = {
          mass: 1e-8,
          shape: "box",
          width: 0.2,
          height: dropHeight,
          depth: 0.2,
        };
        addSensor(
          scene,
          physicBody,
          `${physicBody.name}_sensor_drop`,
          Position.x[id],
          Position.y[id] - dropHeight * 0.6,
          Position.z[id] + 0.8 * height,
          (otherObject, event) => {
            if (event !== "end") {
              AvoidDrop.triggered[id] = 0;
            } else {
              AvoidDrop.triggered[id] = 1;
            }
          },
          dropSensorObject
        );
      }

      const { hasView, viewLength, fov } = getViewInfo(world, id);
      if (hasView) {
        const viewSensorObject = {
          mass: 1e-8,
          shape: "cone",
          radius: fov,
          height: viewLength,
        };
        addSensor(
          scene,
          physicBody,
          `${physicBody.name}_sensor_view`,
          Position.x[id],
          Position.y[id],
          Position.z[id] + viewLength / 2,
          (otherObject, event) => {
            const initial = -1;
            if (otherObject?.userData) {
              const itemToAdd = otherObject.userData.eid;
              let alreadySeen = View.viewedList[id].includes(itemToAdd);

              if (event !== "end") {
                if (!alreadySeen) {
                  const index = View.viewedList[id].findIndex((m) => {
                    return m === initial;
                  });
                  if (index >= 0) {
                    View.viewedList[id][index] = itemToAdd;
                  }
                }
              } else {
                if (alreadySeen) {
                  const hasIndex = View.viewedList[id].findIndex((m) => {
                    return m === itemToAdd;
                  });

                  View.viewedList[id][hasIndex] = initial;
                }
              }
            }
          },
          viewSensorObject,
          true
        );
      }

      ModelFactory.getInstance().addModel(id, physicBody);
    }

    const entitiesExited = modelQueryExit(world);
    for (let i = 0; i < entitiesExited.length; ++i) {
      const id = entitiesExited[i];

      const objectToDestroy = ModelFactory.getInstance().getModel(id);

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
