import { AccountId } from "../../../domain/Account";

export interface AccountLock {
  lockAccount(accountId: AccountId): void;
  releaseAccount(AccountId: AccountId): void;
}
