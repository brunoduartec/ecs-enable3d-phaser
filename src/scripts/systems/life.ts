import { defineSystem, defineQuery, removeComponent } from "bitecs";

import Health from "../components/Health";

export default function checkLifeSystem() {
  const healthQuery = defineQuery([Health]);

  return defineSystem((world) => {
    const entities = healthQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      if (Health.amount[i] < 0) {
        removeComponent(world, Health, i);
      }

      // Health.amount[i] = Health.amount[i] - 1;
    }

    return world;
  });
}
