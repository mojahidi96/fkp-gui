import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Language} from 'angular-l10n';
import {KIASDetails} from './kias-details';
import {KIASOrderData} from './kias-order-data';
import {BulkEditContentService} from './bulk-edit-content.service';
import {OmDetailService} from '../../order-components/order-commons/om-detail/om-detail.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomValidators} from '../../sncr-components/sncr-controls/custom-validators';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';

@Component({
  selector: 'bulk-edit-content',
  templateUrl: 'bulk-edit-content.component.html',
  styleUrls: ['bulk-edit-content.component.scss']
})
export class BulkEditContentComponent implements OnInit {

  @Input() cols: any[];
  @Input() category: any;
  lazyLoadUrl: string;
  @Input() type: 'tariffChange' | 'extension' | 'tariffOptionChange' | 'hardware';
  @Input() warnings: number;
  @Input() kiasDetails: any[];

  @Output() outputForCategoryAndState = new EventEmitter();
  @Output() output = new EventEmitter();
  @Language() lang;
  @ViewChild('kiasDataTable') kiasDataTable: SncrDatatableComponent;

  saveForm: FormGroup;
  loading = false;
  selectedStatus = '';
  selection: KIASOrderData[];
  saveData: KIASDetails;
  statusOptions: any[];
  statusComment: string;

  constructor(private omDetailsService: OmDetailService,
              private bulkEditContentService: BulkEditContentService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.statusOptions = [
      {value: 'INIT', text: 'ORDER_BULK-STATUS-RECEIVED'},
      {value: 'COMPLETE', text: 'ORDER_BULK-STATUS-COMPLETED'},
      {value: 'CANCELLED', text: 'ORDER_BULK-STATUS-DECLINED'}
    ];
    this.selection = [];
    this.createForm();
  }

  createForm() {
    let statusGroup = {
      statusComment: ['',
        this.statusOptions[2].value === this.selectedStatus ? CustomValidators.requiredWithTrim : null],
      status: [this.selectedStatus, [CustomValidators.requiredWithTrim]]
    };
    this.saveForm = this.formBuilder.group(statusGroup);
  }

  saveStatus() {
    if (this.saveForm.valid) {
      this.loading = true;
      this.saveData = new KIASDetails();
      this.saveData.category = this.category;
      let selection = this.selection;
      selection.forEach(data =>
        delete data['_sncrChecked']
      );
      this.saveData.kiasOrderData = selection;
      this.saveData.comments = this.saveForm.get('statusComment').value;
      this.saveData.state = this.saveForm.get('status').value;
      this.bulkEditContentService.saveKIASStatusDetails(this.saveData).subscribe((response) => {
          if (response) {
            this.loading = false;
            this.getKIASTabDetails(this.category);
            this.selection = [];
            this.selectedStatus = '';
            this.createForm();
            this.output.emit(response.state);
          }
        },
        error => {
          this.loading = false;
        }
      );
    }
  }

  getKIASTabDetails(category: string) {
    this.omDetailsService.loadKIASTabDetails(category).subscribe(response => {
      this.kiasDataTable.resetAdvancedFilter();
      this.kiasDetails = response.kiasOrderData;
      this.warnings = response.errorCount;
      if (this.warnings === 0) {
        this.outputForCategoryAndState.emit({category : this.category, state: this.warnings});
      }
      this.loading = false;
    }, error => {
      console.error('error while getting KIAS tab details', error);
      this.loading = false;
    });
  }

  selectionChange(event: any) {
    let selectedChk = [];
    event.forEach(data => {
      if (data.selectHidden !== true) {
        selectedChk.push(data);
      }
      }
    );
    this.selection = selectedChk;

    if (this.selection.length === 0) {
      this.saveForm.reset();
      this.saveForm.controls['status'].setValue('');
    }
  }
}
