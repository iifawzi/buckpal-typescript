import { SendMoneyCommand } from "../../command/SendMoneyCommand";

export interface SendMoneyUseCase {
    sendMoney(command: SendMoneyCommand): Promise<boolean>;
}