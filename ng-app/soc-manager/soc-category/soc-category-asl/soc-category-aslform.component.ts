import {Soc} from './../../soc-blacklisted/Soc';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SocCategoryAslService} from './soc-category-asl.service';

@Component({
  selector: 'category-aslform',
  templateUrl: 'soc-category-aslform.component.html',
  styleUrls: ['soc-category-aslform.component.scss']
})
export class SocCategoryAslformComponent implements OnInit {

  @Input() associateId: string;
  @Input() activesoc = new Soc();
  @Input() editable: boolean;
  @Output() saveActiveSoc = new EventEmitter();
  activeSocs = [];
  socname: string;
  oldactivesoc = new Soc();
  @ViewChild(NgbPopover) popover: NgbPopover;
  loader: boolean;
  toggle = false;

  constructor(private socCategoryAslService: SocCategoryAslService) {
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

  ngOnInit() {

  }


  OpenForm() {
    this.toggle = !this.toggle;
    this.getActiveSocs();
  }

  saveRow() {
    if (this.activesoc.socId) {
      if (this.popover.isOpen()) {
        this.popover.close();
      }
        this.activesoc.associateId = this.associateId;
        this.saveActiveSoc.emit(this.activesoc);
        this.activesoc = new Soc();
        this.toggle = !this.toggle;
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
    this.activesoc = Object.assign({}, soc);
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
    this.socCategoryAslService.getSocsByCategoryId(this.associateId)
      .then(response => {
        this.activeSocs = response;
        this.loader = false;
      });
  }

  resetModel() {
    this.toggle = false;
  }
}
