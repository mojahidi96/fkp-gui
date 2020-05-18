import * as fc from 'fast-check';

import {ComponentFixture} from '@angular/core/testing';

import {SncrDatatableComponent} from '../../sncr-datatable.component';

import {FilterFactory, Filter, Contains} from './helpers/filter';
import {getTypeHelper} from './helpers/type';
import {getFilterHelper} from './helpers/ui';

import {
  AbstractFeatureSpec,
  AsyncDatatableCommand,
  Column,
  DatatableModel,
  FeatureContext
} from './base';

// selectors

const SELECTOR_COLUMN_HEADER_TITLES = '.ui-datatable-thead .ui-column-title';

const SELECTOR_COLUMN_DATA_BY_INDEX = index0 =>
  `.ui-datatable-data > tr:not(.ui-datatable-emptymessage-row) > td:nth-of-type(${index0 +
    1})`;

// commands

abstract class FilterCommand extends AsyncDatatableCommand {
  constructor(readonly columnTitle: string) {
    super();
  }

  check(m: Readonly<DatatableModel>): boolean {
    return this.validColumn(m) !== undefined;
  }

  validColumn(m: Readonly<DatatableModel>): Column {
    return m.columns.find(
      c => c.isVisible && c.isFilterable && c.title === this.columnTitle
    );
  }

  recalculateNumberOfRows(m: DatatableModel): void {
    const filteredColumns = m.columns.filter(
      c => c.isVisible && c.isFilterable && c.filter !== undefined
    );
    m.numberOfRows = m.rows.reduce((acc, row) => {
      return filteredColumns.every(c => c.filter.matches(row[c.field]))
        ? acc + 1
        : acc;
    }, 0);
  }
}

abstract class ApplyFilterCommand<T> extends FilterCommand {
  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const column = this.getModelColumn(m, this.columnTitle);
    const columnHeaderEl = await this.getColumnHeaderEl(r, this.columnTitle);

    const previousFilter = column.filter;
    const samples = m.rows.map(row => row[column.field]);
    const filter = await this.applyRandomFilter(
      m,
      r,
      column,
      columnHeaderEl,
      samples
    );

    // update model
    column.filter = filter;
    const filterHasChanged =
      JSON.stringify(previousFilter) !== JSON.stringify(filter);

    this.recalculateNumberOfRows(m);

    if (filterHasChanged) {
      m.currentPage = 1;
    }
  }

  abstract applyRandomFilter<T>(
    m: Readonly<DatatableModel>,
    r: ComponentFixture<SncrDatatableComponent>,
    column: Column,
    columnHeaderEl: HTMLElement,
    samples: T[]
  ): Promise<Filter<T>>;
}

class ApplyQuickFilterCommand<T> extends ApplyFilterCommand<T> {
  check(m: Readonly<DatatableModel>): boolean {
    const validColumn = this.validColumn(m);

    return (
      validColumn !== undefined &&
      (validColumn.filter === undefined ||
        validColumn.filter instanceof Contains)
    );
  }

  async applyRandomFilter<T>(
    m: Readonly<DatatableModel>,
    r: ComponentFixture<SncrDatatableComponent>,
    column: Column,
    columnHeaderEl: HTMLElement,
    samples: T[]
  ): Promise<Filter<T>> {
    const filterHelper = getFilterHelper(column.type);
    const filter = this.randomFilter(column.type, samples, m.seedStream);

    m.ctx.log(
      `>> Apply quick filter to column '${column.field}':`,
      JSON.stringify(filter)
    );
    await filterHelper.applyQuickFilter(r, column.type, columnHeaderEl, filter);

    return filter;
  }

  randomFilter<T>(
    columnType: string,
    samples: T[],
    seedStream: fc.Stream<number>
  ): Filter<T> {
    const filterFactory = new FilterFactory();
    return filterFactory.randomQuickFilter(columnType, samples, seedStream);
  }
}

class ApplyAdvancedFilterCommand<T> extends ApplyFilterCommand<T> {
  async applyRandomFilter<T>(
    m: Readonly<DatatableModel>,
    r: ComponentFixture<SncrDatatableComponent>,
    column: Column,
    columnHeaderEl: HTMLElement,
    samples: T[]
  ): Promise<Filter<T>> {
    const filterHelper = getFilterHelper(column.type);
    const filter = this.randomFilter(column.type, samples, m.seedStream);

    m.ctx.log(
      `>> Apply advanced filter to column '${column.field}':`,
      JSON.stringify(filter)
    );
    await filterHelper.applyAdvancedFilter(
      r,
      column.type,
      columnHeaderEl,
      filter
    );

    return filter;
  }

  randomFilter<T>(
    columnType: string,
    samples: T[],
    seedStream: fc.Stream<number>
  ): Filter<T> {
    const filterFactory = new FilterFactory();
    return filterFactory.randomAdvancedFilter(columnType, samples, seedStream);
  }
}

abstract class ResetFilterCommand<T> extends FilterCommand {
  check(m: Readonly<DatatableModel>): boolean {
    const validColumn = this.validColumn(m);

    return validColumn !== undefined && validColumn.filter !== undefined;
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const column = this.getModelColumn(m, this.columnTitle);
    const columnHeaderEl = await this.getColumnHeaderEl(r, this.columnTitle);

    m.ctx.log(`>> Reset filter of column '${column.field}'`);

    await this.resetFilter(r, column.type, columnHeaderEl);

    // update model
    column.filter = undefined;

    this.recalculateNumberOfRows(m);

    m.currentPage = 1;
  }

  abstract resetFilter(
    r: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement
  ): Promise<void>;
}

class ResetQuickFilterCommand<T> extends ResetFilterCommand<T> {
  check(m: Readonly<DatatableModel>): boolean {
    const validColumn = this.validColumn(m);

    return (
      validColumn !== undefined &&
      validColumn.filter !== undefined &&
      validColumn.filter instanceof Contains
    );
  }

  async resetFilter(
    r: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement
  ): Promise<void> {
    const filterHelper = getFilterHelper(columnType);
    await filterHelper.resetQuickFilter(r, columnType, columnHeaderEl);
  }
}

class ResetAdvancedFilterCommand<T> extends ResetFilterCommand<T> {
  async resetFilter(
    r: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement
  ): Promise<void> {
    const filterHelper = getFilterHelper(columnType);
    await filterHelper.resetAdvancedFilter(r, columnType, columnHeaderEl);
  }
}

// assertions

const assertColumnsAreFiltered = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  expect(m.numberOfRows).toBeLessThanOrEqual(m.totalNumberOfRows);

  m.columns
    .filter(c => c.isVisible && c.isFilterable && c.filter !== undefined)
    .forEach(c => {
      const displayedColumnIndex = [
        ...r.nativeElement.querySelectorAll(SELECTOR_COLUMN_HEADER_TITLES)
      ]
        .map(el => el.textContent)
        .indexOf(c.title);

      const typeHelper = getTypeHelper(c.type);

      const displayedValues = [
        ...r.nativeElement.querySelectorAll(
          SELECTOR_COLUMN_DATA_BY_INDEX(displayedColumnIndex)
        )
      ].map(typeHelper.fromCellEl.bind(typeHelper));

      expect(
        displayedValues.every((value: any) => c.filter.matches(value))
      ).toBe(true);
    });
};

class FilteringFeatureSpec extends AbstractFeatureSpec {
  getSupportedCommands(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    fc.Arbitrary<
      fc.AsyncCommand<DatatableModel, ComponentFixture<SncrDatatableComponent>>
    >
  > {
    return Array.prototype.concat(
      ...featureCtx.columns
        .filter(c => c.isFilterable)
        .map(c => {
          return [
            fc.constant(new ApplyQuickFilterCommand(c.title)),
            fc.constant(new ApplyAdvancedFilterCommand(c.title)),
            fc.constant(new ResetQuickFilterCommand(c.title)),
            fc.constant(new ResetAdvancedFilterCommand(c.title))
          ];
        })
    );
  }

  getSupportedAssertions(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    (
      m: DatatableModel,
      r: ComponentFixture<SncrDatatableComponent>
    ) => Promise<void>
  > {
    return [assertColumnsAreFiltered];
  }
}

export const FilteringFeature = new FilteringFeatureSpec();
