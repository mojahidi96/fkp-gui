import {DynamicSharedService} from './dynamic-shared.service';
import {FormBuilder} from '@angular/forms';

const formBuilder = new FormBuilder();
const service = new DynamicSharedService();
const panelForm = formBuilder.group({
  44: false, 55: true, 66: 'test'
});

test('Should return true', () => {
  const exp = 'fieldId(44) != true';
  const res = service.expressionCheck(panelForm, exp);
  expect(res).toBeTruthy();
});

test('should return false', () => {
  const exp = 'fieldId(55) != true';
  const res = service.expressionCheck(panelForm, exp);
  expect(res).toBeFalsy();
});

test('complex expression', () => {
  const exp = '(fieldId(44) == true || fieldId(55) == false) || (fieldId(44) == false && fieldId(66) == \'test\')';
  const res = service.expressionCheck(panelForm, exp);
  expect(res).toBeTruthy();
});

test('should return false if no expression provided', () => {
  let res = service.expressionCheck(panelForm, undefined);
  expect(res).toBeFalsy();

  res = service.expressionCheck(panelForm, '');
  expect(res).toBeFalsy();
});