import {Component, Input} from '@angular/core';

@Component({
  selector: 'color-swatch-group',
  templateUrl: 'color-swatch-group.component.html',
  styleUrls: ['color-swatch-group.component.scss']
})
export class ColorSwatchGroupComponent {
  @Input() name: string;

  get displayName() {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
}
