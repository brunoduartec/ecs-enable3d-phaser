import Phaser from "phaser";
import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Player = ComponentFactory.getInstance().getProduct("Player");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Input = ComponentFactory.getInstance().getProduct("Input");
const Jump = ComponentFactory.getInstance().getProduct("Jump");
import { Direction } from "../components/Input";

interface keysProps {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  jump: Phaser.Input.Keyboard.Key;
}

export default function createPlayerSystem(keys: keysProps) {
  const playerQuery = defineQuery([Player, Velocity, Rotation, Input, Jump]);

  return defineSystem((world) => {
    const entities = playerQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      Input.direction[id][Direction.Up] = keys.up.isDown;
      Input.direction[id][Direction.Down] = keys.down.isDown;
      Input.direction[id][Direction.Left] = keys.left.isDown;
      Input.direction[id][Direction.Right] = keys.right.isDown;


      // if (keys.up.isDown) {
      //   Input.direction[id] = Direction.Up;
      //   if (keys.left.isDown) {
      //     Input.direction[id] = Direction.UpLeft;
      //   }
      //   if (keys.right.isDown) {
      //     Input.direction[id] = Direction.UpRight;
      //   }
      // }

      // if (keys.down.isDown) {
      //   Input.direction[id] = Direction.Down;
      //   if (keys.left.isDown) {
      //     Input.direction[id] = Direction.DownLeft;
      //   }
      //   if (keys.right.isDown) {
      //     Input.direction[id] = Direction.DownRight;
      //   }
      // }

      // if (keys.left.isDown) {
      //   Input.direction[id] = Direction.Left;
      // }
      // if (keys.right.isDown) {
      //   Input.direction[id] = Direction.Right;
      // }


      if (keys.jump.isDown) {
        Jump.isJumping[id] = 1;
      } else {
        Jump.isJumping[id] = 0;
      }
    }

    return world;
  });
}
