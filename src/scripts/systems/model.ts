import { Scene3D, THREE } from "@enable3d/phaser-extension";

import { ExtendedObject3D } from "@enable3d/common/dist/extendedObject3D";

import {
  defineSystem,
  defineQuery,
  enterQuery,
  exitQuery,
  hasComponent,
  IWorld,
  addComponent,
} from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Position = ComponentFactory.getInstance().getProduct("Position");
const Model = ComponentFactory.getInstance().getProduct("Model");
const ShouldAddSensor =
  ComponentFactory.getInstance().getProduct("ShouldAddSensor");

import { ModelFactory } from "../ModelFactory";
import { ModelTypeFactory } from "../models/ModelTypeFactory";
import Jump from "../components/Jump";
import { SensorType } from "../components/ShouldAddSensor";

export default function createModelSystem(scene: Scene3D) {
  const modelQuery = defineQuery([Position, Model]);

  const modelQueryEnter = enterQuery(modelQuery);
  const modelQueryExit = exitQuery(modelQuery);

  return defineSystem((world: IWorld) => {
    const entitiesEntered = modelQueryEnter(world);

    for (let i = 0; i < entitiesEntered.length; ++i) {
      const id = entitiesEntered[i];
      const modelId = Model.modelType[id];
      const width = Model.width[id];
      const height = Model.height[id];

      let physicBody: ExtendedObject3D | undefined;

      //TODO Use PromiseAll instead of await
      (async () => {
        try {
          const positionVector = new THREE.Vector3(
            Position.x[id],
            Position.y[id],
            Position.z[id]
          );

          console.log("MODELID", modelId);
          physicBody = await ModelTypeFactory.getInstance().createById(
            modelId,
            positionVector
          );

          if (physicBody) {
            physicBody.body.setLinearFactor(1, 1, 0);
            physicBody.body.setAngularFactor(0, 0, 0);

            physicBody.userData.eid = id;

            ModelFactory.getInstance().addModel(id, physicBody);

            if (hasComponent(world, Jump, id)) {
              const ShouldAddSensor =
                ComponentFactory.getInstance().getProduct("ShouldAddSensor");
              ShouldAddSensor.sensorType[id] = SensorType.Jump;
              addComponent(world, ShouldAddSensor, id);
            }
          }
        } catch (e) {
          // Deal with the fact the chain failed
        }
      })();
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
