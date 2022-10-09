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
  },
  [Direction.Down]: function ({ id, speed }) {
    Velocity.speed[id] = -speed;
  },
  [Direction.Right]: function ({ id }) {
    Rotation.x[id] = -Rotation.speed[id];
  },
  [Direction.Left]: function ({ id }) {
    Rotation.x[id] = Rotation.speed[id];
  },
  [Direction.None]: function ({ id }) {
    Rotation.x[id] = 0;
    Velocity.speed[id] = 0;
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


      //reset moviment
      // effectByDirection[Direction.None]({ id })

      effectByDirection[Direction.None]({ id })

      let directionsConcat = ""
      for (let index = 0; index < directions.length - 1; index++) {
        const direction = directions[index];

        if (direction) {
          directionsConcat = directionsConcat.concat(`${index}`).concat("=>")
          effectByDirection[index]({ id, speed })
        }

      }
    }

    return world;
  });
}
