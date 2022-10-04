import Phaser from "phaser";
import {
  defineSystem,
  defineQuery,
  IWorld,
  addComponent,
  removeComponent,
} from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";
import Position from "../components/Position";

const NPC = ComponentFactory.getInstance().getProduct("NPC");
const Rotation = ComponentFactory.getInstance().getProduct("Rotation");
const View = ComponentFactory.getInstance().getProduct("View");
const Player = ComponentFactory.getInstance().getProduct("Player");
const Target = ComponentFactory.getInstance().getProduct("Target");

function foundPlayer(world: IWorld, players: number[], id: number) {
  const viewedList = View.viewedList[id];

  const found = viewedList.some((r) => players.includes(r));

  let PlayerFound;
  if (found) {
    console.log("Encontrou");
    players.forEach((m) => {
      console.log("player", m);
      if (viewedList.includes(m)) {
        console.log("Achou", m);
        PlayerFound = m;
        return m;
      }
    });
  }

  return { PlayerFound, hasFound: found };
}

export default function chasePlayerSystem(scene: Phaser.Scene) {
  const npcQuery = defineQuery([NPC, View, Rotation]);
  const playerQuery = defineQuery([Player]);

  return defineSystem((world) => {
    const entities = npcQuery(world);
    const players = playerQuery(world);

    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i];

      let playerFound = foundPlayer(world, players, id);

      if (playerFound.hasFound) {
        addComponent(world, Target, id);

        Target.x[id] = Position.x[playerFound.PlayerFound];
        Target.y[id] = Position.y[playerFound.PlayerFound];
        Target.z[id] = Position.z[playerFound.PlayerFound];
      } else {
        removeComponent(world, Target, id);
        // console.log(`Eu ${id} perdi o Player`);
      }
    }

    return world;
  });
}
