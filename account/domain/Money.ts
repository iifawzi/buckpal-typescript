export class Money {
  public static ZERO = Money.of(0);

  private amount: number;

  private constructor(value: number) {
    this.amount = value;
  }

  public static of(value: number): Money {
    return new Money(value);
  }

  public static add(a: Money, b: Money): Money {
    return new Money(a.amount + b.amount);
  }

  public static subtract(a: Money, b: Money): Money {
    return new Money(a.amount - b.amount);
  }

  public minus(money: Money): Money {
    return new Money(this.amount - money.amount);
  }

  public plus(money: Money): Money {
    return new Money(this.amount + money.amount);
  }

  public negate(): Money {
    return new Money(-this.amount);
  }

  public isPositiveOrZero(): boolean {
    return this.amount >= 0;
  }

  public isNegative(): boolean {
    return this.amount < 0;
  }

  public isPositive(): boolean {
    return this.amount > 0;
  }

  public isGreaterThanOrEqualTo(money: Money): boolean {
    return this.amount >= money.amount;
  }

  public isGreaterThan(money: Money): boolean {
    return this.amount > money.amount;
  }

  public get getNumber() {
    return this.amount;
  }
}
