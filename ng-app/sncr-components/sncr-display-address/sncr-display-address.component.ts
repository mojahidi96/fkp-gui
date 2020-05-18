import { Component, Input } from '@angular/core';
import { Address } from './sncr-display-address.model'

@Component({
  selector: 'sncr-display-address',
  templateUrl: 'sncr-display-address.component.html'
})

export class SncrDisplayAddressComponent {
  @Input() showDetails = true;
  @Input() address: Address;
}
