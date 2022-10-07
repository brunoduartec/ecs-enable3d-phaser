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

export default function createNPCSystem(scene: Phaser.Scene) {
  const npcQuery = defineQuery([NPC, Velocity, Rotation, Input]);

  return defineSystem((world) => {
    const entities = npcQuery(world);

    const dt = scene.game.loop.delta;
    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      NPC.accumulatedTime[id] += dt;

      if (Target.x[id]) {
        let lookAtPosition = {
          x: Target.x[id],
          y: Target.y[id],
          z: Target.z[id],
        };

        let diff = lookAtPosition.x - Position.x[id];

        if (diff > 0) {
          Input.direction[id][Direction.Left] = true;
          Input.direction[id][Direction.Up] = true;

        } else {
          Input.direction[id][Direction.Right] = true;
          Input.direction[id][Direction.Up] = true;
        }
        // Rotation.x[id] += lookAtPosition.x - Position.x[id];
        // Velocity.speed[id] = 10;
      } else {
        if (NPC.accumulatedTime[id] < NPC.timeBetweenActions[id]) {
          continue;
        }

        NPC.accumulatedTime[id] = 0;

        switch (Phaser.Math.Between(0, 20)) {
          // left
          case 0: {
            Input.direction[id][Direction.Left] = 1;
            break;
          }

          // right
          case 1: {
            Input.direction[id][Direction.Right] = 1;
            break;
          }

          // up
          case 2: {
            Input.direction[id][Direction.Up] = 1;
            break;
          }

          // down
          case 3: {
            Input.direction[id][Direction.Down] = 1;
            break;
          }

          default: {
            Input.direction[id][Direction.Up] = false
            Input.direction[id][Direction.Down] = false
            Input.direction[id][Direction.Left] = false
            Input.direction[id][Direction.Right] = false
            Input.direction[id][Direction.None] = true
            break;
          }
        }
      }
    }

    return world;
  });
}
