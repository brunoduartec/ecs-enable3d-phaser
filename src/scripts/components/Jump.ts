import { defineComponent, Types } from "bitecs";

export const Jump = defineComponent({
  strength: Types.i8,
  isJumping: Types.i8,
  isGrounded: Types.i8,
});

export default Jump;
