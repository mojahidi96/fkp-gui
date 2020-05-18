import * as fc from 'fast-check';

import {ComponentFixture} from '@angular/core/testing';

import {SncrDatatableComponent} from '../../sncr-datatable.component';

import {getTypeHelper} from './helpers/type';

import {
  AbstractFeatureSpec,
  AsyncDatatableCommand,
  DatatableModel,
  FeatureContext
} from './base';

// selectors

const SELECTOR_COLUMN_HEADER_TITLES = '.ui-datatable-thead .ui-column-title';

const SELECTOR_COLUMN_HEADER_SORTABLE =
  '.ui-datatable-thead .ui-sortable-column-icon';
const SELECTOR_COLUMN_HEADER_SORTED_ASC =
  '.ui-datatable-thead .ui-sortable-column-icon.fa-sort-asc';
const SELECTOR_COLUMN_HEADER_SORTED_DESC =
  '.ui-datatable-thead .ui-sortable-column-icon.fa-sort-desc';
const SELECTOR_COLUMN_HEADER_TITLE = '.ui-column-title';
const SELECTOR_COLUMN_CELL_BY_INDEX = index0 =>
  `.ui-datatable-data > tr:not(.ui-datatable-emptymessage-row) > td:nth-of-type(${index0 +
    1})`;

// commands

class ToggleColumnSortCommand extends AsyncDatatableCommand {
  constructor(readonly title: string) {
    super();
  }

  check(m: Readonly<DatatableModel>): boolean {
    return m.columns.some(
      c => c.title === this.title && c.isVisible && c.isSortable
    );
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const column = this.getModelColumn(m, this.title);
    const columnHeaderEl = await this.getColumnHeaderEl(r, this.title);

    m.ctx.log(
      `>> Sort column '${column.field}' in ${
        column.sorting === 'ASC' ? 'DESC' : 'ASC'
      } order`
    );

    // update real
    columnHeaderEl.click();

    // update model
    m.columns.forEach(c => {
      if (c.title === this.title) {
        c.sorting = c.sorting === 'ASC' ? 'DESC' : 'ASC';
      } else {
        // reset sorting of other columns
        c.sorting = undefined;
      }
    });

    m.currentPage = 1;
  }
}

// assertions

const assertNoneOrOneColumnSorted = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  const numberOfSortedColumns = m.columns.filter(c => c.sorting !== undefined)
    .length;

  expect(numberOfSortedColumns).toBeLessThanOrEqual(1);
};

const assertColumnIsSorted = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  const column = m.columns.find(
    c =>
      c.type !== 'selection' &&
      c.isVisible &&
      c.isSortable &&
      c.sorting !== undefined
  );

  if (column === undefined) {
    // no sorted column, skip
    return;
  }

  const displayedColumnIndex = [
    ...r.nativeElement.querySelectorAll(SELECTOR_COLUMN_HEADER_TITLES)
  ]
    .map(el => el.textContent)
    .indexOf(column.title);

  const typeHelper = getTypeHelper(column.type);
  const displayedValues = [
    ...r.nativeElement.querySelectorAll(
      SELECTOR_COLUMN_CELL_BY_INDEX(displayedColumnIndex)
    )
  ].map(typeHelper.fromCellEl.bind(typeHelper));

  const expectedValues = [...displayedValues];
  expectedValues.sort(typeHelper.compare.bind(typeHelper));

  if (column.sorting === 'DESC') {
    expectedValues.reverse();
  }

  expect(JSON.stringify(displayedValues)).toEqual(
    JSON.stringify(expectedValues)
  );
};

const assertSortedColumnShowsActualSortDirection = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  const sortedColumn = m.columns.find(
    c => c.isVisible && c.isSortable && c.sorting !== undefined
  );

  if (sortedColumn) {
    if (sortedColumn.sorting === 'ASC') {
      const displayedAscSortedColumns = [
        ...r.nativeElement.querySelectorAll(SELECTOR_COLUMN_HEADER_SORTED_ASC)
      ];
      expect(displayedAscSortedColumns).toHaveLength(1);
      expect(
        displayedAscSortedColumns[0].parentElement.querySelector(
          SELECTOR_COLUMN_HEADER_TITLE
        ).textContent
      ).toEqual(sortedColumn.title);

      const displayedDescSortedColumnEls = r.nativeElement.querySelectorAll(
        SELECTOR_COLUMN_HEADER_SORTED_DESC
      );
      expect(displayedDescSortedColumnEls).toHaveLength(0);
    }

    if (sortedColumn.sorting === 'DESC') {
      const displayedDescSortedColumns = [
        ...r.nativeElement.querySelectorAll(SELECTOR_COLUMN_HEADER_SORTED_DESC)
      ];
      expect(displayedDescSortedColumns).toHaveLength(1);
      expect(
        displayedDescSortedColumns[0].parentElement.querySelector(
          SELECTOR_COLUMN_HEADER_TITLE
        ).textContent
      ).toEqual(sortedColumn.title);

      const displayedAscSortedColumnEls = r.nativeElement.querySelectorAll(
        SELECTOR_COLUMN_HEADER_SORTED_ASC
      );
      expect(displayedAscSortedColumnEls).toHaveLength(0);
    }
  } else {
    const displayedAscSortedColumnEls = r.nativeElement.querySelectorAll(
      SELECTOR_COLUMN_HEADER_SORTED_ASC
    );
    expect(displayedAscSortedColumnEls).toHaveLength(0);

    const displayedDescSortedColumnEls = r.nativeElement.querySelectorAll(
      SELECTOR_COLUMN_HEADER_SORTED_DESC
    );
    expect(displayedDescSortedColumnEls).toHaveLength(0);
  }
};

const assertSortableColumnsShowSortDirection = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  const sortableColumnTitles = m.columns
    .filter(c => c.isVisible && c.isSortable)
    .map(c => c.title);

  const displayedSortableColumnTitles = [
    ...r.nativeElement.querySelectorAll(SELECTOR_COLUMN_HEADER_SORTABLE)
  ].map(
    el =>
      el.parentElement.querySelector(SELECTOR_COLUMN_HEADER_TITLE).textContent
  );

  expect(displayedSortableColumnTitles).toHaveLength(
    sortableColumnTitles.length
  );
};

class SortingFeatureSpec extends AbstractFeatureSpec {
  getSupportedCommands(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    fc.Arbitrary<
      fc.AsyncCommand<DatatableModel, ComponentFixture<SncrDatatableComponent>>
    >
  > {
    return featureCtx.columns
      .filter(c => c.isSortable)
      .map(c => fc.constant(new ToggleColumnSortCommand(c.title)));
  }

  getSupportedAssertions(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    (
      m: DatatableModel,
      r: ComponentFixture<SncrDatatableComponent>
    ) => Promise<void>
  > {
    return [
      assertNoneOrOneColumnSorted,
      assertColumnIsSorted,
      assertSortableColumnsShowSortDirection,
      assertSortedColumnShowsActualSortDirection
    ];
  }
}

export const SortingFeature = new SortingFeatureSpec();
