import { defineComponent, Types } from "bitecs";

export const Rotation = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32,
  speed: Types.i8,
});

export default Rotation;
