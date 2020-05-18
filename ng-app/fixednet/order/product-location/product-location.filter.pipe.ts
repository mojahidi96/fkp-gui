import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'bandWidthFilter'})
export class BandwidthFilterPipe implements PipeTransform {
  transform(data: any[], value: string): any {
    if (!value) {
      return data;
    } else {
      let bandwidthDataAr = [];
      let bandwidths = data.find((element) => {
        if (element.productName) {
          return element.productName.toString().trim().toLowerCase() === value.trim().toLowerCase();
        }
      }).bandwidths;
      if ((Object.keys(bandwidths)).length) {
        Object.keys(bandwidths).forEach((bandwidth) => {
          let bandwidthsObj = {
            'salesProdBandWidthId': '', 'salesProdBandWidth': ''
          };
          bandwidthsObj.salesProdBandWidthId = bandwidth;
          bandwidthsObj.salesProdBandWidth = bandwidths[bandwidth];
          bandwidthDataAr.push(bandwidthsObj);
        });
        if (bandwidthDataAr && bandwidthDataAr.length) {
          bandwidthDataAr = this.sortBasedOnSalesBw(bandwidthDataAr);
        }
      }
      return bandwidthDataAr;
    }
  }

  sortBasedOnSalesBw(data: Array<any>): Array<any> {
    let stringReg = /[A-Za-z]/g;
    let numberReg = /^[\d]+$/;
    return data.sort((a, b) => {
      let aIsString = stringReg.test(a.salesProdBandWidth);
      let bIsString = stringReg.test(b.salesProdBandWidth);
      let aIsNumeric = numberReg.test(a.salesProdBandWidth);
      let bIsNumeric = numberReg.test(b.salesProdBandWidth);
      if (aIsString && bIsString) {
        let textA = a.salesProdBandWidth.toUpperCase();
        let textB = b.salesProdBandWidth.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      } else if (aIsNumeric && bIsNumeric) {
        return parseInt(a.salesProdBandWidth, 10) - parseInt(b.salesProdBandWidth, 10);
      } else if (aIsString && bIsNumeric) {
        return -1;
      } else if (aIsNumeric && bIsString) {
        return 1;
      } else if (aIsString || aIsNumeric) {
        return -1;
      } else if (bIsString || bIsNumeric) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });
  }
}