import Phaser from "phaser";
import { Scene3D } from "@enable3d/phaser-extension";
import { ExtendedObject3D } from "@enable3d/common/dist/extendedObject3D";

import { defineSystem, defineQuery, enterQuery, exitQuery } from "bitecs";

import Position from "../components/Position";
import Velocity from "../components/Velocity";
import Model, { ModelTypes } from "../components/Model";
import Rotation from "../components/Rotation";

export default function createModelSystem(scene: Scene3D) {
  const modelsById = new Map<number, ExtendedObject3D>();

  const modelQuery = defineQuery([Position, Rotation, Velocity, Model]);

  const modelQueryEnter = enterQuery(modelQuery);
  const modelQueryExit = exitQuery(modelQuery);

  return defineSystem((world) => {
    const entitiesEntered = modelQueryEnter(world);
    for (let i = 0; i < entitiesEntered.length; ++i) {
      const id = entitiesEntered[i];
      const modelId = Model.modelType[id];
      const width = Model.width[id];
      const height = Model.height[id];
      const model = ModelTypes[modelId];

      modelsById.set(
        id,
        scene.third.physics.add[model]({
          width: width,
          height: height,
          x: Position.x[id],
          y: Position.y[id],
          z: Position.z[id],
        })
      );
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

      // model.body.setVelocity(velocityX, 0, velocityZ);
    }

    const entitiesExited = modelQueryExit(world);
    for (let i = 0; i < entitiesExited.length; ++i) {
      const id = entitiesEntered[i];
      modelsById.delete(id);
    }

    return world;
  });
}
