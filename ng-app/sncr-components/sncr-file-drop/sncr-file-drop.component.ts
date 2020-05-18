import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FileExportService} from '../sncr-commons/file-export.service';
import {SncrFileDropService} from './sncr-file-drop.service';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';


@Component({
  selector: 'sncr-file-drop',
  templateUrl: 'sncr-file-drop.html',
  styleUrls: ['sncr-file-drop.scss']
})
export class SncrFileDropComponent {
  /* filetype supported XLSX and csv*/
  @Input() fileType = 'XLSX';
  @Input() uploadUrl: string;
  @Input() fileName = 'data';
  /* local to be overridden with prefix*/
  @Input() localePrefix = '';
  /* display success and erro messages*/
  @Input() disableMessage = false;
  /* If response to be handled in Parent Component */
  @Input() uploadResult = false;

  @Output() response = new EventEmitter();

  uploadResp = {eligibleSubs: [], ineligibleSubs: []};
  uploading = false;
  fileError: any;
  loading = false;
  files: any[] = [];

  constructor(private fileExportService: FileExportService,
              private fileDropService: SncrFileDropService) {
  }

  processDrop(files: NgxFileDropEntry[]) {
    this.loading = true;
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        // Here you can access the real file
        this.parseFileEntry(fileEntry)
          .then((f: File) => {
            this.processFile(f);
          })
          .catch(err => {
            this.response.emit(err);
          });
      }
    }
  }

  parseFileEntry(fileEntry) {
    return new Promise((resolve, reject) => {
      try {
        fileEntry.file(
          file => {
            resolve(file);
          });
      } catch (err) {
        reject(err);
      }
    });
  }


  processFileUpload(event, files) {
    this.resetUpload();
    this.loading = true;
    if (files && files.length) {
      const file: File = files[0];
      const fileExt = '.' + this.fileType.toLowerCase();
      if (!file.name.endsWith(fileExt)) {
        this.fileError = this.localePrefix + 'WRONG_FILE_FORMAT';
        this.loading = false;
        this.response.emit(this.fileError);
      } else {
        this.processFile(file);
      }
    }
  }

  private processFile(file: File) {
    let fd = new FormData();
    fd.append('fileimport', file);
    fd.append('fileName', file.name);
    fd.append('reupload', 'false');
    this.fileDropService.uploadSubscriber(fd, this.uploadUrl)
      .then(res => {
        if (res) {
          this.response.emit(res);
          this.uploadResp = res;
        } else {
          throw new Error();
        }
      })
      .catch(err => {
        this.response.emit(err);
        this.fileError = this.localePrefix + 'UPLOAD_CHANGES-ERROR_INFO';
      })
      .finally(() => this.loading = false);
    this.resetUpload();
  }

  downloadError(): void {
    let filedata = [];
    this.uploadResp.ineligibleSubs.forEach( item => {
      filedata.push({Rufnummer: item});
    });
    if (this.fileType === 'XLSX') {
      this.fileExportService.exportAsExcelFile(filedata, this.fileName, this.fileName);
    } else {
      this.fileExportService.exportAsCSVFile(filedata, this.fileName);
    }
  }

  private resetUpload() {
    this.uploadResp = {eligibleSubs: [], ineligibleSubs: []};
    this.fileError = null;
    this.uploading = false;
  }

  hideFildrop() {
    this.uploading = !this.uploading;
    this.response.emit(this.uploading);
  }
}
