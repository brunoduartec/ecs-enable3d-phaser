export interface IModel {
  load();
  create(position: THREE.Vector3): Promise<any>;
  getName(): string;
  getModel(): any;
  setId(id: number);
  getId(): number;
}
