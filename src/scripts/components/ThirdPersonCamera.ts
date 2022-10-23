import { defineComponent, Types } from "bitecs";

export const ThirdPersonCamera = defineComponent({
  target: Types.eid,
  posX: Types.f32,
  posY: Types.f32,
  posZ: Types.f32,
  lookatX: Types.f32,
  lookatY: Types.f32,
  lookatZ: Types.f32,
});

export default ThirdPersonCamera;
