import Phaser from "phaser";
import { defineSystem, defineQuery } from "bitecs";
import { THREE } from "@enable3d/phaser-extension";

import { ComponentFactory } from "../components/ComponentFactory";

const NPC = ComponentFactory.getInstance().getProduct("NPC");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Position = ComponentFactory.getInstance().getProduct("Position");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Input = ComponentFactory.getInstance().getProduct("Input");
const Target = ComponentFactory.getInstance().getProduct("Target");

import { Action } from "../components/Input";

import { ModelFactory } from "../ModelFactory";

export default function createNPCSystem(scene: Phaser.Scene) {
  const npcQuery = defineQuery([NPC, Velocity, Rotation, Input]);

  return defineSystem((world) => {
    const entities = npcQuery(world);

    const dt = scene.game.loop.delta;
    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      NPC.accumulatedTime[id] += dt;

      if (Target.x[id]) {
        let playerPosition = new THREE.Vector2(Target.x[id], Target.z[id]);
        let npcPosition = new THREE.Vector2(Position.x[id], Position.z[id]);

        let playerDirectionVector: THREE.Vector2 =
          playerPosition.sub(npcPosition);
        const model = ModelFactory.getInstance().getModel(id);

        // model?.lookAt(playerPosition);s

        if (!model) {
          // log an error
          continue;
        }

        const rotation = model.getWorldDirection(
          new THREE.Vector3()?.setFromEuler?.(model.rotation)
        );
        const theta = Math.atan2(rotation.x, rotation.z);

        const npcForwardVector = new THREE.Vector3(
          Math.sin(theta),
          model.body.position.y,
          Math.cos(theta)
        );

        const npcForwardVectorProjection = new THREE.Vector2(
          npcForwardVector.x,
          npcForwardVector.z
        );

        let cross = npcForwardVectorProjection.cross(playerDirectionVector);

        if (cross < 0) {
          Input.intensity[id] = 0.3;
          Input.action[id][Action.Left] = true;
          Input.action[id][Action.Up] = true;
        } else {
          Input.intensity[id] = 0.3;
          Input.action[id][Action.Right] = true;
          Input.action[id][Action.Up] = true;
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
            Input.action[id][Action.Up] = false;
            Input.action[id][Action.Down] = false;
            Input.action[id][Action.Left] = true;
            Input.action[id][Action.Right] = false;
            Input.action[id][Action.None] = false;
            break;
          }

          // right
          case 1: {
            Input.action[id][Action.Up] = false;
            Input.action[id][Action.Down] = false;
            Input.action[id][Action.Left] = false;
            Input.action[id][Action.Right] = true;
            Input.action[id][Action.None] = false;
            break;
          }

          // up
          case 2: {
            Input.action[id][Action.Up] = true;
            Input.action[id][Action.Down] = false;
            Input.action[id][Action.Left] = false;
            Input.action[id][Action.Right] = false;
            Input.action[id][Action.None] = false;
            break;
          }

          // down
          case 3: {
            Input.action[id][Action.Up] = false;
            Input.action[id][Action.Down] = true;
            Input.action[id][Action.Left] = false;
            Input.action[id][Action.Right] = false;
            Input.action[id][Action.None] = false;
            break;
          }

          default: {
            Input.action[id][Action.Up] = false;
            Input.action[id][Action.Down] = false;
            Input.action[id][Action.Left] = false;
            Input.action[id][Action.Right] = false;
            Input.action[id][Action.None] = true;
            break;
          }
        }
      }
    }

    return world;
  });
}
