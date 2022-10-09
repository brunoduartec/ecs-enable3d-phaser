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
import { Vector3 } from "three";
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

      if (NPC.accumulatedTime[id] < NPC.timeBetweenActions[id]) {
        continue;
      }

      NPC.accumulatedTime[id] = 0;

      if (Target.x[id]) {
        let playerPosition = new Vector3(Target.x[id], Target.y[id], Target.z[id]);
        let npcPosition = new Vector3(Position.x[id], Position.y[id], Position.z[id])


        console.log(playerPosition, npcPosition)

        // let playerDirectionVector = playerPosition.sub(npcPosition);
        // const model = ModelFactory.getInstance().getModel(id);

        // if (!model) {
        //   // log an error
        //   continue;
        // }

        // const rotation = model.getWorldDirection(model.rotation.toVector3());
        // const theta = Math.atan2(rotation.x, rotation.z);

        // const npcForwardVector = new Vector3(Math.sin(theta), model.body.velocity.y, Math.cos(theta))

        // const crossProductModule = npcForwardVector.cross(playerDirectionVector).lengthSq()
        // const dotProduct = npcForwardVector.dot(playerDirectionVector)
        // const diffAngle = Math.atan2(crossProductModule, dotProduct)

        // console.log("Angle", diffAngle)

        const diff = playerPosition.x - npcPosition.x

        console.log(diff)

        if (diff > 0) {
          // Input.direction[id][Direction.Left] = true;
          Rotation.x[id] = 3
          Input.direction[id][Direction.Up] = true;

        } else {
          Rotation.x[id] = -3
          // Input.direction[id][Direction.Right] = true;
          Input.direction[id][Direction.Up] = true;
        }
      } else {
        const randomMoviment = Phaser.Math.Between(0, 20)

        switch (randomMoviment) {
          // left
          case 0: {
            // console.log("UpLeft")
            Input.direction[id][Direction.Up] = false;
            Input.direction[id][Direction.Down] = false;
            Input.direction[id][Direction.Left] = true;
            Input.direction[id][Direction.Right] = false;
            Input.direction[id][Direction.None] = false
            break;
          }

          // right
          case 1: {
            // console.log("UpRight")
            Input.direction[id][Direction.Up] = false;
            Input.direction[id][Direction.Down] = false;
            Input.direction[id][Direction.Left] = false;
            Input.direction[id][Direction.Right] = true;
            Input.direction[id][Direction.None] = false
            break;
          }

          // up
          case 2: {
            // console.log("Up")
            Input.direction[id][Direction.Up] = true;
            Input.direction[id][Direction.Down] = false;
            Input.direction[id][Direction.Left] = false;
            Input.direction[id][Direction.Right] = false;
            Input.direction[id][Direction.None] = false
            break;
          }

          // down
          case 3: {
            // console.log("Down")
            Input.direction[id][Direction.Up] = false;
            Input.direction[id][Direction.Down] = true;
            Input.direction[id][Direction.Left] = false;
            Input.direction[id][Direction.Right] = false;
            Input.direction[id][Direction.None] = false
            break;
          }

          default: {
            // console.log("None")
            Input.direction[id][Direction.Up] = false;
            Input.direction[id][Direction.Down] = false;
            Input.direction[id][Direction.Left] = false;
            Input.direction[id][Direction.Right] = false;
            Input.direction[id][Direction.None] = true
            break;
          }
        }


      }



    }

    return world;
  });
}
