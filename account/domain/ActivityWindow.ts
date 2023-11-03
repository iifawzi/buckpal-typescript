import { AccountId } from "./Account";
import { Activity } from "./Activity";
import { Money } from "./Money";

export class ActivityWindow {
  constructor(activities: Activity[]) {
    this.activities = activities;
  }

  /**
   * The list of account activities within this window.
   */
  private activities: Activity[] = [];

  /**
   * The timestamp of the first activity within this window.
   */
  public getStartTimeStamp() {
    return this.activities[0].getTimestamp;
  }

  /**
   * The timestamp of the last activity within this window.
   */
  public getEndTimeStamp() {
    return this.activities[this.activities.length - 1].getTimestamp;
  }

  /**
   * Calculates the balance by summing up the values of all activities within this window.
   */
  public calculateBalance(accountId: AccountId) {
    const depositBalance = this.activities
      .filter((activity) => activity.getTargetAccountId.equals(accountId))
      .map((activity) => activity.getMoney)
      .reduce(Money.add, Money.ZERO);

    const withdrawalBalance = this.activities
      .filter((activity) => activity.getSourceAccountId.equals(accountId))
      .map((activity) => activity.getMoney)
      .reduce(Money.add, Money.ZERO);

    console.log(
      `depositBalance of account ${accountId.getValue}: `,
      depositBalance
    );
    console.log(
      `withdrawalBalance of account ${accountId.getValue}: `,
      withdrawalBalance
    );
    return Money.add(depositBalance, withdrawalBalance.negate());
  }

  public get getActivities(): Activity[] {
    return this.activities;
  }

  public addActivity(activity: Activity) {
    this.activities.push(activity);
  }
}
