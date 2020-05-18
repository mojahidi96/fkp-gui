import {Component, AfterViewInit, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import {FnShop} from '../common/fn-shop';
import {ActivatedRoute, Router} from '@angular/router';
import {SncrFlowSectionComponent} from '../../sncr-components/sncr-flow/sncr-flow-section.component';
import {FixedNetService} from '../fixednet.service';
import {CustomerDetailsService} from './customer-details.service';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {SncrFlowComponent} from '../../sncr-components/sncr-flow/sncr-flow.component';


@Component({
  selector: 'customer-details',
  templateUrl: 'customer-details.component.html',
  styleUrls: ['customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, AfterViewInit {

  selected = [];
  shops: Array<FnShop> = [];
  customers: Array<any> = [];
  loading = false;
  vfUser = false;
  hideShopSelection = true;
  idParam = 0;
  productOrderTitles = {
    1: 'Aufträge anzeigen',
    2: 'Produkte am Standort anzeigen'
  };
  headerTitle = '';
  @ViewChild('flow') flow: SncrFlowComponent;
  @ViewChild('shopSelection') shopSelection: SncrFlowSectionComponent;
  @ViewChild('customerSelection', { static: true}) customerSelection: SncrFlowSectionComponent;

  constructor(private route: ActivatedRoute, private fixedNetService: FixedNetService, private router: Router,
              private customerDetailsService: CustomerDetailsService, public notify: NotificationHandlerService,
              private cd: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        if (this.idParam !== 0 && this.idParam !== params['id']) {
          window.location.reload();
        }
        this.idParam = params['id'];
        this.headerTitle = this.productOrderTitles[this.idParam];
        this.customerDetailsService.setActiveTab(params['id']);
        this.getUser();
      }
    });
  }

  getUser() {
    this.customerDetailsService.getUserDetails().subscribe(userDetails => {
      this.vfUser = userDetails.vfUser;
      if (this.vfUser) {
        this.loading = true;
        this.hideShopSelection = false;
        this.customerDetailsService.getShopList().then(data => {
            this.loading = false;
            this.shops = data;
          },
          error => {
            this.loading = false;
            this.notify.printErrorNotification(error);
          }
        );
      } else {
        this.hideShopSelection = true;
        this.shopSelection.model = {};
        this.shopSelection.next(this.shopSelection.model, true);
      }
      this.cd.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.resetData();
  }

  resetData() {
    if (this.vfUser) {
      this.shopSelection.model = {
        selected: {}
      };
    }
    this.customerSelection.model = {
      selected: {}
    };
  }
}
