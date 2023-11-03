import { SendMoneyCommand } from "@/account/application/command/SendMoneyCommand";
import { AccountId } from "@/account/domain/Account";
import { SendMoneyDTO } from "../dto/sendMoney.dto";
import { SendMoneyUseCase } from "@/account/application/port/in/SendMoneyUseCase";
import { Money } from "@/account/domain/Money";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/di/Tokens";
import { Response, Request } from "express";

@injectable()
export class SendMoneyController {
  private sendMoneyUseCase: SendMoneyUseCase;
  constructor(
    @inject(TOKENS.SendMoneyUseCase) sendMoneyUseCase: SendMoneyUseCase
  ) {
    this.sendMoneyUseCase = sendMoneyUseCase;
  }

  public async sendMoney(req: Request, res: Response): Promise<void> {
    try {
      const body: SendMoneyDTO = req.body;
      const targetAccountId = new AccountId(body.targetAccountId);
      const sourceAccountId = new AccountId(body.sourceAccountId);
      const money = Money.of(body.amount);
      const command = new SendMoneyCommand(
        sourceAccountId,
        targetAccountId,
        money
      );
      const response = await this.sendMoneyUseCase.sendMoney(command);
      if (!response) {
        res.json({
          status: 409,
          message: "Source account does not have enough money",
        });
        return;
      }
      res.json({
        status: 200,
        message: "Transaction has been saved!",
      });
    } catch (err: any) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  }
}
