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

import { ModelTypeFactory } from "../models/ModelTypeFactory";

interface NPCProps {
  width: number;
  height: number;
}

class NPC implements IEntity {
  public create(world: IWorld, props: NPCProps) {
    const npc = addEntity(world);

    addComponent(world, PositionComponent, npc);
    PositionComponent.x[npc] = Phaser.Math.Between(-props.width, props.width);
    PositionComponent.y[npc] = 100;
    PositionComponent.z[npc] = Phaser.Math.Between(-props.height, props.height);

    addComponent(world, VelocityComponent, npc);
    addComponent(world, RotationComponent, npc);
    RotationComponent.speed[npc] = 1;

    addComponent(world, ModelComponent, npc);
    ModelComponent.modelType[npc] =
      ModelTypeFactory.getInstance().getModelId("enemy");

    addComponent(world, NPCComponent, npc);
    NPCComponent.timeBetweenActions[npc] = 500; //Phaser.Math.Between(0, 500);

    addComponent(world, InputComponent, npc);
    InputComponent.speed[npc] = 3;
    InputComponent.intensity[npc] = 1;

    addComponent(world, HealthComponent, npc);
    HealthComponent.amount[npc] = 10;

    addComponent(world, AvoidDropComponent, npc);
    AvoidDropComponent.height[npc] = 10;

    // addComponent(world, Clicked, npc);
    // Clicked.check[npc] = 0;

    // addComponent(world, ViewComponent, npc);
    // ViewComponent.length[npc] = 30;
    // ViewComponent.fov[npc] = 10;
    // ViewComponent.viewedList[npc] = [-1, -1, -1, -1, -1];

    return npc;
  }
}

export { NPC };
