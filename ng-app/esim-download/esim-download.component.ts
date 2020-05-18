import {Component, OnInit, ViewChild} from '@angular/core';
import {TimeoutService} from '../app/timeout/timeout.service';
import {TopBarService} from '../app/top-bar/top-bar.service';
import {EsimDownloadService} from './esim-download.service';
import {ActivatedRoute} from '@angular/router';
import {Column} from '../sncr-components/sncr-datatable/column';


@Component({
  selector: 'esim-download',
  templateUrl: 'esim-download.component.html',
  styleUrls: ['esim-download.component.scss']
})

export class EsimDownloadComponent implements OnInit {

  selectedVfShop: any;
  vfUser = false;
  shopName: string;
  columns = [];
  data: any;
  custLazyLoadUrl: string;
  loading = true;
  readonlyUser = false;
  configIdCust = 'a2c51271-ead5-1bc6-e053-1e07100a43e6_cust';
  configIdVf = 'a2c51271-ead5-1bc6-e053-1e07100a43e6_vf';

  constructor(protected route: ActivatedRoute,
              private timeoutService: TimeoutService,
              private topBarService: TopBarService,
              private esimDownloadService: EsimDownloadService) {}

  ngOnInit() {
    // get the user details-if admin user show shoplist to select a shop and proceed to download else show download page
    this.getUser();
    if (!this.vfUser) {
      this.getTableData(this.configIdCust);
    }
  }

  getUser() {
    this.topBarService.getData().then(response => {
        this.vfUser = response.vfUser;
        this.readonlyUser = response.isReadOnlyUser
      });

  }

  getTableData(configId) {
    this.esimDownloadService.getColumns(configId).subscribe(response => {
      this.columns = response.filter(c => c.field !== '8');
    });
    this.custLazyLoadUrl = '/buyflow/rest/table/custom/' + configId ;
    this.loading = false;
  }

  setColumnTemplate(cols: Column[], field: string, template: any) {
    if (cols && cols.find(c => c.field === field) && !cols.find(c => c.field === field).bodyTemplate) {
      cols.find(c => c.field === field).bodyTemplate = template;
    }
  }

  selectedShop(event: any) {
    let shopDto = {
      shopId: event.data.shopId,
      skeletonContractNo: event.data.contract,
      shopName: event.data.shopName
    };
    this.setShopId(shopDto);

  }

  setShopId(shopDto) {
    this.esimDownloadService.setShopSession(shopDto.shopId).subscribe(resp => {
      if (resp) {
        this.shopName = shopDto.shopName;
        this.selectedVfShop = true;
        this.getTableData(this.configIdVf);
      }
    });
  }

  downloadPDF(row) {
    if (!this.readonlyUser) {
      this.esimDownloadService.downloadPDF(row[9]);
    }
  }

}