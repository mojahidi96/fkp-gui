import {TextFilterPipe} from './text-filter.pipe';

const pipe = new TextFilterPipe();
const data = [
  {data: 'Text1'},
  {data: 'Text2'},
  {data: 'Data1'},
  {data: 'Extra'},
  {data: 'Extra'},
  {data: 'Extra'},
  {data: 'Extra'},
  {data: 'Extra'},
  {data: 'Extra'},
  {data: 'Extra'},
  {data: 'Extra'},
  {text: 'Text3'}
];

test('returns same list if no filter is provided', () => {
  expect(pipe.transform(data, undefined)).toBe(data);
  expect(pipe.transform(data, null)).toBe(data);
  expect(pipe.transform(data, '')).toBe(data);
});

test('returns a filtered list', () => {
  expect(pipe.transform(data, '1')).toEqual([data[0], data[2]]);
  expect(pipe.transform(data, 'data')).toEqual([data[2]]);
  expect(pipe.transform(data, 'nothing matches')).toHaveLength(0);
});

test('elements not matching the object shape will be ignored', () => {
  const result = pipe.transform(data, 'text');
  expect(result).toHaveLength(2);
  expect(result).not.toContain(data[11]);
});

test('returns the first 10 elements by default', () => {
  expect(pipe.transform(data, 't')).toEqual(data.slice(0, 10));
});

test('returns the first number of elements provided as parameter', () => {
  expect(pipe.transform(data, 't', 3)).toEqual(data.slice(0, 3));
});