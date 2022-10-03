import { defineComponent, Types } from "bitecs";

export const Velocity = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32,
  speed: Types.f32,
});

export default Velocity;
