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

const SELECTOR_SELECT_ALL_BUTTON =
  '.ui-datatable-thead th.col-select-all button .fa.fa-check';
const SELECTOR_DESELECT_ALL_BUTTON =
  '.ui-datatable-thead th.col-select-all button .fa.fa-remove';
const SELECTOR_ROW_DATA =
  '.ui-datatable-data > tr:not(.ui-datatable-emptymessage-row)';
const SELECTOR_ROW_CHECKBOX = 'td.col-select-all input[type="checkbox"]';
const SELECTOR_ROW_RADIO = 'td:first-of-type input[type="radio"]';

// commands

abstract class SelectionCommand extends AsyncDatatableCommand {
  check(m: Readonly<DatatableModel>): boolean {
    return (
      m.numberOfRows > 0 &&
      m.columns.some(c => c.type !== 'selection' && c.isVisible)
    );
  }
}

class SelectAllCommand extends SelectionCommand {
  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    m.ctx.log('>> Click on Select All');

    // update model
    const filteredColumns = m.columns.filter(
      c => c.isVisible && c.isFilterable && c.filter !== undefined
    );

    if (filteredColumns.length > 0) {
      // case: filter applied
      m.selectedRows = m.rows.reduce((acc, row) => {
        if (filteredColumns.every(c => c.filter.matches(row[c.field]))) {
          acc.push(row);
        }
        return acc;
      }, []);
    } else {
      // case: no filter applied
      m.selectedRows = Object.assign([], m.rows);
    }

    // update real
    r.nativeElement.querySelector(SELECTOR_SELECT_ALL_BUTTON).click();
  }
}

class DeselectAllCommand extends SelectionCommand {
  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    m.ctx.log('>> Click on Deselect All');

    // update model
    const filteredColumns = m.columns.filter(
      c => c.isVisible && c.isFilterable && c.filter !== undefined
    );

    if (filteredColumns.length > 0) {
      // case: filter applied
      m.selectedRows = m.rows.reduce((acc, row) => {
        if (
          m.selectedRows.includes(row) &&
          filteredColumns.every(c => c.filter.matches(row[c.field]))
        ) {
          acc.splice(acc.indexOf(row), 1);
        }
        return acc;
      }, Object.assign([], m.selectedRows));
    } else {
      // case: no filter applied
      m.selectedRows = [];
    }

    // update real
    r.nativeElement.querySelector(SELECTOR_DESELECT_ALL_BUTTON).click();
  }
}

class ToggleSingleSelectionCommand extends SelectionCommand {
  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const currentDisplayedRows = [
      ...r.nativeElement.querySelectorAll(SELECTOR_ROW_DATA)
    ];

    const randomDisplayedRowIndex = fc.sample(
      fc.integer(0, currentDisplayedRows.length - 1),
      {seed: m.seedStream.next().value, numRuns: 1}
    )[0];

    const rowRadioEl = (currentDisplayedRows[
      randomDisplayedRowIndex
    ] as HTMLElement).querySelector<HTMLInputElement>(SELECTOR_ROW_RADIO);

    // update real
    rowRadioEl.click();

    // update model
    const row = r.componentInstance.selection;
    m.ctx.log('>> Select row:', row);

    m.selectedRows = [row];
  }
}

class ToggleMultiSelectionCommand extends SelectionCommand {
  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const currentDisplayedRows = [
      ...r.nativeElement.querySelectorAll(SELECTOR_ROW_DATA)
    ];

    const randomDisplayedRowIndex = fc.sample(
      fc.integer(0, currentDisplayedRows.length - 1),
      {seed: m.seedStream.next().value, numRuns: 1}
    )[0];

    const rowCheckboxEl = (currentDisplayedRows[
      randomDisplayedRowIndex
    ] as HTMLElement).querySelector<HTMLInputElement>(SELECTOR_ROW_CHECKBOX);

    const isPreviousStateChecked = rowCheckboxEl.checked;

    // update real
    rowCheckboxEl.click();

    // update model
    if (isPreviousStateChecked) {
      const newDeselected = m.selectedRows.find(
        row => !r.componentInstance.selection.includes(row)
      );

      m.ctx.log('>> Deselect row:', newDeselected);
      m.selectedRows.splice(m.selectedRows.indexOf(newDeselected), 1);
    } else {
      const newSelected = r.componentInstance.selection.find(
        row => !m.selectedRows.includes(row)
      );

      m.ctx.log('>> Select row:', newSelected);
      m.selectedRows.push(newSelected);
    }
  }
}

export const SelectionCommands = selectionMode => {
  if (selectionMode === 'SINGLE') {
    return [fc.constant(new ToggleSingleSelectionCommand())];
  } else if (selectionMode === 'MULTI') {
    return [
      fc.constant(new SelectAllCommand()),
      fc.constant(new DeselectAllCommand()),
      fc.constant(new ToggleMultiSelectionCommand())
    ];
  }

  return [];
};

// assertions

const assertSingleSelection = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  if (m.isLazyLoadMode) {
    if (m.selectedRows.length === 1) {
      // TODO: test for actual content
      expect(
        Array.from(r.componentInstance.selectedMap.values()).filter(
          value => value.sel === 'Y'
        )
      ).toHaveLength(1);
    } else {
      expect(
        Array.from(r.componentInstance.selectedMap.values()).filter(
          value => value.sel === 'Y'
        )
      ).toHaveLength(0);
    }
  } else {
    if (m.selectedRows.length === 1) {
      expect(r.componentInstance.selection).toBe(m.selectedRows[0]);
    } else {
      // expect(r.componentInstance.selection).toBe(undefined);

      // TODO: fix in actual code ... this is sometimes the empty list and sometimes undefined
      if (r.componentInstance.selection !== undefined) {
        expect(r.componentInstance.selection).toHaveLength(0);
      } else {
        expect(r.componentInstance.selection).toBe(undefined);
      }
    }
  }
};

const assertMultiSelection = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  expect(r.componentInstance.selectCount).toBe(m.selectedRows.length);

  // TODO: test for the actual selected content
};

class SelectionFeatureSpec extends AbstractFeatureSpec {
  getSupportedCommands(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    fc.Arbitrary<
      fc.AsyncCommand<DatatableModel, ComponentFixture<SncrDatatableComponent>>
    >
  > {
    return featureCtx.selectionMode === 'SINGLE'
      ? [fc.constant(new ToggleSingleSelectionCommand())]
      : featureCtx.selectionMode === 'MULTI'
      ? [
          fc.constant(new SelectAllCommand()),
          fc.constant(new DeselectAllCommand()),
          fc.constant(new ToggleMultiSelectionCommand())
        ]
      : [];
  }

  getSupportedAssertions(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    (
      m: DatatableModel,
      r: ComponentFixture<SncrDatatableComponent>
    ) => Promise<void>
  > {
    return featureCtx.selectionMode === 'SINGLE'
      ? [assertSingleSelection]
      : featureCtx.selectionMode === 'MULTI'
      ? [assertMultiSelection]
      : [];
  }
}

export const SelectionFeature = new SelectionFeatureSpec();
