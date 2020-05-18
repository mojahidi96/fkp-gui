import {FilterService} from './filter.service';
import {Filter} from './filter';

const filterService = new FilterService();

test('should return true for empty text value', () => {
  const res = filterService.calculate('E', '', null);
  expect(res).toBeTruthy()
});

test('should return true for null text value', () => {
  const res = filterService.calculate('E', null, null);
  expect(res).toBeTruthy()
});

test('should return true for undefined text value', () => {
  const res = filterService.calculate('E', undefined, null);
  expect(res).toBeTruthy()
});

test('should return true for 0 date value', () => {
  let filterVal: Filter = {comparator1: 'E', type: 'date', filter1: null};
  const res = filterService.filter('0', filterVal);
  expect(res).toBeTruthy()
});