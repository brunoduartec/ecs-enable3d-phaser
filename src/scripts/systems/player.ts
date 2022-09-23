import Phaser from "phaser";
import { defineSystem, defineQuery } from "bitecs";

import Velocity from "../components/Velocity";
import Rotation from "../components/Rotation";
import Player from "../components/Player";
import Input, { Direction } from "../components/Input";

interface keysProps {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export default function createPlayerSystem(keys: keysProps) {
  const playerQuery = defineQuery([Player, Velocity, Rotation, Input]);

  return defineSystem((world) => {
    const entities = playerQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];
      if (keys.left.isDown) {
        Input.direction[id] = Direction.Left;
      } else if (keys.right.isDown) {
        Input.direction[id] = Direction.Right;
      } else if (keys.up.isDown) {
        Input.direction[id] = Direction.Up;
      } else if (keys.down.isDown) {
        Input.direction[id] = Direction.Down;
      } else {
        Input.direction[id] = Direction.None;
      }
    }

    return world;
  });
}
