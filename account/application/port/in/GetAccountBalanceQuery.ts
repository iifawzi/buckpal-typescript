import { AccountId } from "../../../domain/Account";
import { Money } from "../../../domain/Money";

export interface GetAccountBalanceQuery {
  getAccountBalance(accountId: AccountId): Promise<Money>;
}
