import { defineComponent, Types } from "bitecs";

export enum SensorType {
  Jump,
}

export const ShouldAddSensor = defineComponent({
  sensorType: Types.i8,
});

export default ShouldAddSensor;
