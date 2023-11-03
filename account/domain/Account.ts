import { Activity, ActivityId } from "./Activity";
import { ActivityWindow } from "./ActivityWindow";
import { Money } from "./Money";

/**
 * An account that holds a certain amount of money. An {@link Account} object only
 * contains a window of the latest account activities. The total balance of the account is
 * the sum of a baseline balance that was valid before the first activity in the
 * window and the sum of the activity values.
 */
export class Account {
  private constructor(
    id: AccountId | null,
    baselineBalance: Money,
    activityWindow: ActivityWindow
  ) {
    this.id = id;
    this.baselineBalance = baselineBalance;
    this.activityWindow = activityWindow;
  }

  /**
   * The unique ID of the account.
   */
  private id: AccountId | null;

  /**
   * The baseline balance of the account. This was the balance of the account before the first
   * activity in the activityWindow.
   */
  private baselineBalance: Money;

  /**
   * The window of latest activities on this account.
   */
  private activityWindow: ActivityWindow;

  /**
   * Creates an {@link Account} entity without an ID. Use to create a new entity that is not yet
   * persisted.
   */
  public static withoutId(
    baselineBalance: Money,
    activityWindow: ActivityWindow
  ): Account {
    return new Account(null, baselineBalance, activityWindow);
  }

  /**
   * Creates an {@link Account} entity with an ID. Use to reconstitute a persisted entity.
   */
  public static withId(
    accountId: AccountId,
    baselineBalance: Money,
    activityWindow: ActivityWindow
  ): Account {
    return new Account(accountId, baselineBalance, activityWindow);
  }

  /**
   * Calculates the total balance of the account by adding the activity values to the baseline balance.
   */
  public calculateBalance(): Money {
    return Money.add(
      this.baselineBalance,
      this.activityWindow.calculateBalance(this.id as AccountId)
    );
  }

  /**
   * Tries to withdraw a certain amount of money from this account.
   * If successful, creates a new activity with a negative value.
   * @return true if the withdrawal was successful, false if not.
   */
  public withdraw(money: Money, targetAccountId: AccountId): boolean {
    if (!this.mayWithdraw(money)) {
      return false;
    }

    const withdrawal: Activity = new Activity(
      null,
      this.id as AccountId,
      this.id as AccountId,
      targetAccountId,
      new Date(),
      money.negate()
    );

    this.activityWindow.addActivity(withdrawal);
    return true;
  }

  public deposit(money: Money, sourceAccountId: AccountId): boolean {
    const deposit: Activity = new Activity(
      null,
      this.id as AccountId,
      sourceAccountId,
      this.id as AccountId,
      new Date(),
      money
    );
    this.activityWindow.addActivity(deposit);
    return true;
  }

  get getId() {
    return this.id;
  }

  get getActivityWindow() {
    return this.activityWindow;
  }

  private mayWithdraw(money: Money): boolean {
    return Money.add(
      this.calculateBalance(),
      money.negate()
    ).isPositiveOrZero();
  }
}

export class AccountId {
  constructor(private value: number) {
    this.value = value;
  }

  get getValue() {
    return this.value;
  }

  equals(accountId: AccountId) {
    return this.value == accountId.value;
  }
}
