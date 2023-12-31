import { Account } from "../../../domain/Account";

export interface UpdateAccountStatePort {
  updateActivities(account: Account): Promise<void>;
}
