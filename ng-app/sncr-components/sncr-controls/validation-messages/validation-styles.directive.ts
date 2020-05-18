import {Directive, ElementRef, Input, OnChanges} from '@angular/core';

/**
 * This class is meant to be used only internally by other form components.
 *
 * It adds and removes different classes to highlight validation errors on the fields.
 */
@Directive({selector: '[sncrValidationStyles]'})
export class ValidationStylesDirective implements OnChanges {
  /**
   * Whether the classes should be swapped or not depending on the validation errors.
   */
  @Input() sncrValidationStyles: boolean;

  private container;

  /**
   * @internal
   */
  constructor(private el: ElementRef) {
  }

  ngOnChanges() {
    if (!this.container) {
      this.container = this.el.nativeElement;
    }

    this.switchClass('has-danger', this.sncrValidationStyles);
    this.switchClass('form-control-danger', this.sncrValidationStyles, ['input', 'select', 'textarea']);
  }

  private switchClass(className: string, add: boolean, queries?: string[]) {
    const element = queries ? this.executeQuery(queries) : this.container;
    element.classList[add ? 'add' : 'remove'](className);
  }

  private executeQuery(queries: string[]) {
    let element;

    for (let i = 0; i < queries.length && !element; i++) {
      element = this.container.querySelector(queries[i]);
    }

    return element;
  }
}