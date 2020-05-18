import {Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SubscriberType} from '../subscribers-selection/subscriber-selection';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {SncrDatatableComponent} from '../sncr-components/sncr-datatable/sncr-datatable.component';
import {MaintainSocService} from './maintain-soc.service';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {SncrFlowSectionComponent} from '../sncr-components/sncr-flow/sncr-flow-section.component';
import {SubscriberSelectionService} from '../subscribers-selection/subscriber-selection.service';
import {CONSTANTS} from '../soc-management/constants';
import {isObject} from 'util';
import {MaintainSoc, OrderCharge, OrderSoc, ReviewMaintainSoc} from './order/order-maintain-soc-details';
import {AvailableSocs, Charge, Soc, SocFamily} from '../management-soc/classes/dtos/available-socs';
import {CurrencyPipe} from '@angular/common';
import {OrderConfirmDetails, OrderType} from '../order-confirm/order-confirm';
import {TimeoutService} from '../app/timeout/timeout.service';
import {SncrPlannedChangesService} from '../sncr-components/sncr-planned-changes/sncr-planned-changes.service';
import {ClientOrderDetailsComponent} from '../client-order-details/client-order-details.component';
import {TranslationService, Language} from 'angular-l10n';
import {Subscription} from 'rxjs';
import {SncrFlowComponent} from '../sncr-components/sncr-flow/sncr-flow.component';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import {ManagementSocService} from '../management-soc/management-soc.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Cart} from '../shopping-cart/Cart';
import {SubscriberSelectionComponent} from '../subscribers-selection/subscriber-selection.component';
import {SaveShoppingCartComponent} from '../save-shopping-cart/save-shopping-cart.component';
import {finalize} from 'rxjs/operators';
import {Column} from '../sncr-components/sncr-datatable/column';
import {OrderConfirmationService} from '../order-confirm/order-confirmation.service';

@Component({
  selector: 'maintain-soc',
  templateUrl: 'maintain-soc.component.html',
  styleUrls: ['maintain-soc.component.scss'],
  providers: [CurrencyPipe]
})
export class MaintainSocComponent implements OnInit, OnDestroy {

  emptyMessage: string;
  orderDetails = new OrderConfirmDetails;
  columns: any[];
  subscribers: any[];
  preFilledSubscribers: any[];
  defaultSortedResult: any[];
  socsWithSubs: ReviewMaintainSoc[];
  totalCharge = [];
  totalOTCharge = [];
  totalPrice: number;
  totalOTPrice: number;
  totalVatPrice: number;
  totalOTVatPrice: number;
  maintainSocOrder: MaintainSoc;
  processedSubs: Set<string>;
  processedSocs: Set<string>;
  processedSet: Set<string>;
  orderProcessing: boolean;
  cartProcessing: boolean;
  orderStatus: boolean;
  constants: CONSTANTS;
  noneMandatory = true;
  masterSocSelected = true;
  mandCount: number;
  prefilled: boolean;
  createCartAccess = false;
  deleteCartAccess = false;
  editCartAccess = false;
  isVFUser = false;
  cartLoading = false;
  isReadOnly: boolean;
  allAvailableSocs: AvailableSocs;
  preFilledMap: any;
  selectedSubCount: number;

  oneTimeCharge = 'Einrichtungspreis';
  showValidation: boolean;
  public isReadOnlyVodafoneUser = false;

  public socNotify: NotificationHandlerService;
  public orderReviewNotify: NotificationHandlerService;
  public orderReviewCartNotify: NotificationHandlerService;
  private subscriptions$: Subscription[] = [];

  @ViewChild('subscriberTable') subscriberTable: SncrDatatableComponent;
  @ViewChild('flow') flow: SncrFlowComponent;
  @ViewChild('subsFlow') subsFlow: SncrFlowSectionComponent;
  @ViewChild('subSelection') subSelection: SubscriberSelectionComponent;
  @ViewChild('availableSocFlow') availableSocFlow: SncrFlowSectionComponent;
  @ViewChild('reviewFlowSoc') reviewFlowSoc: SncrFlowSectionComponent;
  @ViewChild('clientOrderDetails') clientOrderDetails: ClientOrderDetailsComponent;
  @ViewChild('contentDeleteShoppingCart') contentDeleteShoppingCart: TemplateRef<any>;
  @ViewChild('saveCart') saveShoppingCartComponent: SaveShoppingCartComponent;
  @ViewChild('multipleOrderDetails') multipleOrderDetails;
  @ViewChild('orderNumberPDF', {static: true}) orderNumberPDF;
  @Language() lang: string;

  private modalRef: NgbModalRef;
  cart = new Cart();
  count = 0;
  subscriberCount = 0;
  orderCols: Column[];
  orderRows = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private subscriberService: SubscriberSelectionService,
              private maintainSocService: MaintainSocService,
              private socMngService: ManagementSocService,
              private shoppingCartService: ShoppingCartService,
              private plannedChangesService: SncrPlannedChangesService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              private currencyPipe: CurrencyPipe,
              private timeOutService: TimeoutService,
              public translation: TranslationService,
              private statusNotify: NotificationHandlerService,
              private orderConfirmationService: OrderConfirmationService) {
    this.selectedSubCount = 0;
  }

  ngOnInit(): void {
    this.orderProcessing = false;
    this.socNotify = this.notificationHandlerFactory();
    this.orderReviewNotify = this.notificationHandlerFactory();
    this.orderReviewCartNotify = this.notificationHandlerFactory();
    this.constants = new CONSTANTS;
    this.cart = this.timeOutService.cart;
    this.timeOutService.cart = new Cart();
    this.orderCols = [
      {title: 'ORDER_CONFIRMATION-NO_OF_PARTICIPANTS', field: 'affectedSubscriberCount', filter: false, show: true},
      {title: 'ORDER_CONFIRMATION-ORDER_NUMBER', field: 'orderNumber', show: true, filter: false, bodyTemplate: this.orderNumberPDF}
    ];

    this.isVFUser = this.timeOutService.topBar.vfUser;
    if (this.timeOutService.topBar) {
      this.isReadOnly = this.timeOutService.topBar.isReadOnlyUser;
      this.isReadOnlyVodafoneUser = this.timeOutService.topBar.isReadOnlyVodafoneUser;

      let permissions = this.timeOutService.permissions;
      if (permissions.length > 0) {
        if (permissions.includes('prefilled.cart.create') && !this.cart.shoppingCartName) {
          this.createCartAccess = true;
        }
        if (permissions.includes('prefilled.cart.edit') && this.cart.shoppingCartName) {
          this.editCartAccess = true;
        }
        if (permissions.includes('prefilled.cart.delete') && this.cart.shoppingCartName) {
          this.deleteCartAccess = true;
        }
      }
    }

    this.subscriptions$.push(
      this.route.data.subscribe((data: { columns: SubscriberType[], isEnterpriseUser: any, subscribers: any[] }) => {
        data.subscribers.sort((a, b) => this.subscriberService.customSortForBan(a, b, {'order': '1'}));
        this.defaultSortedResult = data.subscribers;
        this.defaultSortedResult.forEach(c => c['2'] = (c['2'] ? +c['2'] : null));
        this.columns = data.columns;
        this.subsFlow.model = {
          selected: []
        };
      })
    );
    this.subscriptions$.push(
      this.route.queryParams.subscribe(params => {
        const psc = params['psc'];
        if (psc) {
          this.prefilled = true;
          this.cartLoading = true;
          this.shoppingCartService.setSessionCart().then(data => {
            let socRequestDto = {orderType: 'MA_MAINTAIN_SOC'};
            let subs = this.shoppingCartService.getSelectedSubscribers();
            let socs = this.socMngService.getSocs(socRequestDto);
            let cdaCategoryName = this.shoppingCartService.getCDACategory();
            Promise.all([subs, socs, cdaCategoryName]).then((res: any[]) => {
              const [selectedSubs, selectedSocs, cda] = res;
              if (selectedSubs && selectedSubs.length !== 0) {
                let selectedSubscribers = [];
                this.defaultSortedResult.forEach(v => {
                  v._sncrChecked = selectedSubs.some(s => s === v['2'] + '');
                  if (v._sncrChecked) {
                    selectedSubscribers.push(v);
                  }
                });
                this.subscribers = this.defaultSortedResult;
                this.preFilledMap = this.socMngService.populateData(selectedSocs, selectedSubscribers, this.constants, false);
                this.preFilledSubscribers = selectedSubscribers;
                this.allAvailableSocs = selectedSocs;
                if (this.preFilledSubscribers && this.preFilledSubscribers.length) {
                  this.selectedSubCount = this.preFilledSubscribers.length;
                  this.manageReviewPanel();
                } else {
                  if (!this.cart.errors) {
                    this.cart.errors = [];
                  }
                  this.cart.errors.push('PSC_ALL_INVALID_SUBS');
                }

                let selectedManageSocs = [];
                if (this.maintainSocOrder && this.maintainSocOrder.socs && this.maintainSocOrder.socs.length) {
                  selectedManageSocs = this.maintainSocOrder.socs;
                }
                let reviewFlowSoc = [];
                if (this.socsWithSubs && this.socsWithSubs.length) {
                  reviewFlowSoc = this.socsWithSubs.filter(fi => !fi.doNotShow);
                }

                const flows = [
                  {section: this.subsFlow, model: {selected: selectedSubscribers, modified: false, cdaCategoryName: cda.name}},
                  {section: this.availableSocFlow, model: {selectedSocs: selectedManageSocs, availableSocs: this.allAvailableSocs}},
                  {section: this.reviewFlowSoc, model: {reviewFlowSoc: reviewFlowSoc}}
                ];
                if (this.cart.errors && this.cart.errors.length > 0 && this.cart.valid) {
                  if (selectedSocs.removeError && !this.cart.errors.some(e => e === 'REMOVE_SOCS_MISSING_SUBSCRIBERS')) {
                    this.cart.errors.push('REMOVE_SOCS_MISSING_SUBSCRIBERS');
                  }
                  this.fillInErrors();
                }
                this.flow.prefill(flows);
                this.cartLoading = false;
              } else {
                this.prefilled = false;
                this.cartLoading = false;
                this.subscribers = this.defaultSortedResult;
                setTimeout(() => {
                  if (this.subSelection) {
                    this.subSelection.subscriberNotify.printErrorNotification('PSC_ALL_INVALID_SUBS');
                  }
                });
              }
            });
          });
        } else {
          this.subscribers = this.defaultSortedResult;
        }
      })
    );
    this.emptyMessage = 'Kein Teilnehmer gefunden';

  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(s => s.unsubscribe());
  }

  fillInErrors() {
    this.orderReviewNotify.clearNotification();
    let errorList = '';
    this.cart.errors.forEach(err => {
      errorList = errorList + `<p>` + this.translation.translate(err) + `</p>`;
    });
    setTimeout(() => this.orderReviewCartNotify.printErrorNotification(errorList), 40);
  }

  clearNotifier(event) {
    if (event) {
      this.orderReviewCartNotify.clearNotification();
    }
  }

  setAvailableSocs(event) {
    this.selectedSubCount = this.subsFlow.model['selected'].length;
    this.preFilledMap = event.subscriberSocMap;
    this.preFilledSubscribers = this.subsFlow.model['selected'];
    this.allAvailableSocs = event.allAvailableSocs;
    this.manageReviewPanel();
  }

  manageReviewPanel() {
    this.showValidation = false;
    let banList = new Set;
    let subs = this.preFilledSubscribers;
    if (subs) {
      subs.forEach(sub => {
        if (!banList.has(sub['1'])) {
          banList.add(sub['1']);
        }
      });
    }
    let socRequestDto = {orderType: 'MA_MAINTAIN_SOC'};
    socRequestDto['subscriberList'] = banList;
    this.processedSubs = new Set;
    this.processedSocs = new Set;
    this.processedSet = new Set;
    this.reviewOrder();
    if (this.maintainSocOrder.socs.length > 0 && this.getDateValidation() && this.noneMandatory && this.masterSocSelected) {
      this.socNotify.clearNotification();
      this.availableSocFlow.model.selectedSocs = this.maintainSocOrder.socs;
      this.availableSocFlow.next(this.availableSocFlow.model);
    } else {
      this.showValidation = true;
      if (this.noneMandatory && this.masterSocSelected) {
        this.socNotify.printErrorNotification(`<b>Entschuldigung, leider ist ein Fehler aufgetreten</b><p></p>
            <p>Wählen Sie bitte die gewünschten Änderungen aus bevor Sie die Bestellung überprüfen.</p>`);
      } else if (!this.noneMandatory) {
        this.socNotify.printErrorNotification(`<b>Entschuldigung, leider ist ein Fehler aufgetreten</b><p></p>
            <p>Bitte wählen Sie eine der Pflichtoptionen.</p>`);
      } else {
        this.socNotify.printErrorNotification(`<b>Entschuldigung, leider ist ein Fehler aufgetreten</b><p></p>
            <p>Bitte wählen Sie eine der Tarifoptionen.</p>`);
      }
    }
  }

  /**
   * Method to validate is the date was selected if custom
   * @returns {boolean}
   */
  getDateValidation() {
    let count = 0;
    this.maintainSocOrder.socs.forEach(soc => {
      if (soc.charge.activationType === 'custom'
        && !UtilsService.notNull(soc.charge.activationDate)) {
        count++;
      }
    });
    return count === 0;

  }

  getSubsSummary(subscribers) {
    return subscribers.length;
  }

  getAvailableSocsSummary(availableSocs) {
    return availableSocs.length;
  }


  reviewOrder() {
    this.mandCount = 0;
    this.masterSocSelected = true;
    this.socsWithSubs = [];
    this.totalCharge = [];
    this.totalOTCharge = [];
    this.maintainSocOrder = new MaintainSoc();
    this.maintainSocOrder.type = this.constants.dtoType;
    this.maintainSocOrder.orderType = this.constants.orderFlowType;
    this.maintainSocOrder.subscribers = [];
    this.maintainSocOrder.socs = [];
    let subs = this.preFilledSubscribers;
    if (subs && subs.length) {
      subs.forEach(sub => {
        let subSocs = [];
        if (sub[this.constants.socColValue]) {
          sub[this.constants.socColValue].split(',').forEach(value => {
            subSocs.push(value);
          });
        }
        this.filterSubsWithSocs(subSocs, sub, this.allAvailableSocs);
        this.calculateTotalCharge();
        this.calculateVat();
      });
    }
    this.socsWithSubs.filter(fi => fi.activationType === 'D').forEach(fis => {
      let replaceSoc = this.socsWithSubs.find(ri => ri.familyName === fis.familyName
        && ri.subscriber === fis.subscriber && ri.activationType === 'A');
      if (UtilsService.notNull(replaceSoc)) {
        replaceSoc.oldTariff = fis.oldTariff;
        fis.doNotShow = true;
      }
    });
    this.reviewFlowSoc.model['reviewFlowSoc'] = this.socsWithSubs.filter(fi => !fi.doNotShow);
    this.noneMandatory = this.mandCount <= 0;
  }

  filterSubsWithSocs(subSocs, sub, selectedSocs) {
    selectedSocs.groups.forEach(g => g.families.forEach(f => {
      let selectedSoc;
      let activationType;
      if (UtilsService.notNull(f.isSelected) && isObject(f.isSelected)) {
        Object.keys(f.isSelected).forEach(key => {
          selectedSoc = key;
          activationType = f.isSelected[key];
        });
      } else {
        if (UtilsService.notNull(f.isSelected)) {
          selectedSoc = f.isSelected;
          activationType = f.isSelected === 'none' ? 'D' : 'A';
        }
      }
      if (f.mandatory
        && (!UtilsService.notNull(selectedSoc) || !UtilsService.notNull(activationType))
        && f.socs.filter(soc => soc.mandatory).length === 0
        && (f.socs.length > 1 && !f.socs.some(soc => soc.length === this.selectedSubCount))) {
        this.mandCount++;
      }
      if (selectedSoc === 'none') {
        let removeSoc = f.socs.find(soc => soc.value === 'none');
        f.socs.filter(soc => soc.value !== 'none' && soc.canOnly !== 'A').forEach(soc => {
          if (!soc.wifi || sub[this.constants.ultraColValue] === 0) {
            if (soc.charge) {
              soc.charge.selected = removeSoc.charge.selected;
              soc.charge.date = removeSoc.charge.date;
            }
            this.buildReviewOrderJson(this.findExistingSoc(f, subSocs, sub),
              sub, soc, f, activationType, null, this.getEffectiveDate(removeSoc, activationType), subSocs);
          }

        });
      } else {
        f.socs.filter(soc => soc.value === selectedSoc || soc.mandatory).forEach(soc => {
          if (soc.mandatory) {
            activationType = 'A';
          }
          if (!soc.wifi || sub[this.constants.ultraColValue] === 0) {
            this.buildReviewOrderJson(this.findExistingSoc(f, subSocs, sub), sub, soc, f,
              activationType, null, this.getEffectiveDate(soc, activationType), subSocs);
          }
        });
      }
    }));
  }

  getEffectiveDate(soc: Soc, activationType) {
    let charge: Charge;
    if (UtilsService.notNull(soc.charge)) {
      charge = soc.charge;
    } else {
      charge = new Charge();
      charge.selected = 'today';
    }
    if (!UtilsService.notNull(charge.selected)) {
      charge.selected = 'today';
    }
    return charge.selected === 'custom' ? (charge.date.day.toString().length === 1 ? '0' + charge.date.day.toString() : charge.date.day)
      + '.' + (charge.date.month.toString().length === 1 ? '0' + charge.date.month.toString() : charge.date.month) + '.' + charge.date.year
      : charge.selected === 'today' ? this.getTodayLabel(activationType, soc)
        : this.constants.actType[charge.selected];
  }

  getTodayLabel(activationType, soc) {
    if (activationType === 'D' && soc.duration > 0) {
      return 'zum nächstmöglichen Zeitpunkt';
    } else {
      if (this.allAvailableSocs.serverTimeCrossed) {
        return 'Morgen';
      } else {
        return 'Heute';
      }
    }
  }

  private getRemovedMasterSocIfAny(masterSocs: any[]) {
    let masterSoc;
    masterSocs.forEach(f => {
      if (UtilsService.notNull(f.original.isSelected)) {
        let process = true;
        if (f.original.isSelected instanceof Object) {
          process = Object.keys(f.original.isSelected).some(key => f.original.isSelected[key] === 'D');
        }
        const socValues = f.original.isSelected instanceof Object && process
          ? Object.keys(f.original.isSelected)
          : f.original.isSelected instanceof Object ? null : [...f.original.isSelected];
        if (!UtilsService.notNull(masterSoc) && UtilsService.notNull(socValues)) {
          let findSoc = f.socs.find(s => socValues.includes(s.value));
          if (socValues.includes('none')) {
            findSoc = f.socs[0];
          }
          if (UtilsService.notNull(findSoc)) {
            masterSoc = findSoc.value;
          }
        }
      }

    });
    return masterSoc;
  }

  private getMasterSoc(soc: any) {
    let masterSocs = soc.masterSocs;
    let masterSoc;
    let isOriginalSelected = masterSocs.some(m => UtilsService.notNull(m.original.isSelected) || m.original.socs.some(s => s.mandatory));
    if (!isOriginalSelected && UtilsService.notNull(soc.isMasterSelected)) {
      const socValues = soc.isMasterSelected instanceof Object ? Object.keys(soc.isMasterSelected) :
        [...soc.isMasterSelected];
      masterSocs.forEach(f => {
        if (UtilsService.notNull(socValues) && !UtilsService.notNull(masterSoc) && !UtilsService.notNull(f.original.isSelected)) {
          let findSoc = f.socs.find(s => socValues.includes(s.value));
          if (UtilsService.notNull(findSoc)) {
            masterSoc = findSoc;
          }
        }
      });
    }
    if (!UtilsService.notNull(masterSoc) && isOriginalSelected) {
      let count = 0;
      masterSocs.forEach(f => {
        let socValues = [];
        if (UtilsService.notNull(f.original.isSelected)) {
          let process = true;
          if (f.original.isSelected instanceof Object) {
            process = Object.keys(f.original.isSelected).some(key => f.original.isSelected[key] !== 'D');
          }
          socValues = f.original.isSelected instanceof Object && process ? Object.keys(f.original.isSelected)
            : f.original.isSelected instanceof Object || f.original.isSelected === 'none' ? null : [...f.original.isSelected];
        }
        if (!UtilsService.notNull(socValues) || socValues.length === 0) {
          f.original.socs.forEach(ms => {
            if (ms.mandatory) {
              socValues.push(ms.value);
            }
          });
        }
        if (!UtilsService.notNull(masterSoc) && UtilsService.notNull(socValues) && socValues.length > 0) {
          let findSoc = f.socs.find(s => socValues.includes(s.value));
          if (UtilsService.notNull(findSoc)) {
            masterSoc = findSoc;
          }
        }

      });
    }
    return masterSoc;
  }

  findExistingSoc(f: SocFamily, subSocs, sub) {
    let existingSoc = f.socs.find(findSoc => subSocs.includes(findSoc.value));
    if (!UtilsService.notNull(existingSoc) && this.preFilledMap.has(sub[this.constants.subscriberCol])) {
      let subscriberSoc = this.preFilledMap.get(sub[this.constants.subscriberCol]);
      subscriberSoc.socs.forEach(asoc => {
        if (asoc.familyName === f.name) {
          existingSoc = asoc.soc;
        }
      });
    }
    return existingSoc;
  }

  buildReviewOrderJson(existingSoc, sub, soc, family, activationType, mainSoc,
                       effectiveDate, subSocs) {
    let newSoc = activationType === 'D' ? '-' :
      UtilsService.notNull(soc.text) ? soc.text : '-';
    if (newSoc === '-' || !this.processedSet.has(sub[this.constants.subscriberCol] + '#' + soc.value)) {
      if (newSoc !== '-') {
        this.processedSet.add(sub[this.constants.subscriberCol] + '#' + soc.value);
      }

      if ((!UtilsService.notNull(existingSoc) && activationType === 'A')
        || (UtilsService.notNull(existingSoc) && existingSoc.value !== soc.value && activationType === 'A')
        || (UtilsService.notNull(existingSoc) && existingSoc.value === soc.value && activationType === 'D')) {
        let reviewMaintainsSoc = new ReviewMaintainSoc();
        reviewMaintainsSoc.ban = sub[this.constants.banCol];
        reviewMaintainsSoc.subscriber = sub[this.constants.subscriberCol];
        reviewMaintainsSoc.familyName = family.name;
        reviewMaintainsSoc.effectiveDate = effectiveDate;
        reviewMaintainsSoc.newTariff = activationType === 'D' ? '-' :
          UtilsService.notNull(soc.text) ? soc.text : '-';
        reviewMaintainsSoc.quantity = soc.quantity;
        if (UtilsService.notNull(existingSoc)) {
          reviewMaintainsSoc.oldTariff = existingSoc.text;
        } else {
          reviewMaintainsSoc.oldTariff = '-';
        }
        reviewMaintainsSoc.activationType = activationType;
        if (activationType === 'A') {
          if (soc.charge.type === this.oneTimeCharge) {
            reviewMaintainsSoc.oneTimeCharge = soc.charge.amount === null
              ? 0 : soc.charge.amount === 0
                ? 0 : soc.charge.amount;
            this.totalOTCharge.push(soc.charge.amount === null
              ? 0 : soc.charge.amount === 0
                ? 0 : soc.charge.amount);

          } else {
            reviewMaintainsSoc.monthlyCharge = soc.charge.amount === null
              ? 0 : soc.charge.amount === 0
                ? 0 : soc.charge.amount;
            this.totalCharge.push(soc.charge.amount === null
              ? 0 : soc.charge.amount === 0
                ? 0 : soc.charge.amount);
          }
        } else {
          reviewMaintainsSoc.monthlyCharge = '';
        }
        this.socsWithSubs.push(reviewMaintainsSoc);
        if (activationType === 'A' && UtilsService.notNull(soc.masterList)) {
          let selectedMaster;
          if (UtilsService.notNull(soc.isMasterSelected)) {
            if (isObject(soc.isMasterSelected)) {
              Object.keys(soc.isMasterSelected).forEach(key => {
                selectedMaster = key;
              });
            } else {
              selectedMaster = soc.isMasterSelected;
            }
            if (UtilsService.notNull(selectedMaster) && UtilsService.notNull(soc.masterSocs)) {
              soc.masterSocs.forEach(mf => {
                mf.socs.forEach(msc => {
                  if (msc.value === selectedMaster) {
                    reviewMaintainsSoc.selectedMasterDetails = msc;
                    this.buildReviewOrderJson(this.findExistingSoc(mf.original, subSocs, sub),
                      sub, reviewMaintainsSoc.selectedMasterDetails, mf.original, activationType, null,
                      this.getEffectiveDate(reviewMaintainsSoc.selectedMasterDetails, activationType), subSocs);
                  }
                });
              });
            }
          } else if (UtilsService.notNull(soc.masterSocs)) {
            this.plannedChangesService.getPlannedChanges().forEach(p => p.socs.forEach(ps => {
              soc.masterSocs.forEach(mf => {
                mf.socs.forEach(msc => {
                  if (ps.isAddition && msc.value === ps.value && !UtilsService.notNull(selectedMaster)) {
                    reviewMaintainsSoc.selectedMasterDetails = msc;
                    reviewMaintainsSoc.selectedMasterDetails.charge.selected = ps.charge.selected;
                    reviewMaintainsSoc.selectedMasterDetails.charge.date = ps.charge.date;
                    selectedMaster = msc.value;
                    this.buildReviewOrderJson(this.findExistingSoc(mf.original, subSocs, sub),
                      sub, reviewMaintainsSoc.selectedMasterDetails, mf.original, activationType, null,
                      this.getEffectiveDate(reviewMaintainsSoc.selectedMasterDetails, activationType), subSocs);
                  }
                });
              });
            }));
          }
        }
        let effectiveSoc = soc;
        if (UtilsService.notNull(reviewMaintainsSoc.selectedMasterDetails)) {
          effectiveSoc = reviewMaintainsSoc.selectedMasterDetails;
          reviewMaintainsSoc.effectiveDate = this.getEffectiveDate(effectiveSoc, activationType);
        }
        // these steps are to set the soca and subscribers in the dto
        if (!UtilsService.notNull(mainSoc)) {
          this.buildOrderConfirmationJson(reviewMaintainsSoc, soc, family, activationType);
        }
        if (UtilsService.notNull(soc.trigger) &&
          (UtilsService.notNull(soc.trigger.isSelected) || soc.trigger.mandatory) && activationType === 'A') {
          this.buildReviewOrderJson(null, sub, soc.trigger, family, activationType,
            soc.value, this.getEffectiveDate(effectiveSoc, activationType), subSocs);
        }
      }
    }

  }

  getSocPrice(amount): string {
    return `${this.currencyPipe.transform(amount, 'EUR', 'symbol', '1.2-2')}`;
  }

  buildOrderConfirmationJson(reviewMaintainsSoc, soc, family, activationType) {
    if (!this.processedSubs.has(reviewMaintainsSoc.subscriber)) {
      this.processedSubs.add(reviewMaintainsSoc.subscriber);
      this.maintainSocOrder.subscribers.push(reviewMaintainsSoc.subscriber);
    }

    if (!this.processedSocs.has(soc.value)) {
      this.processedSocs.add(soc.value);
      let serverCharge = Object.assign({}, soc.charge);
      if (UtilsService.notNull(reviewMaintainsSoc.selectedMasterDetails)) {
        serverCharge = Object.assign({}, reviewMaintainsSoc.selectedMasterDetails.charge);
        serverCharge.amount = soc.charge.amount;
      }
      let orderSoc = this.populateSocDetails(soc, family, activationType, serverCharge, reviewMaintainsSoc);
      if (UtilsService.notNull(soc.trigger) &&
        (UtilsService.notNull(soc.trigger.isSelected) || soc.trigger.mandatory) && activationType === 'A') {
        soc.trigger.length = soc.length;
        orderSoc.trigger = this.populateSocDetails(soc.trigger, family, activationType, serverCharge, reviewMaintainsSoc);
      }
      this.maintainSocOrder.socs.push(orderSoc);
    }
  }

  isMasterAssignedToAll(masterSocs) {
    return masterSocs && !masterSocs.some(f => {
      let activationType = 'A';
      if (UtilsService.notNull(f.isSelected) && isObject(f.isSelected)) {
        Object.keys(f.isSelected).forEach(key => {
          activationType = f.isSelected[key];
        });
      } else {
        if (UtilsService.notNull(f.isSelected)) {
          activationType = f.isSelected === 'none' ? 'D' : 'A';
        }
      }
      return f.original.isSelected !== 'none' && activationType === 'A'
        && f.original.socs.some(ins => ins.model !== 'D' && ins.length === this.selectedSubCount);
    });
  }

  private populateSocDetails(soc, family, activationType, charge, reviewMaintainsSoc) {
    let orderSoc = new OrderSoc();
    let orderCharge = new OrderCharge();
    if (!UtilsService.notNull(charge)) {
      charge = new Charge();
    }
    orderCharge.amount = charge.amount;
    orderSoc.socId = soc.value;
    orderSoc.socName = soc.text;
    orderSoc.duration = soc.duration;
    let date = charge.date;
    if (UtilsService.notNull(date)) {
      orderCharge.activationDate = date['day'] + '-' + date['month'] + '-' + date['year'];
    }
    if (UtilsService.notNull(charge.selected)) {
      orderCharge.activationType = charge.selected;
    } else {
      orderCharge.activationType = 'today';
    }
    orderSoc.charge = orderCharge;
    orderSoc.familyName = family.name;
    orderSoc.action = activationType;
    if (soc.masterList && this.isMasterAssignedToAll(soc.masterSocs)) {
      if (orderSoc.action === 'A') {
        if (UtilsService.notNull(reviewMaintainsSoc.selectedMasterDetails)) {
          orderSoc.masterSoc = reviewMaintainsSoc.selectedMasterDetails.value;
        } else {
          let masterSoc = this.getMasterSoc(soc);
          if (UtilsService.notNull(masterSoc)) {
            orderSoc.masterSoc = masterSoc.value;
            if (UtilsService.notNull(masterSoc.charge) && masterSoc.charge.selected !== 'today') {
              soc.charge.selected = masterSoc.charge.selected;
              soc.charge.date = masterSoc.charge.date;
              reviewMaintainsSoc.activationDate = this.getEffectiveDate(masterSoc, 'A');
            }

          }
        }

        if (!UtilsService.notNull(orderSoc.masterSoc)) {
          this.masterSocSelected = false;
        }
      } else {
        orderSoc.masterSoc = this.getRemovedMasterSocIfAny(soc.masterSocs);
      }
    }
    orderSoc.quantity = activationType === 'A' ? this.selectedSubCount - soc.length : soc.length;
    if ((soc.wifi || soc.subsidizedHWSoc) && soc.excluded && soc.excluded > 0) {
      orderSoc.quantity = orderSoc.quantity - soc.excluded;
    }
    return orderSoc;
  }

  calculateVat() {
    let vatPer = this.constants.vatPercentage;
    this.totalVatPrice = (this.totalPrice * vatPer) / 100;
    this.totalOTVatPrice = (this.totalOTPrice * vatPer) / 100;
  }

  calculateTotalCharge() {
    this.totalOTPrice = this.totalOTCharge.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    this.totalPrice = this.totalCharge.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
  }


  processMaintainSocOrder() {
    if (!this.clientOrderDetails.isFormInValid() && this.clientOrderDetails.saveForm.valid && !this.orderProcessing) {
      this.orderProcessing = true;
      if (this.prefilled) {
        this.shoppingCartService.isCartLocked(this.cart.shoppingCartId).subscribe((res) => {
          if (res.valid) {
            this.submitOrder();
          } else {
            this.orderProcessing = false;
            let errors = res.errors;
            if (errors && errors.length) {
              this.orderReviewNotify.printErrorNotification(errors[0], {shoppingCartName: this.cart.shoppingCartName});
            }
          }
        });
      } else {
        this.submitOrder();
      }
    }
  }

  saveCartDetails() {
    if (!this.clientOrderDetails.isFormInValid() && this.clientOrderDetails.saveForm.valid) {
      if (this.createCartAccess || this.editCartAccess) {
        // open the modal
        this.saveShoppingCartComponent.openModal();
      } else {
        this.orderReviewNotify.printErrorNotification(this.translation.translate('REVIEW-NO_PERMISSION_TO_SAVE_CART'));
      }
    }
  }

  deleteResponse(event: any) {
    if (event && event.errors.length === 0) {
      this.router.navigate(['/mobile/home']);
    } else {
      this.orderReviewNotify.clearNotification();
      event.errors.forEach(error => this.orderReviewNotify.printErrorNotification(error));
    }
  }


  submitOrder() {
    this.clientOrderDetails.populateClientOrderDetails(this.maintainSocOrder);
    const errorText = `<b>Vorübergehende technische Störung</b><p></p>` +
      `Aufgrund einer Systemstörung steht Ihnen die gewünschte Internetseite zurzeit leider nicht zur Verfügung.` +
      ` Bitte versuchen Sie es später noch einmal.<p></p>Viele Grüße, Ihr Vodafone Team`;
    this.maintainSocService.submitMaintainSocOrder(this.maintainSocOrder)
      .then((data: any) => {
        this.orderProcessing = false;
        if (UtilsService.notNull(data)) {
          this.orderRows = [];
          if (Object.keys(data).length > 0) {
            Object.keys(data).forEach(key => {
              this.orderDetails.orderNumber = parseFloat(key);
              this.orderDetails.orderType = OrderType[this.maintainSocOrder.orderType];
              this.orderRows.push({
                'orderNumber': key,
                'affectedSubscriberCount': data[key]['subsCount'],
                'orderType': data[key]['orderType']
              })
            });
            this.orderStatus = true;
            this.orderDetails.mutlipleOrders = []; // just make this property true
            this.orderDetails.multipleOrdersTemplate = this.multipleOrderDetails;
            this.orderDetails.description = 'CONFIRM-DESCRIPTION';
          } else {
          this.orderDetails.orderNumber = data;
          this.orderDetails.orderType = OrderType[this.maintainSocOrder.orderType];
          this.orderDetails.description = `Die Bestellung befindet sich aktuell in Bearbeitung. ` +
            `Bitte beachten Sie, dass die Aktualisierung der Informationen zum Folgetag vorgenommen wird. Wir möchten Sie bitten, ` +
            `weiterführende Aufträge zu dieser/n Rufnummer/n erst nach Abschluss der Aktualisierung zu übermitteln.`;
          this.orderStatus = true;
          }
        } else {
          this.orderReviewNotify.printErrorNotification(errorText);
        }
      })
      .catch((ex) => {
        console.error('exception in order', ex);
        this.orderProcessing = false;
        this.orderReviewNotify.printErrorNotification(errorText);
      });
  }


  processSaveCart(cart: any) {
    this.saveOrderCart(cart);
  }


  saveOrderCart(cart: Cart) {
    this.cartProcessing = true;
    this.clientOrderDetails.populateClientOrderDetails(this.maintainSocOrder);
    if (this.maintainSocOrder) {
      this.maintainSocOrder.cart = cart;
    }
    if (this.createCartAccess) {
      this.shoppingCartService.createCart(this.maintainSocOrder)
        .pipe(finalize(() => this.cartProcessing = false))
        .subscribe((data) => {

        this.updateOnCartSubmit(data);
        }, () => {
          // exception during save cart
          this.orderReviewNotify.printErrorNotification(this.constants.technicalErrorText);
        });
    } else if (this.editCartAccess) {
      this.shoppingCartService.updateCart(this.maintainSocOrder)
        .subscribe((data: any) => {

          this.updateOnCartSubmit(data);
          this.cartProcessing = false;
        }, () => {
          // exception during save cart
          this.cartProcessing = false;
          this.orderReviewNotify.printErrorNotification(this.constants.technicalErrorText);
        });
    }
  }

  updateOnCartSubmit(data) {
    if (UtilsService.notNull(data) && data.valid) {
      this.router.navigate(['/mobile/home']);
    } else {
      this.orderReviewNotify.clearNotification();
      this.orderReviewNotify.printErrorNotification(data.errors.length ? data.errors[0] : this.constants.technicalErrorText);
    }
  }

  downloadPdf(orderNumber, orderType) {
    this.showInProgressMsg();
    this.orderConfirmationService.downloadPdf(orderNumber, OrderType[orderType]).subscribe(data => {
        window.location.href = '/buyflow/rest/orderflow/' + orderNumber
          + '/' + orderType + '/pdf?t=' + new Date().getTime();
      },
      error => this.retryMessage());
  }

  showInProgressMsg() {
    this.statusNotify.clearNotification();
    this.statusNotify.printWarningNotification('DOWNLOAD_IN-PROGRESS');
  }

  retryMessage() {
    this.statusNotify.clearNotification();
    this.statusNotify.printWarningNotification('ORDER_IN-PROGRESS');
  }

}
