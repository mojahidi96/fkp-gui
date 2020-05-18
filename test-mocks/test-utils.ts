export class TestUtils {

  static getWithSelector(el, selectors: string[]) {
    if (!el || !el.querySelector) {
      throw Error('[TestUtils] A native element must be passed as first argument');
    }
    return selectors.map(s => el.querySelector(s));
  }
}