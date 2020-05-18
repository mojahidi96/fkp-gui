import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbAccordion, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {finalize} from 'rxjs/operators';
import {EdBillingAccount, EdBillingAccPanel, EdCustomer, EdCustomerPanel, EdProduct, EdShop} from '../common/ed-shop';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {FnUserDetails} from '../../fixednet/common/fn-user-details';
import {ShopValidation} from '../../fixednet/common/validation/shop-validation-config';
import {EDService} from '../ed.service';
import {EDOrderDetailsService} from '../order/ed-order-details/ed-order-details.service';
import {EditShopService} from './edit-shop.service';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {EditShopPanelConfig, popupMsgs} from './edit-shop-panel-config';
import {CreateEditShop} from '../../fixednet/common/create-edit-shop/create-edit-shop';
import {FixedNetService} from '../../fixednet/fixednet.service';
import {TranslationService} from 'angular-l10n';
import {Router} from '@angular/router';

@Component({
  selector: 'edit-shop-app',
  templateUrl: 'edit-shop.component.html',
  styleUrls: ['./edit-shop.component.scss']
})
export class EditShopComponent extends CreateEditShop implements OnInit {
  edShop: EdShop;
  edShopCopy: EdShop;
  notify: NotificationHandlerService = new NotificationHandlerService();
  fnUser: FnUserDetails = new FnUserDetails();
  panels: Array<any> = [];
  loading = false;
  showValidation = false;
  private panel;
  edCustomerPanel: EdCustomerPanel;
  private edCustomer: EdCustomer;
  @ViewChild('accordion') accordion: NgbAccordion;
  @ViewChild('multipleSelectionAlert') multipleSelectionAlert: NgbModal;
  edBillingAccPanel: EdBillingAccPanel;
  edProduct: EdProduct;
  private panelOpen;
  type: string;
  readonly CUSTOMER = 'customer';
  readonly BILLING = 'billing';
  popupMessage: string;
  popupMsgs: any;
  ngbRef: NgbModalRef;
  @ViewChild('customerAlert') customerAlert: NgbModal;
  edProducts: Array<EdProduct> = [];
  @ViewChild('customerNo', {static: true}) customerNo;
  @ViewChild('billError', {static: true}) billError;
  noBillingForCustMsg = '';
  @ViewChild('selectionAlert') selectionAlert: NgbModal;
  selectedShop: string;
  disableShopSave = false;
  productFlag: boolean;
  shopNameandCount = new Map();
  shopCounts: any;
  prevSelectedCustomers: any = [];
  zeroShops: any = [];
  checkCount = 0;

  constructor(private edService: EDService, private edOrderDetailsService: EDOrderDetailsService,
              private editShopService: EditShopService, private fixedNetService: FixedNetService, private modalService: NgbModal,
              private translation: TranslationService, private router: Router) {
    super(fixedNetService);
    this.edShop = this.router.getCurrentNavigation().extras.state.Shop;
  }

  ngOnInit(): void {
    this.notify.clearNotification();
    this.fnUser = this.edOrderDetailsService.getFnUser();
    this.panels = EditShopPanelConfig;
    this.popupMsgs = popupMsgs;
    this.noBillingForCustMsg = this.translation.translate('EDIT_SHOP_CUSTOMER-NO_BILLING_NOS');
    this.panels[1].columns[0].bodyTemplate = this.billError;
    this.panels[2].columns[3].bodyTemplate = this.customerNo;
    if (this.edShop && this.edShop.shopId) {
      this.edProduct = new EdProduct();
      this.edProduct.shopId = this.edShop.shopId;
      this.edCustomer = new EdCustomer();
      this.edCustomer.shopId = this.edShop.shopId;
    }
    this.edShopCopy = {...this.edShop};
    this.edCustomerPanel = new EdCustomerPanel();
    this.edBillingAccPanel = new EdBillingAccPanel();
  }

  panelChange(event: any): void {
    this.panel = this.getPanelOpened(event.panelId);
    if (this.panel && event.nextState) {
      this.loading = true;
      switch (this.panel.id) {
        case 'setup-1':
          this.editShopService.getShopSetup(this.edShop, this.panel.getUrl)
            .pipe(finalize(() => this.loading = false))
            .subscribe((data: EdShop) => {
                this.setShopSetupData(data);
                this.disableShopSave = false;
              },
              error => {
                this.notify.printErrorNotification(error);
              });

          break;

        case '1':
          this.editShopService.getCustomerPanelData(this.edShop, this.panel.getUrl)
            .pipe(finalize(() => this.loading = false))
            .subscribe(data => {
                this.successOnCustomerPanelOPened(data, this.panel);
                this.disableShopSave = true;
              },
              error => {
                this.errorOnPanelOpen(error);

              });
          this.getshopCounts();
          break;

        case '2':
          this.editShopService.getBillingPanelData(this.edShop, this.panel.getUrl)
            .pipe(finalize(() => this.loading = false))
            .subscribe(data => {
                this.successOnBillingPanelOPened(data, this.panel);
                this.disableShopSave = true;
              },
              error => {
                this.errorOnPanelOpen(error);
              });
          break;

        case '3':
          this.editShopService.getProductData(this.edProduct, this.panel.getUrl)
            .pipe(finalize(() => this.loading = false))
            .subscribe(data => {
              this.successOnTabOpen(data, this.panel);
                this.disableShopSave = true;
            },
            error => {
              this.errorOnPanelOpen(error);
            });
          break;
      }
    }
  }

  successOnTabOpen(data: any, panel: any) {
    panel.rows = data;
    panel.selected = this.filterSelectedData([...data]);
    this.editShopService.getCustBillingCount(this.edShop).subscribe(productFlag => {
      this.productFlag = productFlag;
    });
  }

  filterSelectedData(edPanelRows: Array<any>): Array<EdShop> {
    return edPanelRows.filter(row => {
      return row._sncrChecked;
    });
  }

  errorOnPanelOpen(error: string) {
    this.onErrorResponse(error, false);
    this.panel.rows = [];
    this.panel.selected = [];
  }

  successOnCustomerPanelOPened(response: EdCustomerPanel, panel: any) {
    if (UtilsService.notNull(response)) {
      this.setCustomerBillingPanelData(response.fnCustomers, panel);
      this.edCustomerPanel = response;
    }
  }

  setCustomerBillingPanelData(rows, panel) {
    if (rows) {
      panel.rows = rows;
      panel.selected = this.filterSelectedData([...rows]);
    }
  }

  assignShopCopy() {
    this.edShopCopy = {...this.edShop};
  }

  private setShopSetupData(data: EdShop) {
    if (UtilsService.notNull(data)) {
      this.edShop = {...this.edShop, ...data};
      this.assignShopCopy();
    }
  }

  onErrorResponse(message: string, collapse: boolean) {
    this.panel.rows = [];
    this.accordion.activeIds = collapse ? '' : this.accordion.activeIds;
    this.notify.printErrorNotification(message);
  }

  getPanelOpened(id: string): any {
    return this.panels.find(panel => panel.id === id);
  }

  successOnBillingPanelOPened(response: EdBillingAccPanel, panel: any) {
    if (UtilsService.notNull(response)) {
      this.setCustomerBillingPanelData(response.fnBillingAccounts, panel);
      this.edBillingAccPanel = response;
    }
  }

  disableSaveButton(): boolean {
    if (this.fnUser && this.fnUser.isReadOnlyUser) {
      return true;
    }
    if (!this.edShop.shopName || (this.edShop.shopName && this.edShop.shopName.trim().length < ShopValidation.SHOP_MIN_LENGTH)) {
      return true;
    }
    return false;
  }

  validateShopFields(): boolean {
    if (this.edShop.shopName && (!this.edShop.shopName.match('^[^|;\\\\<>?]+$') || this.isInvalidInput(this.edShop.shopName))) {
      return this.setValidateErrorMessage(ShopValidation.SHOP_ERROR_MSG_CHARS);
    }
    if (this.edShop.shopName.trim().length > ShopValidation.SHOP_MAX_LENGTH) {
      return this.setValidateErrorMessage(ShopValidation.SHOP_MAX_LENGTH_ERROR);
    }
    return true;
  }

  setValidateErrorMessage(message: string): boolean {
    this.notify.printErrorNotification(message);
    return false;
  }

  onSuccessResponse(message: string, collapse: boolean) {
    this.loading = false;
    this.notify.printSuccessNotification(message);
    this.accordion.activeIds = collapse ? '' : this.accordion.activeIds;
  }

  savePanelEditShop(id: string): void {
    this.panelOpen = this.getPanelOpened(this.accordion.activeIds[0]);
    switch (id) {
      case 'setup-1':
        this.showValidation = true;
        if (this.edShop && this.edShop.shopName && this.validateShopFields()) {
          this.edShop.shopName = this.edShop.shopName.trim();
          this.loading = true;
          this.editShopService.savePanelData(this.edShop, this.panelOpen.saveUrl).subscribe(() => {
              this.loading = false;
              this.accordion.toggle('1');
              this.assignShopCopy();
            },
            error => {
              this.onErrorResponse(error, true);
              this.edShop = {...this.edShopCopy};
            });
        }
        break;

      // save the customer list
      case '1':
        this.type = this.CUSTOMER;
        let selectedCustomers: Array<EdCustomer> = this.panelOpen.selected;
        if (selectedCustomers && selectedCustomers.length && this.isCustomerAssignedToAnotherShop(selectedCustomers)) {
          this.popupMessage = this.popupMsgs.customerToOtherShopMsg;
          this.ngbRef = this.modalService.open(this.customerAlert, {backdrop: 'static'});
        } else {
          this.saveCustBillingData(false, this.type);
        }
        break;

      case '2':
        // save the billing accounts
        this.type = this.BILLING;
        this.saveCustBillingData(false, this.type);

        break;

      case '3':
        // save the product
        if (this.panelOpen.selected.length) {
          this.loading = true;
          this.edProducts = this.panelOpen.rows;
          this.editShopService.saveProductData(this.edProducts, this.panelOpen.saveUrl).subscribe(data => {
              this.notify.clearNotification();
              this.onSuccessResponse('EDIT_SHOP_SUCCESS', true);
            },
            error => {
              this.errorOnPanelOpen(error);
            });
        }
        break;
    }
  }

  isCustomerAssignedToAnotherShop(customers: Array<EdCustomer>): boolean {
    return customers.some((customer) => {
      return customer.shopName ? customer.shopName.trim().toLowerCase() !== this.edShop.shopName.trim().toLowerCase() : false;
    });
  }

  saveCustBillingData(modal: boolean, type: string) {
    if (modal) {
      this.ngbRef.close('ok');
    }
    if (this.panelOpen.selected.length) {
      this.loading = true;
      switch (type) {
        case this.CUSTOMER:
          this.edShop.fnCustomerPanel = this.edCustomerPanel;
            this.editShopService.savePanelData(this.edShop, this.panelOpen.saveUrl).subscribe(() => {
                this.loading = false;
                this.accordion.toggle('2');
              },
              error => {
                this.onErrorResponse(error, true);
              });

          break;
        case this.BILLING:
          this.edShop.fnBillingAccPanel = this.edBillingAccPanel;
            this.editShopService.savePanelData(this.edShop, this.panelOpen.saveUrl).subscribe(() => {
                this.loading = false;
                this.accordion.toggle('3');
              },
              error => {
                this.onErrorResponse(error, true);
              });

          break;
      }
    }
  }

  getCustomerNo(customerNo: string) {
    if (UtilsService.notNull(customerNo)) {
      return customerNo.split(',');
    } else {
      return [];
    }
  }

  getshopCounts(): void {
    this.editShopService.getCustomersShopCount(this.edShop).subscribe(customerShopCount => {
      this.shopCounts = customerShopCount;
      for (let shops of customerShopCount) {
        this.shopNameandCount.set(shops.shopName, shops.customerCount);
      }
    });
  }

  unSelected(event, openPanel) {
    if (event && event.data && JSON.stringify(event.data) !== '{}' && openPanel && openPanel.id === '1') {
      let shopname = event.data.shopName;
      let index = this.prevSelectedCustomers.indexOf(event.data);
      this.prevSelectedCustomers.splice(index, 1);
      if (this.edShopCopy && this.edShopCopy.shopName !== shopname) {
        let shopCount = this.shopNameandCount.get(shopname);
        let newShopCount = parseInt(shopCount, 10) + 1;
        this.shopNameandCount.set(shopname, newShopCount);
        this.checkCount = 0;
      }
      if (this.zeroShops.length) {
        let toRemove = this.zeroShops.indexOf(event.data);
        this.zeroShops.splice(toRemove, 1);
      }
    }
    this.disableSave(openPanel);
  }


  disableSave(selectedPanel: any) {
    if (selectedPanel.id !== '3' &&  selectedPanel.selected.length < 1) {
      this.disableShopSave = true;
    } else if (selectedPanel.id === '3' && (!this.productFlag || selectedPanel.selected.length < 1)) {
      this.disableShopSave = true;
    } else {
      this.disableShopSave = false;
    }
  }

  onSelection(event: any, panel: any) {
    // We want the logic below only for customer selection
    if (event && event.data && JSON.stringify(event.data) !== '{}' && panel && panel.id === '1') {
      this.prevSelectedCustomers.push(event.data);
      let shopName = event.data.shopName;
      let newshopCount;
      if (this.edShopCopy && this.edShopCopy.shopName !== shopName) {
        let shopCount = this.shopNameandCount.get(shopName);
        newshopCount = parseInt(shopCount, 10) - 1;
        this.shopNameandCount.set(shopName, newshopCount);
        this.checkCount = 0;
      }
      this.selectedShop = shopName;

      if (newshopCount === 0) {
        this.ngbRef = this.modalService.open(this.selectionAlert, {backdrop: 'static'});
      }
    }
    this.disableSave(panel);
  }

  onAllCheck(event: any, openPanel) {
    if (event.checked) {
      if (openPanel && openPanel.id === '1') {
        if (this.prevSelectedCustomers.length && (this.prevSelectedCustomers.length !== openPanel.selected.length)
          && (this.checkCount !== 1)) {
          for (let shops of openPanel.selected) {
            for (let sel of this.prevSelectedCustomers) {
              if ((shops.fnCustomerNumber !== sel.fnCustomerNumber) && (this.edShopCopy && this.edShopCopy.shopName !== shops.shopName)) {
                  let shopCount = this.shopNameandCount.get(shops.shopName);
                  let newshopCount = parseInt(shopCount, 10) - 1;
                  if (newshopCount === 0) {
                    this.zeroShops.push(shops.shopName);
                  }
                  this.shopNameandCount.set(shops.shopName, newshopCount);
              }
            }
          }
          if (this.zeroShops.length) {
            this.ngbRef = this.modalService.open(this.multipleSelectionAlert, {backdrop: 'static'});
          }
        } else {
          if ((this.prevSelectedCustomers.length !== openPanel.selected.length) && this.checkCount !== 1) {
            for (let shops of openPanel.selected) {
              if (this.edShopCopy && this.edShopCopy.shopName !== shops.shopName) {
                let shopCount = this.shopNameandCount.get(shops.shopName);
                let newshopCount = parseInt(shopCount, 10) - 1;
                if (newshopCount === 0) {
                  this.zeroShops.push(shops.shopName);
                }
                this.shopNameandCount.set(shops.shopName, newshopCount);
              }
            }
            if (this.zeroShops.length) {
              this.ngbRef = this.modalService.open(this.multipleSelectionAlert, {backdrop: 'static'});
            }
          }

        }
        this.checkCount = 1;
      }
      this.disableSave(openPanel);
    } else {
      this.shopNameandCount.clear();
      this.prevSelectedCustomers = [];
      this.zeroShops = [];
      this.checkCount = 0;
      this.getshopCounts();
      this.disableShopSave = !event.checked;
    }
  }
}
