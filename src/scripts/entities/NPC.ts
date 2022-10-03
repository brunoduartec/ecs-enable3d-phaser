import { IEntity } from "./IEntity";

import { addEntity, addComponent, IWorld } from "bitecs";
import { ComponentFactory } from "../components/ComponentFactory";

const PositionComponent = ComponentFactory.getInstance().getProduct("Position");
const VelocityComponent = ComponentFactory.getInstance().getProduct("Velocity");
const RotationComponent = ComponentFactory.getInstance().getProduct("Rotation");
const NPCComponent = ComponentFactory.getInstance().getProduct("NPC");
const InputComponent = ComponentFactory.getInstance().getProduct("Input");
const ModelComponent = ComponentFactory.getInstance().getProduct("Model");
const HealthComponent = ComponentFactory.getInstance().getProduct("Health");
const AvoidDropComponent =
  ComponentFactory.getInstance().getProduct("AvoidDrop");

const ViewComponent = ComponentFactory.getInstance().getProduct("View");

import { ModelTypes } from "../components/Model";

interface NPCProps {
  width: number;
  height: number;
}

class NPC implements IEntity {
  public create(world: IWorld, props: NPCProps) {
    const npc = addEntity(world);

    addComponent(world, PositionComponent, npc);
    PositionComponent.x[npc] = Phaser.Math.Between(
      -props.width * 0.25,
      props.width * 0.75
    );
    PositionComponent.y[npc] = 0;
    PositionComponent.z[npc] = Phaser.Math.Between(
      -props.height * 0.25,
      props.height * 0.75
    );

    addComponent(world, VelocityComponent, npc);
    addComponent(world, RotationComponent, npc);
    RotationComponent.speed[npc] = 0.3;

    addComponent(world, ModelComponent, npc);
    ModelComponent.modelType[npc] = ModelTypes.sphere;

    addComponent(world, NPCComponent, npc);
    NPCComponent.timeBetweenActions[npc] = Phaser.Math.Between(0, 500);

    addComponent(world, InputComponent, npc);
    InputComponent.speed[npc] = 3;

    addComponent(world, HealthComponent, npc);
    HealthComponent.amount[npc] = 10;

    addComponent(world, AvoidDropComponent, npc);
    AvoidDropComponent.height[npc] = 2;

    // addComponent(world, Clicked, npc);
    // Clicked.check[npc] = 0;

    // addComponent(world, ViewComponent, npc);
    // ViewComponent.length[npc] = 30;
    // ViewComponent.fov[npc] = 10;
  }
}

export { NPC };
