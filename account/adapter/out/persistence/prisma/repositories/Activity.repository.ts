import prismaClient from "..";
import Prisma from "@prisma/client";

export class ActivityRepository {
  private activity = prismaClient.activity;

  public async findByOwnerSince(ownerAccountId: number, since: Date) {
    return await this.activity.findMany({
      where: {
        ownerAccountId,
        timestamp: {
          gt: since,
        },
      },
    });
  }

  public async getDepositBalanceUntil(accountId: number, until: Date) {
    const result = await this.activity.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        targetAccountId: accountId,
        ownerAccountId: accountId,
        timestamp: {
          lt: until,
        },
      },
    });
    return result._sum.amount;
  }

  public async getWithdrawalBalanceUntil(accountId: number, until: Date) {
    const result = await this.activity.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        sourceAccountId: accountId,
        ownerAccountId: accountId,
        timestamp: {
          lt: until,
        },
      },
    });
    return result._sum.amount;
  }

  public async save(activity: Prisma.Prisma.ActivityCreateInput) {
    await this.activity.create({ data: activity });
  }
}
