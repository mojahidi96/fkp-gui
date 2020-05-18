import {
  Component,
  EventEmitter,
  Inject,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Language} from 'angular-l10n';
import {RolesService} from '../../flow-maintainsoc/roles.service';
import {Store} from '@ngxs/store';
import {AvailableTariffs, Tariff} from './tariff';
import {TariffSelectionPlannedChanges} from './tariff-selection-planned-changes';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {TariffSelectionService} from './tariff-selection.service';
import {finalize} from 'rxjs/internal/operators';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileExportService} from '../../sncr-components/sncr-commons/file-export.service';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';

@Component({
  selector: 'tariffgrid-selection',
  templateUrl: 'tariffgrid-selection.component.html',
  styleUrls: ['tariffgrid-selection.component.scss'],
  providers: [TariffSelectionPlannedChanges]
})
export class TariffgridSelectionComponent implements OnInit, OnChanges {

  @ViewChild('ctFlowDate', {static: true}) dateColumn;
  // the state must have selectedTariff and selectedTariffGroup properties within the model.
  state: any = {};
  @Input() nextButtonLabel = 'TARIFF_SELECTION-NEXT_BUTTON';
  @Input() onlyNewTariff = false;
  @Input() selectedTariffGroup: string;
  @Input() selectedPreQuery = 'none';
  @Input() prefilled = false;
  @Input() selectedTariff?: any;
  @Input() showDateSelection = false;
  @Input() prefix = '';
  @Input() isVvlFlow = false;
  @Input() isPreQueryEligible = false;

  @Output() selectedTariffGroupChange = new EventEmitter();
  @Output() selectedTariffChange = new EventEmitter();
  @Output() nextSelection = new EventEmitter();
  @Output() selectedPreQueryChange = new EventEmitter();

  @ViewChild('tariffDataTable') tariffDataTable: SncrDatatableComponent;

  @Language() lang: string;
  enablePreQuery = false;
  constants: any;
  filteredTariffList = false;
  selectedTariffFamily: string;
  selectedTariffType: string;
  isEnterpriseUser = false;
  tariffListForEnterPrise = false;
  pleaseSelectTariff = false;
  pleaseSelectOption = false;
  hasTariffError = false;
  showTiles = true;
  isLoading = false;
  tariffList = [];
  availableTariffList = [];
  hardwareFirst = 0;
  articlesProcessed = [];
  hardwareRows = 1;
  currentTariff = [];
  subsCount = 0;
  listSelectedTariff: any;
  swapView: any;
  loadingEliSubs: boolean;
  alertForNoSubs = false;
  articlesPerPage = 6;
  radioSelectedValue?: any;
  cols?: any[];
  tariffFamilies?: string[];
  tariffTypes?: string[];
  enterpriseTariffList?: Tariff[];
  existingTariffList?: AvailableTariffs;
  disableOnceClicked = false;
  tariffDetails?: string[];
  tariffFamily?: any;
  selectedTariffDate = 'TODAY';
  isComponentLoaded = false;
  alertMessage: NotificationHandlerService;
  hidePlannedChanges = false;

  @ViewChild('price', {static: true}) tariffPrice: TemplateRef<any>;
  @ViewChild('detailsContent') detailsContent: TemplateRef<any>;

  @Input() set reload(reload: boolean) {
    if (reload) {
      delete this.selectedTariff;
      delete this.listSelectedTariff;
      if (this.isComponentLoaded) {
        this.ngOnInit();
      }
    }
  }

  constructor(public tariffSelectionPlannedChanges: TariffSelectionPlannedChanges,
              private store: Store,
              private roleService: RolesService,
              public tariffSelectionService: TariffSelectionService,
              private fileExportService: FileExportService,
              private modalService: NgbModal,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory) {
    this.alertMessage = notificationHandlerFactory();
  }

  ngOnInit(): void {
    this.alertMessage.clearNotification();
    this.showTiles = true;
    this.enterpriseTariffList = [];
    this.tariffList = [];
    this.isComponentLoaded = true;
    this.tariffSelectionPlannedChanges.plannedChangesEvent.emit([]);
    this.roleService.getUserRole().then(role => {
      this.isEnterpriseUser = role;
    });

    if (!this.selectedTariffGroup) {
      this.selectedTariffGroup = this.onlyNewTariff ? 'new' : 'none';
    }
    if (this.selectedTariffGroup !== 'none' && !this.isPreQueryEligible) {
      this.loadTariffs(true);
    } else if (this.isPreQueryEligible) {
      if (this.prefilled && this.selectedPreQuery && this.selectedPreQuery !== 'none') {
        this.enablePreQuery = true;
        this.loadTariffs(true);
      } else {
        this.getTariffPreQueryEligibility();
      }
    }
    if (this.onlyNewTariff && this.selectedTariff && this.selectedTariff.effectiveDateType) {
      this.selectedTariffDate = this.selectedTariff.effectiveDateType;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTariffGroup'] && UtilsService.isEmpty(changes['selectedTariffGroup'].currentValue)) {
      this.tariffSelectionPlannedChanges.plannedChangesEvent.emit([]);
    }
  }

  getTariffPreQueryEligibility() {
    this.isLoading = true;
    this.selectedTariffGroup = 'none';
    this.selectedPreQuery = 'none';
    this.tariffSelectionService.getTariffPreQueryEligibility()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((value: string[]) => {
              let isSimOnlyFlow = value.includes('ENABLE_ACT_SIM_ONLY');
              if (value.length === 0) {
                this.hidePlannedChanges = true;
              } else if (!isSimOnlyFlow || (value.length === 1 && isSimOnlyFlow)) {
                this.selectedPreQuery = isSimOnlyFlow ? 'ACT_SIM_ONLY' : 'ACT_SUBSIDY';
                this.onlyNewTariff = true;
                this.loadTariffs();
              } else {
                this.enablePreQuery = true;
              }
            }
        );
  }

  loadTariffs(isRadioChange?: boolean) {
    
    if (this.tariffDataTable) {
    this.tariffDataTable.resetSort();
    }
    this.alertMessage.clearNotification();
    this.pleaseSelectOption = false;
    this.hardwareFirst = 0;

    if (isRadioChange) {
      this.tariffListForEnterPrise = false;
    }
    if (!this.prefilled) {
      delete this.selectedTariff;
      delete this.listSelectedTariff;
      this.selectedTariffChange.emit(this.selectedTariff);
    }
    if (this.isPreQueryEligible) {
      this.selectedPreQueryChange.emit(this.selectedPreQuery);
    } else {
      this.selectedTariffGroupChange.emit(this.selectedTariffGroup);
    }

    if (this.isPreQueryEligible) {
      this.selectedTariffGroup = 'new';
      this.tariffList = [];
      this.enterpriseTariffList = [];
    }
    if (this.selectedTariffGroup === 'new') {
      this.selectedTariffFamily = 'choose';
      this.selectedTariffType = 'choose';
      this.tariffSelectionPlannedChanges.plannedChangesEvent.emit([]);
      if ((!this.tariffListForEnterPrise && !this.tariffList.length)
          || (this.tariffListForEnterPrise && !this.enterpriseTariffList.length)) {
        this.isLoading = true;
        this.tariffSelectionService.getAvailableTariffs(this.tariffListForEnterPrise, this.selectedPreQuery)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(value => {
                  this.bindToCarouselData(value);
                }
            );
      } else {
        const list = this.tariffListForEnterPrise ? [...this.enterpriseTariffList] : [...this.availableTariffList];

        let articlesProcessed = this.processArticles(list);
        const current = articlesProcessed[0] || [];
        let currentTariff = [...current, ...Array(this.articlesPerPage - current.length)];

        this.articlesProcessed = articlesProcessed;
        this.currentTariff = this.generateCarouselData(currentTariff);
        this.tariffList = this.tariffListForEnterPrise ? [...this.enterpriseTariffList] : [...this.availableTariffList];
        this.fixCheckedFields();
      }
    } else {
      this.hasTariffError = false;
      this.tariffSelectionService.getEligibleSubscribers('existing').subscribe(value => {
        if (value && value.tariffs && value.tariffs.length) {
          this.loadExistingTariffsToPlannedChanged(value);
        }
        this.existingTariffList = value;
      });
    }
  }

  onTariffSelection() {
    this.updateTariffDate();
    this.alertMessage.clearNotification();
    this.pleaseSelectTariff = false;
    this.alertForNoSubs = false;
    this.disableOnceClicked = false;
    this.listSelectedTariff = this.selectedTariff;
    this.selectedTariffChange.emit(this.selectedTariff);
    if (this.selectedTariff) {
      this.fixCheckedFields();
      this.loadingEliSubs = true;
      this.radioSelectedValue = this.selectedTariff;
      this.checkTariffEligible();
    }
  }

  filterTariffList() {
    const list = this.tariffListForEnterPrise ? [...this.enterpriseTariffList] : [...this.tariffList];
    // applying filter for TariffFamily
    let result = this.selectedTariffFamily === 'choose' ? list :
        list.filter(t => this.filterTariffListByParams(t.familyName, t.type));
    // applying filter for TariffType
    result = this.selectedTariffType === 'choose' ? result :
        result.filter(t => this.filterTariffListByParams(t.familyName, t.type));
    let articlesProcessed = this.processArticles(result);
    const current = articlesProcessed[0] || [];
    let currentTariff = [...current, ...Array(this.articlesPerPage - current.length)];

    this.articlesProcessed = [...articlesProcessed];
    this.currentTariff = this.generateCarouselData(currentTariff);
    if (!UtilsService.notNull(this.currentTariff)) {
      this.filteredTariffList = true;
    }
  }

  continueFromTariffSelection() {
    this.alertMessage.clearNotification();
    this.disableOnceClicked = true;
    let isContinueFromTariff = true;
    this.alertForNoSubs = this.hasTariffError;
    if (this.alertForNoSubs) {
      this.alertMessage.printErrorNotification('TARIFF_SELECTION-SELECT_TARIFF_ERR_MSG');
    }
    this.pleaseSelectOption = this.selectedTariffGroup === 'none';
    if (!this.pleaseSelectOption) {
      if (this.listSelectedTariff) {
        this.pleaseSelectTariff = (this.selectedTariffGroup === 'new' && !this.listSelectedTariff);
      } else {
        this.pleaseSelectTariff = (this.selectedTariffGroup === 'new' && !this.selectedTariff);
      }
      if (!this.pleaseSelectTariff) {
        let action = {selectedTariffGroup: this.selectedTariffGroup, nextSelection: this.nextSelection};
        if (this.selectedTariffGroup === 'new') {
          if (this.listSelectedTariff) {
            isContinueFromTariff = this.listSelectedTariff.subsCount > 0;
            action['selectedTariff'] = this.listSelectedTariff;
          } else {
            isContinueFromTariff = this.selectedTariff.subsCount > 0;
            action['selectedTariff'] = this.selectedTariff;
          }
        } else {
          action['existingTariffList'] = this.existingTariffList;
        }
        if (isContinueFromTariff) {

          const tariffId = this.selectedTariffGroup === 'new' ? this.getSelectedTariffId() : 'existing';
          this.isLoading = true;
          this.tariffSelectionService.persistTariff(tariffId, this.selectedTariffDate)
              .pipe(finalize(() => this.isLoading = false))
              .subscribe(value => {
                let selectAction = {selectedTariffGroup: this.selectedTariffGroup};
                if (this.selectedTariffGroup === 'new') {
                  selectAction['selectedTariff'] = this.selectedTariff;
                  if (value > 0) {
                    selectAction['subsQuantity'] = value;
                  }
                } else {
                  selectAction['existingTariffList'] = this.existingTariffList;
                }
                this.disableOnceClicked = false;
                this.nextSelection.emit(selectAction);
              }, error => {
                this.disableOnceClicked = false;
                console.log('error', error);
              });
        } else {
          this.disableOnceClicked = false;
        }
      } else {
        this.disableOnceClicked = false;
        this.alertMessage.printErrorNotification(this.prefix + 'TARIFF_SELECTION-SELECT_WARNING');
      }
    } else {
      this.disableOnceClicked = false;
      this.alertMessage.printErrorNotification('TARIFF_SELECTION-SELECT_OPTION_WARNING');
    }
  }

  getSelectedTariffId(): string {
    if (UtilsService.isEmpty(this.selectedTariff.value)) {
      return this.tariffList.find(tariff => tariff.tariffOption === this.selectedTariff.tariffOption).value;
    } else {
      return this.selectedTariff.value;
    }
  }

  getCount() {
    return UtilsService.flattenArray(this.articlesProcessed).length;
  }

  exportcsv(): void {
    let filedata = [];
    this.selectedTariff.inEligibleSubs.forEach( item => {
      filedata.push({Rufnummer: item});
    });
    if (this.isVvlFlow) {
      this.fileExportService.exportAsExcelFile(filedata, 'Teilnehmerdaten_' + this.selectedTariff.tariffOption, 'Teilnehmerdaten');
    } else {
      this.fileExportService.exportAsExcelFile(filedata, 'Teilnehmerdaten_' + this.selectedTariff.tariffOption);
    }
  }

  onPageChange(event) {

    const current = this.articlesProcessed[event.first] || [];
    // Trick to have always the same number of elements so flex works as a grid
    let currentTariff = [...current, ...Array(this.articlesPerPage - current.length)];
    let hardwareFirst = event.first;

    this.currentTariff = this.generateCarouselData(currentTariff);
    this.hardwareFirst = hardwareFirst;
  }

  getEligibleSubs() {
    if (this.selectedTariff) {
      return this.selectedTariff.subsCount;
    }
  }

  getExistingSubs() {
    if (this.selectedTariff) {
      return this.selectedTariff.existingSubsCount;
    }
    return 0;
  }

  getInEligibleSubs(): number {
    if (this.selectedTariff && this.selectedTariff.inEligibleSubs) {
      return this.selectedTariff.inEligibleSubs.length;
    }
    return 0;
  }

  onListTariffSelection(event?: any) {
    this.updateTariffDate();
    this.alertMessage.clearNotification();
    this.pleaseSelectTariff = false;
    this.alertForNoSubs = false;
    this.disableOnceClicked = false;
    if (event) {
      this.selectedTariff = event;
      this.listSelectedTariff = event;

      this.loadingEliSubs = true;
      this.radioSelectedValue = this.selectedTariff;
      this.checkTariffEligible();
    }
  }

  getListEligibleSubs() {
    if (this.listSelectedTariff) {
      return this.listSelectedTariff.subsCount;
    }
  }

  checkSelection(value?: any) {
    this.showTiles = value;
    if (!value) {
      this.fixCheckedFields();
    }
    this.swapView = value;
  }

  bindToCarouselData(value: any) {
    if (!this.showTiles) {
      this.tariffDataTable.resetAdvancedFilter();
      this.tariffDataTable.sortField = '';
    }
    let changes = {tariffFamilies: [], tariffTypes: [], filterTariffList: []};
    let tariffColumns = AvailableTariffs.tariffCols;
    tariffColumns[1].bodyTemplate = this.tariffPrice;
    if (this.showDateSelection) {
      tariffColumns = tariffColumns.slice(0);
      tariffColumns.splice(1, 0, {
        title: 'TARIFF_SELECTION-TARIFWECHSEL',
        field: '',
        show: true,
        sortable: false,
        filter: false,
        type: '',
        bodyTemplate: this.dateColumn
      });
    }
    if (UtilsService.notNull(value)) {
      value.forEach(t => {
        if (!changes.tariffFamilies.includes(t.familyName)) {
          changes.tariffFamilies.push(t.familyName);
        }
        if (!changes.tariffTypes.includes(t.type)) {
          changes.tariffTypes.push(t.type);
        }
      });
      if (this.tariffListForEnterPrise) {
        this.enterpriseTariffList = [...value];
      } else {
        this.availableTariffList = [...value];
      }
      let articlesProcessed = this.processArticles([...value]);

      const current = articlesProcessed[0] || [];
      let currentTariff = [...current, ...Array(this.articlesPerPage - current.length)];
      this.articlesProcessed = articlesProcessed;
      this.currentTariff = this.generateCarouselData(currentTariff);
      this.cols = tariffColumns;
      this.tariffList = [...value];
      if (this.prefilled && this.selectedTariff) {
        let subsCount = this.selectedTariff['subsCount'];
        let inEligibleSubs = this.selectedTariff['inEligibleSubs'];
        let existingSubsCount = this.selectedTariff['existingSubsCount'];
        this.selectedTariff = this.tariffList.find(t => t.tariffOption === this.selectedTariff.tariffOption);
        if (UtilsService.notNull(this.selectedTariff)) {
          this.listSelectedTariff = this.selectedTariff;
          this.selectedTariff['_sncrChecked'] = 0;
          this.selectedTariff['subsCount'] = subsCount;
          this.selectedTariff['inEligibleSubs'] = inEligibleSubs;
          this.selectedTariff['existingSubsCount'] = existingSubsCount;
        }
      }
      this.tariffFamilies = changes.tariffFamilies;
      this.tariffTypes = changes.tariffTypes;
    }
    if (this.onlyNewTariff && this.tariffList && this.tariffList.length === 1) {
      this.selectedTariff = this.tariffList[0];
      this.onTariffSelection();
    }
  }

  public processArticles(articles) {
    let result = [];
    let articlesPerPage = 6;
    while (articles && articles.length) {
      result.push(articles.splice(0, articlesPerPage));
    }
    return result;
  }

  generateCarouselData(tariffs: any) {
    let result = [];
    while (tariffs && tariffs.length) {
      result.push(tariffs.splice(0, 3));
    }
    return result || new Array([]);
  }

  loadExistingTariffsToPlannedChanged(value: AvailableTariffs) {
    this.tariffSelectionPlannedChanges.clear();
    value.tariffs.forEach(tariff => {
      this.tariffSelectionPlannedChanges.plannedChangesEvent.emit([]);
      this.tariffSelectionPlannedChanges.plannedChangeEmit({
        groupName: tariff.familyName,
        socs: [
          {
            isAddition: true,
            isExist: true,
            name: tariff.text,
            value: tariff.value,
            quantity: tariff.subsCount,
            price: tariff.amount,
            frequency: '',
            mandatory: true,
            showPrice: true,
            charge: null
          }
        ]
      });
    });
  }

  filterTariffListByParams(familyName, type) {
    return (this.selectedTariffFamily === 'choose' || familyName === this.selectedTariffFamily)
        && (this.selectedTariffType === 'choose' || type === this.selectedTariffType);
  }

  private checkTariffEligible() {
    this.tariffSelectionPlannedChanges.plannedChangesEvent.emit([]);
    this.tariffSelectionService.getEligibleSubscribers(this.selectedTariff.value)
        .pipe(finalize(() => this.loadingEliSubs = false))
        .subscribe(data => {
          let isTariffEligible = false;

          this.tariffSelectionPlannedChanges.clear();
          this.selectedTariff['subsCount'] = data.tariffs['0'].subsCount;
          if (this.selectedTariff['subsCount'] !== 0) {
            isTariffEligible = true;
            this.tariffSelectionPlannedChanges.plannedChangeEmit({
              groupName: this.selectedTariff.vaule, socs: [{
                isAddition: true,
                name: this.selectedTariff.text,
                value: this.selectedTariff.value,
                quantity: this.selectedTariff.subsCount,
                price: this.selectedTariff.charge && this.selectedTariff.charge.amount,
                frequency: this.selectedTariff.charge && this.selectedTariff.charge.type,
                mandatory: true,
                showPrice: true,
                charge: this.selectedTariff.charge
              }]
            });
          }

          if (data.tariffs['0'].inEligibleSubs && data.tariffs['0'].inEligibleSubs.length) {
            this.selectedTariff['inEligibleSubs'] = data.tariffs['0'].inEligibleSubs;
          }

          if (data.tariffs['0'].existingSubsCount) {
            this.selectedTariff['existingSubsCount'] = data.tariffs['0'].existingSubsCount;
          }

          this.selectedTariffChange.emit({
            tariffOption: this.selectedTariff.tariffOption,
            SubsCount: data.tariffs['0'].subsCount,
            existingSubsCount: this.selectedTariff['existingSubsCount'],
            inEligibleSubs: this.selectedTariff['inEligibleSubs']
          });
          this.hasTariffError = !isTariffEligible;
        });
  }

  private fixCheckedFields() {
    this.tariffList.forEach(tariff => {
      if (UtilsService.notNull(this.selectedTariff) && this.selectedTariff.tariffOption === tariff.tariffOption) {
        tariff._sncrChecked = 0;
      } else {
        tariff._sncrChecked = null;
      }
    });
  }

  public gettariffDetails(tariff: any): void {
    this.tariffFamily = tariff.text;
    this.tariffSelectionService.getTariffDetails(tariff.value)
        .subscribe(data => {
          this.tariffDetails = data.bulletPoints;
          this.modalService.open(this.detailsContent, {backdrop: 'static'});
        });
  }

  public enableDateSelection(tariffOption: string): boolean {
    return this.showDateSelection && this.selectedTariff && this.selectedTariff.tariffOption === tariffOption;
  }

  public updateTariffDate(event?) {
    if (this.showDateSelection) {
      this.selectedTariffDate = event && event.target && event.target.value ? event.target.value : 'TODAY';
    }
  }

}
