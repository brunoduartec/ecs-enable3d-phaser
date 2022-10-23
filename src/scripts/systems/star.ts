import Phaser from "phaser";
import { defineSystem, defineQuery } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const Star = ComponentFactory.getInstance().getProduct("Star");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");

export default function handleStarSystem() {
  const starQuery = defineQuery([Star, Rotation]);

  return defineSystem((world) => {
    const entities = starQuery(world);

    console.log("Stars", entities);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      Rotation.y[id] = 1;
    }

    return world;
  });
}
