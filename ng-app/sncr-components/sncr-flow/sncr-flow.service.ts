import {EventEmitter, Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Sections, Section} from './section';
import {UtilsService} from '../sncr-commons/utils.service';

/**
 * Service to be used internally to allow communication between {@link SncrFlowComponent} and
 * {@link SncrFlowSectionComponent}
 */
@Injectable()
export class SncrFlowService {

  public newSectionsCount = new EventEmitter();

  private sections = new Sections();
  private sectionsSource = new Subject<Sections>();

  /**
   * @internal
   */
  public sectionsStream: Observable<Sections> = this.sectionsSource.asObservable();

  /**
   * @internal
   */
  activate(section: Section) {
    this.sections.list.forEach(s => {
      if (s === section) {
        s.active = true;
        s.alreadyActivated = true;
      } else {
        s.active = false;
      }
    });
  }

  /**
   * @internal
   */
  modifyData(section: Section, data: {}, clearNext?: boolean, prefilling?: boolean) {
    if (!(data instanceof Object) || data instanceof Array) {
      throw new Error('sncr-flow: only Objects allowed');
    }

    let flowSections = this.sections.list.filter(s => !s['hideStepper']);
    let currentIndex = flowSections.findIndex(s => s === section);
    const dataStringified = JSON.stringify(data);
    let modified = JSON.stringify(section.prevModel) !== dataStringified;

    let nextIndex = currentIndex + 1;
    let nextSection = flowSections[nextIndex];

    if (!prefilling) {
      section.active = false;
      nextSection.active = true;
      nextSection.alreadyActivated = true;
      nextSection.disabled = false;
      nextSection.reload = true;
    }

    if (modified || clearNext) {
      section.model = data;
      section.reload = false;
      section.prevModel = JSON.parse(dataStringified);
      flowSections.slice(nextIndex).forEach(s => {
        s.disabled = s !== nextSection;
        if (clearNext) {
          s.model = {};
          s.prevModel = {};
        }
      }
      );
      this.sections.model = this.mergeModels();
    }

    this.sectionsSource.next(this.sections);
  }

  /**
   * @internal
   */
  register(sections: Section[]) {
    this.sections.list = sections;
  }

  getSectionNumber(section: Section): number {
    return this.sections.list.filter(s => !s['hideStepper']).findIndex(s => s === section) + 1;
  }

  disableFollowing(section: Section) {
    let i = this.sections.list.indexOf(section);
    this.sections.list.slice(i + 1).forEach(s => s.disabled = true);
    section.disabled = false;
    this.sectionsSource.next(this.sections);
  }

  enableFollowing() {
    this.sections.list[0].disabled = false;
    let sections = this.sections.list.slice(1);
    for (let i = 0; i < sections.length; i++) {
      let s = sections[i];

      if (s.changed) {
        break;
      } else {
        s.disabled = !(this.sections.list[i]['hideStepper']) && Object.keys(this.sections.list[i].prevModel).length === 0;
      }
      // if last stepper never activated then that should be disabled
      if ((i + 1) === sections.length && !s.alreadyActivated) {
        s.disabled = true;
      }
    }

    this.sectionsSource.next(this.sections);

  }

  isModelSynch(section: any): boolean {

    if (!UtilsService.isEmpty(section.modelSortKey)) {
      if (!UtilsService.isEmpty(section.eventType) && section.eventType !== 'cb_change') {
        section.prevModel = Object.assign({}, section.model);
        return true;
      }
      let curModel = {};
      let prevModel = {};
      if (section.prefilled && !section.isModelSortDone && section.model[section.modelSortKey].length) {
        section.prevModel = Object.assign({}, section.model);
        section.isModelSortDone = true;
      }
      Object.keys(section.model).sort().forEach(function(key) {
        curModel[key] = section.model[key];
      });
      Object.keys(section.prevModel).sort().forEach(function(key) {
        prevModel[key] = section.prevModel[key];
      });

      if (curModel[section.modelSortKey].length && prevModel[section.modelSortKey].length) {
        curModel[section.modelSortKey].sort((a, b) =>
          a[section.modelSortVal].toLocaleLowerCase().localeCompare(b[section.modelSortVal].toLocaleLowerCase()));

        prevModel[section.modelSortKey].sort((a, b) =>
          a[section.modelSortVal].toLocaleLowerCase().localeCompare(b[section.modelSortVal].toLocaleLowerCase()));
      }

      return JSON.stringify(curModel) === JSON.stringify(prevModel);
    }
    return JSON.stringify(section.model) === JSON.stringify(section.prevModel);
  }

  private mergeModels() {
    return Object.assign({}, ...this.sections.list.map(s => s.model));
  }
}
