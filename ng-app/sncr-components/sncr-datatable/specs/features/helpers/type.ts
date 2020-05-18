import * as fc from 'fast-check';

import {DebugElement} from '@angular/core';

// selectors

const SELECTOR_COLUMN_DATA_BOOLEAN_TRUE = '.boolean-true';
const SELECTOR_COLUMN_DATA_BOOLEAN_FALSE = '.boolean-false';
const SELECTOR_CHECKBOX_INPUT = 'input[type=checkbox]';

// classes

export abstract class TypeHelper<T> {
  abstract compare(a: T, b: T): number;
  abstract arbitrary(): fc.Arbitrary<T>;
  abstract fromString(str: string): T;
  abstract toString(value: T): string;

  fromCellEl(cellEl: HTMLElement): T {
    return this.fromString(cellEl.textContent.trim());
  }

  sample(samples: T[], seedStream: fc.Stream<number>): T {
    const arb =
      samples !== undefined && samples.length > 0
        ? fc.oneof(this.arbitrary(), fc.constantFrom(...samples))
        : this.arbitrary();

    return fc.sample(arb, {seed: seedStream.next().value, numRuns: 1})[0];
  }
}

class BooleanHelper extends TypeHelper<boolean> {
  compare(a: boolean, b: boolean): number {
    return a.toString().localeCompare(b.toString());
  }

  arbitrary(): fc.Arbitrary<boolean> {
    return fc.boolean();
  }

  fromString(str: string): boolean {
    return str === 'true';
  }

  toString(value: boolean): string {
    return value ? 'true' : 'false';
  }

  fromCellEl(cellEl: HTMLElement): boolean {
    if (cellEl.querySelector(SELECTOR_COLUMN_DATA_BOOLEAN_TRUE)) {
      return true;
    } else if (cellEl.querySelector(SELECTOR_COLUMN_DATA_BOOLEAN_FALSE)) {
      return false;
    }
    throw new Error(
      `No boolean value found for cell with content: ${cellEl.innerHTML}`
    );
  }
}

class DateHelper extends TypeHelper<number> {
  compare(a: number, b: number): number {
    return a === null ? -1 : b === null ? 1 : a - b;
  }

  arbitrary(): fc.Arbitrary<number> {
    // TODO: A date of 0 is currently filtered out by FilterService.
    // As a temporary workaround we are only generating date timestamps with 1 or greater,
    // once fixed and applied across all layers this should be corrected.
    return fc
      .tuple(fc.integer(1970, 2038), fc.nat(11), fc.integer(1, 31))
      .chain(t => fc.constant(Math.max(1, Date.UTC(t[0], t[1], t[2]))));
  }

  fromString(str: string): number {
    return Date.parse(
      str
        .split('.')
        .reverse()
        .join('-')
    );
  }

  toString(value: number): string {
    return new Date(value).toLocaleDateString('de-DE');
  }
}

class NumberHelper extends TypeHelper<number> {
  compare(a: number, b: number): number {
    return a === null ? 1 : b === null ? -1 : a - b;
  }

  arbitrary(): fc.Arbitrary<number> {
    return fc.integer();
  }

  fromString(str: string): number {
    return Number(str);
  }

  toString(value: number): string {
    return value.toString();
  }
}

class TextHelper extends TypeHelper<string> {
  sample(samples?: string[], seedStream?: fc.Stream<number>): string {
    const arbs = [this.arbitrary()];

    if (samples !== undefined && samples.length > 0) {
      // additional support for random substring of random sample
      const randomSampleIndex = fc.sample(fc.nat(samples.length - 1), {
        seed: seedStream.next().value,
        numRuns: 1
      })[0];
      const randomSample = samples[randomSampleIndex];

      const randomSubstringPositions = fc.sample(
        fc.nat(Math.max(0, randomSample.length - 1)),
        {
          seed: seedStream.next().value,
          numRuns: 2
        }
      );
      const substringStart = Math.min(...randomSubstringPositions);
      const substringEnd = Math.max(...randomSubstringPositions);
      const randomSubstringSample = randomSample.substring(
        substringStart,
        substringEnd
      );

      arbs.push(fc.constantFrom(...samples));
      arbs.push(fc.constant(randomSubstringSample));
    }

    return fc.sample(fc.oneof(...arbs), {
      seed: seedStream.next().value,
      numRuns: 1
    })[0];
  }

  compare(a: string, b: string): number {
    return a.localeCompare(b);
  }

  arbitrary(): fc.Arbitrary<string> {
    return fc.hexaString(255);
  }

  fromString(str: string): string {
    return str;
  }

  toString(value: string): string {
    return value;
  }
}

class SelectionHelper extends TypeHelper<boolean> {
  compare(a: boolean, b: boolean): number {
    return a.toString().localeCompare(b.toString());
  }

  arbitrary(): fc.Arbitrary<boolean> {
    return fc.boolean();
  }

  fromString(str: string): boolean {
    return str === 'true';
  }

  toString(value: boolean): string {
    return value ? 'true' : 'false';
  }

  fromCellEl(cellEl: HTMLElement): boolean {
    return cellEl.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX_INPUT)
      .checked;
  }
}

const TYPE_HELPERS = {
  boolean: new BooleanHelper(),
  date: new DateHelper(),
  number: new NumberHelper(),
  text: new TextHelper(),
  selection: new SelectionHelper()
};

export const getTypeHelper = <T>(type: string): TypeHelper<T> =>
  TYPE_HELPERS[type];
