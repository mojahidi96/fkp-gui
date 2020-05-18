import {Component, DebugElement, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DisableControlDirective} from './disable-control.directive';
import {By} from '@angular/platform-browser';

@Component({
  template: '<input [formControl]="control" [disableControl]="isDisabled"/>'
})
class TestComponent {

  @Input() isDisabled: boolean;

  control: FormControl;

  constructor() {
    this.control = new FormControl()
  }
}


beforeEach(() => {

});

test('control it disables and enables depending on the value', () => {
  let fixture: ComponentFixture<TestComponent>, element: DebugElement;

  fixture = TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    declarations: [DisableControlDirective, TestComponent]
  }).createComponent(TestComponent);

  fixture.detectChanges();
  element = fixture.debugElement.query(By.css('input'));
  expect(element.properties['disabled']).toBeFalsy();

  fixture.componentInstance.isDisabled = true;
  fixture.detectChanges();
  element = fixture.debugElement.query(By.css('input'));
  expect(element.properties['disabled']).toBeTruthy();
});