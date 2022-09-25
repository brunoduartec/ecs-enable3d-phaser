import { IEntity } from "./IEntity";

import { addEntity, addComponent, IWorld } from "bitecs";

import { ComponentFactory } from "../components/ComponentFactory";

const JumpComponent = ComponentFactory.getInstance().getProduct("Jump");
const PositionComponent = ComponentFactory.getInstance().getProduct("Position");
const VelocityComponent = ComponentFactory.getInstance().getProduct("Velocity");
const RotationComponent = ComponentFactory.getInstance().getProduct("Rotation");
const PlayerComponent = ComponentFactory.getInstance().getProduct("Player");
const InputComponent = ComponentFactory.getInstance().getProduct("Input");
const ModelComponent = ComponentFactory.getInstance().getProduct("Model");
const HealthComponent = ComponentFactory.getInstance().getProduct("Health");

import { ModelTypes } from "../components/Model";

class Player implements IEntity {
  constructor() {}

  public create(world: IWorld) {
    // create the player tank
    const player = addEntity(world);
    addComponent(world, PositionComponent, player);
    addComponent(world, VelocityComponent, player);
    addComponent(world, RotationComponent, player);
    addComponent(world, ModelComponent, player);
    addComponent(world, PlayerComponent, player);
    addComponent(world, InputComponent, player);
    addComponent(world, JumpComponent, player);
    addComponent(world, HealthComponent, player);

    PositionComponent.x[player] = 1;
    PositionComponent.y[player] = 10;
    PositionComponent.z[player] = 0;

    ModelComponent.modelType[player] = ModelTypes.box;
    ModelComponent.width[player] = 1;
    ModelComponent.height[player] = 1;
    InputComponent.speed[player] = 2;

    JumpComponent.strength[player] = 2;
    JumpComponent.isJumping[player] = 0;
    JumpComponent.isGrounded[player] = 0;

    HealthComponent.amount[player] = 100;
  }
}

export { Player };
