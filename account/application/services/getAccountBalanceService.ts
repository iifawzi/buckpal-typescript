import { AccountId } from "../../domain/Account";
import { Money } from "../../domain/Money";
import { GetAccountBalanceQuery } from "../port/in/GetAccountBalanceQuery";
import { LoadAccountPort } from "../port/out/LoadAccountPort";

export class GetAccountBalanceService implements GetAccountBalanceQuery {
    private loadAccountPort: LoadAccountPort;
    
    constructor(loadAccountPort: LoadAccountPort) {
        this.loadAccountPort = loadAccountPort;
    }
    
    getAccountBalance(accountId: AccountId): Money {
        return this.loadAccountPort.loadAccount(accountId, new Date()).calculateBalance()
    }

}