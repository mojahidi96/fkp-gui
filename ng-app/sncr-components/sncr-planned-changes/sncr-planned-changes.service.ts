import {EventEmitter, Injectable} from '@angular/core';
import {PlannedChange, PlannedChangesService} from './planned-change';

@Injectable()
export class SncrPlannedChangesService implements PlannedChangesService {

  protected plannedChanges: PlannedChange[] = [];

  plannedChangesEvent: EventEmitter<PlannedChange[]> = new EventEmitter<PlannedChange[]>();
  socRemoveEvent: EventEmitter<string> = new EventEmitter<string>();
  manualPositionRefreshEvent = new EventEmitter();

  plannedChangeEmit(plannedChange: PlannedChange) {
    let group: PlannedChange = this.plannedChanges.find(c => c.groupName === plannedChange.groupName);
    if (!group && plannedChange.socs.length && plannedChange.socs[0].quantity) {
      this.updatePlannedChanges(plannedChange);
    } else if (group) {
      plannedChange.socs.forEach(soc => {
        let existingSoc = group.socs.find(s => s.value === soc.value);
        if (existingSoc) {
          if (soc.quantity) {
            Object.assign(existingSoc, soc);
          } else if (group.socs.length > 1) {
            const i = group.socs.indexOf(existingSoc);
            group.socs.splice(i, 1);
          } else {
            const i = this.plannedChanges.indexOf(group);
            this.plannedChanges.splice(i, 1);
          }
        } else if (soc.quantity) {
          group.socs.push(soc);
        }
      });
    }

    this.plannedChangesEvent.emit(this.plannedChanges);
  }

  clear() {
    this.plannedChanges = [];
  }

  getPlannedChanges() {
    return this.plannedChanges;
  }

  updatePlannedChanges(plannedChange: PlannedChange) {
    let newSoc = plannedChange.socs[0].value;
    let groupName = '';
    this.plannedChanges.forEach( (item, index) => {
      item.socs = item.socs.filter( sc => sc.value !== newSoc);
      if (item.socs.length === 0) {
          groupName = item.groupName;
      }
    });
    if (groupName !== '') {
      this.plannedChanges = this.plannedChanges.filter( pc => pc.groupName !== groupName);
    }
    this.plannedChanges.push(plannedChange);
  }
}