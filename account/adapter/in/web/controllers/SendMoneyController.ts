import { SendMoneyCommand } from "account/application/command/SendMoneyCommand";
import { AccountId } from "account/domain/Account";
import { SendMoneyDTO } from "../dto/sendMoney.dto";
import { SendMoneyUseCase } from "account/application/port/in/SendMoneyUseCase";
import { Money } from "account/domain/Money";


export class SendMoneyController {
  private sendMoneyUseCase: SendMoneyUseCase;
  constructor(sendMoneyUseCase: SendMoneyUseCase) {
    this.sendMoneyUseCase = sendMoneyUseCase;
  }

  public sendMoney(body: SendMoneyDTO): void {
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
