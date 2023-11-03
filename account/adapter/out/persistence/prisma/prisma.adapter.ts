import { LoadAccountPort } from "account/application/port/out/LoadAccountPort";
import { UpdateAccountStatePort } from "account/application/port/out/UpdateAccountStatePort";
import { AccountId, Account } from "account/domain/Account";
import { AccountRepository } from "./repositories/account.repository";
import { ActivityRepository } from "./repositories/Activity.repository";
import { Prisma } from "@prisma/client";
import { AccountMapper } from "./mappers/AccountMapper";
import { AccountLock } from "account/application/port/out/AccountLock";

export class PrismaPersistence
  implements LoadAccountPort, UpdateAccountStatePort, AccountLock
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly activityRepository: ActivityRepository
  ) {}

  lockAccount(accountId: AccountId): void {
    // locked
  }

  releaseAccount(AccountId: AccountId): void {
    // released
  }

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

  async updateActivities(account: Account): Promise<void> {
    const activities = account.getActivityWindow.getActivities;
    for (const activity of activities) {
      if (activity.getId == null) {
        await this.activityRepository.save(
          AccountMapper.mapActivityToPrisma(activity)
        );
      }
    }
  }
}
