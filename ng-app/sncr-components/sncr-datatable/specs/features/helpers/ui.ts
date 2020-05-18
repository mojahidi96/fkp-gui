import {ComponentFixture} from '@angular/core/testing';

import {SncrDatatableComponent} from '../../../sncr-datatable.component';

import {
  Filter,
  And,
  Or,
  Not,
  IsEmpty,
  Equals,
  Contains,
  GreaterThan,
  GreaterThanOrEquals,
  LessThan,
  LessThanOrEquals
} from './filter';
import {TypeHelper, getTypeHelper} from './type';

// selectors

const SELECTOR_QUICK_FILTER_INPUT = 'input';
const SELECTOR_QUICK_FILTER_RESET = '.reset-group .fa-times';

const SELECTOR_SELECT_YEAR = 'select[aria-label="Select year"]';
const SELECTOR_SELECT_MONTH = 'select[aria-label="Select month"]';
const SELECTOR_BUTTON_BY_DATE = (year, month, day) =>
  `div[aria-label="${day}-${month}-${year}"]`;

const SELECTOR_OPEN_ADVANCED_FILTER_BUTTON =
  'span[popoverclass="advanced-filter-popover"]';
const SELECTOR_ADVANCED_FILTER_PANEL_BY_ID = panelId => `[id="${panelId}"]`;
const SELECTOR_ADVANCED_FILTER_SELECT_COMPARATOR1 = 'select#comparator1';
const SELECTOR_ADVANCED_FILTER_SELECT_COMPARATOR2 = 'select#comparator2';
const SELECTOR_ADVANCED_FILTER_INPUT_VALUE1 = 'input#filter1';
const SELECTOR_ADVANCED_FILTER_INPUT_VALUE2 = 'input#filter2';
const SELECTOR_ADVANCED_FILTER_CONDITION_AND_LABEL = `div[name="logicalOperation"] label:nth-of-type(1)`;
const SELECTOR_ADVANCED_FILTER_CONDITION_OR_LABEL = `div[name="logicalOperation"] label:nth-of-type(2)`;
const SELECTOR_ADVANCED_FILTER_SUBMIT = 'button[type="submit"]';
const SELECTOR_ADVANCED_FILTER_RESET = 'button[type="button"]';

// classes

abstract class FilterHelper<T> {
  abstract applyQuickFilter(
    fixture: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement,
    filter: Filter<T>
  ): Promise<void>;

  abstract applyAdvancedFilter(
    fixture: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement,
    filter: Filter<T>
  ): Promise<void>;

  abstract resetQuickFilter(
    fixture: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement
  ): Promise<void>;

  abstract resetAdvancedFilter(
    fixture: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement
  ): Promise<void>;
}

class DefaultFilterHelper<T> extends FilterHelper<T> {
  constructor(readonly typeHelper: TypeHelper<T>) {
    super();
  }

  async applyQuickFilter(
    fixture: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement,
    filter: Filter<T>
  ): Promise<void> {
    if (columnType === 'date') {
      await this.applyDateQuickFilterValue(
        columnHeaderEl,
        ((filter as any) as Contains<number>).value
      );
    } else {
      await this.applyQuickFilterValue(
        columnHeaderEl,
        this.typeHelper.toString((filter as Contains<T>).value)
      );
    }

    await fixture.whenStable();
  }

  private async applyDateQuickFilterValue(
    columnHeaderEl: HTMLElement,
    dateValue: number
  ): Promise<void> {
    const quickFilterInput = columnHeaderEl.querySelector(
      SELECTOR_QUICK_FILTER_INPUT
    );

    await this.applyDateValue(quickFilterInput, dateValue);
  }

  private async applyDateValue(
    dateInputEl: HTMLInputElement,
    dateValue: number
  ): Promise<void> {
    const dateInputParentEl = dateInputEl.parentElement;

    const date = new Date(dateValue);
    const year = date.getUTCFullYear().toString();
    const month = (date.getUTCMonth() + 1).toString();
    const day = date.getUTCDate().toString();

    // open date picker
    dateInputEl.click();

    // select year
    const yearSelectEl = dateInputParentEl.querySelector<HTMLSelectElement>(
      SELECTOR_SELECT_YEAR
    );

    // year selection is limited to +/- 10 years of previous selection
    while (Math.abs(Number(yearSelectEl.value) - Number(year)) > 10) {
      const nextYearToSelect =
        Number(year) > Number(yearSelectEl.value)
          ? Number(yearSelectEl.value) + 10
          : Number(yearSelectEl.value) - 10;
      yearSelectEl.value = nextYearToSelect.toString();
      yearSelectEl.dispatchEvent(new Event('change'));
    }

    yearSelectEl.value = year;
    yearSelectEl.dispatchEvent(new Event('change'));

    // select month
    const monthSelectEl = dateInputParentEl.querySelector<HTMLSelectElement>(
      SELECTOR_SELECT_MONTH
    );
    monthSelectEl.value = month;
    monthSelectEl.dispatchEvent(new Event('change'));

    // select day
    const dayButtonEl = dateInputParentEl.querySelector<HTMLButtonElement>(
      SELECTOR_BUTTON_BY_DATE(year, month, day)
    );
    dayButtonEl.click();
  }

  private async applyQuickFilterValue(
    columnHeaderEl: HTMLElement,
    filterValue: string
  ): Promise<void> {
    const quickFilterInputEl = columnHeaderEl.querySelector(
      SELECTOR_QUICK_FILTER_INPUT
    );

    quickFilterInputEl.value = filterValue;
    quickFilterInputEl.dispatchEvent(new Event('input', {bubbles: true}));
  }

  async applyAdvancedFilter(
    fixture: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement,
    filter: Filter<T>
  ): Promise<void> {
    const advancedFilterButtonEl = columnHeaderEl.querySelector<
      HTMLSpanElement
    >(SELECTOR_OPEN_ADVANCED_FILTER_BUTTON);

    // open advanced filter panel
    advancedFilterButtonEl.click();
    await fixture.whenStable();

    const advancedFilterPanelId = advancedFilterButtonEl.getAttribute(
      'aria-describedby'
    );

    const panelEls = fixture.nativeElement.parentElement.querySelectorAll(
      SELECTOR_ADVANCED_FILTER_PANEL_BY_ID(advancedFilterPanelId)
    );
    const advancedFilterPanelEl = panelEls[panelEls.length - 1];

    const firstFilter =
      filter instanceof And || filter instanceof Or
        ? filter.filters[0]
        : filter;
    const secondFilter =
      filter instanceof And || filter instanceof Or
        ? filter.filters[1]
        : undefined;

    // first filter
    const firstAction = this.filterToActions(firstFilter);
    const firstComparatorSelectEl = advancedFilterPanelEl.querySelector(
      SELECTOR_ADVANCED_FILTER_SELECT_COMPARATOR1
    ) as HTMLSelectElement;
    firstComparatorSelectEl.value = firstAction.comparator;
    firstComparatorSelectEl.dispatchEvent(new Event('change'));

    await fixture.whenStable();

    if (firstAction.value !== null) {
      const firstValueInputEl = advancedFilterPanelEl.querySelector(
        SELECTOR_ADVANCED_FILTER_INPUT_VALUE1
      ) as HTMLInputElement;

      if (columnType === 'date') {
        await this.applyDateValue(firstValueInputEl, firstAction.value);
        await fixture.whenStable();
      } else {
        firstValueInputEl.value = firstAction.value;
        firstValueInputEl.dispatchEvent(new Event('input', {bubbles: true}));
      }
    }

    // select logical condition
    const conditionAndLabelEl = advancedFilterPanelEl.querySelector(
      SELECTOR_ADVANCED_FILTER_CONDITION_AND_LABEL
    ) as HTMLLabelElement;
    const conditionOrLabelEl = advancedFilterPanelEl.querySelector(
      SELECTOR_ADVANCED_FILTER_CONDITION_OR_LABEL
    ) as HTMLLabelElement;

    const conditionAndAlreadySelected = conditionAndLabelEl.classList.contains(
      'active'
    );
    const conditionOrAlreadySelected = conditionOrLabelEl.classList.contains(
      'active'
    );

    if (filter instanceof And) {
      if (!conditionAndAlreadySelected) {
        conditionAndLabelEl.click();
      }
    } else if (filter instanceof Or) {
      if (!conditionOrAlreadySelected) {
        conditionOrLabelEl.click();
      }
    } else {
      if (conditionAndAlreadySelected) {
        conditionAndLabelEl.click();
      } else if (conditionOrAlreadySelected) {
        conditionOrLabelEl.click();
      }
    }

    await fixture.whenStable();

    // second filter
    if (secondFilter !== undefined) {
      const secondAction = this.filterToActions(secondFilter);
      const secondComparatorSelectEl = advancedFilterPanelEl.querySelector(
        SELECTOR_ADVANCED_FILTER_SELECT_COMPARATOR2
      ) as HTMLSelectElement;
      secondComparatorSelectEl.value = secondAction.comparator;
      secondComparatorSelectEl.dispatchEvent(new Event('change'));

      await fixture.whenStable();

      if (secondAction.value !== null) {
        const secondValueInputEl = advancedFilterPanelEl.querySelector(
          SELECTOR_ADVANCED_FILTER_INPUT_VALUE2
        ) as HTMLInputElement;

        if (columnType === 'date') {
          await this.applyDateValue(secondValueInputEl, secondAction.value);
          await fixture.whenStable();
        } else {
          secondValueInputEl.value = secondAction.value;
          secondValueInputEl.dispatchEvent(new Event('input', {bubbles: true}));
        }
      }
    }

    // submit filter
    (advancedFilterPanelEl.querySelector(
      SELECTOR_ADVANCED_FILTER_SUBMIT
    ) as HTMLButtonElement).click();

    // filter changes in the UI are picked up with a slight delay on purpose,
    // so we need to use same timing here
    // in the contains case the UI behaves in the same manner as quick filter
    await fixture.whenStable();
  }

  private filterToActions(filter) {
    let comparatorParts = [];
    let value = null;

    if (filter instanceof Not) {
      comparatorParts.push('N');
      filter = filter.filter;
    }

    if (filter instanceof IsEmpty) {
      comparatorParts.push('E');
    } else if (filter instanceof Equals) {
      comparatorParts.push('EQ');
      value = filter.value;
    } else if (filter instanceof Contains) {
      comparatorParts.push('INC');
      value = filter.value;
    } else if (filter instanceof GreaterThan) {
      comparatorParts.push('GT');
      value = filter.value;
    } else if (filter instanceof GreaterThanOrEquals) {
      comparatorParts.push('GTE');
      value = filter.value;
    } else if (filter instanceof LessThan) {
      comparatorParts.push('LT');
      value = filter.value;
    } else if (filter instanceof LessThanOrEquals) {
      comparatorParts.push('LTE');
      value = filter.value;
    }

    const comparator = comparatorParts.join('');

    return {comparator, value};
  }

  async resetQuickFilter(
    fixture: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement
  ): Promise<void> {
    const filterResetButtonEl = columnHeaderEl.querySelector<HTMLButtonElement>(
      SELECTOR_QUICK_FILTER_RESET
    );

    filterResetButtonEl.click();

    // filter changes in the UI are picked up with a slight delay on purpose,
    // so we need to use same timing here
    await fixture.whenStable();
  }

  async resetAdvancedFilter(
    fixture: ComponentFixture<SncrDatatableComponent>,
    columnType: string,
    columnHeaderEl: HTMLElement
  ): Promise<void> {
    const advancedFilterButtonEl = columnHeaderEl.querySelector<
      HTMLButtonElement
    >(SELECTOR_OPEN_ADVANCED_FILTER_BUTTON);

    // open advanced filter panel
    advancedFilterButtonEl.click();
    await fixture.whenStable();

    const advancedFilterPanelId = advancedFilterButtonEl.getAttribute(
      'aria-describedby'
    );

    const panelEls = fixture.nativeElement.parentElement.querySelectorAll(
      SELECTOR_ADVANCED_FILTER_PANEL_BY_ID(advancedFilterPanelId)
    );
    const advancedFilterPanelEl = panelEls[panelEls.length - 1];

    // reset filter
    (advancedFilterPanelEl.querySelector(
      SELECTOR_ADVANCED_FILTER_RESET
    ) as HTMLButtonElement).click();

    await fixture.whenStable();
  }
}

const FILTER_HELPERS = {
  boolean: new DefaultFilterHelper(getTypeHelper('boolean')),
  date: new DefaultFilterHelper(getTypeHelper('date')),
  number: new DefaultFilterHelper(getTypeHelper('number')),
  text: new DefaultFilterHelper(getTypeHelper('text'))
};

export const getFilterHelper = <T>(type: string): FilterHelper<T> =>
  FILTER_HELPERS[type];
