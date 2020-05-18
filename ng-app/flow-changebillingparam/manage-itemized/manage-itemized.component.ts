import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {CONSTANTS} from '../constants';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {ManageItemizedService} from './manage-itemized.service';
import {SncrFlowSectionComponent} from '../../sncr-components/sncr-flow/sncr-flow-section.component';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'manage-itemized',
  templateUrl: 'manage-itemized.component.html',
  styleUrls: ['manage-itemized.component.scss']
})
export class ManageItemizedComponent implements OnChanges {


  @ViewChild('miniDesc') miniDesc: TemplateRef<any>;
  @ViewChild('superDesc') superDesc: TemplateRef<any>;

  constants: CONSTANTS;

  @Input() totalLength = 0;
  @Input() properties: Map<any, any>;
  @Input() showValidation: boolean;
  @Input() isChanged: boolean;
  @Input() itemizedFlow: SncrFlowSectionComponent;
  @Input() infomsg: any;

  @Output() processingEvent = new EventEmitter();

  @Input()
  get itemized() {
    return this._itemized;
  }

  @Output() itemizedChange = new EventEmitter();

  set itemized(itemized) {
    this._itemized = itemized;
    this.itemizedChange.emit(itemized);
  }

  @Input()
  get targetNumber() {
    return this._targetNumber;
  }

  @Output() targetNumberChange = new EventEmitter();

  set targetNumber(targetNumber) {
    this._targetNumber = targetNumber;
    this.targetNumberChange.emit(targetNumber);
  }

  infoDescSingle = 'Teilnehmern hat bereits diese Einstellung';
  infoDescMultiple = 'Teilnehmern haben bereits diese Einstellung';
  showText = 'Beschreibung einblenden';
  hideText = 'Beschreibung ausblenden';
  itemizedOptions = [];
  targetNumberOptions = [];

  private _itemized: any;
  private _targetNumber: any;
  loading = false;
  alertNotify: NotificationHandlerService = new NotificationHandlerService();
  private superScript = '\u00B9Den Preis entnehmen Sie bitte ihren Rahmenvertragskonditionen.';
  private defaultItemized: any;
  private defaultTargetNumber: any;
  private processing = false;
  private hasChanged = false;
  private reviewConfigId = '698eb8c1-0f98-6997-e053-1505100a66a9';


  constructor(private manageItemizedService: ManageItemizedService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalLength'] || changes['isChanged']) {
      this.alertNotify.clearNotification();
      this.constants = new CONSTANTS;
      if (this.itemizedOptions.length === 0) {
        this.itemizedOptions = [
          {
            text: 'Kein Einzelverbindungsnachweis', value: 'N', length: 0, infoDesc: ''
          },
          {
            text: 'Einzelverbindungsnachweis Mini',
            description: this.miniDesc,
            value: 'M',
            length: 0,
            infoDesc: ''
          },
          {
            text: 'Einzelverbindungsnachweis Super\u00B9',
            description: this.superDesc,
            value: 'S',
            length: 0,
            infoDesc: ''
          }
        ];
        this.targetNumberOptions = [
          {
            text: 'Ja',
            description: 'Alle Zielrufnummern auf dem Einzelverbindungsnachweis werden zum Schutz der Privatsphäre um die ' +
            'letzten drei Ziffern verkürzt ausgewiesen, z. B. 0172 123 123 xxx.',
            value: 'Y',
            length: 0,
            infoDesc: ''
          },
          {
            text: 'Nein',
            description: 'Alle Zielrufnummern auf dem Einzelverbindungsnachweis werden vollständig ausgewiesen.',
            value: 'N',
            length: 0,
            infoDesc: ''
          }
        ];
      } else {
        this.itemizedOptions.forEach(obj => obj.length = 0);
        this.targetNumberOptions.forEach(obj => obj.length = 0);
      }

      this.defaultItemized = null;
      this.defaultTargetNumber = null;
      this.loading = true;
      this.manageItemizedService.getManageItemizedData().pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.displayCountOnPageLoad(response);
          this.infoDescription();
          this.defaultSelection();
        }, () => {
          this.alertNotify.printErrorNotification(this.constants.technicalErrorText);
        });
    }
  }

  reviewOrder() {
    if (this.totalLength) {
      let editedRows = [];
      editedRows.push(this.getItemizedRequest(this.constants.CONST_CALL_DETAIL_TYPE_ID,
        this.itemized));
      editedRows.push(this.getItemizedRequest(this.constants.CONST_NUMBER_DIGIT_MASKED_ID,
        this.targetNumber));

      // persist the options selected by the user
      if (((UtilsService.notNull(this.itemized) && this.itemized !== this.defaultItemized)
        || (UtilsService.notNull(this.targetNumber) && this.targetNumber !== this.defaultTargetNumber))) {
        this.setProcessing(true);
        this.manageItemizedService.persistManageItemizedData(editedRows)
          .subscribe(() => {
            this.manageItemizedService.getCountForAffectedSubscribers(this.reviewConfigId)
              .pipe(finalize(() => this.setProcessing(false)))
              .subscribe((countResp) => {
                if (countResp) {
                  this.alertNotify.clearNotification();
                  this.hasChanged = !this.hasChanged;
                  this.itemizedFlow.model.isChanged = this.hasChanged;
                  this.itemizedFlow.next(this.itemizedFlow.model);
                } else {
                  this.setNoItemizedSelectionErrorMsg();
                }
              }, () => {
                this.alertNotify.printErrorNotification(this.constants.technicalErrorText);
              });

          }, () => {
            this.alertNotify.printErrorNotification(this.constants.technicalErrorText);
          });
      } else {
        this.setNoItemizedSelectionErrorMsg();
      }
    }
  }

  displayCountOnPageLoad(response) {
    if (response && JSON.stringify(response) !== '{}') {
      if (response.itemized && JSON.stringify(response.itemized) !== '{}') {
        Object.keys(response.itemized).forEach(key => {
          if (key) {
            this.itemizedOptions[this.constants.itOptionsIndex[key]].length = response.itemized[key];
          }
        });
      }

      if (response.targetNumber && JSON.stringify(response.targetNumber) !== '{}') {
        Object.keys(response.targetNumber).forEach(key => {
          if (key) {
            this.targetNumberOptions[this.constants.tnOptionsIndex[key]].length = response.targetNumber[key];
          }
        });
      }
    }
  }

  infoDescription() {
    this.itemizedOptions.forEach(element => {
      element.infoDesc = element.length === 1 ? this.infoDescSingle : this.infoDescMultiple;
    });
    this.targetNumberOptions.forEach(element => {
      element.infoDesc = element.length === 1 ? this.infoDescSingle : this.infoDescMultiple;
    });
  }


  defaultSelection() {
    this.defaultItemized = this.getDefaultObjVal(this.itemizedOptions);
    this.defaultTargetNumber = this.getDefaultObjVal(this.targetNumberOptions);
    setTimeout(() => {
      this.itemized = this.defaultItemized;
      if (this.itemized === 'N') {
        this.targetNumber = null;
      } else {
        this.targetNumber = this.defaultTargetNumber;
      }
    });
  }

  getDefaultObjVal(options) {
    let defaultObj = options.find(o => (o.length === this.totalLength && this.totalLength !== 0 && o.value !== 'none'));
    if (UtilsService.notNull(defaultObj)) {
      return defaultObj.value;
    }
    return null;
  }

  getItemizedRequest(id, newValue) {
    return {id, newValue};
  }

  setNoItemizedSelectionErrorMsg() {
    this.alertNotify.printErrorNotification(`<b>Entschuldigung, leider ist ein Fehler aufgetreten</b><p></p>
            <p>Es wurden keine Änderungen durchgeführt.</p>`);
  }

  setProcessing(processing: boolean) {
    this.processing = processing;
    this.processingEvent.emit(processing);
  }
}
