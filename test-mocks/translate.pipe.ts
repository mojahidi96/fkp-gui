import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
  static getTransformSpy() {
    return jest.spyOn(TranslatePipe.prototype, 'transform');
  }

  transform(value: any, ...args: any[]): any {
    return value;
  }
}