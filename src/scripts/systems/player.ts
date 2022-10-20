import Phaser from "phaser";
import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Player = ComponentFactory.getInstance().getProduct("Player");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Input = ComponentFactory.getInstance().getProduct("Input");
const Jump = ComponentFactory.getInstance().getProduct("Jump");
const Model = ComponentFactory.getInstance().getProduct("Model");
import { Action } from "../components/Input";
import { ModelFactory } from "../ModelFactory";

interface keysProps {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  jump: Phaser.Input.Keyboard.Key;
}

const animationByAction = {
  [Action.Up]: "run",
  [Action.Left]: "rotate_left",
  [Action.Right]: "rotate_right",

  [Action.None]: "idle",
  [Action.Jump]: "jump",
};

function applyAnimation(id: number, animationName: string) {
  const model = ModelFactory.getInstance().getModel(id);

  if (model?.anims.current !== animationName) model?.anims.play(animationName);
}

export default function createPlayerSystem(keys: keysProps) {
  const playerQuery = defineQuery([Player, Velocity, Rotation, Input, Jump]);

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

      for (let index = 0; index < Input.action[id].length - 1; index++) {
        const action = Input.action[id][index];
        if (action) {
          applyAnimation(id, animationByAction[index]);
        }
      }

      // if (Input.action[id][Action.Up]) {
      //   console.log("Animation");
      //   applyAnimation(id, "run");
      // } else {
      //   applyAnimation(id, "idle");
      // }

      // if (keys.jump.isDown) {
      //   Jump.isJumping[id] = 1;
      // } else {
      //   Jump.isJumping[id] = 0;
      // }
    }

    return world;
  });
}
