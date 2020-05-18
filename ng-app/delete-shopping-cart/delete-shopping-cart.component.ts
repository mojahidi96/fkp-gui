import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {TranslationService} from 'angular-l10n';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DeleteShoppingCartService} from './delete-shopping-cart.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'delete-shopping-cart',
  templateUrl: 'delete-shopping-cart.component.html',
  styleUrls: ['delete-shopping-cart.component.scss']
})

export class DeleteShoppingCartComponent implements OnInit {

  @Input() rowData: any;
  @Input() prefix: any;
  @Input() landingPage = false;

  @Output() deletedResponse = new EventEmitter();

  shoppingCartId: string;
  shoppingCartName: string;

  @ViewChild('content') content: TemplateRef<any>;
  private modalRef: NgbModalRef;

  constructor(public translation: TranslationService,
              private deleteshoppingCartService: DeleteShoppingCartService,
              private modalService: NgbModal) {

  }

  ngOnInit(): void {

  }

  deleteCart() {
    this.modalRef = this.modalService.open(this.content);
  }

  deleteCartFromList() {
    let cartDetails = {
      shoppingCartId: this.rowData.shoppingCartId,
      shoppingCartName: this.rowData.shoppingCartName
    };

    this.deleteshoppingCartService.deleteCartFromList(cartDetails)
      .pipe(finalize(() => this.modalRef.close('ok')))
      .subscribe((response: any) => {
        // If an cart is not locked and exists
        if (response) {
          this.deletedResponse.emit(response);
        }
      }, (ex) => {
        // If an cart is locked and doesn't exists
        this.deletedResponse.emit({errors : ['SHOPPING_CART_EXCEPTION']});
      });
  }

}
