import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'delete-model',
  templateUrl: 'delete-soc-model.component.html',
  styleUrls: ['delete-soc-model.component.scss']
})

export class DeleteSocComponent implements OnInit {

  @Input() row: any;
  @Input() name: string;
  @Input() name2: string;
  @Input() title: string;
  @Input() bodyTitle: string;
  @Input() bodyTitle2: string;
  @Input() bodyTitle3: string;
  @Output() onDelete = new EventEmitter();

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  openModel(del) {
    this.modalService.open(del, {backdrop: 'static'});
  }

  deleteRow() {
    this.onDelete.emit(this.row);
  }
}