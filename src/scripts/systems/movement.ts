import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Position = ComponentFactory.getInstance().getProduct("Position");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Jump = ComponentFactory.getInstance().getProduct("Jump");
const Input = ComponentFactory.getInstance().getProduct("Input");

import { Action } from "../components/Input";

const effectByAction = {
  [Action.Up]: function ({ id, speed }) {
    Velocity.speed[id] = speed;
  },
  [Action.Down]: function ({ id, speed }) {
    Velocity.speed[id] = -speed;
  },
  [Action.Right]: function ({ id }) {
    Rotation.x[id] = -Rotation.speed[id] * Input.intensity[id];
  },
  [Action.Left]: function ({ id }) {
    Rotation.x[id] = Rotation.speed[id] * Input.intensity[id];
  },
  [Action.Jump]: function ({ id }) {
    Jump.isJumping[id] = 1;
  },
  [Action.None]: function ({ id }) {
    Rotation.x[id] = 0;
    Velocity.speed[id] = 0;
  },
};

const noEffectByAction = {
  [Action.Jump]: function ({ id }) {
    Jump.isJumping[id] = 0;
  },
};

export default function createMovementSystem() {
  const movementQuery = defineQuery([Position, Velocity, Input, Rotation]);

  return defineSystem((world) => {
    const entities = movementQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      const actions = Input.action[id];
      const speed = Input.speed[id];

      effectByAction[Action.None]({ id });

      for (let index = 0; index < actions.length - 1; index++) {
        const action = actions[index];

        if (action) {
          effectByAction[index]({ id, speed });
        } else {
          if (noEffectByAction[index]) noEffectByAction[index]({ id, speed });
        }
      }
    }

    return world;
  });
}
