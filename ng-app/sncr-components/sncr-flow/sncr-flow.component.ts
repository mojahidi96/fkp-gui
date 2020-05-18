import {AfterContentInit, Component, ContentChildren, forwardRef, Input, OnInit, QueryList} from '@angular/core';
import {SncrFlowService} from './sncr-flow.service';
import {SncrFlowSectionComponent} from './sncr-flow-section.component';
import {Section, Sections} from './section';

/**
 * Wrapper component for navigation flows. It holds the model of all the sections defined.
 *
 * The model can be accessed with the "exportAs" syntax.
 *
 * Rules for section activation:
 * - First section is always enabled.
 * - The other sections will be enabled when the previous section has data in its model.
 * - When a section changes its model, next sections will get their model wiped and disabled.
 *
 * ### Example
 * ``` html
 * <sncr-flow #flow="sncrFlow">
 *   <p>Global model: {{flow.model}}</p>
 *   <sncr-flow-section titleText="Section 1">
 *     ...
 *   </sncr-flow-section>
 *   <sncr-flow-section titleText="Section 2">
 *     ...
 *   </sncr-flow-section>
 * </sncr-flow>
 * ```
 */
@Component({
  selector: 'sncr-flow',
  templateUrl: 'sncr-flow.component.html',
  providers: [SncrFlowService],
  exportAs: 'sncrFlow',
  styleUrls: ['sncr-flow.component.scss']
})
export class SncrFlowComponent implements OnInit, AfterContentInit {

  /**
   * @internal
   */
  @ContentChildren(forwardRef(() => SncrFlowSectionComponent)) flowSections: QueryList<SncrFlowSectionComponent>;

  @Input() prefilled: boolean;

  /**
   * The model of all the sections merged in one object.
   */
  model = {};

  /**
   * @internal
   */
  constructor(private flowService: SncrFlowService) {

  }

  ngOnInit(): void {
    this.flowService.sectionsStream.subscribe((sections: Sections) => {
      this.model = sections.model;
    });
  }

  ngAfterContentInit(): void {
    if (this.flowSections.length) {
      this.flowService.register(this.flowSections.toArray());
      this.flowService.newSectionsCount.emit();

      if (!this.prefilled) {
        let firstSection = this.flowSections.first;
        firstSection.active = true;
        firstSection.alreadyActivated = true;
        firstSection.disabled = false;
      }
    }
  }

  prefill(sections: any[]) {
    sections.forEach(s => {
      Object.assign(s.section.model, s.model);
      this.flowService.modifyData(s.section, s.section.model, false, true);
      s.section.prefilled = true;
      s.section.disabled = false;
    });

    let lastSection = sections[sections.length - 1].section;
    lastSection.active = true;
    lastSection.prevModel = {};
    lastSection.alreadyActivated = true;
  }

  /**
   * @internal
   */
  canActivate(section: Section): boolean {
    let sectionsArray = this.flowSections.toArray().filter(s => !s['hideStepper']);
    let i = sectionsArray.findIndex(s => s === section);
    return i === 0 ||
      (Object.keys(sectionsArray[i - 1].model).length > 0 && !sectionsArray[i].disabled);
  }
}
