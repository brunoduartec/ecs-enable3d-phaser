import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Position = ComponentFactory.getInstance().getProduct("Position");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Input = ComponentFactory.getInstance().getProduct("Input");

import { Direction } from "../components/Input";

const effectByDirection = {
  [Direction.Up]: function ({ id, speed }) {
    Velocity.speed[id] = speed;
    console.log("Up", { id, speed })
  },
  [Direction.Down]: function ({ id, speed }) {
    console.log("Down", { id, speed })
    Velocity.speed[id] = -speed;
  },
  [Direction.Right]: function ({ id }) {
    console.log("Right", { id })
    Rotation.x[id] -= Rotation.speed[id];
  },
  [Direction.Left]: function ({ id }) {
    console.log("Left", { id })
    Rotation.x[id] += Rotation.speed[id];
  }
}
export default function createMovementSystem() {
  const movementQuery = defineQuery([Position, Velocity, Input, Rotation]);

  return defineSystem((world) => {
    const entities = movementQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      const directions = Input.direction[id];
      const speed = Input.speed[id];


      for (let index = 0; index < directions.length; index++) {
        const direction = directions[index];

        // console.log("Effect", id, index, direction)
        if (direction) {
          console.log("Effect", index)
          effectByDirection[index]({ id, speed })
        }

      }

      // switch (direction) {
      //   case Direction.None:
      //     break;

      //   case Direction.Left:
      //     effectByDirection["Left"]({ id })
      //     break;

      //   case Direction.Right:
      //     effectByDirection["Right"]({ id })
      //     break;

      //   case Direction.Up:
      //     effectByDirection["Up"]({ id, speed })
      //     break;

      //   case Direction.Down:
      //     effectByDirection["Down"]({ id, speed })
      //     break;

      //   case Direction.UpRight:
      //     effectByDirection["Up"]({ id, speed })
      //     effectByDirection["Right"]({ id })
      //     break;
      //   case Direction.UpLeft:
      //     effectByDirection["Up"]({ id, speed })
      //     effectByDirection["Left"]({ id })
      //     break;
      //   case Direction.DownRight:
      //     effectByDirection["Down"]({ id, speed })
      //     effectByDirection["Right"]({ id })
      //     break;
      //   case Direction.DownLeft:
      //     effectByDirection["Down"]({ id, speed })
      //     effectByDirection["Left"]({ id })
      //     break;
      // }

      //   Position.x[id] += Velocity.x[id];
      //   Position.y[id] += Velocity.z[id];
    }

    return world;
  });
}
