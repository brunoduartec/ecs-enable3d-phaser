import { Scene3D, THREE } from "@enable3d/phaser-extension";
import { defineSystem, defineQuery, enterQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";
import { Camera } from "../entities/Camera";

const ThirdPersonCamera =
  ComponentFactory.getInstance().getProduct("ThirdPersonCamera");

const Position = ComponentFactory.getInstance().getProduct("Position");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Player = ComponentFactory.getInstance().getProduct("Rotation");

// export const third_person_camera = (() => {
//   class ThirdPersonCamera extends entity.Component {
//     constructor(params) {
//       super();

//       this._params = params;
//       this._camera = params.camera;

//       this._currentPosition = new THREE.Vector3();
//       this._currentLookat = new THREE.Vector3();
//     }

//     _CalculateIdealOffset() {
//       const idealOffset = new THREE.Vector3(-0, 10, -15);
//       idealOffset.applyQuaternion(this._params.target._rotation);
//       idealOffset.add(this._params.target._position);
//       return idealOffset;
//     }

//     _CalculateIdealLookat() {
//       const idealLookat = new THREE.Vector3(0, 5, 20);
//       idealLookat.applyQuaternion(this._params.target._rotation);
//       idealLookat.add(this._params.target._position);
//       return idealLookat;
//     }

//     Update(timeElapsed) {
//       const idealOffset = this._CalculateIdealOffset();
//       const idealLookat = this._CalculateIdealLookat();

//       // const t = 0.05;
//       // const t = 4.0 * timeElapsed;
//       const t = 1.0 - Math.pow(0.01, timeElapsed);

//       this._currentPosition.lerp(idealOffset, t);
//       this._currentLookat.lerp(idealLookat, t);

//       this._camera.position.copy(this._currentPosition);
//       this._camera.lookAt(this._currentLookat);
//     }
//   }

//   return {
//     ThirdPersonCamera: ThirdPersonCamera,
//   };
// })();

function _CalculateIdealOffset(target) {
  const idealOffset = new THREE.Vector3(-0, 5, -15);
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

let currentPosition = new THREE.Vector3();
let currentLookat = new THREE.Vector3();

export default function handleThirdPersonCamera(
  scene: Scene3D,
  deltaTime: number
) {
  const cameraQuery = defineQuery([ThirdPersonCamera]);

  const modelQueryEnter = enterQuery(cameraQuery);
  const playerQuery = defineQuery([Player]);

  return defineSystem((world) => {
    const newCameras = modelQueryEnter(world);
    const cameras = cameraQuery(world);
    const player = playerQuery(world);

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

      console.log(deltaTime);

      currentPosition.lerp(idealOffset, t);
      currentLookat.lerp(idealLookat, t);

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
