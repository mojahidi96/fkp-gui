import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ElementRef
} from '@angular/core';
import {NotificationHandlerService} from './notification-handler.service';
import {UtilsService} from '../sncr-commons/utils.service';
import {Language} from 'angular-l10n';
import {PageScrollInstance, PageScrollService} from 'ngx-page-scroll';

@Component({
  selector: 'sncr-notification',
  templateUrl: 'sncr-notification.component.html',
  styleUrls: ['sncr-notification.component.scss']
})
export class SncrNotificationComponent implements OnInit, OnDestroy {
  @Input() heading: string;
  @Input() message: string;
  @Input() type: 'basic' | 'success' | 'info' | 'warning' | 'error' | 'info-gray' = 'basic';
  @Input() parameters: {};
  @Input() handler: NotificationHandlerService;
  @Input() dismissible = false;
  @Input() scrollableSelector: string;
  @Input() errors: any[];
  @Input() contentClass: string;

  @Output() onScroll = new EventEmitter();
  @Output() onCloseNotification = new EventEmitter();

  @Language() lang: string;

  private notificationSubscription: any;
  private dismissed = false;

  constructor(
    private pageScrollService: PageScrollService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (this.handler) {
      this.notificationSubscription = this.handler.notifications$.subscribe(
        notificationHandlerService => {
          this.message = notificationHandlerService.message;
          this.type = notificationHandlerService.type;
          this.parameters = notificationHandlerService.parameter;
          this.errors = notificationHandlerService.errors;
          if (UtilsService.notNull(this.message)) {
            setTimeout(() => {
              let scrollConfig: any = {
                document: document,
                scrollTarget: this.elementRef.nativeElement,
                pageScrollOffset: 10,
                scrollingViews: [
                  document.documentElement,
                  document.body,
                  document.body.parentNode
                ]
              };

              if (this.scrollableSelector  && UtilsService.notNull(document.querySelector(this.scrollableSelector))) {
                scrollConfig.scrollingViews.push(
                  document.querySelector(this.scrollableSelector)
                );
              }

              const pageScrollInstance = PageScrollInstance.newInstance(
                scrollConfig
              );
              this.pageScrollService.start(pageScrollInstance);

              this.onScroll.emit();
            }, 100);
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.handler) {
      this.notificationSubscription.unsubscribe();
    }
  }

  isVisible(): boolean {
    return (
      (!this.dismissed && !this.handler) ||
      (UtilsService.notNull(this.message) && !!this.handler)
    );
  }

  closeNotification() {
    this.onCloseNotification.emit(true);
    if (this.handler) {
      this.handler.clearNotification();
    } else {
      this.dismissed = true;
    }
  }
}

