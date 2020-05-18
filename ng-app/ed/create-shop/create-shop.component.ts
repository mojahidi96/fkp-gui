import {Component, OnInit} from '@angular/core';
import {CreateShopService} from './create-shop.service';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {ShopValidation} from '../../fixednet/common/validation/shop-validation-config';
import {EDService} from '../ed.service';
import {EdShop} from '../common/ed-shop';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {CreateEditShop} from '../../fixednet/common/create-edit-shop/create-edit-shop';
import {FixedNetService} from '../../fixednet/fixednet.service';
import {FnUserDetails} from '../../fixednet/common/fn-user-details';
import {EDOrderDetailsService} from '../order/ed-order-details/ed-order-details.service';


@Component({
  selector: 'create-shop-app',
  templateUrl: 'create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent extends CreateEditShop implements OnInit {

  shopName: string;
  customerName: string;
  customerHierarchy: string;
  shopNames: Array<any> = [];
  showValidation = false;
  rootCustomerName: string;
  customers: Array<any> = [];
  customerNumber: string;
  rootCustomers: Array<any> = [];
  rootCustomersCopy: Array<EdShop> = [];
  loading = true;
  notify: NotificationHandlerService = new NotificationHandlerService();
  shopNamesCopy: Array<any> = [];
  showCustomerNumber = false;
  edShop: EdShop;
  customersCopy: Array<any> = [];
  isCustomerNo = false;
  fnUser: FnUserDetails = new FnUserDetails();

  constructor(private createShopService: CreateShopService, private edService: EDService, private router: Router,
              private fixedNetService: FixedNetService, private edOrderDetailsService: EDOrderDetailsService) {
    super(fixedNetService)
  }

  ngOnInit(): void {
    this.notify.clearNotification();
    this.edShop = new EdShop();
    this.fnUser = this.edOrderDetailsService.getFnUser();
    this.getRootCustomerandShops();
  }

  private getRootCustomerandShops() {
    forkJoin(
      this.createShopService.getRootCustomers(),
      this.createShopService.getShopList()
    ).subscribe(([roorCustomers, shops]) => {
      this.loading = false;
      this.rootCustomersCopy = roorCustomers;
      this.rootCustomers = this.reformatDropdownArray(roorCustomers, 'fnRootCustomerNumber');
      this.shopNamesCopy = shops;
      this.shopNames = this.reformatDropdownArray(shops, 'shopName');
    }, error => {
      this.loading = false;
      this.notify.printErrorNotification(error);
    })
  }

  changeOnModel() {
    if (this.customerHierarchy && this.customerHierarchy.trim()) {
      this.showCustomerNumber = this.rootCustomers.some(element => {
        return element.data === this.customerHierarchy.trim();
      });

      if (this.showCustomerNumber) {
        this.loading = true;
        this.edShop.fnRootCustomerNumber = this.customerHierarchy.trim();
        this.rootCustomerName = this.getRootCustomerName();
        this.createShopService.getCustomers(this.edShop).subscribe(data => {
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

  reformatDropdownArray(data: Array<any>, field: string): any[] {
    return data.map(element => {
      if (element[field]) {
        element.data = element[field];
      }
      return element;
    });
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
      this.edShop.shopName = this.shopName.trim();
      this.edShop.fnRootCustomerNumber = this.customerHierarchy.trim();
      this.edShop.fnCustomerNumber = this.customerNumber ? this.customerNumber.trim() : '';
      this.edShop.rootCustomerName = this.getRootCustomerName();
      this.edShop.customerName = this.customerNumber ? this.getCustomerName() : '';

      this.createShopService.createShop(this.edShop).subscribe(data => {
          // this.printSuccessNotification('Create shop was successful.');
          this.loading = false;
          if (data.success) {
            this.edShop.shopId = data.shopId;
            this.router.navigate(['/ed/editshop/edit'], {state : {Shop : this.edShop}});
          } else {
            this.notify.printErrorNotification('ED-CREATE_SHOP_ERROR');
          }
        },
        error => {
          this.loading = false;
          this.notify.printErrorNotification(error);
        }
      );
    }
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

  isCustomerValid(): boolean {
    return this.customers.some(element => {
      return element.data === this.customerNumber.trim();
    });
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