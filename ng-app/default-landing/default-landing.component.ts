import {Component, AfterViewInit, OnInit} from '@angular/core';
import {DefaultLandingService} from './default-landing.service';
import {ActivatedRoute} from '@angular/router';
import {TimeoutService} from '../app/timeout/timeout.service';
import {DefaultLandingMenusUtil} from './default-landing.menus.util';
import {Language} from 'angular-l10n';
import {FixedNetService} from '../fixednet/fixednet.service';

@Component({
  selector: 'default-landing',
  templateUrl: 'default-landing.component.html',
  styleUrls: ['default-landing.component.scss'],
  providers: [DefaultLandingMenusUtil]
})

export class DefaultLandingComponent implements OnInit {
  private menuJSON = [];
  loading = false;
  flowType: string;
  bannerTemplate = '';
  private banCount: any = 0;

  @Language() lang: string;

  constructor(private defaultLandingService: DefaultLandingService, private route: ActivatedRoute,
              private timeoutService: TimeoutService,
              private fixedNetServie: FixedNetService,
              private menuUtils: DefaultLandingMenusUtil) {
    this.flowType = location.hash.split('/')[1];
  }

  ngOnInit(): void {

    let menusData = [];
    this.loading = true;
    this.defaultLandingService.getBanner().then((html: any) => this.bannerTemplate = html);
    this.route.data.subscribe((data: { pattern: any }) => {
      let patternMap = data.pattern ? data.pattern : '';
      this.fixedNetServie.setPattern(patternMap);
      this.defaultLandingService.setPattern(patternMap);
    });

    if (this.timeoutService.topBar && Object.keys(this.timeoutService.topBar).length) {
      this.setBanCount(this.timeoutService.topBar);
      if (this.timeoutService.topBar.menus && this.timeoutService.topBar.menus.length) {
        menusData = this.timeoutService.topBar.menus;
        this.loading = false;
        this.menuJSON = this.menuUtils.addRouterUrl(menusData);
        this.fixedNetServie.setTopBar(this.timeoutService.topBar);
        this.defaultLandingService.setTopBar(this.timeoutService.topBar);
      }
    } else {
      this.defaultLandingService.getMenu(location.hash.split('/')[1]).then(data => {
        this.setBanCount(data);
        if (data && data.menus && data.menus.length) {
          this.loading = false;
          menusData = data.menus;
          this.menuJSON = this.menuUtils.addRouterUrl(menusData);
        }
      });
    }
  }

  setBanCount(obj: any) {
    if (obj && Object.keys(obj).length && obj.shop) {
      this.banCount = obj.shop.banExist;
    }
  }
}