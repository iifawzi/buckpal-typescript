import { Money } from "../../domain/Money";

export class ThresholdExceededException extends Error {
  constructor(threshold: Money, actual: Money) {
    super(
      `Maximum threshold for transferring money exceeded: tried to transfer ${actual} but threshold is ${threshold}`
    );
  }
}
