import Prisma from "@prisma/client";
import { Account, AccountId } from "account/domain/Account";
import { Activity, ActivityId } from "account/domain/Activity";
import { ActivityWindow } from "account/domain/ActivityWindow";
import { Money } from "account/domain/Money";

export class AccountMapper {
  public static mapToDomainEntity(
    account: Prisma.Account,
    activities: Prisma.Activity[],
    withdrawalBalance: number,
    depositBalance: number
  ): Account {
    const baselineBalance: Money = Money.subtract(
      Money.of(depositBalance),
      Money.of(withdrawalBalance)
    );

    return Account.withId(
      new AccountId(account.id),
      baselineBalance,
      AccountMapper.mapToActivityWindow(activities)
    );
  }

  public static mapActivityToPrisma(activity: Activity): Prisma.Prisma.ActivityCreateInput {
    return {
        timestamp: activity.getTimestamp,
        ownerAccountId: activity.getOwnerAccountId.getValue,
        sourceAccountId: activity.getSourceAccountId.getValue,
        targetAccountId: activity.getTargetAccountId.getValue,
        amount: activity.getMoney.getNumber,

    }
  }

  private static mapToActivityWindow(activities: Prisma.Activity[]): ActivityWindow {
    const mappedActivities = [];

    for (const activity of activities) {
      mappedActivities.push(
        new Activity(
          new ActivityId(activity.id),
          new AccountId(activity.ownerAccountId),
          new AccountId(activity.sourceAccountId),
          new AccountId(activity.targetAccountId),
          activity.timestamp,
          Money.of(activity.amount)
        )
      );
    }

    return new ActivityWindow(mappedActivities);
  }
}
