import {OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TimeoutService} from '../../app/timeout/timeout.service';
import {Cart} from '../../shopping-cart/Cart';
import {ShoppingCartService} from '../../shopping-cart/shopping-cart.service';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {SncrFlowSectionComponent} from '../../sncr-components/sncr-flow/sncr-flow-section.component';
import {SncrFlowComponent} from '../../sncr-components/sncr-flow/sncr-flow.component';
import {OrderReviewService} from '../order-review/order-review.service';
import {AddressConstants} from '../address-selection/address-constants';
import {Debitor, Shipment} from '../address-selection/address';
import {SubsFlowModel} from './model/prefilled-shopping-cart.model';

export class PrefilledShoppingCart implements OnInit {

  @ViewChild('flow') flow: SncrFlowComponent;
  // Stepper flows
  @ViewChild('subsFlow') subsFlow: SncrFlowSectionComponent;
  @ViewChild('tariffFlow') tariffFlow: SncrFlowSectionComponent;
  @ViewChild('hardwareFlow') hardwareFlow: SncrFlowSectionComponent;
  @ViewChild('socFlow') socFlow: SncrFlowSectionComponent;
  @ViewChild('reviewFlow') reviewFlow: SncrFlowSectionComponent;
  @ViewChild('debitorFlow') debitorFlow: SncrFlowSectionComponent;
  @ViewChild('shippingFlow') shippingFlow: SncrFlowSectionComponent;
  @ViewChild('subManagementFlow') subManagementFlow: SncrFlowSectionComponent;

  subsFlowModel: SubsFlowModel = new SubsFlowModel();

  isArticleNotRequired: boolean;
  eligibleSubsHardware: any;
  cartLoading = false;
  prefilled = false;
  cart = new Cart();
  commonConstants = AddressConstants;
  debitorAddress: any;
  selectedShipmentAction: any;
  subsFlowSortField: any;
  allSummary: any;

  constructor(protected route: ActivatedRoute,
    protected timeoutService: TimeoutService,
    protected orderService: OrderReviewService,
    protected shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const psc = params['psc'];
      if (psc) {
        this.subsFlowSortField = '_sncrChecked';
        this.cart = this.timeoutService.cart;
        this.prefilled = true;
        this.cartLoading = true;
        this.shoppingCartService.getSubscriberCount(this.cart.shoppingCartId).subscribe(subsCount => {
          this.subsFlowModel.selectCount = subsCount;
          if (this.route.snapshot['_routerState'].url.indexOf('vvl') > -1) {
            this.subsFlowModel.selectionMap = [];
          } else {
            this.subsFlowModel.selected = [];
          }
          this.populateFlowSummary(this.subsFlowModel);
        });
      }
    });
  }

  populateFlowSummary(subSummary: any, tariffSummary?: any, hardwareSummary?: any,
    socSummary?: any, debitorSummary?: any, shipmentSummary?: any, subsSummary?: any) {
    let flows = [];

    if (!UtilsService.isEmpty(this.subsFlow)) {
      flows.push({ section: this.subsFlow, model: subSummary });
    }
    if (!UtilsService.isEmpty(this.tariffFlow)) {
      flows.push({ section: this.tariffFlow, prefilled: this.prefilled, model: tariffSummary });
    }
    if (!UtilsService.isEmpty(this.hardwareFlow)) {
      flows.push({ section: this.hardwareFlow, prefilled: this.prefilled, model: hardwareSummary });
    }
    if (!UtilsService.isEmpty(this.socFlow)) {
      flows.push({ section: this.socFlow, prefilled: this.prefilled, model: socSummary });
    }
    if (!UtilsService.isEmpty(this.subManagementFlow)) {
      flows.push({ section: this.subManagementFlow, prefilled: this.prefilled, model: {} });
    }
    if (!UtilsService.isEmpty(this.debitorFlow)) {
      flows.push({ section: this.debitorFlow, prefilled: this.prefilled, model: debitorSummary });
    }
    if (!UtilsService.isEmpty(this.shippingFlow)) {
      flows.push({ section: this.shippingFlow, prefilled: this.prefilled, model: shipmentSummary });
    }
    if (!UtilsService.isEmpty(this.reviewFlow)) {
      flows.push({ section: this.reviewFlow, prefilled: this.prefilled, model: {} });
    }
    this.pscLocalProperties();
    this.flow.prefill(flows);
    this.cartLoading = false;
  }

  processPSC(event) {
    this.allSummary = event;
    this.cartLoading = true;
    let tariffModel;
    let hardwareModel;
    let socModel;
    let debitorModel;
    let shipmentModel;
    let tariffType = event.tariffSummary.isNewTariff === 'Y' ? 'new' : 'exist';
    let selTariff = event.tariffSummary.tariffs[0];
    
    selTariff['_sncrChecked'] = 0;
    tariffModel = {
      selectedTariffGroup: tariffType
    };
    if (tariffType === 'new') {
      tariffModel['subsQuantity'] = event.tariffSubsQuantity;
      tariffModel['selectedTariff'] = selTariff;
      this.tariffFlow['tariffModel'] = tariffModel;
    } else {
      this.tariffFlow['tariffModel'] = {
        existingTariffList: event.tariffSummary
      };
    }

    socModel = {
      reloadSummary: true,
      selectedSocs: []
    };

    if (!UtilsService.isEmpty(event.socSummary)) {
      let pscSocs = event.socSummary;
      pscSocs.map((soc: any) => {
        soc.name = soc.text;
        soc.quantity = soc.length;
        if (soc.type !== 'TRIGGER') {
          soc.charge['billingCycles'] = ['today', 'next', 'custom'];

          if (!UtilsService.notNull(soc.charge.selected)) {
            soc.charge.selected = 'today';
          }
          if (soc.charge.activationType) {
            soc.charge.selected = soc.charge.activationType === 'nbc' ? 'next' : soc.charge.activationType;
          }
          if (soc.charge.activationDate) {
            let launchDate = new Date(parseInt(soc.charge.activationDate, 10));
            soc.charge.date = {
              'day': launchDate.getDate(),
              'month': launchDate.getMonth() + 1,
              'year': launchDate.getFullYear()
            }
          }
          if (soc.charge.selected !== 'custom') {
            let date = new Date();
            let lastDay = new Date(date.getUTCFullYear(), date.getMonth() + 1, 0).getDate();
            let day = date.getUTCDate() + 1;
            let month = day > lastDay ? date.getUTCMonth() + 2 : date.getUTCMonth() + 1;
            soc.charge.date = {
              day: day > lastDay ? 1 : day,
              month: month > 12 ? 1 : month,
              year: month > 12 ? date.getUTCFullYear() + 1 : date.getUTCFullYear()
            };
          }
        } else {
          soc['isTrigger'] = true;
        }
        return soc;
      });

      if (pscSocs.length > 0) {
        socModel.selectedSocs.push({socs: pscSocs});
      }
    }
    if (!UtilsService.isEmpty(this.hardwareFlow)) {
      if (!UtilsService.isEmpty(event.handySummary)
        || (UtilsService.isEmpty(event.handySummary) && event?.banSummary[0].tariffType === 'ACT_SIM_ONLY')) {
        this.getHandyDebitor(event, tariffModel, hardwareModel, socModel, debitorModel, shipmentModel);
      } else {
        this.isArticleNotRequired = true;
        this.orderService.getSubsidySummary().subscribe(subsidySummary => {
          let subsidyId = this.getSubsidyId(subsidySummary.subsidyType);
          this.orderService.getSubsidyEligibilityCount(subsidyId).subscribe(subsidyEligibility => {
            this.eligibleSubsHardware = subsidyEligibility.subsidySubsCount;
            hardwareModel = {
              isArticleNotRequired: subsidyId,
              eligibleSubsHardware: subsidyEligibility.subsidySubsCount,
              tariffSubsCount: subsidyEligibility.tariffSubsCount,
              selectedArticle: [],
              selectedHardware: []
            };

            this.populateFlowSummary(this.subsFlowModel, tariffModel, hardwareModel, socModel, null, null);
            this.cartLoading = false;
          });
        });
      }
    } else {
      this.populateFlowSummary(this.subsFlowModel, tariffModel, hardwareModel, socModel, null, null);
    }
  }

  getSubsidyId(subsidyType: string): number {
    if (subsidyType === 'HANDY') {
      return 0;
    } else if (subsidyType === 'CREDIT_VOUCHER') {
      return 1;
    } else if (subsidyType === 'DELAYED_SUBSIDY') {
      return 2;
    } else {
      return -1;
    }
  }

  getImages(selectedArt: any): any {
    let imagesMap = {};
    selectedArt.imagePaths.forEach(img => {
      imagesMap[img.type] = img.path;
    });
    return imagesMap;
  }

  getHandyDebitor(event, tariffModel, hardwareModel, socModel, debitorModel, shipmentModel) {
    let articleList;
    let debitorSummary = this.orderService.getDebitorSummary().toPromise();
    let shipmentSummary = this.orderService.getShippingSummary().toPromise();

    if (!UtilsService.isEmpty(event.handySummary)) {
      articleList = this.orderService.getAvailableArticles().toPromise();
      this.isArticleNotRequired = event.handySummary.isArticleNotRequired;
      this.eligibleSubsHardware = event.handySummary.length;
      hardwareModel = {
        selectedArticle: event.handySummary,
        isArticleNotRequired: this.isArticleNotRequired
      };
    }

    Promise.all([debitorSummary, shipmentSummary, articleList]).then(res => {
      const [dbs, sps, arcl] = res;
      // hardware panel --> model setting(new hardware)
      if (arcl) {
        let selectedArt = arcl.find(item => item.articleNumber === event.handySummary.articleNumber);
        if (UtilsService.notNull(selectedArt) && selectedArt.imagePaths && selectedArt.imagePaths.length) {
          selectedArt['images'] = this.getImages(selectedArt);
        }
        if (event.handySummary.depCustomerId) {
          selectedArt.displayDep = true;
          selectedArt.depCustomerId = event.handySummary.depCustomerId;
        }
        selectedArt['_sncrChecked'] = 0;
        hardwareModel.selectedArticle = selectedArt;
        hardwareModel.selectedHardware = selectedArt;
      }

      // Debitor and ShipmentPanel --> model setting
      let debitor = new Debitor();
      dbs.fullName = debitor.generateFullName(dbs);
      if (dbs && sps) {
        debitorModel = {
          selectedAddressId: dbs.addressId,
          debitorAddressId: dbs.addressId
        };

        this.debitorAddress = dbs;
        this.selectedShipmentAction = sps.selectionOption;
        sps.selectedDescription = this.commonConstants.shipmentKeyType[sps.selectionOption];
        let shipment = new Shipment();
        sps.fullName = shipment.generateFullName(sps);
        shipmentModel = {
          selectedAddressId: sps.addressId,
          shipmentAddress: sps.addressId
        };
        this.shippingFlow['selectedShipmentAddress'] = sps;
      }
      this.populateFlowSummary(this.subsFlowModel, tariffModel, hardwareModel, socModel, debitorModel, shipmentModel);
    });
  }

  pscLocalProperties(): void {}
}
