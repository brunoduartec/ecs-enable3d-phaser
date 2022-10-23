import { Scene3D, THREE } from "@enable3d/phaser-extension";
import { defineSystem, defineQuery, enterQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";
import { Camera } from "../entities/Camera";

const ThirdPersonCamera =
  ComponentFactory.getInstance().getProduct("ThirdPersonCamera");

const Position = ComponentFactory.getInstance().getProduct("Position");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Player = ComponentFactory.getInstance().getProduct("Rotation");

function _CalculateIdealOffset(target) {
  const idealOffset = new THREE.Vector3(10, 10, -15);
  idealOffset.applyQuaternion(target.rotation);
  idealOffset.add(target.position);
  return idealOffset;
}

function _CalculateIdealLookat(target) {
  const idealLookat = new THREE.Vector3(0, 5, 20);
  idealLookat.applyQuaternion(target.rotation);
  idealLookat.add(target.position);
  return idealLookat;
}

export default function handleThirdPersonCamera(
  scene: Scene3D,
  deltaTime: number
) {
  const cameraQuery = defineQuery([ThirdPersonCamera]);

  const modelQueryEnter = enterQuery(cameraQuery);
  const playerQuery = defineQuery([Player, Position, Rotation]);

  return defineSystem((world) => {
    const newCameras = modelQueryEnter(world);
    const cameras = cameraQuery(world);
    const player = playerQuery(world);

    console.log("PP", player);

    const dt = scene.game.loop.delta;

    for (let index = 0; index < newCameras.length; index++) {
      const id = newCameras[index];
      const playerId = player[0];

      ThirdPersonCamera.target[id] = playerId;
    }

    for (let index = 0; index < cameras.length; index++) {
      const id = cameras[index];
      const targetId = ThirdPersonCamera.target[id];

      const posX = Position.x[targetId];
      const posY = Position.y[targetId];
      const posZ = Position.z[targetId];

      const rotationX = Rotation.x[targetId];
      const rotationY = Rotation.y[targetId];
      const rotationZ = Rotation.z[targetId];

      const target = {
        position: new THREE.Vector3(posX, posY, posZ),
        rotation: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(rotationX, rotationY, rotationZ)
        ),
      };

      const idealOffset = _CalculateIdealOffset(target);
      const idealLookat = _CalculateIdealLookat(target);

      // const t = 0.05;
      // const t = 4.0 * timeElapsed;
      const t = 1.0 - Math.pow(0.01, dt);

      let currentPosition = new THREE.Vector3(
        ThirdPersonCamera.posX[id],
        ThirdPersonCamera.posY[id],
        ThirdPersonCamera.posZ[id]
      );

      currentPosition.lerp(idealOffset, t);

      ThirdPersonCamera.posX[id] = currentPosition.x;
      ThirdPersonCamera.posY[id] = currentPosition.y;
      ThirdPersonCamera.posZ[id] = currentPosition.z;

      let currentLookat = new THREE.Vector3(
        ThirdPersonCamera.lookatX[id],
        ThirdPersonCamera.lookatY[id],
        ThirdPersonCamera.lookatZ[id]
      );

      currentLookat.lerp(idealLookat, t);

      ThirdPersonCamera.lookatX[id] = currentLookat.x;
      ThirdPersonCamera.lookatY[id] = currentLookat.y;
      ThirdPersonCamera.lookatZ[id] = currentLookat.z;

      scene.third.camera.position.set(
        currentPosition.x,
        currentPosition.y,
        currentPosition.z
      );
      scene.third.camera.lookAt(currentLookat);
    }

    return world;
  });
}
