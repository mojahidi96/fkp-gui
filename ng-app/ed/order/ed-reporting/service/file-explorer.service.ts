import {Injectable} from '@angular/core';
import {FileElement} from '../file-explorer/model/file-element';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs';

export interface IFileService {
  add(fileElement: FileElement);

  delete(elementId: string, parentId: string, location: string);

  queryInFolder(folderId: string): Observable<FileElement[]>;

  get(id: string): FileElement;
}

@Injectable()
export class FileService implements IFileService {
  private map = new Map<string, FileElement>();
  private querySubject: BehaviorSubject<FileElement[]>;

  constructor(private http: HttpClient) {}

  add(fileElement: FileElement) {
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  delete(elementId: string, parentId: string, location: string): Promise<any> {
    return this.http
      .delete(
        '/ed/rest/drive/delete?id=' +
          encodeURIComponent(elementId) +
          '&parentId=' +
          encodeURIComponent(parentId) +
          '&location=' +
          encodeURIComponent(location) +
          '&t=' +
          new Date().getTime()
      )
      .toPromise();
  }

  clear() {
    this.map.clear();
  }

  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parentId === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  retrieveDir(parentId: string): Promise<any> {
    return this.http
      .get(
        '/ed/rest/drive/details/' +
          encodeURIComponent(parentId) +
          '?t=' +
          new Date().getTime()
      )
      .toPromise();
  }

  createDir(
    parentId: string,
    folderPath: string,
    folderName: string
  ): Promise<any> {
    return this.http
      .post(
        '/ed/rest/drive/create?parentId=' +
          encodeURIComponent(parentId) +
          '&folderPath=' +
          encodeURIComponent(folderPath) +
          '&folderName=' +
          encodeURIComponent(folderName) +
          '&t=' +
          new Date().getTime(),
        null
      )
      .toPromise();
  }

  downloadFile(filePath: string, fileName: string): Promise<any> {
    return this.http
      .get(
        '/ed/rest/drive/download?filePath=' +
          encodeURIComponent(filePath) +
          '&fileName=' +
          encodeURIComponent(fileName) +
          '&t=' +
          new Date().getTime(),
        {responseType: 'blob'}
      )
      .toPromise();
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }

  uploadChanges(obj: any, parentId: string, uploadPath: string): Promise<any> {
    return this.http
      .post(
        '/ed/rest/drive/upload?parentId=' +
          encodeURIComponent(parentId) +
          '&uploadPath=' +
          encodeURIComponent(uploadPath) +
          '&t=' +
          new Date().getTime(),
        obj
      )
      .toPromise();
  }

  rename(
    elementId: string,
    parentId: string,
    folderPath: string,
    currentFolderName: string,
    newFolderName: string
  ): Promise<any> {
    return this.http
      .put(
        '/ed/rest/drive/sec/rename?id=' +
          encodeURIComponent(elementId) +
          '&parentId=' +
          encodeURIComponent(parentId) +
          '&currentFolderName=' +
          encodeURIComponent(currentFolderName) +
          '&folderPath=' +
          encodeURIComponent(folderPath) +
          '&newFolderName=' +
          encodeURIComponent(newFolderName) +
          '&t=' +
          new Date().getTime(),
        {}
      )
      .toPromise();
  }

  move(
    elementId: string,
    newParentId: string,
    currentPath: string,
    newPath: string
  ): Promise<any> {
    return this.http
      .put(
        '/ed/rest/drive/sec/move?id=' +
          encodeURIComponent(elementId) +
          '&newParentId=' +
          encodeURIComponent(newParentId) +
          '&currentPath=' +
          encodeURIComponent(currentPath) +
          '&newPath=' +
          encodeURIComponent(newPath) +
          '&t=' +
          new Date().getTime(),
        {}
      )
      .toPromise();
  }

  getShops(): Promise<any> {
    return this.http
      .get('/ed/rest/edshop/shoplist?t=' + new Date().getTime())
      .toPromise();
  }

  setSelectedShopToSession(shopDto): Promise<any> {
    return this.http
      .post(
        '/ed/rest/drive/setShopId?shopId=' +
          shopDto.shopId +
          '&t=' +
          new Date().getTime(),
        {}
      )
      .toPromise();
  }

  checkSpecialCharacters(elementName, regexText) {
    let regex = new RegExp(regexText, 'g');
    return (
      elementName.match(regex) ||
      (elementName.toUpperCase().includes('SELECT') &&
        elementName.toUpperCase().includes('FROM')) ||
      elementName.toUpperCase().includes('DATABASE') ||
      elementName.toUpperCase().startsWith('SELECT') ||
      elementName.toUpperCase().startsWith('FROM') ||
      elementName.toUpperCase().startsWith('TABLE') ||
      elementName.toUpperCase().startsWith('INSERT') ||
      elementName.toUpperCase().startsWith('UPDATE') ||
      elementName.toUpperCase().startsWith('DELETE')
    );
  }
}
