import { defineComponent, Types } from "bitecs";

export const Input = defineComponent({
  direction: [Types.ui8, 5],
  speed: Types.ui8,
});

export enum Direction {
  Left,
  Right,
  Up,
  Down,
  None
}

export default Input;
