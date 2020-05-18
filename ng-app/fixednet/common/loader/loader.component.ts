import {Component, Input} from '@angular/core';


@Component({
  selector: 'load-data',
  templateUrl: 'loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  @Input() loading: boolean;

  @Input() message: string;


}