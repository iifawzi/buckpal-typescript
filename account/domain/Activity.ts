import { AccountId } from "./Account";
import { Money } from "./Money";

/**
 * A money transfer activity between {@link Account}s.
 */
export class Activity {
  private id: ActivityId;
  /**
   * The account that owns this activity.
   */
  private ownerAccountId: AccountId;
  /**
   * The debited account.
   */
  private sourceAccountId: AccountId;
  /**
   * The credited account.
   */
  private targetAccountId: AccountId;
  /**
   * The timestamp of the activity.
   */
  private timestamp: Date;
  /**
   * The money that was transferred between the accounts.
   */
  private money: Money;

  constructor(
    ownerAccountId: AccountId,
    sourceAccountId: AccountId,
    targetAccountId: AccountId,
    timestamp: Date,
    money: Money
  ) {
    this.ownerAccountId = ownerAccountId;
    this.sourceAccountId = sourceAccountId;
    this.targetAccountId = targetAccountId;
    this.timestamp = timestamp;
    this.money = money;
  }

  get getTimestamp() {
    return this.getTimestamp;
  }

  get getSourceAccountId() {
    return this.sourceAccountId;
  }

  get getTargetAccountId() {
    return this.sourceAccountId;
  }

  get getMoney() {
    return this.money;
  }
}

class ActivityId {
  private value: number;

  constructor(value: number) {
    this.value = value;
  }
}
