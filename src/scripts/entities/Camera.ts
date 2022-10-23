import { IEntity } from "./IEntity";

import { addEntity, addComponent, IWorld } from "bitecs";
import { ComponentFactory } from "../components/ComponentFactory";

const ThirdPersonCamera =
  ComponentFactory.getInstance().getProduct("ThirdPersonCamera");

class Camera implements IEntity {
  public create(world: IWorld) {
    const camera = addEntity(world);

    addComponent(world, ThirdPersonCamera, camera);

    return camera;
  }
}

export { Camera };
