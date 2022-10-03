import { defineComponent, Types } from "bitecs";

export const AvoidDrop = defineComponent({
  height: Types.f32,
  triggered: Types.i8,
});

export default AvoidDrop;
