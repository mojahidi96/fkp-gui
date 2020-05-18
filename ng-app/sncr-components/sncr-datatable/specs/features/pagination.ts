import * as fc from 'fast-check';

import {ComponentFixture} from '@angular/core/testing';

import {SncrDatatableComponent} from '../../sncr-datatable.component';

import {
  AbstractFeatureSpec,
  AsyncDatatableCommand,
  DatatableModel,
  FeatureContext
} from './base';

// selectors

const SELECTOR_ROW_DATA =
  '.ui-datatable-data > tr:not(.ui-datatable-emptymessage-row)';
const SELECTOR_PREVIOUS_PAGE = '.ui-paginator-prev';
const SELECTOR_NEXT_PAGE = '.ui-paginator-next';
const SELECTOR_PAGE_BUTTONS = '.ui-datatable-footer .ui-paginator-page';
const SELECTOR_CURRENT_PAGE =
  '.ui-datatable-footer .ui-paginator-page.ui-state-active';
const SELECTOR_NUMBER_OF_ROWS_PER_PAGE_SELECT =
  '.ui-datatable-header .ui-paginator select';

// commands

abstract class PaginationCommand extends AsyncDatatableCommand {
  check(m: Readonly<DatatableModel>): boolean {
    return (
      m.numberOfRows > 0 &&
      m.columns.some(c => c.type !== 'selection' && c.isVisible)
    );
  }

  async clickPageButton(
    r: ComponentFixture<SncrDatatableComponent>,
    pageNumber: number
  ): Promise<void> {
    const pageButtons = [
      ...r.nativeElement.querySelectorAll(SELECTOR_PAGE_BUTTONS)
    ];
    const matchedPageButtons = pageButtons.filter(
      el => el.textContent.trim() === pageNumber.toString()
    );

    expect(matchedPageButtons).toHaveLength(1);
    const pageButtonToSelect = matchedPageButtons[0];

    pageButtonToSelect.click();
  }
}

class PreviousPageCommand extends PaginationCommand {
  check(m: Readonly<DatatableModel>): boolean {
    return super.check(m) && m.hasPreviousPage();
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    m.ctx.log('>> Click on Previous Page');

    r.nativeElement.querySelector(SELECTOR_PREVIOUS_PAGE).click();

    --m.currentPage;
  }
}

class NextPageCommand extends PaginationCommand {
  check(m: Readonly<DatatableModel>): boolean {
    return super.check(m) && m.hasNextPage();
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    m.ctx.log('>> Click on Next Page');

    r.nativeElement.querySelector(SELECTOR_NEXT_PAGE).click();

    ++m.currentPage;
  }
}

class FirstPageCommand extends PaginationCommand {
  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    m.ctx.log('>> Click on First Page');

    const pageToSelect = 1;

    await this.clickPageButton(r, pageToSelect);

    m.currentPage = pageToSelect;
  }
}

class LastPageCommand extends PaginationCommand {
  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    m.ctx.log('>> Click on Last Page');

    const pageToSelect = m.numberOfPages();

    await this.clickPageButton(r, pageToSelect);

    m.currentPage = pageToSelect;
  }
}

class RelativePageCommand extends PaginationCommand {
  constructor(readonly relative: number) {
    super();
  }

  check(m: Readonly<DatatableModel>): boolean {
    const pageToSelect = m.currentPage + this.relative;

    // explicitly exclude first and last page as these are covered by their own commands
    return (
      super.check(m) && pageToSelect > 1 && pageToSelect < m.numberOfPages()
    );
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const pageToSelect = m.currentPage + this.relative;

    m.ctx.log(`>> Click on Page ${pageToSelect}`);

    await this.clickPageButton(r, pageToSelect);

    m.currentPage = pageToSelect;
  }
}

class SelectNumberOfRowsPerPageCommand extends PaginationCommand {
  constructor(readonly numberOfRowsPerPage: number) {
    super();
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    m.ctx.log(`>> Select Number of Rows per Page: ${this.numberOfRowsPerPage}`);

    // update real
    const rowsPerPageSelectEl = r.nativeElement.querySelector(
      SELECTOR_NUMBER_OF_ROWS_PER_PAGE_SELECT
    ) as HTMLSelectElement;
    rowsPerPageSelectEl.value = this.numberOfRowsPerPage.toString();
    rowsPerPageSelectEl.dispatchEvent(new Event('change'));

    // update model
    const currentFirstRow = (m.currentPage - 1) * m.numberOfRowsPerPage + 1;
    const newPage = Math.ceil(currentFirstRow / this.numberOfRowsPerPage);

    m.numberOfRowsPerPage = this.numberOfRowsPerPage;
    m.currentPage = newPage;
  }
}

export const PaginationCommands = () => [
  fc.constant(new PreviousPageCommand()),
  fc.constant(new NextPageCommand()),
  fc.constant(new RelativePageCommand(-2)),
  fc.constant(new RelativePageCommand(-1)),
  fc.constant(new RelativePageCommand(0)),
  fc.constant(new RelativePageCommand(1)),
  fc.constant(new RelativePageCommand(2)),
  fc.constant(new FirstPageCommand()),
  fc.constant(new LastPageCommand()),
  fc.constant(new SelectNumberOfRowsPerPageCommand(5)),
  fc.constant(new SelectNumberOfRowsPerPageCommand(10)),
  fc.constant(new SelectNumberOfRowsPerPageCommand(20)),
  fc.constant(new SelectNumberOfRowsPerPageCommand(40)),
  fc.constant(new SelectNumberOfRowsPerPageCommand(80))
];

// assertions

const assertNumberOfCurrentDisplayedRows = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  const isSomeColumnVisible = m.columns
    .filter(c => c.type !== 'selection')
    .some(c => c.isVisible);

  if (!isSomeColumnVisible) {
    // TODO: improve to test for real component in this case
    return;
  }

  const remainderRows = m.numberOfRows % m.numberOfRowsPerPage;
  const expectedCurrentDisplayedRows =
    m.currentPage === m.numberOfPages()
      ? remainderRows === 0 && m.numberOfRows > 0
        ? m.numberOfRowsPerPage
        : remainderRows
      : m.numberOfRowsPerPage;

  const currentDisplayedRows = r.nativeElement.querySelectorAll(
    SELECTOR_ROW_DATA
  );

  expect(currentDisplayedRows).toHaveLength(expectedCurrentDisplayedRows);
};

const assertCurrentPage = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  // model assertions
  // assert current page is within expected boundaries
  expect(m.currentPage).toBeGreaterThanOrEqual(1);
  expect(m.currentPage).toBeLessThanOrEqual(m.numberOfPages());

  // real assertions
  // assert exactly one current page
  const displayedCurrentPages = [
    ...r.nativeElement.querySelectorAll(SELECTOR_CURRENT_PAGE)
  ];
  expect(displayedCurrentPages).toHaveLength(1);

  // assert visible current page is same as in model
  const displayedCurrentPage = displayedCurrentPages[0];
  const displayedCurrentPageText = displayedCurrentPage.textContent.trim();
  expect(displayedCurrentPageText).toBe(m.currentPage.toString());
};

const assertNumberOfRowsPerPage = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  // model assertions
  // assert current number of rows per page is one of the supported values
  expect([5, 10, 20, 40, 80].includes(m.numberOfRowsPerPage)).toBe(true);

  // real assertions
  const rowsPerPageSelectEl = r.nativeElement.querySelector(
    SELECTOR_NUMBER_OF_ROWS_PER_PAGE_SELECT
  ) as HTMLSelectElement;
  expect(rowsPerPageSelectEl.value).toBe(m.numberOfRowsPerPage.toString());
};

class PaginationFeatureSpec extends AbstractFeatureSpec {
  getSupportedCommands(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    fc.Arbitrary<
      fc.AsyncCommand<DatatableModel, ComponentFixture<SncrDatatableComponent>>
    >
  > {
    return [
      fc.constant(new PreviousPageCommand()),
      fc.constant(new NextPageCommand()),
      fc.constant(new RelativePageCommand(-2)),
      fc.constant(new RelativePageCommand(-1)),
      fc.constant(new RelativePageCommand(0)),
      fc.constant(new RelativePageCommand(1)),
      fc.constant(new RelativePageCommand(2)),
      fc.constant(new FirstPageCommand()),
      fc.constant(new LastPageCommand()),
      fc.constant(new SelectNumberOfRowsPerPageCommand(5)),
      fc.constant(new SelectNumberOfRowsPerPageCommand(10)),
      fc.constant(new SelectNumberOfRowsPerPageCommand(20)),
      fc.constant(new SelectNumberOfRowsPerPageCommand(40)),
      fc.constant(new SelectNumberOfRowsPerPageCommand(80))
    ];
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
      assertCurrentPage,
      assertNumberOfCurrentDisplayedRows,
      assertNumberOfRowsPerPage
    ];
  }
}

export const PaginationFeature = new PaginationFeatureSpec();
