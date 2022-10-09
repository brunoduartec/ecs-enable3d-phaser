import { defineComponent, Types } from "bitecs";

export const TemporizedInput = defineComponent({
    timeBetweenActions: Types.ui32,
    accumulatedTime: Types.ui32,
});

export default TemporizedInput;
