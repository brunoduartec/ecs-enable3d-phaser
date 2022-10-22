import { ExtendedObject3D } from "@enable3d/phaser-extension";
import Third from "@enable3d/phaser-extension/dist/third";

export interface IModel {
  load();
  create(position: THREE.Vector3): Promise<ExtendedObject3D>;
  get();
  setId(id: number);
  getId(): number;
}
