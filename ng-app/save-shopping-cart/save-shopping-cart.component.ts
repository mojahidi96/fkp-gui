import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CustomValidators} from '../sncr-components/sncr-controls/custom-validators';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cart} from '../shopping-cart/Cart';
import {SaveShoppingCartService} from './save-shopping-cart.service';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'save-shopping-cart',
  templateUrl: 'save-shopping-cart.component.html',
  styleUrls: ['save-shopping-cart.component.scss']
})

export class SaveShoppingCartComponent implements OnInit, OnDestroy {

  @ViewChild('saveCartModal') saveCartModal: NgbModal;

  @Input() cart: Cart;
  @Input() reviewBtnTitle = '';
  @Input() orderType = '';
  @Output() saveCart = new EventEmitter();
  @Output() processSaveCartDetails = new EventEmitter();
  @Input() shoppingCartType = '';
  @Input() prefix = '';

  private saveCartForm: FormGroup;
  private ngbRef: NgbModalRef;
  private processing = false;
  private notificationHandlerService: NotificationHandlerService = new NotificationHandlerService();
  private patternMap: any;
  private subscriptions: Subscription[] = [];


  constructor(private formBuilder: FormBuilder, private modalService: NgbModal,
              private service: SaveShoppingCartService, private route: ActivatedRoute) {

  }


  ngOnInit(): void {
    this.notificationHandlerService.clearNotification();

    this.subscriptions.push(this.route.data.subscribe((data: { pattern: any }) => {
      this.patternMap = data.pattern ? data.pattern : '';
    }));
  }


  openModal() {
      this.createSaveCartForm();
      this.ngbRef = this.modalService.open(this.saveCartModal, {backdrop: 'static', keyboard: false});
  }

  createSaveCartForm() {
    this.saveCartForm = this.formBuilder.group(
      {
        'cartName': [this.getCartName() || this.getDefaultCartName(), [CustomValidators.requiredWithTrim,
          CustomValidators.sanitization(this.patternMap), Validators.maxLength(255)]]
      }
    );
  }


  getDefaultCartName(): string {
    let orderType = this.orderType;
    let formattedDate = this.getFormattedDate(this.cart.dateTimeStamp);
    return `${orderType}${formattedDate}`;
  }


  getFormattedDate(value) {
    let dateFormat = '';
    let date = value ? new Date(value) : new Date();
    let day = date.getDate().toString(), month = (date.getMonth() + 1).toString(), year = date.getFullYear().toString(),
      hours = date.getHours().toString(), mins = date.getMinutes().toString(), sec = date.getSeconds().toString();

    dateFormat = [
        day.length === 1 ? '0' + day : day,
        month.length === 1 ? '0' + month : month,
        year
      ].join('.') + '_' +
      [
        hours.length === 1 ? '0' + hours : hours,
        mins.length === 1 ? '0' + mins : mins,
        sec.length === 1 ? '0' + sec : sec
      ].join(':');
    return `_${dateFormat}`;
  }

  processCart() {
    this.saveCart.emit();
  }

  closeModal() {
    this.ngbRef.close();
  }

  processSaveCart() {
    if (this.saveCartForm && this.saveCartForm.valid) {
      this.processing = true;
      let cart = new Cart();
      let cartName = this.saveCartForm.get('cartName').value ? this.saveCartForm.get('cartName').value : '';
      cart.shoppingCartName = cartName.trim();
      cart.shoppingCartType = this.shoppingCartType;
      if (cart.shoppingCartName) {
        this.service.isCartNameExist(cart)
          .pipe(finalize(() => this.processing = false))
          .subscribe(res => {
            if (res) {
              this.notificationHandlerService.clearNotification();
              this.notificationHandlerService.printErrorNotification('SAVE_CART-CART_EXIST_ERR_MSG');
            } else {
              // if cartName doesn't exist then call process cart API to save the current changed cartName
              this.closeModal();
              this.processSaveCartDetails.emit(cart);
            }
          }, error => this.notificationHandlerService.printErrorNotification('ERROR_TECHNICAL-ERR'));
      }

    }
  }


  getCartName(): string {
    return this.cart ? this.cart.shoppingCartName : '';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
