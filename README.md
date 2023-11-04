The plain typescript implementation of Buckpal
https://github.com/thombergs/buckpal

### Introduction 

<img width="1543" alt="Screenshot 2023-11-04 at 12 02 45 AM" src="https://github.com/iifawzi/buckpal-typescript/assets/46695441/b58728f7-3341-4726-ab52-6572d15d6667">

Buckpal is a small system with single end-point `SendMoney` that would make you able to send money from account A to account B. 
the goal is to fully follow the principles of Domain Driven Design and Hexagonal architecture. Tom, the author of the book has built it in java and shown his reasoning behind every decision, here I just followed the same code organization and namings with a very tiny changes, and implemented it in typescript. 

For a fully documented/explained architecture of the project, it would be better to get back to the book of tom `get your hands dirty with clean architecture`, or his course on Educative. `hexagonal software architecture for web applications`.

This's not a complete application, and still is missing many parts when it comes to validation, domain exceptions and errors handling. 
the goal was just to implement the core logic in typescript. it's also missing the tests suite that's implemented in the actual buckpal java repo.

### Dependency Inversion: 

I've used https://github.com/microsoft/tsyringe from microsoft as a lightweight `dependency injection` container, which made me able to inject the necessary ports and services in an easy, and controllable way. 

https://github.com/iifawzi/parcels-delivery-service/blob/4094ff475e0ace6c6781f08009c22b03a08bb86d/backend/di/production.ts#L10-L26

Thanks to the decorators, and our base abstractions we can simply program to interfaces and make `tsyringe` handles the rest. 

The diagram below explains how the layers would be communicating with each other, with the help of our `container`:

![Buckpal digram](https://github.com/iifawzi/buckpal-typescript/assets/46695441/25909b6b-79cd-4818-afd3-b1d42a3807e5)
By adhering to such architecture, the Business logic is fully isolated, and can be developed and tested independently, this can be seen 
in the `getAccountBalanceService`, `SendMoneyService`, at which you will find that they're only applying business logic, and just communicating with the adapters ports ( not the actual implementation )


The domain layer can be found in the `domain` folder under account, while the ports and adapter can be found at the `application` and `adapter` folders accordingly, split as `input` and `output`. 

### How to run?

- You would need first to instal the dep

```bash
npm i
```

- Spin postgres database and update the connection url in `.env` file. 
- Load the database migrations and seeds

``` bash
npx prisma migrate reset --schema ./account/adapter/out/persistence/prisma/schema.prisma
```


