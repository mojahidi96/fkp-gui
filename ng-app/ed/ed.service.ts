import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TimeoutService} from '../app/timeout/timeout.service';
import {TopBar} from '../app/top-bar/top-bar';
import {EDUserDetails} from './common/ed-user-details';
import {EdShop} from './common/ed-shop';


@Injectable()
export class EDService implements OnInit {
  private edUser: EDUserDetails;
  private menus: TopBar;
  private edShop: EdShop;

  constructor(private http: HttpClient, private timeoutService: TimeoutService) {
    this.edUser = new EDUserDetails();
  }

  ngOnInit(): void {
    this.menus = this.timeoutService.topBar;
  }

  getEDUser(): EDUserDetails {
    if (this.menus) {
      this.edUser.vfUser = this.menus.vfUser;
      this.edUser.isReadOnlyUser = this.menus.isReadOnlyUser;
    } else {
      this.edUser.vfUser = this.timeoutService.vfUser;
      this.edUser.isReadOnlyUser = this.timeoutService.isReadOnlyUser;
    }
    return this.edUser;
  }

  setEDUser(edUser: EDUserDetails): void {
    this.edUser = edUser;
  }

  getEdShop(): EdShop {
    return this.edShop;
  }

  setEdShop(edShop: EdShop): void {
    this.edShop = edShop;
  }
}