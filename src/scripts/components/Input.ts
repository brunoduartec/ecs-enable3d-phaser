import { defineComponent, Types } from "bitecs";

export enum Action {
  Left,
  Right,
  Up,
  Down,
  Jump,
  None,
}
export const Input = defineComponent({
  action: [Types.ui8, 6],
  speed: Types.ui8,
  intensity: Types.f32,
});

export default Input;
