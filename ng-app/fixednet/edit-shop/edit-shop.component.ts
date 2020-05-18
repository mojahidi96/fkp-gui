import {Component, OnInit, ViewChild} from '@angular/core';
import {FnBillingAccPanel, FnCustomer, FnCustomerPanel, FnShop} from '../common/fn-shop';
import {EditShopService} from './edit-shop.service';
import {EditShopPanelConfig, popupMsgs} from './edit-shop-panel-config';
import {FixedNetService} from '../fixednet.service';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {NgbAccordion, NgbModal, NgbModalRef, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {FnBillingAccount} from '../common/fn-billing-account';
import {FnProduct} from '../common/fn-product';
import {FnSalesProduct} from '../common/fn-sales-product';
import {ShopValidation} from '../common/validation/shop-validation-config';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {FnUserDetails} from '../common/fn-user-details';
import {CreateEditShop} from '../common/create-edit-shop/create-edit-shop';
import {TranslationService} from 'angular-l10n';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'edit-shop-app',
  templateUrl: 'edit-shop.component.html',
  styleUrls: ['edit-shop.component.scss']
})
export class EditShopComponent extends CreateEditShop implements OnInit {
  selected = [];
  fnShop: FnShop;
  fnShopCopy: FnShop;
  panels: Array<any> = [];
  private panel;
  private panelOpen;
  loading = false;
  @ViewChild('accordion') accordion: NgbAccordion;
  @ViewChild('selectionAlert') selectionAlert: NgbModal;
  @ViewChild('multipleSelectionAlert') multipleSelectionAlert: NgbModal;
  fnBillingAccounts: Array<FnBillingAccount> = [];
  fnProducts: Array<FnProduct> = [];
  private fnBillingAccount: FnBillingAccount;
  private fnProduct: FnProduct;
  @ViewChild('tab') tab: NgbTabset;
  private fnSalesProduct: FnSalesProduct;
  private fnSalesProducts: Array<FnSalesProduct> = [];
  ngbRef: NgbModalRef;
  @ViewChild('customerAlert') customerAlert: NgbModal;
  @ViewChild('billError', {static: true}) billError;
  @ViewChild('customerNo', {static: true}) customerNo;
  popupMsgs: any;
  popupMessage: string;
  type: string;
  noBillingCustomers: Array<any>;
  notify: NotificationHandlerService = new NotificationHandlerService();
  fnUser: FnUserDetails = new FnUserDetails();
  showValidation = false;
  noBillingForCustMsg = '';
  private fnCustomer: FnCustomer;
  readonly CUSTOMER = 'customer';
  readonly BILLING = 'billing';
  fnCustomerPanel: FnCustomerPanel;
  fnBillingAccPanel: FnBillingAccPanel;
  shopNameandCount = new Map();
  shopCounts: any;
  prevSelectedCustomers: any = [];
  zeroShops: any = [];
  checkCount = 0;
  selectedShop: string;

  constructor(private fixedNetService: FixedNetService, private editShopService: EditShopService,
              private modalService: NgbModal, private translation: TranslationService) {
    super(fixedNetService);
  }

  ngOnInit(): void {
    this.notify.clearNotification();
    this.fnShop = this.fixedNetService.getFnShop();
    this.fnUser = this.fixedNetService.getFnUser();
    this.panels = EditShopPanelConfig;
    this.popupMsgs = popupMsgs;
    this.noBillingForCustMsg = this.translation.translate('EDIT_SHOP_CUSTOMER-NO_BILLING_NOS');

    // tool tip error when no billing account
    this.panels[1].columns[0].bodyTemplate = this.billError;
    this.panels[2].columns[3].bodyTemplate = this.customerNo;

    if (this.fnShop && this.fnShop.shopId) {
      // If shopId exists then set it to the respective beans
      // which can be used as request obj in APIs
      this.fnProduct = new FnProduct();
      this.fnProduct.shopId = this.fnShop.shopId;

      this.fnSalesProduct = new FnSalesProduct();
      this.fnSalesProduct.shopId = this.fnShop.shopId;

      this.fnCustomer = new FnCustomer();
      this.fnCustomer.shopId = this.fnShop.shopId;
    }

    this.fnShopCopy = {...this.fnShop};
    this.fnCustomerPanel = new FnCustomerPanel();
    this.fnBillingAccPanel = new FnBillingAccPanel();
  }

  onSuccessResponse(message: string, collapse: boolean) {
    this.loading = false;
    this.notify.printSuccessNotification(message);
    this.accordion.activeIds = collapse ? '' : this.accordion.activeIds;
  }

  onErrorResponse(message: string, collapse: boolean) {
    this.loading = false;
    this.panel.rows = [];
    this.accordion.activeIds = collapse ? '' : this.accordion.activeIds;
    this.notify.printErrorNotification(message);
  }

  successOnTabOpen(tab: any, data: any) {
    this.loading = false;
    tab.rows = data;
    tab.selected = this.filterSelectedData([...data]);
  }

  errorOnPanelOpen(error: string) {
    this.onErrorResponse(error, false);
    this.panel.rows = [];
    this.panel.selected = [];
  }

  savePanelEditShop(id: string): void {
    this.panelOpen = this.getPanelOpened(this.accordion.activeIds[0]);
    switch (id) {
      case 'setup-1':
        this.showValidation = true;
        if (this.fnShop && this.validateShopFields()) {
          this.fnShop.shopName = this.fnShop.shopName.trim();
          this.loading = true;
          this.editShopService.savePanelData(this.fnShop, this.panelOpen.saveUrl).then(() => {
              this.onSuccessResponse('Setup->Allgemein erfolgreich gespeichert', true);
              this.assignShopCopy();
            },
            error => {
              this.onErrorResponse(error, true);
              this.fnShop = {...this.fnShopCopy};
            });
        }
        break;

      // save the customer list
      case '1':
        this.type = this.CUSTOMER;
        let selectedCustomers: Array<FnCustomer> = this.panelOpen.selected;
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
        this.fnBillingAccounts = this.panelOpen.rows;
        if (this.fnBillingAccounts && this.fnBillingAccounts.length) {
          this.noBillingCustomers = this.customersWithNoBilling();
          if (this.noBillingCustomers && this.noBillingCustomers.length) {
            this.popupMessage = this.translation.translate('EDIT_SHOP_BILLING-NO_BILLING_NOS_SELECTED');
            this.ngbRef = this.modalService.open(this.customerAlert, {backdrop: 'static'});
          } else {
            this.saveCustBillingData(false, this.type);
          }
        } else {
          this.saveCustBillingData(false, this.type);
        }
        break;
    }
  }

  panelChange(event: any): void {
    // this.panel will be set with the current panel i.e opened
    this.panel = this.getPanelOpened(event.panelId);
    if (this.panel && event.nextState) {
      this.loading = true;
      switch (this.panel.id) {
        case 'setup-1':
          this.editShopService.getShopSetup(this.fnShop, this.panel.getUrl)
            .pipe(finalize(() => this.loading = false))
            .subscribe((data: FnShop) => {
                this.setShopSetupData(data);
              },
              error => {
                this.notify.printErrorNotification(error);
              });

          break;

        case '1':
          this.editShopService.getCustomerPanelData(this.fnShop, this.panel.getUrl)
            .pipe(finalize(() => this.loading = false))
            .subscribe(data => {
                this.successOnCustomerPanelOPened(data, this.panel);
              },
              error => {
                // dont collapse back the panel since we want the user to see empty data table here
                this.errorOnPanelOpen(error);

              });
          this.getshopCounts();
          break;

        case '2':
          this.editShopService.getBillingPanelData(this.fnShop, this.panel.getUrl)
            .pipe(finalize(() => this.loading = false))
            .subscribe(data => {
                this.successOnBillingPanelOPened(data, this.panel);
              },
              error => {
                this.errorOnPanelOpen(error);
              });
          break;

        case '3':
          // product list assuming the first tab is always active with index as 0
          let event1: any = {
            'nextId': ''
          };
          event1.nextId = '0';
          this.tabChange(event1);
          break;
      }
    }
  }

  tabChange(event: any): void {
    let tabOpen = this.getTabOpened(event.nextId);
    if (tabOpen && event.nextId) {
      this.loading = true;
      switch (event.nextId) {
        case '0':
          this.editShopService.getFnData(this.fnProduct, tabOpen.getUrl).then(data => {
              this.successOnTabOpen(tabOpen, data);
            },
            error => {
              this.errorOnPanelOpen(error);
            });
          break;
        case '1':
          this.editShopService.getFnData(this.fnSalesProduct, tabOpen.getUrl).then(data => {
              this.successOnTabOpen(tabOpen, data);
            },
            error => {
              this.errorOnPanelOpen(error);
            });
          break;
      }
    }
  }

  setTabActive(id: string): void {
    setTimeout(() => this.tab.activeId = (parseInt(id, 10) + 1).toString());
  }


  // make the API Call to save product list
  // make the API call to get the sales products based on PCN
  saveTabEditShop(id: string): void {
    let tabOpen = this.getTabOpened(id);
    switch (id) {
      case ('0'):
        if (tabOpen.selected.length) {
          this.loading = true;
          this.fnProducts = tabOpen.rows;

          this.editShopService.saveData(this.fnProducts, tabOpen.saveUrl).then(data => {
              this.notify.clearNotification();
              this.loading = false;
              const nextTabId = parseInt(id, 10) + 1;
              this.panel.tabs[nextTabId].rows = [...data];
              // reset selections
              this.panel.tabs[nextTabId].selected = data.filter(val => val._sncrChecked);
              this.setTabActive(id);
            },
            error => {
              this.errorOnPanelOpen(error);
            });
        } else {
          this.notify.printErrorNotification('EDIT_SHOP_PRODUCT_COMMENT_NO');
        }
        break;
      case ('1'):
        this.loading = true;
        this.fnSalesProducts = tabOpen.rows;

        this.editShopService.saveData(this.fnSalesProducts, tabOpen.saveUrl).then(() => {
            this.onSuccessResponse('Service-Scheine und Produkte erfolgreich gespeichert', true);
          },
          error => {
            this.errorOnPanelOpen(error);
          });
        break;
    }
  }

  disableEditShopSave(): boolean {
    if (this.panel) {
      return !this.panel.rows.some(fnShop => {
        return fnShop._sncrChecked;
      });
    }
  }

  disableSaveButton(): boolean {
    if (this.fnUser && this.fnUser.isReadOnlyUser) {
      return true;
    }
    if (!this.fnShop.shopName || (this.fnShop.shopName && this.fnShop.shopName.trim().length < ShopValidation.SHOP_MIN_LENGTH)) {
      return true;
    }
    return false;
  }

  filterSelectedData(fnPanelRows: Array<any>): Array<FnShop> {
    return fnPanelRows.filter(row => {
      return row._sncrChecked;
    });
  }

  validateShopFields(): boolean {
    if (!this.fnShop.shopName || !this.fnShop.shopName.trim()) {
      return this.setValidateErrorMessage(ShopValidation.SHOP_ERROR_MSG_EMPTY);
    }
    if (this.fnShop.shopName && (!this.fnShop.shopName.match('^[^|;\\\\<>?]+$') || this.isInvalidInput(this.fnShop.shopName))) {
      return this.setValidateErrorMessage(ShopValidation.SHOP_ERROR_MSG_CHARS);
    }
    if (this.fnShop.shopName.trim().length > ShopValidation.SHOP_MAX_LENGTH) {
      return this.setValidateErrorMessage(ShopValidation.SHOP_MAX_LENGTH_ERROR);
    }
    return true;
  }

  setValidateErrorMessage(message: string): boolean {
    this.notify.printErrorNotification(message);
    return false;
  }


  isCustomerAssignedToAnotherShop(customers: Array<FnCustomer>): boolean {
    return customers.some((customer) => {
      return customer.shopName ? customer.shopName.trim().toLowerCase() !== this.fnShop.shopName.trim().toLowerCase() : false;
    });
  }

  saveCustBillingData(modal: boolean, type: string) {
    if (modal) {
      this.ngbRef.close('ok');
    }
    this.loading = true;
    switch (type) {
      case this.CUSTOMER:
        this.fnCustomerPanel.autoAssign = this.panelOpen.autoAssign;
        this.fnShop.fnCustomerPanel = this.fnCustomerPanel;
        this.editShopService.savePanelData(this.fnShop, this.panelOpen.saveUrl).then(() => {
            this.onSuccessResponse('Kundennummern erfolgreich gespeichert', true);
          },
          error => {
            this.onErrorResponse(error, true);
          });
        break;
      case this.BILLING:
        this.fnBillingAccPanel.autoAssign = this.panelOpen.autoAssign;
        this.fnShop.fnBillingAccPanel = this.fnBillingAccPanel;
        this.editShopService.savePanelData(this.fnShop, this.panelOpen.saveUrl).then(() => {
            this.onSuccessResponse('Rechnungskonten erfolgreich gespeichert', true);
          },
          error => {
            this.onErrorResponse(error, true);
          });
        break;
    }
  }


  getPanelOpened(id: string): any {
    return this.panels.find(panel => panel.id === id);
  }

  getTabOpened(id: string): any {
    return this.panel.tabs.find(tab => tab.id === id);
  }


  customersWithNoBilling(): Array<any> {
    let accounts = [...this.fnBillingAccounts];
    let customersChecked = [];
    let customersUnChecked = [];
    accounts.filter(account => account._sncrChecked).forEach(account => {
      if (account.customerNo) {
        if (account.customerNo.includes(',')) {
          // customer nos with , separated
          if (customersChecked.length > 0) {
            customersChecked = [...customersChecked, ...account.customerNo.split(',')];
          } else {
            customersChecked = account.customerNo.split(',');
          }
        } else {
          if (customersChecked.indexOf(account.customerNo) === -1) {
            // if not exists then push
            customersChecked.push(account.customerNo);
          }
        }
      }
    });


    let accounts1 = [...this.fnBillingAccounts];
    accounts1.filter(account => !account._sncrChecked).forEach(account1 => {
      if (account1.customerNo) {
        if (account1.customerNo.includes(',')) {
          // customer nos with , separated
          if (customersUnChecked.length > 0) {
            customersUnChecked = [...customersUnChecked, ...account1.customerNo.split(',')];
          } else {
            customersUnChecked = account1.customerNo.split(',');
          }
        } else {
          if (customersUnChecked.indexOf(account1.customerNo) === -1) {
            // if not exists then push
            customersUnChecked.push(account1.customerNo);
          }
        }
      }
    });

    let noBillingCustomers = customersUnChecked.filter(customerUnChecked => !customersChecked.includes(customerUnChecked));
    noBillingCustomers = noBillingCustomers.filter((v, i, self) => self.indexOf(v) === i);
    return noBillingCustomers;
  }

  getCustomerNo(customerNo: string) {
    if (UtilsService.notNull(customerNo)) {
      return customerNo.split(',');
    } else {
      return [];
    }
  }

  getshopCounts(): void {
    this.editShopService.getCustomersShopCount(this.fnShop).subscribe(customerShopCount => {
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
      if (this.fnShopCopy && this.fnShopCopy.shopName !== shopname) {
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
  }


  onSelection(event: any, panel: any) {
    // We want the logic below only for customer selection
    if (event && event.data && JSON.stringify(event.data) !== '{}' && panel && panel.id === '1') {
      this.prevSelectedCustomers.push(event.data);
      let shopName = event.data.shopName;
      let newshopCount;
      if (this.fnShopCopy && this.fnShopCopy.shopName !== shopName) {
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
  }


  successOnCustomerPanelOPened(response: FnCustomerPanel, panel: any) {
    // set the auto assign for customer panel
    if (UtilsService.notNull(response)) {
      this.setAutoAssignForPanel(response.autoAssign);
      this.setCustomerBillingPanelData(response.fnCustomers, panel);
      // assign customer panel data from the response
      this.fnCustomerPanel = response;
    }
  }

  assignShopCopy() {
    this.fnShopCopy = {...this.fnShop};
  }

  successOnBillingPanelOPened(response: FnBillingAccPanel, panel: any) {
    if (UtilsService.notNull(response)) {
      this.setAutoAssignForPanel(response.autoAssign);
      this.setCustomerBillingPanelData(response.fnBillingAccounts, panel);
      // assign billing panel data from the response
      this.fnBillingAccPanel = response;
    }
  }

  setCustomerBillingPanelData(rows, panel) {
    if (rows) {
      panel.rows = rows;
      panel.selected = this.filterSelectedData([...rows]);
    }
  }

  setAutoAssignForPanel(autoAssign) {
    this.panel.autoAssign = autoAssign;
  }

  private setShopSetupData(data: FnShop) {
    if (UtilsService.notNull(data)) {
      this.fnShop.orderApproval = data.orderApproval;
      this.fnShop.tfa = data.tfa;
      this.fnShop.shopName = data.shopName;
      this.assignShopCopy();
    }
  }

  onAllCheck(event: any, openPanel) {
    if (event.checked) {
      if (openPanel && openPanel.id === '1') {
        if (this.prevSelectedCustomers.length && (this.prevSelectedCustomers.length !== openPanel.selected.length)
          && (this.checkCount !== 1)) {
          for (let shops of openPanel.selected) {
            for (let sel of this.prevSelectedCustomers) {
              if ((shops.fnCustomerNumber !== sel.fnCustomerNumber) && (this.fnShopCopy && this.fnShopCopy.shopName !== shops.shopName)) {
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
              if (this.fnShopCopy && this.fnShopCopy.shopName !== shops.shopName) {
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
    } else {
      this.shopNameandCount.clear();
      this.prevSelectedCustomers = [];
      this.zeroShops = [];
      this.checkCount = 0;
      this.getshopCounts();
    }
  }
}
