import * as fc from 'fast-check';

import {ComponentFixture} from '@angular/core/testing';

import {SncrDatatableComponent} from '../../sncr-datatable.component';

import {Filter} from './helpers/filter';

const SELECTOR_COLUMN_HEADER_TITLES = '.ui-datatable-thead .ui-column-title';

export interface Context {
  log(message?: any, ...optionalParams: any[]): void;
}

export class Column {
  field: string;
  title: string;
  isFilterable: boolean;
  filter: Filter<any> | undefined;
  isVisible: boolean;
  isSortable: boolean;
  sorting: 'ASC' | 'DESC' | undefined;
  type: 'boolean' | 'date' | 'number' | 'text' | 'selection';
}

export class DatatableModel {
  seedStream: fc.Stream<number>;

  ctx: Context;

  isColumnSelectionSupported: boolean;
  isLazyLoadMode: boolean;

  columns: Column[];
  rows: any[];

  selectionMode: 'SINGLE' | 'MULTI' | undefined;
  selectedRows: any[];

  numberOfRows: number;
  totalNumberOfRows: number;

  currentPage: number;
  numberOfRowsPerPage: number;
  supportedAssertions: any;

  numberOfPages(): number {
    return Math.max(1, Math.ceil(this.numberOfRows / this.numberOfRowsPerPage));
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.numberOfPages();
  }

  async assertAll(r: ComponentFixture<SncrDatatableComponent>): Promise<void> {
    for (let i = 0; i < this.supportedAssertions.length; i++) {
      await this.supportedAssertions[i](this, r);
    }
  }
}

export class FeatureContext {
  columns: Column[];
  selectionMode: 'SINGLE' | 'MULTI' | undefined;
  isColumnSelectionSupported: boolean;
}

export abstract class AbstractFeatureSpec {
  abstract getSupportedCommands(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    fc.Arbitrary<
      fc.AsyncCommand<DatatableModel, ComponentFixture<SncrDatatableComponent>>
    >
  >;

  abstract getSupportedAssertions(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    (
      m: DatatableModel,
      r: ComponentFixture<SncrDatatableComponent>
    ) => Promise<void>
  >;
}

export abstract class AsyncDatatableCommand
  implements
    fc.AsyncCommand<DatatableModel, ComponentFixture<SncrDatatableComponent>> {
  check(m: Readonly<DatatableModel>): boolean {
    return true;
  }

  async run(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    await this.runBeforeAssert(m, r);

    // TODO: consider to remove r.whenStable() at the end of this.runBeforeAssert() methods
    await r.whenStable();

    await m.assertAll(r);
  }

  abstract runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void>;

  toString(): string {
    return this.constructor.name;
  }

  // common helpers
  getModelColumn(m: DatatableModel, title: string): Column {
    return m.columns.find(c => c.title === title);
  }

  async getColumnHeaderEl(
    r: ComponentFixture<SncrDatatableComponent>,
    title: string
  ): Promise<HTMLElement> {
    return [
      ...r.nativeElement.querySelectorAll(SELECTOR_COLUMN_HEADER_TITLES)
    ].find(el => el.textContent === title).parentElement;
  }
}
