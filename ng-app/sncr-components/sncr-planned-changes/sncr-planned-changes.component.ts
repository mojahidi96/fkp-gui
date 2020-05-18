import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {PlannedChange, PlannedChangesService, SocChange} from './planned-change';
import {CurrencyPipe} from '@angular/common';
import { Language, TranslationService } from 'angular-l10n';

@Component({
  selector: 'sncr-planned-changes',
  templateUrl: 'sncr-planned-changes.component.html',
  styleUrls: ['sncr-planned-changes.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class SncrPlannedChangesComponent implements OnInit, OnDestroy {

  @ViewChild('wrapper') wrapper: ElementRef;

  @Output() review = new EventEmitter();

  @Input() buttonLabel = 'Weiter zur Bestellübersicht';
  @Input() plannedChangesService: PlannedChangesService;
  @Input() loading = false;
  @Input() cssClass = 'max-window-height';
  @Input() disableOnceClicked = false;
  @Language() lang;
  plannedChanges: EventEmitter<PlannedChange[]>;

  revertChangesLabel = 'Änderung verwerfen';

  currentBundletype = 'Monatlicher Basispreis';


  oneTimeCharge = 'Einrichtungspreis';

  oneTimeChargeLabel = 'Einrichtungspreis\u00B9';

  constructor(private currencyPipe: CurrencyPipe, private translation: TranslationService) {

  }

  ngOnInit(): void {
    this.plannedChanges = this.plannedChangesService.plannedChangesEvent;
  }

  ngOnDestroy(): void {
    this.plannedChangesService.clear();
  }

  reset(soc: SocChange) {
    this.plannedChangesService.socRemoveEvent.emit(soc.value);
  }

  getSocPrice(soc: SocChange): string {
    return `${this.currencyPipe.transform(soc.price, 'EUR')} ${
      (soc.frequency === this.currentBundletype) ? this.translation.translate('SOC_SELECTION-BUNDLE_TYPE') :
        (soc.frequency === this.oneTimeCharge) ? this.oneTimeChargeLabel : soc.frequency
      }`;
  }
}
