import Phaser from "phaser";
import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const NPC = ComponentFactory.getInstance().getProduct("NPC");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Position = ComponentFactory.getInstance().getProduct("Position");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Input = ComponentFactory.getInstance().getProduct("Input");
const Target = ComponentFactory.getInstance().getProduct("Target");

import { Direction } from "../components/Input";
import { Vector2, Vector3 } from "three";
import { ModelFactory } from "../ModelFactory";
import { ExtendedObject3D } from "@enable3d/phaser-extension";

export default function createNPCSystem(scene: Phaser.Scene) {
  const npcQuery = defineQuery([NPC, Velocity, Rotation, Input]);

  return defineSystem((world) => {
    const entities = npcQuery(world);

    const dt = scene.game.loop.delta;
    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      NPC.accumulatedTime[id] += dt;

      if (Target.x[id]) {
        let playerPosition = new Vector2(Target.x[id], Target.z[id]);
        let npcPosition = new Vector2(Position.x[id], Position.z[id]);

        let playerDirectionVector: Vector2 = playerPosition.sub(npcPosition);
        const model = ModelFactory.getInstance().getModel(id);

        // model?.lookAt(playerPosition);s

        if (!model) {
          // log an error
          continue;
        }

        const rotation = model.getWorldDirection(model.rotation.toVector3());
        const theta = Math.atan2(rotation.x, rotation.z);

        const npcForwardVector = new Vector3(
          Math.sin(theta),
          model.body.position.y,
          Math.cos(theta)
        );

        const npcForwardVectorProjection = new Vector2(
          npcForwardVector.x,
          npcForwardVector.z
        );

        let cross = npcForwardVectorProjection.cross(playerDirectionVector);

        if (cross < 0) {
          Input.intensity[id] = 0.3;
          Input.direction[id][Direction.Left] = true;
          Input.direction[id][Direction.Up] = true;
        } else {
          Input.intensity[id] = 0.3;
          Input.direction[id][Direction.Right] = true;
          Input.direction[id][Direction.Up] = true;
        }
      } else {
        if (NPC.accumulatedTime[id] < NPC.timeBetweenActions[id]) {
          continue;
        }

        NPC.accumulatedTime[id] = 0;
        const randomMoviment = Phaser.Math.Between(0, 20);

        Input.intensity[id] = 1;

        switch (randomMoviment) {
          // left
          case 0: {
            // console.log("UpLeft")
            Input.direction[id][Direction.Up] = false;
            Input.direction[id][Direction.Down] = false;
            Input.direction[id][Direction.Left] = true;
            Input.direction[id][Direction.Right] = false;
            Input.direction[id][Direction.None] = false;
            break;
          }

          // right
          case 1: {
            // console.log("UpRight")
            Input.direction[id][Direction.Up] = false;
            Input.direction[id][Direction.Down] = false;
            Input.direction[id][Direction.Left] = false;
            Input.direction[id][Direction.Right] = true;
            Input.direction[id][Direction.None] = false;
            break;
          }

          // up
          case 2: {
            // console.log("Up")
            Input.direction[id][Direction.Up] = true;
            Input.direction[id][Direction.Down] = false;
            Input.direction[id][Direction.Left] = false;
            Input.direction[id][Direction.Right] = false;
            Input.direction[id][Direction.None] = false;
            break;
          }

          // down
          case 3: {
            // console.log("Down")
            Input.direction[id][Direction.Up] = false;
            Input.direction[id][Direction.Down] = true;
            Input.direction[id][Direction.Left] = false;
            Input.direction[id][Direction.Right] = false;
            Input.direction[id][Direction.None] = false;
            break;
          }

          default: {
            // console.log("None")
            Input.direction[id][Direction.Up] = false;
            Input.direction[id][Direction.Down] = false;
            Input.direction[id][Direction.Left] = false;
            Input.direction[id][Direction.Right] = false;
            Input.direction[id][Direction.None] = true;
            break;
          }
        }
      }
    }

    return world;
  });
}
