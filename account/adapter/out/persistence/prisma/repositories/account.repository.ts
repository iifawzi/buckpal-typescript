import prismaClient from "..";

export class AccountRepository {
  private account = prismaClient.account;

  public async findById(id: number) {
    return await this.account.findFirst({ where: { id } });
  }
}
