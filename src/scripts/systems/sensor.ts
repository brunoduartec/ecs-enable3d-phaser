import { Scene3D, THREE } from "@enable3d/phaser-extension";

import { ExtendedObject3D } from "@enable3d/common/dist/extendedObject3D";

import { defineSystem, defineQuery, enterQuery, IWorld } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Model = ComponentFactory.getInstance().getProduct("Model");
const AvoidDrop = ComponentFactory.getInstance().getProduct("AvoidDrop");
const ShouldAddSensor =
  ComponentFactory.getInstance().getProduct("ShouldAddSensor");
const Position = ComponentFactory.getInstance().getProduct("Position");

const Jump = ComponentFactory.getInstance().getProduct("Jump");

import { ModelFactory } from "../ModelFactory";

export default function createSensorSystem(scene: Scene3D) {
  const jumpQuery = defineQuery([Model, Jump, ShouldAddSensor]);
  const dropQuery = defineQuery([Model, AvoidDrop, ShouldAddSensor]);

  const jumpSensorQueryEnter = enterQuery(jumpQuery);
  // const avoidDropSensorQueryEnter = enterQuery(dropQuery);

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

    // connect sensor to entity
    scene.third.physics.add.constraints.lock(item.body, sensor.body);

    sensor.body.on.collision((otherObject, event) => {
      if (collisionCallback) {
        collisionCallback(otherObject, event);
      }
    });

    return sensor;
  }

  return defineSystem((world: IWorld) => {
    const jumpEntered = jumpSensorQueryEnter(world);
    // const dropEntered = avoidDropSensorQueryEnter(world);

    for (let index = 0; index < jumpEntered.length; index++) {
      console.log("Entrou");

      const id = jumpEntered[index];
      const width = Model.width[id];
      const height = Model.height[id];

      (async () => {
        const physicBody = await ModelFactory.getInstance().getModel(id);

        let xPos = Position.x[id];
        let yPos = Position.y[id];
        let zPos = Position.z[id];

        if (physicBody) {
          const jumpSensorObject = {
            mass: 1e-8,
            shape: "box",
            width: width,
            height: 0.3,
            depth: width,
          };
          addSensor(
            scene,
            physicBody,
            `sensor-${physicBody.uuid}_jump`,
            xPos,
            yPos,
            zPos,
            (otherObject, event) => {
              if (physicBody) {
                if (/sensor/.test(otherObject.name)) {
                }
                if (event !== "end") {
                  Jump.isGrounded[id] = 1;
                } else {
                  Jump.isGrounded[id] = 0;
                }
              }
            },
            jumpSensorObject
          );
        }
      })();
    }

    // for (let index = 0; index < dropEntered.length; index++) {
    //   const id = dropEntered[index];
    //   const modelId = Model.modelType[id];
    //   const width = Model.width[id];
    //   const height = Model.height[id];
    // }

    // for (let i = 0; i < entitiesEntered.length; ++i) {
    //   const id = entitiesEntered[i];
    //   const modelId = Model.modelType[id];
    //   const width = Model.width[id];
    //   const height = Model.height[id];

    //   let physicBody: ExtendedObject3D | undefined;

    //   //TODO Use PromiseAll instead of await
    //   (async () => {
    //     try {
    //       const positionVector = new THREE.Vector3(
    //         Position.x[id],
    //         Position.y[id],
    //         Position.z[id]
    //       );

    //       physicBody = await ModelTypeFactory.getInstance().createById(
    //         modelId,
    //         positionVector
    //       );

    //       if (physicBody) {
    //         physicBody.body.setLinearFactor(1, 1, 0);
    //         physicBody.body.setAngularFactor(0, 0, 0);

    //         physicBody.userData.eid = id;

    //         const { hasJump } = getJumpInfo(world, id);
    //         if (hasJump) {
    //           const jumpSensorObject = {
    //             mass: 1e-8,
    //             shape: "box",
    //             width: Model.width[id],
    //             height: 0.3,
    //             depth: Model.width[id],
    //           };
    //           addSensor(
    //             scene,
    //             physicBody,
    //             `sensor-${physicBody.name}_jump`,
    //             0,
    //             0,
    //             0,
    //             (otherObject, event) => {
    //               if (physicBody) {
    //                 if (/sensor/.test(otherObject.name)) {
    //                 }
    //                 if (event !== "end") {
    //                   Jump.isGrounded[id] = 1;
    //                 } else {
    //                   Jump.isGrounded[id] = 0;
    //                 }
    //               }
    //             },
    //             jumpSensorObject
    //           );
    //         }

    //         const { hasAvoidDrop, dropHeight } = getAvoidDropInfo(world, id);
    //         if (hasAvoidDrop) {
    //           const dropSensorObject = {
    //             mass: 1e-8,
    //             shape: "box",
    //             width: 0.2,
    //             height: dropHeight,
    //             depth: 0.2,
    //           };
    //           addSensor(
    //             scene,
    //             physicBody,
    //             `sensor-${physicBody.name}_drop`,
    //             0,
    //             -dropHeight * 0.5,
    //             0.8 * height,
    //             (otherObject, event) => {
    //               if (event !== "end") {
    //                 AvoidDrop.triggered[id] = 0;
    //               } else {
    //                 AvoidDrop.triggered[id] = 1;
    //               }
    //             },
    //             dropSensorObject
    //           );
    //         }

    //         const { hasView, viewLength, fov } = getViewInfo(world, id);
    //         if (hasView) {
    //           const viewSensorObject = {
    //             mass: 1e-8,
    //             shape: "cone",
    //             radius: fov,
    //             height: viewLength,
    //           };
    //           addSensor(
    //             scene,
    //             physicBody,
    //             `${physicBody.name}_sensor_view`,
    //             0,
    //             0,
    //             viewLength / 2,
    //             (otherObject, event) => {
    //               const initial = -1;
    //               if (otherObject?.userData) {
    //                 const itemToAdd = otherObject.userData.eid;
    //                 let alreadySeen = View.viewedList[id].includes(itemToAdd);

    //                 if (event !== "end") {
    //                   if (!alreadySeen) {
    //                     const index = View.viewedList[id].findIndex((m) => {
    //                       return m === initial;
    //                     });
    //                     if (index >= 0) {
    //                       View.viewedList[id][index] = itemToAdd;
    //                     }
    //                   }
    //                 } else {
    //                   if (alreadySeen) {
    //                     const hasIndex = View.viewedList[id].findIndex((m) => {
    //                       return m === itemToAdd;
    //                     });

    //                     View.viewedList[id][hasIndex] = initial;
    //                   }
    //                 }
    //               }
    //             },
    //             viewSensorObject,
    //             true
    //           );
    //         }
    //         ModelFactory.getInstance().addModel(id, physicBody);
    //       }
    //     } catch (e) {
    //       // Deal with the fact the chain failed
    //     }
    //   })();
    // }

    // const entitiesExited = modelQueryExit(world);
    // for (let i = 0; i < entitiesExited.length; ++i) {
    //   const id = entitiesExited[i];

    //   const objectToDestroy = ModelFactory.getInstance().getModel(id);

    //   if (!objectToDestroy) {
    //     // log an error
    //     continue;
    //   }

    //   objectToDestroy.userData.dead = true;
    //   objectToDestroy.visible = false;
    //   scene.third.physics.destroy(objectToDestroy);
    // }

    return world;
  });
}
