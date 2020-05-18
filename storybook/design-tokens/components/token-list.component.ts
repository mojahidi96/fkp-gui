import {Component, Input} from '@angular/core';

@Component({
  selector: 'token-list',
  templateUrl: 'token-list.component.html',
  styleUrls: ['token-list.component.scss']
})
export class TokenListComponent {
  @Input() tokens: Array<Token>;
}
