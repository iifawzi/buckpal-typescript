import { AccountId } from "../../domain/Account";
import { Money } from "../../domain/Money";
import { GetAccountBalanceQuery } from "../port/in/GetAccountBalanceQuery";
import { LoadAccountPort } from "../port/out/LoadAccountPort";

export class GetAccountBalanceService implements GetAccountBalanceQuery {
    private loadAccountPort: LoadAccountPort;
    
    constructor(loadAccountPort: LoadAccountPort) {
        this.loadAccountPort = loadAccountPort;
    }
    
    async getAccountBalance(accountId: AccountId): Promise<Money> {
        const account = await this.loadAccountPort.loadAccount(accountId, new Date());
        return account.calculateBalance()
    }

}