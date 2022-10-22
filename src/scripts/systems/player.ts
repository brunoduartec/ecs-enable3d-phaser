import Phaser from "phaser";
import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Player = ComponentFactory.getInstance().getProduct("Player");
const Input = ComponentFactory.getInstance().getProduct("Input");
import { Action } from "../components/Input";

interface keysProps {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  jump: Phaser.Input.Keyboard.Key;
}

export default function createPlayerSystem(keys: keysProps) {
  const playerQuery = defineQuery([Player, Input]);

  return defineSystem((world) => {
    const entities = playerQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      let anyButtonPressed =
        keys.up.isDown ||
        keys.down.isDown ||
        keys.left.isDown ||
        keys.right.isDown ||
        keys.jump.isDown;

      Input.action[id][Action.Up] = keys.up.isDown;
      Input.action[id][Action.Down] = keys.down.isDown;
      Input.action[id][Action.Left] = keys.left.isDown;
      Input.action[id][Action.Right] = keys.right.isDown;
      Input.action[id][Action.Jump] = keys.jump.isDown;

      Input.action[id][Action.None] = !anyButtonPressed;
    }

    return world;
  });
}
