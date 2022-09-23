import { defineComponent, Types } from "bitecs";

export enum ModelTypes {
  box,
  sphere,
}

export const Model = defineComponent({
  modelType: Types.ui8,
  width: Types.ui8,
  height: Types.ui8,
});

export default Model;
