import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PageScrollService} from 'ngx-page-scroll';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TestMocksModule} from '../../../test-mocks/test-mocks.module';
import {TranslatePipe} from '../../../test-mocks/translate.pipe';
import {NotificationHandlerService} from './notification-handler.service';
import {TestUtils} from '../../../test-mocks/test-utils';
import {SncrNotificationComponent} from './sncr-notification.component';
import {SvgIconModule} from '../svg-icon/svg-icon.module';

describe('SncrNotificationComponent', () => {
  const pageScrollServiceMock = {start: jest.fn()};

  @Component({
    template: `
      <sncr-notification
        [handler]="notificationHandlerService"
        [dismissible]="dismissible"
        [message]="message"
        [parameters]="parameters"
        [scrollableSelector]="scrollableSelector"
        [type]="type"
        (onCloseNotification)="onCloseNotification.emit($event)"
        (onScroll)="onScroll.emit($event)"
      >
        My notification
      </sncr-notification>

      <div id="test"></div>
    `
  })
  class TestHostComponent {
    @Input() notificationHandlerService: NotificationHandlerService;
    @Input() dismissible;
    @Input() message;
    @Input() parameters;
    @Input() scrollableSelector;
    @Input() type;

    @Output() onCloseNotification = new EventEmitter();
    @Output() onScroll = new EventEmitter();
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let el;
  let component: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TestMocksModule, SvgIconModule],
      declarations: [SncrNotificationComponent, TestHostComponent],
      providers: [{provide: PageScrollService, useValue: pageScrollServiceMock}]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    el = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('without handler', () => {
    beforeEach(() => fixture.detectChanges());

    test('Should project inner content', () => {
      const contentEl = el.querySelector('.notification__content');

      expect(contentEl.textContent).toMatch('My notification');
    });

    test('Should change icon depending of type', () => {
      let iconEl = el.querySelector('.notification__icon');
      expect(iconEl).not.toBeNull();

      component.type = 'success';
      fixture.detectChanges();
      iconEl = el.querySelector('.notification__icon');
      expect(iconEl).not.toBeNull();

      component.type = 'error';
      fixture.detectChanges();
      iconEl = el.querySelector('.notification__icon');
      expect(iconEl).not.toBeNull();

      component.type = 'non-existing-type';
      fixture.detectChanges();
      iconEl = el.querySelector('.notification__icon');
      expect(iconEl).not.toBeNull();
    });

    test('Should show dismiss icon and remove notification on dismiss', () => {
      let buttonEl = el.querySelector('.notification__close');
      expect(buttonEl).toBeNull();

      component.dismissible = true;
      fixture.detectChanges();
      buttonEl = el.querySelector('.notification__close');
      expect(buttonEl).not.toBeNull();

      const mockFn = jest.fn();
      component.onCloseNotification.subscribe(mockFn);
      buttonEl.click();
      fixture.detectChanges();
      expect(mockFn.mock.calls.length).toBe(1);
      expect(el.querySelector('.notification')).toBeNull();
    });

    test('Should change content depending on message input', () => {
      let msgEl;

      component.message = 'msg1';
      fixture.detectChanges();
      msgEl = el.querySelector('.notification__message');
      expect(msgEl.textContent).toMatch('msg1');

      component.message = 'msg2';
      fixture.detectChanges();
      msgEl = el.querySelector('.notification__message');
      expect(msgEl.textContent).toMatch('msg2');
    });

    test('Should pass parameters to the translate pipe if set', () => {
      const translatePipeSpy = TranslatePipe.getTransformSpy();
      const msg = 'msg';
      const params = {p1: 'param1'};

      translatePipeSpy.mockClear();

      component.message = msg;
      fixture.detectChanges();

      component.parameters = params;
      fixture.detectChanges();

      const pipeCalls = translatePipeSpy.mock.calls;
      expect(pipeCalls[0][0]).toMatch(msg);
      expect(pipeCalls[0][2]).toBeUndefined();
      expect(pipeCalls[1][0]).toMatch(msg);
      expect(pipeCalls[1][2]).toBe(params);
    });
  });

  describe('with handler', () => {
    let notificationHandlerService;

    beforeEach(() => {
      notificationHandlerService = new NotificationHandlerService();
      component.notificationHandlerService = notificationHandlerService;
      fixture.detectChanges();
    });

    test('Should not show anything before emitting values', () => {
      expect(el.querySelector('.notification')).toBeNull();
    });

    test('Should change notification message, type and parameters after emitted values', () => {
      const translatePipeSpy = TranslatePipe.getTransformSpy();
      let iconEl, msgEl, msgText, params;

      // Testing success message
      msgText = 'msg-success';
      params = {p1: 'param-s'};
      translatePipeSpy.mockClear();
      notificationHandlerService.printSuccessNotification(msgText, params);
      fixture.detectChanges();

      [iconEl, msgEl] = TestUtils.getWithSelector(el, [
        '.notification__icon',
        '.notification__message'
      ]);

      expect(iconEl).not.toBeNull();
      expect(msgEl.textContent).toMatch(msgText);
      expect(translatePipeSpy.mock.calls[0][2]).toBe(params);

      // Testing error message
      msgText = 'msg-error';
      params = {p2: 'param-d'};
      translatePipeSpy.mockClear();
      notificationHandlerService.printErrorNotification(msgText, params);
      fixture.detectChanges();

      [iconEl, msgEl] = TestUtils.getWithSelector(el, [
        '.notification__icon',
        '.notification__message'
      ]);

      expect(iconEl).not.toBeNull();
      expect(msgEl.textContent).toMatch(msgText);
      expect(translatePipeSpy.mock.calls[0][2]).toBe(params);
    });

    test('Should clear notification and show when new notification is emitted when dismissible is true', () => {
      component.dismissible = true;
      notificationHandlerService.printSuccessNotification('test');
      fixture.detectChanges();
      expect(el.querySelector('.notification')).not.toBeNull();

      const closeBtn = el.querySelector('.notification__close');
      closeBtn.click();
      fixture.detectChanges();
      expect(el.querySelector('.notification')).toBeNull();
      expect(component.message).toBeUndefined();
      expect(component.type).toBeUndefined();
      expect(component.parameters).toBeUndefined();

      notificationHandlerService.printSuccessNotification('another test');
      fixture.detectChanges();
      expect(el.querySelector('.notification')).not.toBeNull();
    });

    test('Should scroll in default views and emit onScroll event', fakeAsync(() => {
      const onScrollSpy = jest.fn();
      component.onScroll.subscribe(onScrollSpy);
      pageScrollServiceMock.start.mockClear();
      notificationHandlerService.printSuccessNotification('test');
      fixture.detectChanges();
      tick(100);

      expect(pageScrollServiceMock.start.mock.calls.length).toBe(1);
      expect(
        pageScrollServiceMock.start.mock.calls[0][0]['_scrollingViews'].length
      ).toBe(3);
      expect(onScrollSpy.mock.calls.length).toBe(1);
    }));

    test('Should scroll in default and added views', fakeAsync(() => {
      pageScrollServiceMock.start.mockClear();
      component.scrollableSelector = '#test';
      notificationHandlerService.printSuccessNotification('test');
      fixture.detectChanges();
      tick(100);

      expect(pageScrollServiceMock.start.mock.calls.length).toBe(1);
      expect(
        pageScrollServiceMock.start.mock.calls[0][0]['_scrollingViews'].length
      ).toBe(4);
      expect(el.querySelector('#test')).toBe(
        pageScrollServiceMock.start.mock.calls[0][0]['_scrollingViews'][3]
      );
    }));
  });
});
