import * as fc from 'fast-check';

import {getTypeHelper} from './type';

export abstract class Filter<T> {
  abstract matches(value: T): boolean;

  toJSON() {
    return {filterType: this.constructor.name, ...this};
  }
}

// filters

export class Equals<T> extends Filter<T> {
  constructor(readonly value: T) {
    super();
  }

  matches(value: T): boolean {
    return this.value === value;
  }
}

export class Contains<T> extends Filter<T> {
  constructor(readonly value: T) {
    super();
  }

  matches(value: T): boolean {
    if (typeof value === 'string') {
      return (value as any).includes(this.value);
    }

    return this.value === value;
  }
}

export class IsEmpty<T> extends Filter<T> {
  matches(value: T): boolean {
    if (typeof value === 'string' && value === '') {
      return true;
    }

    return value === null;
  }
}

export class GreaterThan<T> extends Filter<T> {
  constructor(readonly value: T) {
    super();
  }

  matches(value: T): boolean {
    return value > this.value;
  }
}

export class GreaterThanOrEquals<T> extends Filter<T> {
  constructor(readonly value: T) {
    super();
  }

  matches(value: T): boolean {
    return value >= this.value;
  }
}

export class LessThan<T> extends Filter<T> {
  constructor(readonly value: T) {
    super();
  }

  matches(value: T): boolean {
    return value < this.value;
  }
}

export class LessThanOrEquals<T> extends Filter<T> {
  constructor(readonly value: T) {
    super();
  }

  matches(value: T): boolean {
    return value <= this.value;
  }
}

// filter logic

export class And<T> extends Filter<T> {
  filters: Filter<T>[];

  constructor(...filters: Filter<T>[]) {
    super();
    this.filters = filters;
  }

  matches(value: T): boolean {
    return this.filters.every(filter => filter.matches(value));
  }
}

export class Or<T> extends Filter<T> {
  filters: Filter<T>[];

  constructor(...filters: Filter<T>[]) {
    super();
    this.filters = filters;
  }

  matches(value: T): boolean {
    return this.filters.some(filter => filter.matches(value));
  }
}

export class Not<T> extends Filter<T> {
  constructor(readonly filter: Filter<T>) {
    super();
  }

  matches(value: T): boolean {
    return !this.filter.matches(value);
  }
}

// filter factory

export class FilterFactory {
  randomQuickFilter<T>(
    type: string,
    samples: T[],
    seedStream: fc.Stream<number>
  ): Filter<T> {
    let value = getTypeHelper<T>(type).sample(samples, seedStream);

    if (type === 'text') {
      // ensure to use a non-empty string as filtering
      // for empty string is not supported
      while ((value as any) === '') {
        value = getTypeHelper<T>(type).sample(samples, seedStream);
      }
    }

    return new Contains<T>(value);
  }

  randomAdvancedFilter<T>(
    type: string,
    samples: T[],
    seedStream: fc.Stream<number>
  ): Filter<T> {
    return fc.sample(
      fc.oneof(
        // no logical condition
        fc.constant(this.randomSimpleFilter(type, samples, seedStream)),

        // logical AND condition
        fc.constant(
          new And(
            this.randomSimpleFilter(type, samples, seedStream),
            this.randomSimpleFilter(type, samples, seedStream)
          )
        ),

        // logical OR condition
        fc.constant(
          new Or(
            this.randomSimpleFilter(type, samples, seedStream),
            this.randomSimpleFilter(type, samples, seedStream)
          )
        )
      ),
      {seed: seedStream.next().value, numRuns: 1}
    )[0];
  }

  private randomSimpleFilter<T>(
    type: string,
    samples: T[],
    seedStream: fc.Stream<number>
  ): Filter<T> {
    let value = getTypeHelper<T>(type).sample(samples, seedStream);

    if (type === 'text') {
      // ensure to use a non-empty string as filtering
      // for empty string is not supported
      while ((value as any) === '') {
        value = getTypeHelper<T>(type).sample(samples, seedStream);
      }

      return fc.sample(
        fc.oneof(
          fc.constant(new IsEmpty()),
          fc.constant(new Not(new IsEmpty())),
          fc.constant(new Equals(value)),
          fc.constant(new Not(new Equals(value))),
          fc.constant(new Contains(value)),
          fc.constant(new Not(new Contains(value)))
        ),
        {seed: seedStream.next().value, numRuns: 1}
      )[0];
    } else if (type === 'number' || type === 'date') {
      return fc.sample(
        fc.oneof(
          fc.constant(new IsEmpty()),
          fc.constant(new Not(new IsEmpty())),
          fc.constant(new Equals(value)),
          fc.constant(new Not(new Equals(value))),
          fc.constant(new GreaterThan(value)),
          fc.constant(new GreaterThanOrEquals(value)),
          fc.constant(new LessThan(value)),
          fc.constant(new LessThanOrEquals(value))
        ),
        {seed: seedStream.next().value, numRuns: 1}
      )[0];
    }
  }
}
