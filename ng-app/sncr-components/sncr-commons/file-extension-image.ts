import {Subscription} from 'rxjs';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

export enum FileExtensionImage {
    doc = 'doc.gif',
    docx = 'doc.gif',
    pdf = 'pdf.gif',
    ppt = 'ppt.gif',
    txt = 'txt.gif',
    xls = 'xls.gif',
    xlsx = 'xls.gif',
    xml = 'xml.png',
    default = 'default.png',
}
export enum FileStatus {
    Pending,
    Success,
    Error,
    Progress
}
export class FileObject {
    public file: any;
    public status: FileStatus = FileStatus.Pending;
    public progress = 0;
    public request: Subscription = null;
    public response: HttpResponse<any> | HttpErrorResponse = null;

    constructor(file: any) {
        this.file = file;
    }
}