import {EventEmitter, Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';
import * as jsep from 'jsep';
import {Field} from './panel';

@Injectable()
export class DynamicSharedService {

  public formChanged = new EventEmitter<FormGroup>();
  public allForms: FormGroup[];

  expressionCheck(panelForms: FormGroup | FormGroup[], exp: any): boolean {
    if (exp === true || exp === false) {
      return exp;
    }

    if (!UtilsService.notNull(exp) || exp.trim() === '') {
      return false;
    }

    if (!(panelForms instanceof Array)) {
      panelForms = [panelForms];
    }

    const fieldIdentifier = 'fieldId(';
    let i = exp.indexOf(fieldIdentifier);
    while (i !== -1) {
      i += fieldIdentifier.length;
      const end = exp.indexOf(')', i);
      const fieldName = exp.substr(i, end - i);
      let value = null;

      value = this.getValue(panelForms, fieldName);

      if (value === null && this.allForms) {
        value = this.getValue(this.allForms, fieldName);
      }

      exp = exp.replace(/fieldId\(.*?\)/, value);
      i = exp.indexOf(fieldIdentifier);
    }
    exp = exp.replace(/"/g, '\'');
    let parsedTree;
    try {
      parsedTree = this.parseTree(jsep(exp));
    } catch (e) {
      console.error('Error in expression', exp, e);
    }
    return parsedTree;
  }

  shouldFieldShow(panelForm: FormGroup | FormGroup[], field: Field) {
    return (!field.hidden && !field.show) ||
      (field.hidden && !this.expressionCheck(panelForm, field.hidden)) ||
      (field.show && this.expressionCheck(panelForm, field.show));
  }

  private parseTree(tree: any): boolean {
    let left = tree.left.type === 'Literal' ? tree.left.value : this.parseTree(tree.left),
      right = tree.right.type === 'Literal' ? tree.right.value : this.parseTree(tree.right);

    if (left === 'true' || left === 'false') {
      left = UtilsService.stringToBoolean(left);
    }

    if (right === 'true' || right === 'false') {
      right = UtilsService.stringToBoolean(right);
    }

    switch (tree.operator) {
      case '==':
      case '===':
        return left === right;
      case '!=':
      case '!==':
        return left !== right;
      case '&&':
        return left && right;
      case '||':
        return left || right;
      default:
        return false;
    }
  }

  private getValue(formGroups: FormGroup[], fieldName: string) {
    let value = null;

    formGroups.some(panelForm => {
      const field = panelForm.controls[fieldName];
      if (field !== undefined) {
        value = field.value;
        if (value === '' || (value !== true && value !== false && isNaN(value))) {
          value = `'${value}'`;
        }
        return true;
      }
    });

    return value;
  }
}
