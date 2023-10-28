import { Account, AccountId } from "../../../domain/Account";

export interface LoadAccountPort {
  loadAccount(accountId: AccountId, baselineDate: Date): Account;
}
