import { Lifecycle, container } from "tsyringe";
import { TOKENS } from "./Tokens";
import { AccountLockAdapter, LoadAccountAdapter, UpdateAccountStateAdapter } from "@/account/adapter/out/persistence/prisma/prisma.adapter";
import { AccountLockPort } from "@/account/application/port/out/AccountLock";
import { LoadAccountPort } from "@/account/application/port/out/LoadAccountPort";
import { UpdateAccountStatePort } from "@/account/application/port/out/UpdateAccountStatePort";
import { SendMoneyUseCase } from "@/account/application/port/in/SendMoneyUseCase";
import { SendMoneyService } from "@/account/application/services/SendMoneyService";


export default function registerDependencies() {
    
    container.register<AccountLockPort>(TOKENS.AccountLockPort, { useClass: AccountLockAdapter }, { lifecycle: Lifecycle.Singleton });
    container.register<LoadAccountPort>(TOKENS.LoadAccountPort, { useClass: LoadAccountAdapter }, { lifecycle: Lifecycle.Singleton });
    container.register<UpdateAccountStatePort>(TOKENS.UpdateAccountStatePort, { useClass: UpdateAccountStateAdapter }, { lifecycle: Lifecycle.Singleton });
    
    container.register<SendMoneyUseCase>(TOKENS.SendMoneyUseCase, { useClass: SendMoneyService }, { lifecycle: Lifecycle.Singleton });
}