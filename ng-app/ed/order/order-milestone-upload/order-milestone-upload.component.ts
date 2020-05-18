import {Component, OnInit} from '@angular/core';
import {EDOrderDetailsService} from '../ed-order-details/ed-order-details.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'ed-order-milestone-upload',
  templateUrl: './order-milestone-upload.component.html',
  styleUrls: ['order-milestone-upload.scss'],
})
export class OrderMilestoneUploadComponent implements OnInit {
  isReadOnlyUser: boolean;

  constructor(private orderDetailsService: EDOrderDetailsService) {
  }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.orderDetailsService.getMenu().pipe(take(1)).subscribe(value => {
      this.isReadOnlyUser = value.isReadOnlyUser;
    })
  }

}
