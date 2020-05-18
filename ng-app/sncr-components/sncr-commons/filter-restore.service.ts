import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';

export interface PreviousFilter {
  type: string;
  column: string;
  comparator1?: string;
  comparator2?: string;
  filter1: string;
}

export interface DatatableFilter {
  flow: string;
  filters: Array<PreviousFilter>;
}

export interface DatatableViewOptions {
  flow: string;
  pageRows: string;
}

@Injectable()
export class FilterRestoreService {

  public filters: Array<any> = [];
  public pageViewOptions: Array<DatatableViewOptions> = [];
  public selectedTemplate: any = '';
  public currentUrl: string;

  constructor(public router: Router) {
    this.currentUrl = this.router.url;
  }

  public setFilters(col, filterModel) {
    let filterExistsForFlow = false;
    if (this.filters && this.filters.length > 0) {
      this.filters.forEach((filter, index) => {
        if (filter.flow === this.currentUrl) {
          filterExistsForFlow = true;
          this.addOrUpdateExistingFilter(index, filterModel, col);
        }
        if (index === this.filters.length - 1) {
          if (!filterExistsForFlow) {
            this.filters.push(
              {
                'flow': this.currentUrl,
                'filters': [
                  filterModel
                ]

              }
            )
          }
        }
      })
    } else {
      this.filters.push(
        {
          'flow': this.currentUrl,
          'filters': [
            filterModel
          ]
        }
      )
    }
  }

  public setFlowFilters(fils) {
    let flowIndex = this.filters.findIndex(fil => {
      return fil.flow === this.currentUrl;
    });
    if (flowIndex > -1) {
      this.filters[flowIndex].filters = fils;
    } else {
      this.filters.push({
        flow: this.currentUrl,
        filters: fils
      })
    }
  }

  public getFilters(col) {
    let flowIndex = this.filters.findIndex(fil => {
      return fil.flow === this.currentUrl
    })
    if (flowIndex > -1) {
      let filterIndex = this.filters[flowIndex].filters.findIndex(prevFilter => {
        return prevFilter.column === col.field
      })
      if (filterIndex > -1) {
        return this.filters[flowIndex].filters[filterIndex]
      }
    }
  }

  public getAllFilters() {
    if (this.filters && this.filters.length > 0) {
      let flowToReturn = this.filters.find(filter => {
        return filter.flow === this.currentUrl
      });
      return flowToReturn && flowToReturn.filters;
    }
  }

  public addOrUpdateExistingFilter(index, newFilter, col) {
    let filterExists = false;
    if (this.filters[index].filters.length > 0) {
      this.filters[index].filters.forEach((existingFilter, filIndex) => {
        if (existingFilter.column === col.field) {
          filterExists = true;
          this.filters[index].filters[filIndex] = newFilter;
        }
        if (index === this.filters[index].filters.length - 1) {
          if (!filterExists) {
            this.filters[index].filters.push(newFilter);
          }
        }
      });
    } else {
      this.filters[index].filters.push(newFilter);
    }

  }

  public filterRemoved(col, removeAll: boolean): any {
    if (this.filters && this.filters.length > 0) {
      let flowIndex = this.filters.findIndex(filter => {
        return filter.flow === this.currentUrl
      });
      if (removeAll) {
        this.filters.splice(flowIndex);
      } else {
        let indexToRemove = this.filters[flowIndex].filters.findIndex(filterToRemove => {
          return filterToRemove.column === col.field;
        })
        if (indexToRemove > -1) {
          this.filters[flowIndex].filters.splice(indexToRemove);
        }
      }
    }
  }

  public setViewOption(pageRows) {
    let viewOptionExists = false;
    if (this.pageViewOptions && this.pageViewOptions.length > 0) {
      this.pageViewOptions.forEach((viewOption, index) => {
        if (viewOption.flow === this.currentUrl) {
          viewOption.pageRows = pageRows;
          viewOptionExists = true;
        }
        if ((index === this.pageViewOptions.length - 1) && !viewOptionExists) {
          this.pageViewOptions.push({
            flow: this.currentUrl,
            pageRows: pageRows
          })
        }
      })
    } else {
      this.pageViewOptions.push({
        flow: this.currentUrl,
        pageRows: pageRows
      });
    }
  }

  public viewOptionRemoved() {
    if (this.pageViewOptions && this.pageViewOptions.length > 0) {
      this.pageViewOptions = [];
    }
  }

  public getPageRows(): Observable<any> {
    if (this.pageViewOptions && this.pageViewOptions.length > 0) {
      const indexToReturn = this.pageViewOptions.findIndex(viewOption => {
        return viewOption.flow === this.currentUrl;
      })
      const viewOptionToReturn = of(this.pageViewOptions[indexToReturn].pageRows || '');
      return viewOptionToReturn;
    } else {
      return of(false);
    }
  }

  public getTemplate() {
    return this.selectedTemplate;
  }

  public setTemplate(template) {
    this.selectedTemplate = template;
  }
}