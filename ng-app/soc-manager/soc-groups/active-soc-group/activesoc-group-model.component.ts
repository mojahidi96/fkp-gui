import {ActiveSocGroupService} from './active-soc-group.service';
import {Soc} from './../../soc-blacklisted/Soc';
import {NgbModal, NgbModalRef, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
@Component({
  selector: 'asg-model',
  templateUrl: 'activesoc-group-model.component.html',
  styleUrls: ['activesoc-group-model.component.scss']
})
export class ActiveSocGroupModelComponent implements OnInit {

  @Input() groupId: string;
  @Input() activesoc = new Soc();
  @Input() editable: boolean;
  @Output() saveActiveSoc = new EventEmitter();
  activeSocs = [];
  socname: string;
  oldactivesoc = new Soc();
  @ViewChild(NgbPopover) popover: NgbPopover;
  loader: boolean;
  toggle = false;

  constructor(private activeSocGroupService: ActiveSocGroupService) {
  }

  ngOnInit() {

  }

  OpenForm() {
    this.toggle = !this.toggle;
    this.getActiveSocs();
  }

  saveRow(name) {
    if (this.activesoc.socId) {
      if (this.popover.isOpen()) {
        this.popover.close();
      }
      if (!name.invalid) {
        this.activesoc.groupId = this.groupId;
        this.saveActiveSoc.emit(this.activesoc);
        this.activesoc = new Soc();
        this.toggle = !this.toggle;
      }
    } else {
      if (!this.popover.isOpen()) {
        this.popover.open();
      }
    }
  }


  updateSel(soc) {
    if (this.popover && this.popover.isOpen()) {
      this.popover.close();
    }
    soc.displayOrder = this.activesoc.displayOrder;
    this.activesoc = Object.assign({}, soc);
  }

  get acitvesocfilter() {
    let filtered = this.activeSocs.filter((soc) => {
      if (this.socname && this.socname.length > 0) {
        return soc.socName.toLowerCase().includes(this.socname.toLowerCase());
      } else {
        return this.activeSocs;
      }
    });
    return filtered;
  }

  getActiveSocs() {
    this.loader = true;
    this.socname = '';
    if (this.editable) {
      this.oldactivesoc = Object.assign({}, this.activesoc);
    } else {
      this.activesoc = new Soc();
    }
    this.activeSocs = [];
    this.activeSocGroupService.getActiveSocs(this.groupId)
      .then(response => {
        this.activeSocs = response;
        this.loader = false;
      });
  }

  resetModel() {
    this.toggle = false;
  }
}
