import { SendMoneyCommand } from "../../../application/command/SendMoneyCommand";
import { SendMoneyUseCase } from "../../../application/port/in/SendMoneyUseCase";
import { AccountId } from "../../../domain/Account";
import { Money } from "../../../domain/Money";

export class SendMoneyController {
  private sendMoneyUseCase: SendMoneyUseCase;
  constructor(sendMoneyUseCase: SendMoneyUseCase) {
    this.sendMoneyUseCase = sendMoneyUseCase;
  }

  // TODO:: any for now, I need to set proper types when getting back to this.
  public sendMoney(body: any): void {
    const targetAccountId = new AccountId(body.targetAccountId);
    const sourceAccountId = new AccountId(body.sourceAccountId);
    const money = Money.of(body.amount);
    const command = new SendMoneyCommand(
      sourceAccountId,
      targetAccountId,
      money
    );
    this.sendMoneyUseCase.sendMoney(command);
  }
}
