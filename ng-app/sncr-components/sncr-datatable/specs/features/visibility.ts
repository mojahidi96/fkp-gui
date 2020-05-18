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

const SELECTOR_COLUMN_HEADER_TITLES = '.ui-datatable-thead .ui-column-title';

const SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE =
  '.column-selection .dropdown-toggle';
const SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_TEXT =
  '.column-selection .dropdown-itemTxt';
const SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM = '.dropdown-item';
const SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_FIRST =
  '.sortArrows .fa-angle-double-up';
const SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_UP = '.sortArrows .fa-angle-up';
const SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_DOWN = '.sortArrows .fa-angle-down';
const SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_LAST =
  '.sortArrows .fa-angle-double-down';

// commands

abstract class VisibilityCommand extends AsyncDatatableCommand {
  constructor(readonly title: string) {
    super();
  }

  canColumnMoveUp(m: Readonly<DatatableModel>): boolean {
    const column = this.getModelColumn(m, this.title);
    const firstColumnIndex = m.selectionMode !== undefined ? 1 : 0;

    return m.columns.indexOf(column) > firstColumnIndex;
  }

  canColumnMoveDown(m: Readonly<DatatableModel>): boolean {
    const column = this.getModelColumn(m, this.title);

    return m.columns.indexOf(column) < m.columns.length - 1;
  }
}

class ToggleColumnVisibilityCommand extends VisibilityCommand {
  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const column = this.getModelColumn(m, this.title);

    // expand dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    const viewOptionsLabelEl = [
      ...r.nativeElement.querySelectorAll(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_TEXT
      )
    ].find(el => el.textContent === this.title);

    if (column.isVisible) {
      m.ctx.log(`>> Hide column '${column.field}'`);
    } else {
      m.ctx.log(`>> Show column '${column.field}'`);
    }

    // update real
    viewOptionsLabelEl.click();

    // collapse dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    // update model
    column.isVisible = !column.isVisible;

    // reset selection if all columns are hidden
    if (m.columns.every(c => c.type !== 'selection' && !c.isVisible)) {
      m.selectedRows = [];
    }
  }
}

const moveItem = (arr, from, to) => {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
};

class MoveColumnFirstCommand extends VisibilityCommand {
  check(m: Readonly<DatatableModel>): boolean {
    return this.canColumnMoveUp(m);
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const column = this.getModelColumn(m, this.title);

    m.ctx.log(`>> Move column first '${column.field}'`);

    // expand dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    const viewOptionsMoveFirstEl = ([
      ...r.nativeElement.querySelectorAll(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_TEXT
      )
    ]
      .find(el => el.textContent === this.title)
      .closest(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM
      ) as HTMLElement).querySelector<HTMLSpanElement>(
      SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_FIRST
    );
    viewOptionsMoveFirstEl.click();

    // collapse dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    // update model
    const firstColumnIndex = m.selectionMode !== undefined ? 1 : 0;
    moveItem(m.columns, m.columns.indexOf(column), firstColumnIndex);
  }
}

class MoveColumnUpCommand extends VisibilityCommand {
  check(m: Readonly<DatatableModel>): boolean {
    return this.canColumnMoveUp(m);
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const column = this.getModelColumn(m, this.title);

    m.ctx.log(`>> Move column up '${column.field}'`);

    // expand dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    const viewOptionsMoveUpEl = ([
      ...r.nativeElement.querySelectorAll(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_TEXT
      )
    ]
      .find(el => el.textContent === this.title)
      .closest(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM
      ) as HTMLElement).querySelector<HTMLSpanElement>(
      SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_UP
    );
    viewOptionsMoveUpEl.click();

    // collapse dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    // update model
    const currentIndex = m.columns.indexOf(column);
    moveItem(m.columns, currentIndex, currentIndex - 1);
  }
}

class MoveColumnDownCommand extends VisibilityCommand {
  check(m: Readonly<DatatableModel>): boolean {
    return this.canColumnMoveDown(m);
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const column = this.getModelColumn(m, this.title);

    m.ctx.log(`>> Move column down '${column.field}'`);

    // expand dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    const viewOptionsMoveDownEl = ([
      ...r.nativeElement.querySelectorAll(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_TEXT
      )
    ]
      .find(el => el.textContent === this.title)
      .closest(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM
      ) as HTMLElement).querySelector<HTMLSpanElement>(
      SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_DOWN
    );
    viewOptionsMoveDownEl.click();

    // collapse dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    // update model
    const currentIndex = m.columns.indexOf(column);
    moveItem(m.columns, currentIndex, currentIndex + 1);
  }
}

class MoveColumnLastCommand extends VisibilityCommand {
  check(m: Readonly<DatatableModel>): boolean {
    return this.canColumnMoveDown(m);
  }

  async runBeforeAssert(
    m: DatatableModel,
    r: ComponentFixture<SncrDatatableComponent>
  ): Promise<void> {
    const column = this.getModelColumn(m, this.title);

    m.ctx.log(`>> Move column last '${column.field}'`);

    // expand dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    const viewOptionsMoveLastEl = ([
      ...r.nativeElement.querySelectorAll(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_TEXT
      )
    ]
      .find(el => el.textContent === this.title)
      .closest(
        SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM
      ) as HTMLElement).querySelector<HTMLSpanElement>(
      SELECTOR_VIEW_OPTIONS_DROPDOWN_ITEM_LAST
    );
    viewOptionsMoveLastEl.click();

    // collapse dropdown
    r.nativeElement
      .querySelector(SELECTOR_VIEW_OPTIONS_DROPDOWN_TOGGLE)
      .click();

    // update model
    moveItem(m.columns, m.columns.indexOf(column), m.columns.length);
  }
}

const assertColumnOrder = async (
  m: DatatableModel,
  r: ComponentFixture<SncrDatatableComponent>
): Promise<void> => {
  const expectedColumnOrder = m.columns
    .filter(c => c.isVisible)
    .map(c => c.title);

  const actualColumnOrder = [
    ...r.nativeElement.querySelectorAll(SELECTOR_COLUMN_HEADER_TITLES)
  ].map(el => el.textContent);

  expect(JSON.stringify(actualColumnOrder)).toBe(
    JSON.stringify(expectedColumnOrder)
  );
};

class VisibilityFeatureSpec extends AbstractFeatureSpec {
  getSupportedCommands(
    featureCtx: Readonly<FeatureContext>
  ): Array<
    fc.Arbitrary<
      fc.AsyncCommand<DatatableModel, ComponentFixture<SncrDatatableComponent>>
    >
  > {
    return featureCtx.isColumnSelectionSupported
      ? Array.prototype.concat(
          ...featureCtx.columns
            .filter(c => c.type !== 'selection')
            .map(c => {
              return [
                fc.constant(new ToggleColumnVisibilityCommand(c.title)),
                fc.constant(new MoveColumnFirstCommand(c.title)),
                fc.constant(new MoveColumnUpCommand(c.title)),
                fc.constant(new MoveColumnDownCommand(c.title)),
                fc.constant(new MoveColumnLastCommand(c.title))
              ];
            })
        )
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
    return [assertColumnOrder];
  }
}

export const VisibilityFeature = new VisibilityFeatureSpec();
