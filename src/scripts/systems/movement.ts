import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Position = ComponentFactory.getInstance().getProduct("Position");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const Velocity = ComponentFactory.getInstance().getProduct("Velocity");
const Input = ComponentFactory.getInstance().getProduct("Input");

import { Direction } from "../components/Input";

export default function createMovementSystem() {
  const movementQuery = defineQuery([Position, Velocity, Input, Rotation]);

  return defineSystem((world) => {
    const entities = movementQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      const direction = Input.direction[id];
      const speed = Input.speed[id];

      switch (direction) {
        case Direction.None:
          Velocity.speed[id] = 0;
          Rotation.x[id] = 0;
          break;

        case Direction.Left:
          // Velocity.x[id] = speed;
          // Velocity.z[id] = 0;
          Rotation.x[id] += Rotation.speed[id];
          break;

        case Direction.Right:
          // Velocity.x[id] = speed;
          // Velocity.z[id] = 0;
          // Rotation.angle[id] = 0;
          Rotation.x[id] -= Rotation.speed[id];
          break;

        case Direction.Up:
          Velocity.speed[id] = speed;
          // Velocity.z[id] = speed;
          // Rotation.angle[id] = 270;
          Rotation.x[id] = 0;
          break;

        case Direction.Down:
          Velocity.speed[id] = speed;
          // Velocity.z[id] = speed;
          Rotation.x[id] += 180;
          break;
      }

      //   Position.x[id] += Velocity.x[id];
      //   Position.y[id] += Velocity.z[id];
    }

    return world;
  });
}
