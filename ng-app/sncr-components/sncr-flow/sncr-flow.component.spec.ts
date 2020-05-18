import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {SncrFlowComponent} from './sncr-flow.component';
import {SncrFlowSectionComponent} from './sncr-flow-section.component';
import {SncrFlowService} from './sncr-flow.service';
import {PageScrollService} from 'ngx-page-scroll';
import {CommonModule} from '@angular/common';

describe('sncr-flow-component:', () => {
  let fixture;

  @Component({
    template: `
        <sncr-flow>
            <sncr-flow-section title="title 1"></sncr-flow-section>
            <sncr-flow-section title="title 2"></sncr-flow-section>
            <sncr-flow-section title="title 3" [hideStepper]="hideThird"></sncr-flow-section>
            <sncr-flow-section title="title 4"></sncr-flow-section>
        </sncr-flow>
    `
  })
  class TestHostComponent {
    hideThird = false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [TestHostComponent, SncrFlowComponent, SncrFlowSectionComponent],
      providers: [SncrFlowService, {provide: PageScrollService, useValue: {}}]
    });

    fixture = TestBed.createComponent(TestHostComponent);
  });

  test('Count should be correlative', () => {
    fixture.detectChanges();

    const circleEls = getCircleElements(fixture);

    expect(circleEls.length).toBe(4);
    checkCorrelativeCounts(circleEls);
  });

  test('Count should be correlative after hiding and showing steps', () => {
    const component = fixture.componentInstance;

    // Hiding one section in the middle
    component.hideThird = true;
    fixture.detectChanges();

    let circleEls = getCircleElements(fixture);

    expect(circleEls.length).toBe(3);
    checkCorrelativeCounts(circleEls);

    // Showing back all the sections
    component.hideThird = false;
    fixture.detectChanges();

    circleEls = getCircleElements(fixture);

    expect(circleEls.length).toBe(4);
    checkCorrelativeCounts(circleEls);
  });

  function getCircleElements(componentFixture) {
    return componentFixture.nativeElement.querySelectorAll('.number');
  }

  function checkCorrelativeCounts(circleEls) {
    circleEls.forEach((circleEl, i) => {
      expect(circleEl.textContent).toBe(`${i + 1}`);
    });
  }
});