import { LoadAccountPort } from "account/application/port/out/LoadAccountPort";
import { UpdateAccountStatePort } from "account/application/port/out/UpdateAccountStatePort";
import { AccountId, Account } from "account/domain/Account";
import { AccountRepository } from "./repositories/account.repository";
import { ActivityRepository } from "./repositories/Activity.repository";
import { Prisma } from "@prisma/client";
import { AccountMapper } from "./mappers/AccountMapper";
import { AccountLockPort } from "account/application/port/out/AccountLock";
import { injectable } from "tsyringe";

@injectable()
export class LoadAccountAdapter implements LoadAccountPort {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly activityRepository: ActivityRepository
  ) {}

  async loadAccount(
    accountId: AccountId,
    baselineDate: Date
  ): Promise<Account> {
    const account: Prisma.AccountGetPayload<{ select: { id: true } }> | null =
      await this.accountRepository.findById(accountId.getValue);
    if (!account) {
      throw new Error("User does not exist");
    }

    const activities = await this.activityRepository.findByOwnerSince(
      accountId.getValue,
      baselineDate
    );

    const withdrawBalance =
      await this.activityRepository.getWithdrawalBalanceUntil(
        accountId.getValue,
        baselineDate
      );

    const depositBalance = await this.activityRepository.getDepositBalanceUntil(
      accountId.getValue,
      baselineDate
    );

    return AccountMapper.mapToDomainEntity(
      account,
      activities,
      withdrawBalance || 0,
      depositBalance || 0
    );
  }
}

@injectable()
export class UpdateAccountStateAdapter implements UpdateAccountStatePort {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async updateActivities(account: Account): Promise<void> {
    const activities = account.getActivityWindow.getActivities;
    for ( let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      if (activity.getId == null) {
        await this.activityRepository.save(
          AccountMapper.mapActivityToPrisma(activity)
        );
      }
    }
  }
}

export class AccountLockAdapter implements AccountLockPort {
  constructor() {}

  lockAccount(accountId: AccountId): void {
    // locked
  }

  releaseAccount(AccountId: AccountId): void {
    // released
  }
}