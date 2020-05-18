import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {SncrDatatableComponent} from '../sncr-datatable.component';
import {By} from '@angular/platform-browser';

export default class Utils {
  static *counterWithPrefix(prefix: string) {
    let i = 1;
    while (true) {
      yield `${prefix} ${i++}`;
    }
  }

  static *numberCounter() {
    let i = 1;
    while (true) {
      yield i++;
    }
  }

  static *dateGenerator() {
    // Returns random utc timestamps for ± 1 year from today
    const today = new Date();
    while (true) {
      yield Date.UTC(today.getFullYear(), today.getMonth(), today.getDay()) +
        Math.round(
          (Math.random() > 0.5 ? Math.random() : -Math.random()) * 365
        ) *
          86400000;
    }
  }

  static getGenerator(col) {
    switch (col.type) {
      case 'date':
        return Utils.dateGenerator();
      case 'number':
        return Utils.numberCounter();
      default:
        return Utils.counterWithPrefix(col.title);
    }
  }

  static generateValueForCols(cols?, counter = 100) {
    cols = cols || Utils.getCols();
    let value = [];
    let valueGenerators = cols.map(col => Utils.getGenerator(col));
    for (let i = 0; i < counter; i++) {
      let row = {};
      for (let j = 0; j < cols.length; j++) {
        if (!cols[j].nullable || i % 5 !== 0) {
          row[cols[j].field] = valueGenerators[j].next().value;
        }
      }
      value.push(row);
    }
    return value;
  }

  static createHostComponent(
    props: Partial<SncrDatatableComponent>
  ): ComponentFixture<SncrDatatableComponent> {
    const fixture = TestBed.createComponent(SncrDatatableComponent);
    if (!props.cols) {
      props.cols = Utils.getCols();
    }
    if (!props.lazy && !props.value) {
      props.value = Utils.generateValueForCols(props.cols);
    }

    Object.assign(fixture.componentInstance, props);

    fixture.autoDetectChanges();

    return fixture;
  }

  static getCols() {
    return [
      {
        field: 'givenName',
        type: 'text',
        title: 'Given Name',
        show: true
      },
      {
        field: 'middleName',
        type: 'text',
        title: 'Middle Name',
        show: true,
        nullable: true
      },
      {
        field: 'surname',
        type: 'text',
        title: 'Surname',
        show: true
      },
      {
        field: 'birthday',
        type: 'date',
        title: 'Birthday',
        show: true
      },
      {
        field: 'age',
        type: 'number',
        title: 'Age',
        show: true
      },
      {
        field: 'hidden',
        type: 'text',
        title: 'Hidden',
        show: false
      }
    ];
  }

  static isSortedArray(array, ascending = true) {
    let sorted = true;

    for (let i = 0; i < array.length - 1; i++) {
      sorted = ascending ? array[i] <= array[i + 1] : array[i] >= array[i + 1];
      if (!sorted) {
        break;
      }
    }
    return sorted;
  }

  static normalizeDate(dateString) {
    return dateString
      .split('.')
      .reverse()
      .join('-');
  }

  static getSortFnct(sortField, sortOrder) {
    return function(a, b) {
      let result =
        a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
      return result * sortOrder;
    };
  }

  static getPages(totalRecords, selectedPage, pageSize = 10) {
    let pages = [];
    let numberOfPages = Math.ceil(totalRecords / pageSize);

    // eg. [ '1', '2', '3', '4', '5', '6', '7', '8' ], [ '1', '2', '3', '4', '5', '6', '7'], [ '1', '2', '3', '4', '5']...
    if (numberOfPages < 8) {
      pages = Array(numberOfPages)
        .fill(0)
        .map((e, i) => i + 1);
    } else {
      // eg. [ '1', '2', '3', '4', '5', '6', '7', '...', '100' ]
      if (selectedPage < 5) {
        pages = Array(7)
          .fill(0)
          .map((e, j) => j + 1);
        pages.push(numberOfPages);
      } else if (selectedPage > numberOfPages - 4) {
        // eg. [ '1', '...', '93', '94', '95', '96', '97', '98', '99', '100' ]
        pages = [1];
        for (let k = 6; k >= 0; k--) {
          pages.push(numberOfPages - k);
        }
      } else {
        // eg. [ '1', '...', '53', '54', '55', '56', '57', '...', '100' ]
        pages = [1];
        for (let h = -2; h <= 2; h++) {
          pages.push(selectedPage + h);
        }
        pages.push(numberOfPages);
      }
    }

    return pages.map(e => e.toString());
  }

  static clickElement(
    fixture: ComponentFixture<any>,
    selector: string,
    event?: string
  ) {
    const element = fixture.debugElement.query(By.css(selector)).nativeElement;
    element.click();
    if (event) {
      element.dispatchEvent(new Event(event));
    }
  }

  static getDataTableServiceSpies(datatableService) {
    const getDataFn = jest.spyOn(datatableService, 'getData'),
      updateOnSelectAllFn = jest.spyOn(
        datatableService,
        'updateOnSelectDeselectAll'
      );

    return {getDataFn, updateOnSelectAllFn};
  }

  static getFilterInputByIndex(fixture, columnIndex) {
    return fixture.debugElement.query(
      By.css(`table > thead > tr > th:nth-child(${columnIndex}) input`)
    ).nativeElement;
  }

  static clickFilterInput(fixture, columnIndex) {
    this.getFilterInputByIndex(fixture, columnIndex).click();
  }

  static pickDate(fixture, dateFilter) {
    let dateParts = dateFilter
      .split('.')
      .map(part => (part[0] === '0' ? part[1] : part));

    const yearSelect = fixture.debugElement.query(
      By.css('select[aria-label="Select year"]')
    ).nativeElement;
    yearSelect.value = dateParts[2];
    yearSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const monthSelect = fixture.debugElement.query(
      By.css('select[aria-label="Select month"]')
    ).nativeElement;
    monthSelect.value = dateParts[1];
    monthSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css(`div[aria-label="${dateParts.join('-')}"]`))
      .nativeElement.click();
    fixture.detectChanges();
  }

  static getColumnHeader(fixture, index) {
    return fixture.debugElement.query(
      By.css(`table > thead > tr > th:nth-child(${index})`)
    ).nativeElement;
  }

  static getColumnContent(fixture, index) {
    return fixture.debugElement
      .queryAll(By.css(`table > tbody > tr > td:nth-child(${index})`))
      .map(el => el.nativeElement.textContent.trim());
  }

  static getFilterInputEl(fixture, index) {
    return fixture.debugElement.query(
      By.css(`table thead th:nth-child(${index}) input`)
    ).nativeElement;
  }

  static enterQckFilterValue(fixture, value, index = 1) {
    const filterInputEl = Utils.getFilterInputEl(fixture, index);
    filterInputEl.value = value;
    filterInputEl.dispatchEvent(new Event('input', {bubbles: true}));
  }

  static toUTCTimeStamp(dateString) {
    const dateParts = dateString
      .split('.')
      .map(part => (part[0] === '0' ? part[1] : part))
      .map(part => parseInt(part, 10));
    return Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]);
  }

  static clickAdFilterIcon(fixture, columnIndex) {
    fixture.debugElement
      .query(
        By.css(
          `table > thead > tr > th:nth-child(${columnIndex}) sncr-advanced-filter span[popoverclass="advanced-filter-popover"]`
        )
      )
      .nativeElement.click();
    fixture.detectChanges();
  }

  static getAdFilterPopupConfig(fixture) {
    const select = fixture.debugElement.query(
      By.css('ngb-popover-window select')
    );

    return {
      defaultValue: select.nativeElement.value,
      options: select.queryAll(By.css('option')).map(o => o.nativeElement.value)
    };
  }

  static selectAdComparator(fixture, value, index = 1) {
    const comparatorId = `comparator${index}`;
    const select = fixture.debugElement.query(
      By.css(`ngb-popover-window select#${comparatorId}`)
    ).nativeElement;
    select.value = value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  static getAdFilterInput(fixture, index = 1) {
    const filterId = `filter${index}`;

    return fixture.debugElement.query(
      By.css(`ngb-popover-window input#${filterId}`)
    ).nativeElement;
  }

  static enterAdFilterValue(fixture, value, index = 1) {
    const input = this.getAdFilterInput(fixture, index);
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    fixture.detectChanges();
  }

  static clickAdFilterInput(fixture, index = 1) {
    const input = this.getAdFilterInput(fixture, index);
    input.click();
    fixture.detectChanges();
  }

  static submitAdFilter(fixture) {
    fixture.debugElement
      .query(By.css('ngb-popover-window button[type="submit"]'))
      .nativeElement.click();
    fixture.detectChanges();
  }

  static resetAdFilter(fixture) {
    fixture.debugElement
      .query(By.css('ngb-popover-window button[type="button"]'))
      .nativeElement.click();
    fixture.detectChanges();
  }

  static clickAdFilterLogicalOperation(fixture, logicalOperation) {
    fixture.debugElement
      .query(
        By.css(
          `ngb-popover-window div[name="logicalOperation"] label:nth-child(${logicalOperation})`
        )
      )
      .nativeElement.click();
    fixture.detectChanges();
  }

  static openViewOptions(fixture) {
    fixture.debugElement
      .query(By.css('sncr-multi-select'))
      .nativeElement.click();
  }

  static getColumnHeaders(fixture) {
    return fixture.debugElement
      .queryAll(By.css('table > thead > tr > th'))
      .map(el => el.nativeElement.textContent.trim());
  }

  static getViewOptions(fixture) {
    return fixture.debugElement
      .queryAll(By.css('sncr-multi-select sncr-checkbox'))
      .map(del => {
        return {
          checked: del.query(By.css('input')).nativeElement.checked,
          label: del.query(By.css('.content')).nativeElement.textContent.trim()
        };
      });
  }

  static clickViewOptionElement(fixture, selector) {
    fixture.debugElement.query(By.css(selector)).nativeElement.click();
  }

  static toggleViewOption(fixture, index) {
    const selector = `sncr-multi-select .dropdown-item:nth-child(${index}) label`;
    Utils.clickViewOptionElement(fixture, selector);
  }

  static clickMoveViewOption(fixture, index, cssClass) {
    const selector = `sncr-multi-select .dropdown-item:nth-child(${index}) .sortArrows ${cssClass}`;
    Utils.clickViewOptionElement(fixture, selector);
  }

  static swapArrayElement(array, index1, index2) {
    let el1 = array[index1];
    array[index1] = array[index2];
    array[index2] = el1;
  }

  static moveArrayElement(array, index, option) {
    switch (option) {
      case 'down':
        Utils.swapArrayElement(array, index, index + 1);
        break;
      case 'up':
        Utils.swapArrayElement(array, index - 1, index);
        break;
      case 'first':
        array.unshift(array.splice(index, 1)[0]);
        break;
      case 'last':
        array.push(array.splice(index, 1)[0]);
        break;
    }
  }
}
