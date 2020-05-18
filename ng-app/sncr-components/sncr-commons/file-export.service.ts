import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const CSV_TYPE = 'text/csv;charset=utf-8;';

@Injectable()
export class FileExportService {

  constructor() { }

  public exportAsExcelFile(json: any[], fileName: string, dataSheetName = 'data'): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    let workbook = XLSX.utils.book_new();
    workbook.SheetNames.push(dataSheetName);
    workbook.Sheets[dataSheetName] = worksheet;
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '.xlsx');
  }

  public exportAsCSVFile(data: any, fileName: string): void {
    let csvData = this.convertToCSV(data);
    let blob = new Blob([csvData], { type: CSV_TYPE });
    let url = window.URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName + '.csv');
    } else {
      let a = document.createElement('a');
      a.href = url;
      a.download = fileName + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

  convertToCSV(objArray) {
    let array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    array.forEach( item => {
      let line = '';
      Object.keys(item).forEach( key => {
        if (line !== '') {
          line += ',';
        }
        line += item[key];
      });
      str += line + '\r\n';
    });
    return str;
  }
}