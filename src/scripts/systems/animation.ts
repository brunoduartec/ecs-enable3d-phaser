import Phaser from "phaser";
import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Model = ComponentFactory.getInstance().getProduct("Model");
const Input = ComponentFactory.getInstance().getProduct("Input");
import { Action } from "../components/Input";
import { ModelFactory } from "../ModelFactory";

const animationByAction = {
  [Action.Up]: "Walk",
  [Action.Left]: "Walk",
  [Action.Right]: "Walk",
  [Action.None]: "Idle",
  [Action.Jump]: "Jump",
};

function applyAnimation(id: number, animationName: string) {
  const model = ModelFactory.getInstance().getModel(id);

  if (model?.anims.current !== animationName) {
    model?.anims.play(animationName);
  }
}

export default function handleAnimationSystem() {
  const entityQuery = defineQuery([Model, Input]);

  return defineSystem((world) => {
    const entities = entityQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      let anyAction = false;
      for (let index = 0; index < Input.action[id].length - 1; index++) {
        const action = Input.action[id][index];
        if (action) {
          anyAction = true;
          applyAnimation(id, animationByAction[index]);
        }
      }

      if (!anyAction) {
        applyAnimation(id, animationByAction[Action.None]);
      }
    }

    return world;
  });
}
