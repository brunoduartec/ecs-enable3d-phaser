import { defineComponent, Types } from "bitecs";

export const View = defineComponent({
  length: Types.f32,
  fov: Types.f32,
  viewedList: [Types.eid, 5],
});

export default View;
