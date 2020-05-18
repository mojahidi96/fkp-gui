import {Component, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TimeoutService} from './timeout.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TopBarService} from '../top-bar/top-bar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'timeout-popup',
  templateUrl: 'timeout.component.html',
  styleUrls: ['./timeout.component.scss']
})
export class TimeoutComponent implements OnInit, OnDestroy {

  @ViewChild('popup') popup: TemplateRef<any>;

  min: any;
  sec: any;

  private interval: any;
  private modalRef: NgbModalRef;
  private timeout$: Subscription;

  constructor(private timeoutService: TimeoutService, private modalService: NgbModal,
              private topBarService: TopBarService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.timeout$ = this.timeoutService.timeoutStream.subscribe(() => {
      if (NgZone.isInAngularZone()) {
        this.createModal();
      } else {
        this.ngZone.run(() => this.createModal());
      }
    });
  }

  ngOnDestroy(): void {
    this.cancelCountDown();

    if (this.timeout$) {
      this.timeout$.unsubscribe();
    }
  }

  keepAlive() {
    if (this.timeoutService.timeRemaining === 0) {
      if (this.timeoutService.ssoUser) {
        this.topBarService.terminateSession().then(() => {
            console.log('Your session was terminated after 30 minutes of inactivity.');
            // just navigate to login page now
            this.topBarService.keepAlive().then(() => console.log('navigate to login.'));
          }
        );
      } else if (this.timeoutService.vfUser) {
        window.location.href = '/portal/login.jsp';
      } else {
        window.location.href = '/buyflow/login.jsp';
      }
    } else {
      if (this.timeoutService.ssoUser) {
        this.keepSsoAlive();
      }
      this.topBarService.keepAlive().then(() => {
        this.cancelCountDown();
        this.modalRef.close();
        this.timeoutService.timeRemaining = 300000;
      });
    }

  }

  private createModal() {
    this.convertToMinute();
    this.modalRef = this.modalService.open(this.popup, {backdrop: 'static', windowClass: 'zindex-custom'});

    this.interval = setInterval(() => {
      this.timeoutService.timeRemaining -= 1000;
      this.convertToMinute();

      if (this.timeoutService.timeRemaining === 0) {
        this.cancelCountDown();
        this.timeout$.unsubscribe();
        console.log('t', this.timeout$);
      }
    }, 1000);
  }

  private convertToMinute() {
    this.min = Math.floor(this.timeoutService.timeRemaining / 60000);
    this.sec = ((this.timeoutService.timeRemaining % 60000) / 1000).toFixed(0);
  }

  private cancelCountDown() {
    clearInterval(this.interval);
  }

  keepSsoAlive() {
    let menubarKeepAliveImage = new Image();
    let doNotCacheDate = new Date();
    menubarKeepAliveImage.src = this.timeoutService.ssoKeepAliveUrl + '?rand=' + doNotCacheDate.getTime();
  }
}
