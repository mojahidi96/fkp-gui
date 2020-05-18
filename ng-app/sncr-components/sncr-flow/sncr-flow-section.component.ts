import {
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  NgZone,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {SncrFlowService} from './sncr-flow.service';
import {Section} from './section';
import {SncrFlowComponent} from './sncr-flow.component';
import {SncrSectionTemplateDirective} from './sncr-section-template.directive';
import {SncrSummaryTemplateDirective} from './sncr-summary-template.directive';
import {PageScrollInstance, PageScrollService} from 'ngx-page-scroll';
import {Subscription} from 'rxjs';

/**
 * Component to define each section inside a {@link SncrFlowComponent}.
 *
 * Each instance will have its own model that will be shared via the "exportAs" syntax.
 *
 * An html element should be provided with the attribute `summary` to act as a summary of the model when the flow
 * is collapsed.
 *
 * ### Example
 * ``` html
 *  <sncr-flow-section titleText="Section 1" #section1="sncrFlowSection">
 *    <div summary>Text: {{section1.model | json}}</div>
 *    Own model: {{section1.model | json}}
 *    <sncr-input [(ngModel)]="text">Some text</sncr-input>
 *    <sncr-button (click)="section1.next({text: text})">Next</sncr-button>
 *  </sncr-flow-section>
 * ```
 */
@Component({
  selector: 'sncr-flow-section',
  templateUrl: 'sncr-flow-section.component.html',
  exportAs: 'sncrFlowSection',
  styleUrls: ['sncr-flow-section.component.scss']
})
export class SncrFlowSectionComponent extends Section implements OnChanges, OnInit, DoCheck, OnDestroy {
  @ContentChild(SncrSummaryTemplateDirective) sectionSummary: SncrSummaryTemplateDirective;
  @ContentChild(SncrSectionTemplateDirective) sectionTemplate: SncrSectionTemplateDirective;

  @ViewChild('header') header: ElementRef;

  @Output() clearMessage = new EventEmitter();
  /**
   * The title of the section
   */
  @Input() titleText: string;
  @Input() modelSortKey: string;
  @Input() modelSortVal: string;
  @Input() eventType = '';

  @Input() changeLink: string;
  @Input() hideStepper = false;

  @Output() onActivate = new EventEmitter();

  prefilled = false;
  sectionNumber: number;
  isModelSortDone = false;

  private sncrFlow: SncrFlowComponent;
  private debounceFunc: any;
  private prevActive = false;
  private subscriptions$: Subscription[] = [];

  /**
   * @internal
   */
  constructor(injector: Injector, private flowService: SncrFlowService,
              private pageScrollService: PageScrollService, private ngZone: NgZone) {
    super();

    this.sncrFlow = injector.get(SncrFlowComponent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const hiddenStepperChange = changes['hideStepper'];
    if (hiddenStepperChange && hiddenStepperChange.previousValue !== hiddenStepperChange.currentValue) {
      this.flowService.newSectionsCount.emit();
    }
  }

  ngOnInit(): void {
    this.subscriptions$.push(
      this.flowService.newSectionsCount.subscribe(() => {
        this.sectionNumber = this.flowService.getSectionNumber(this);
      })
    );
  }

  ngDoCheck(): void {
    if (Object.keys(this.prevModel).length && this.active) {
      this.ngZone.runOutsideAngular(() => {
        clearTimeout(this.debounceFunc);
        this.debounceFunc = setTimeout(() => {
          const changed = !this.flowService.isModelSynch(this);

          if (this.changed !== changed) {
            this.changed = changed;
              this.ngZone.run(() => {
                if (changed) {
                  this.flowService.disableFollowing(this);
                } else {
                  this.flowService.enableFollowing();
                }
              });
          }
        }, 100);
      });
    }

    if (this.active) {
      if (!this.prevActive) {
        this.onActivate.emit();
      }
      this.prevActive = true;
    } else {
      this.prevActive = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(s => s.unsubscribe());
  }

  /**
   * Method to activate a specific section programmatically. This shouldn't be used unless the section needs to be
   * activated outside of the regular behaviours.
   */
  activate() {
    this.clearMessage.emit(true);
    if (!this.disabled && this.sncrFlow.canActivate(this)) {
      this.flowService.activate(this);
    }
  }

  /**
   * Method to be called to save new data to the model and go to the next section. The model passed as argument will
   * override the existing one for the section.
   * @param model
   * @param clearNext - optional param to clear next panel data
   */
  next(model: any, clearNext?: boolean) {
    this.flowService.modifyData(this, model || this.model, clearNext);

    let pageScrollInstance = PageScrollInstance.simpleInstance(document, this.header.nativeElement);
    setTimeout(() => this.pageScrollService.start(pageScrollInstance), 100);
  }

  /**
   * @internal
   */
  showSummary(): boolean {
    const keys = Object.keys(this.model);
    return !this.hideStepper && !this.active && !this.disabled && keys.length > 0 && this.flowService.isModelSynch(this);
  }
}
