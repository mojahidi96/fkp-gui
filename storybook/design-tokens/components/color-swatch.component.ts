import {Component, Input} from '@angular/core';

@Component({
  selector: 'color-swatch',
  templateUrl: 'color-swatch.component.html',
  styleUrls: ['color-swatch.component.scss']
})
export class ColorSwatchComponent {
  @Input() variableName: string;
  @Input() colorCode: string;

  get displayName() {
    return this.variableName
      .replace('color-', '')
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
  }
}
