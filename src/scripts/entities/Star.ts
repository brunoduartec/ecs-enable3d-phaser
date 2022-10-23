import { IEntity } from "./IEntity";

import { addEntity, addComponent, IWorld } from "bitecs";
import { ComponentFactory } from "../components/ComponentFactory";

const PositionComponent = ComponentFactory.getInstance().getProduct("Position");
const RotationComponent = ComponentFactory.getInstance().getProduct("Rotation");
const StarComponent = ComponentFactory.getInstance().getProduct("Star");
const ModelComponent = ComponentFactory.getInstance().getProduct("Model");

import { ModelTypeFactory } from "../models/ModelTypeFactory";

interface StarProps {
  position: {
    x: number;
    y: number;
    z: number;
  };
}

class Star implements IEntity {
  public create(world: IWorld, props: StarProps) {
    const star = addEntity(world);

    addComponent(world, StarComponent, star);
    addComponent(world, PositionComponent, star);
    PositionComponent.x[star] = props.position.x;
    PositionComponent.y[star] = props.position.y;
    PositionComponent.z[star] = props.position.z;

    addComponent(world, ModelComponent, star);
    ModelComponent.modelType[star] =
      ModelTypeFactory.getInstance().getModelId("star");

    addComponent(world, RotationComponent, star);
    RotationComponent.speed[star] = 1;
    return star;
  }
}

export { Star };
