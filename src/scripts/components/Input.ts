import { defineComponent, Types } from "bitecs";

export const Input = defineComponent({
  direction: [Types.ui8, 4],
  speed: Types.ui8,
});

export enum Direction {
  Left,
  Right,
  Up,
  Down
}

export default Input;
