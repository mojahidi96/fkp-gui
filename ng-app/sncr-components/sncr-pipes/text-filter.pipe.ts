import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'textFilter'})
export class TextFilterPipe implements PipeTransform {
  transform(data: any[], value: string, limit = 10): any {

    if (value === undefined || value === null || value === '') {
      return data;
    } else {
      return data.filter((element) => {
        if (element.data) {
          return element.data.toString().trim().toLowerCase().includes(value.trim().toLowerCase());
        }
      }).slice(0, limit);
    }
  }
}