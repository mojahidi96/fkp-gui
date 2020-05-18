import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CreateShopService} from './create-shop.service';
import {FnShop} from '../common/fn-shop';
import {FnCommonService} from '../common/fncommon.service';
import {FixedNetService} from '../fixednet.service';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {ShopValidation} from '../common/validation/shop-validation-config';
import {FnUserDetails} from '../common/fn-user-details';
import {CreateEditShop} from '../common/create-edit-shop/create-edit-shop';

@Component({
  selector: 'create-shop-app',
  templateUrl: 'create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent extends CreateEditShop implements OnInit {
  customerHierarchy: string;
  rootCustomers: Array<any> = [];
  rootCustomersCopy: Array<FnShop> = [];
  customers: Array<any> = [];
  customersCopy: Array<any> = [];
  showCustomerNumber = false;
  customerNumber: string;
  fnShop: FnShop;
  shopName: string;
  customerName: string;
  loading = false;
  errorMessage: string;
  shopNames: Array<any> = [];
  shopNamesCopy: Array<any> = [];
  isCustomerNo = false;
  rootCustomerName: string;
  notify: NotificationHandlerService = new NotificationHandlerService();
  fnUser: FnUserDetails = new FnUserDetails();
  showValidation = false;

  constructor(private router: Router, private createShopService: CreateShopService, private fixedNetService: FixedNetService,
              private fnCommonService: FnCommonService) {
    super(fixedNetService);
  }

  ngOnInit(): void {
    this.notify.clearNotification();
    this.loading = true;
    this.fnShop = new FnShop();
    this.fnUser = this.fixedNetService.getFnUser();


    this.createShopService.getRootCustomers().then(data => {
      this.loading = false;
      this.rootCustomersCopy = data;
      this.rootCustomers = this.reformatDropdownArray(data, 'fnRootCustomerNumber');
    }, error => {
      this.loading = false;
      this.notify.printErrorNotification(error);
    });

    this.createShopService.getShopList().then(data => {
      this.loading = false;
      this.shopNamesCopy = data;
      this.shopNames = this.reformatDropdownArray(data, 'shopName');
    }, error => {
      this.loading = false;
      this.notify.printErrorNotification(error);
    });


  }

  changeOnModel() {
    if (this.customerHierarchy && this.customerHierarchy.trim()) {
      this.showCustomerNumber = this.rootCustomers.some(element => {
        return element.data === this.customerHierarchy.trim();
      });

      if (this.showCustomerNumber) {
        this.loading = true;
        this.fnShop.fnRootCustomerNumber = this.customerHierarchy.trim();
        this.rootCustomerName = this.getRootCustomerName();
        this.createShopService.getCustomers(this.fnShop).then(data => {
          this.loading = false;
          this.customersCopy = [...data];
          this.customers = this.reformatDropdownArray(data, 'fnCustomerNumber');
        }, error => {
          this.loading = false;
          this.notify.printErrorNotification(error);
        });
      } else {
        this.customers = [];
        this.customerNumber = '';
      }
    } else {
      this.showCustomerNumber = false;
    }
  }

  changeOnModelCustomerNo() {
    if (this.customerNumber && this.customerNumber.trim()) {
      this.isCustomerNo = this.customers.some(element => {
        return element.data === this.customerNumber.trim();
      });
      this.customerName = this.isCustomerNo ? this.getCustomerName() : '';
    } else {
      this.isCustomerNo = false;
    }
  }

  createShop(): void {
    this.showValidation = true;
    if (this.validateFields()) {
      this.loading = true;
      this.fnShop.shopName = this.shopName.trim();
      this.fnShop.fnRootCustomerNumber = this.customerHierarchy.trim();
      this.fnShop.fnCustomerNumber = this.customerNumber ? this.customerNumber.trim() : '';
      this.fnShop.rootCustomerName = this.getRootCustomerName();
      this.fnShop.customerName = this.customerNumber ? this.getCustomerName() : '';

      this.createShopService.createShop(this.fnShop).then(data => {
          // this.printSuccessNotification('Create shop was successful.');
          this.loading = false;
          if (data.success) {
            this.fnShop.shopId = data.shopId;
            this.fixedNetService.setFnShop(this.fnShop);
            this.router.navigate(['/fixednet/editshop/edit']);
          } else {
            this.notify.printErrorNotification('Dieser Name ist bereits vergeben. Bitte geben Sie einen neuen Namen ein.');
          }
        },
        error => {
          this.loading = false;
          this.notify.printErrorNotification(error);
        }
      );
    }
  }

  reformatDropdownArray(data: Array<any>, field: string): any[] {
    return data.map(element => {
      if (element[field]) {
        element.data = element[field];
      }
      return element;
    });
  }

  getRootCustomerName(): string {
    return this.rootCustomersCopy.find(element => {
      return element.fnRootCustomerNumber === this.customerHierarchy.trim();
    }).rootCustomerName;
  }

  getCustomerName(): string {
    return this.customersCopy.find(element => {
      return element.fnCustomerNumber === this.customerNumber.trim();
    }).customerName;
  }

  isCustomerValid(): boolean {
    return this.customers.some(element => {
      return element.data === this.customerNumber.trim();
    });
  }

  disableCreateShop(): boolean {
    if (this.fnUser && this.fnUser.isReadOnlyUser) {
      return true;
    }
    if (!this.shopName || this.shopName.trim().length < ShopValidation.SHOP_MIN_LENGTH) {
      return true;
    }
    if (!this.customerHierarchy || !this.showCustomerNumber) {
      return true;
    }
    if (!this.customerNumber) {
      return false;
    } else if (!this.isCustomerValid()) {
      return true;
    }
    return false;
  }

  validateFields(): boolean {
    if (!this.shopName || this.shopName.trim().length > ShopValidation.SHOP_MAX_LENGTH) {
      return this.setValidateErrorMessage(ShopValidation.SHOP_MAX_LENGTH_ERROR);
    }
    if (!this.shopName.match('^[^|;\\\\<>?]+$') || this.isInvalidInput(this.shopName)) {
      return this.setValidateErrorMessage(ShopValidation.SHOP_ERROR_MSG_CHARS);
    }
    if (!this.isFullRefresh() && !this.customerNumber) {
      return this.setValidateErrorMessage(ShopValidation.FULL_REFRESH_CUSTOMER_REQUIRED);
    }
    return true;
  }

  setValidateErrorMessage(message: string): boolean {
    this.notify.printErrorNotification(message);
    return false;
  }

  isFullRefresh(): boolean {
    return this.rootCustomersCopy.find(element => {
      return element.fnRootCustomerNumber === this.customerHierarchy.trim();
    }).fullRefresh;
  }
}