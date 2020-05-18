import {Component, Input} from '@angular/core';

@Component({
  selector: 'sncr-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss']
})
export class ButtonComponent {

  @Input() href: string;
  @Input() target = '_self';
  @Input() text: string;
  @Input() type = 'submit';
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Input() btnStyle = '';
}