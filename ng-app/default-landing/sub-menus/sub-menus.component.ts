import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TopBarService} from '../../app/top-bar/top-bar.service';
import {Subscription} from 'rxjs';
import {MenuItem} from '../../app/top-bar/top-bar';

@Component({
  selector: 'app-sub-menus',
  templateUrl: './sub-menus.component.html',
  styleUrls: ['./sub-menus.component.scss']
})
export class SubMenusComponent implements OnInit, OnDestroy {

  selected = [];
  loading = false;
  menuSelected: MenuItem;
  subscriptions: Subscription[] = [];
  flowType = '';

  constructor(private topBarService: TopBarService) {
    this.flowType = location.hash.split('/')[1];
  }

  ngOnInit(): void {
    this.subscriptions.push(this.topBarService.getMenuSelectedSubject().subscribe(menu => {
      this.menuSelected = menu;
      if (this.menuSelected) {
        sessionStorage.setItem('menuSelected', JSON.stringify(this.menuSelected));
      } else {
        this.menuSelected = JSON.parse(sessionStorage.getItem('menuSelected'));
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
