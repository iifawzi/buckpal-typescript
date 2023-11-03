import { AccountId } from "../../../domain/Account";

export interface AccountLockPort {
  lockAccount(accountId: AccountId): void;
  releaseAccount(AccountId: AccountId): void;
}
