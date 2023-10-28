import { Money } from "../../domain/Money";
import { SendMoneyCommand } from "../command/SendMoneyCommand";
import { ThresholdExceededException } from "../exceptions/ThresholdExceededException";
import { SendMoneyUseCase } from "../port/in/SendMoneyUseCase";
import { AccountLock } from "../port/out/AccountLock";
import { LoadAccountPort } from "../port/out/LoadAccountPort";
import { UpdateAccountStatePort } from "../port/out/UpdateAccountStatePort";

export class SendMoneyService implements SendMoneyUseCase {
  private loadAccountPort: LoadAccountPort;
  private accountLock: AccountLock;
  private updateAccountStatePort: UpdateAccountStatePort;

  constructor(
    loadAccountPort: LoadAccountPort,
    accountLock: AccountLock,
    updateAccountStatePort: UpdateAccountStatePort
  ) {
    this.loadAccountPort = loadAccountPort;
    this.accountLock = accountLock;
    this.updateAccountStatePort = updateAccountStatePort;
  }

  public sendMoney(command: SendMoneyCommand): boolean {
    this.checkThreshold(command);

    const date = new Date();
    const baselineDate = new Date(date.setDate(date.getDate() - 10));

    const sourceAccount = this.loadAccountPort.loadAccount(
      command.getSourceAccountId,
      baselineDate
    );

    const targetAccount = this.loadAccountPort.loadAccount(
      command.getTargetAccountId,
      baselineDate
    );

    const sourceAccountId = sourceAccount.getId;
    if (!sourceAccountId) {
      throw new Error("expected source account ID not to be empty");
    }

    const targetAccountId = sourceAccount.getId;
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

    this.updateAccountStatePort.updateActivities(sourceAccount);
    this.updateAccountStatePort.updateActivities(targetAccount);

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
