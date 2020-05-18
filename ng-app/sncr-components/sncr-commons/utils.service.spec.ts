import {UtilsService} from './utils.service';

test('notNull: returns whether a value passed is neither null nor undefined', () => {
  expect(UtilsService.notNull('')).toBeTruthy();
  expect(UtilsService.notNull('a')).toBeTruthy();
  expect(UtilsService.notNull(0)).toBeTruthy();
  expect(UtilsService.notNull({})).toBeTruthy();
  expect(UtilsService.notNull([])).toBeTruthy();

  expect(UtilsService.notNull(null)).toBeFalsy();
  expect(UtilsService.notNull(undefined)).toBeFalsy();
});

test('flattenArray: returns a new version of the array getting flattened', () => {
  expect(UtilsService.flattenArray([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
  expect(UtilsService.flattenArray([[1, 2], 3, 4])).toEqual([1, 2, 3, 4]);
  expect(UtilsService.flattenArray([1, 2, [3, 4]])).toEqual([1, 2, 3, 4]);
  expect(UtilsService.flattenArray(null)).toBeNull();
});

test('deepCompare: returns whether two objects are equal even if their references are not', () => {
  const obj1 = {a: 1, b: 2}, obj2 = {a: 1, b: 2};
  expect(UtilsService.deepCompare(obj1, obj2)).toBeTruthy();

  obj2.b = 3;
  expect(UtilsService.deepCompare(obj1, obj2)).toBeFalsy();
});

test('maskAllButLastFour: returns a full masked string if the length is 4 or less', () => {
  expect(UtilsService.maskAllButLastFour('abcd')).toBe('****');
  expect(UtilsService.maskAllButLastFour('ab')).toBe('**');
  expect(UtilsService.maskAllButLastFour('')).toBe('');
});

test('maskAllButLastFour: returns all characters masked but the latest 4 if the length is grater than 4', () => {
  expect(UtilsService.maskAllButLastFour('abcdefg')).toBe('***defg');
});

test('maskAllButLastFour: returns empty string if a null or undefined value is passed', () => {
  expect(UtilsService.maskAllButLastFour(null)).toBe('');
  expect(UtilsService.maskAllButLastFour(undefined)).toBe('');
});

test('toBoolean: returns true if the value is an empty string or evaluates to true in JavaScript truth table', () => {
  expect(UtilsService.toBoolean('')).toBeTruthy();
  expect(UtilsService.toBoolean([])).toBeTruthy();
  expect(UtilsService.toBoolean({})).toBeTruthy();

  expect(UtilsService.toBoolean(0)).toBeFalsy();
  expect(UtilsService.toBoolean(null)).toBeFalsy();
  expect(UtilsService.toBoolean(undefined)).toBeFalsy();
});

test('stringToBoolean: returns false if the variable evaluates to false in JavaScript truth table', () => {
  expect(UtilsService.stringToBoolean('')).toBeFalsy();
  expect(UtilsService.stringToBoolean(null)).toBeFalsy();
  expect(UtilsService.stringToBoolean(undefined)).toBeFalsy();
});

test('stringToBoolean: if the value is boolean, returns itself', () => {
  expect(UtilsService.stringToBoolean(true)).toBeTruthy();
  expect(UtilsService.stringToBoolean(false)).toBeFalsy();
});

test('stringToBoolean: returns true if the string value is true', () => {
  expect(UtilsService.stringToBoolean('true')).toBeTruthy();
  expect(UtilsService.stringToBoolean('True')).toBeTruthy();
  expect(UtilsService.stringToBoolean('TRUE')).toBeTruthy();

  expect(UtilsService.stringToBoolean('false')).toBeFalsy();
  expect(UtilsService.stringToBoolean('something')).toBeFalsy();
});

test('isEmpty: returns whether the value passed is empty or not', () => {
  const emptyValues = [undefined, null, '', [], {}];
  emptyValues.forEach(value => {
    expect(UtilsService.isEmpty(value)).toBeTruthy();
  });

  const nonEmptyValues = ['test', 0, [1, 2], {a: 1}];
  nonEmptyValues.forEach(value => {
    expect(UtilsService.isEmpty(value)).toBeFalsy();
  })
});