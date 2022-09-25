import { IWorld } from "bitecs";

export interface IEntity {
  create(world: IWorld, props: any): void;
}
