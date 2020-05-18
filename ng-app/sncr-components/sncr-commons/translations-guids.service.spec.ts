import {TranslationsGuidsService} from './translations-guids.service';

const service = new TranslationsGuidsService();
const guids = {
  'sub-update-info': '6550b532-28bb-747b-e053-1505100a8fdc',
  'ban-update-info': '6550d990-ebec-6099-e053-2076a8c03bae',
  'data-report-page': '69160c0b-961c-04c1-e053-1405100acb85'
};

test('returns a list of guids based on a list of features', () => {
  const result = service.getGuids(...Object.keys(guids)),
    expected = Object.keys(guids).map(k => guids[k]);
  expect(result).toEqual(expected);
});

test('returns true or false indicating if a feature has translations enabled' , () => {
  expect(service.isTranslationEnabled('/mobile/subscriberUpdateInfo')).toBeTruthy();
  expect(service.isTranslationEnabled('/mobile/anotherFeature')).toBeFalsy();
});