import { TOKENS } from "@/di/Tokens";
import { Money } from "../../domain/Money";
import { SendMoneyCommand } from "../command/SendMoneyCommand";
import { ThresholdExceededException } from "../exceptions/ThresholdExceededException";
import { SendMoneyUseCase } from "../port/in/SendMoneyUseCase";
import { AccountLockPort } from "../port/out/AccountLock";
import { LoadAccountPort } from "../port/out/LoadAccountPort";
import { UpdateAccountStatePort } from "../port/out/UpdateAccountStatePort";
import { inject, injectable } from "tsyringe";

@injectable()
export class SendMoneyService implements SendMoneyUseCase {
  private loadAccountPort: LoadAccountPort;
  private accountLock: AccountLockPort;
  private updateAccountStatePort: UpdateAccountStatePort;

  constructor(
    @inject(TOKENS.AccountLockPort) accountLock: AccountLockPort,
    @inject(TOKENS.LoadAccountPort) loadAccountPort: LoadAccountPort,
    @inject(TOKENS.UpdateAccountStatePort) updateAccountStatePort: UpdateAccountStatePort
  ) {
    this.loadAccountPort = loadAccountPort;
    this.accountLock = accountLock;
    this.updateAccountStatePort = updateAccountStatePort;
  }

  public async sendMoney(command: SendMoneyCommand): Promise<boolean> {
    this.checkThreshold(command);

    const date = new Date();
    const baselineDate = new Date(date.setDate(date.getDate() - 10));

    const sourceAccount = await this.loadAccountPort.loadAccount(
      command.getSourceAccountId,
      baselineDate
    );

    const targetAccount = await this.loadAccountPort.loadAccount(
      command.getTargetAccountId,
      baselineDate
    );

    const sourceAccountId = sourceAccount.getId;
    if (!sourceAccountId) {
      throw new Error("expected source account ID not to be empty");
    }

    const targetAccountId = targetAccount.getId;
    if (!targetAccountId) {
      throw new Error("expected target account ID not to be empty");
    }

    this.accountLock.lockAccount(sourceAccountId);

    if (!sourceAccount.withdraw(command.getMoney, targetAccountId)) {
      this.accountLock.releaseAccount(sourceAccountId);
      return false;
    }

    this.accountLock.lockAccount(targetAccountId);
    if (!targetAccount.deposit(command.getMoney, sourceAccountId)) {
      this.accountLock.releaseAccount(sourceAccountId);
      this.accountLock.releaseAccount(targetAccountId);
      return false;
    }
    
    await this.updateAccountStatePort.updateActivities(sourceAccount);
    await this.updateAccountStatePort.updateActivities(targetAccount);

    this.accountLock.releaseAccount(sourceAccountId);
    this.accountLock.releaseAccount(targetAccountId);
    return true;
  }

  private checkThreshold(command: SendMoneyCommand) {
    if (command.getMoney.isGreaterThan(Money.of(10000000))) {
      throw new ThresholdExceededException(
        Money.of(10000000),
        command.getMoney
      );
    }
  }
}
