import { AccountId } from "../../domain/Account";
import { Money } from "../../domain/Money";

export class SendMoneyCommand {
  private readonly sourceAccountId: AccountId;
  private readonly targetAccountId: AccountId;
  private readonly money: Money;

  constructor(
    sourceAccountId: AccountId,
    targetAccountId: AccountId,
    money: Money
  ) {
    if (!sourceAccountId) {
      throw new Error("SourceAccountId must be valid");
    }

    if (!targetAccountId) {
      throw new Error("targetAccountId must be valid");
    }

    if (!money.isPositive()) {
      throw new Error("Money must be larger than zero");
    }

    this.sourceAccountId = sourceAccountId;
    this.targetAccountId = targetAccountId;
    this.money = money;
  }

  get getMoney() {
    return this.money;
  }

  get getSourceAccountId() {
    return this.sourceAccountId;
  }

  get getTargetAccountId() {
    return this.targetAccountId;
  }

}
