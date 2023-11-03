import { AccountId } from "./Account";
import { Money } from "./Money";

/**
 * A money transfer activity between {@link Account}s.
 */
export class Activity {
  private id: ActivityId | null;
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
    id: ActivityId | null,
    ownerAccountId: AccountId,
    sourceAccountId: AccountId,
    targetAccountId: AccountId,
    timestamp: Date,
    money: Money
  ) {
    this.id = id;
    this.ownerAccountId = ownerAccountId;
    this.sourceAccountId = sourceAccountId;
    this.targetAccountId = targetAccountId;
    this.timestamp = timestamp;
    this.money = money;
  }

  get getTimestamp() {
    return this.timestamp;
  }

  get getSourceAccountId() {
    return this.sourceAccountId;
  }

  get getTargetAccountId() {
    return this.targetAccountId;
  }

  get getOwnerAccountId() {
    return this.ownerAccountId;
  }

  get getMoney() {
    return this.money;
  }

  get getId() {
    return this.id;
  }
}

export class ActivityId {
  private value: number;

  constructor(value: number) {
    this.value = value;
  }
}
