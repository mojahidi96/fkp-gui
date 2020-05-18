import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Language} from 'angular-l10n';
import {OmDetailService} from '../om-detail/om-detail.service';
import {finalize} from 'rxjs/internal/operators';
import {CommentsHistoryConstants} from './comments-history-constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../../sncr-components/sncr-controls/custom-validators';

@Component({
  selector: 'comments-history',
  templateUrl: 'comments-history.component.html'
})
export class CommentsHistoryComponent implements OnInit {

  @Input() id: string;
  @Input() readonly: boolean;
  @Input() flowType: string;
  @Input() pattern: any;
  @Input() maxLength = 4000;

  @Language() lang;

  @ViewChild('admincomments', {static: true}) admincomments: TemplateRef<any>;
  @ViewChild('freetxts', {static: true}) freetxts: TemplateRef<any>;
  @ViewChild('freetxtsTimeStamp', {static: true}) freetxtsTimeStamp: TemplateRef<any>;
  @ViewChild('mastertxtsTimeStamp', {static: true}) mastertxtsTimeStamp: TemplateRef<any>;

  cols = [];
  saving = false;
  dataLoading = true;
  masterComments = [];
  formGroup: FormGroup;
  commentPlaceholder: string;
  comments_placeholder = { MASTER_TXT: 'COMMENTS-TEXTAREA_PLACEHOLDER', FREE_TXT: ' '};
  constructor(private formBuilder: FormBuilder,
              private omDetailService: OmDetailService) {
  }

  ngOnInit(): void {
    this.cols = CommentsHistoryConstants.cols[this.flowType];
    this.getComments();
    this.formGroup = this.formBuilder.group(
      {
        comments: ['', [Validators.maxLength(this.maxLength),
          CustomValidators.sanitization(this.pattern), Validators.required]]
      }
    );
    this.commentPlaceholder = this.comments_placeholder[this.flowType];
  }


  addComment() {
    if (this.formGroup.valid) {
      this.saving = true;
      this.omDetailService.saveOMComments(CommentsHistoryConstants.post_urls[this.flowType],
        this.formGroup.value.comments).subscribe(response => {
        if (response) {
          this.getComments();
          this.formGroup.reset();
          this.saving = false;
        }
      }, error => {
        console.error('error while saving the master/internal comments', error);
        this.saving = false;
      });
    }
  }

  /**
   * Method to get comments of admin /internal free text
   * @returns any
   */
  getComments(): any {
    this.omDetailService.getOMComments(CommentsHistoryConstants.get_urls[this.flowType]).pipe(finalize(() => this.dataLoading = false))
      .subscribe((val) => {
        let cols = CommentsHistoryConstants.cols[this.flowType];
        if (this.flowType === 'MASTER_TXT') {
          cols[1].bodyTemplate = this.admincomments;
          cols[0].bodyTemplate = this.mastertxtsTimeStamp;
        } else {
          cols[1].bodyTemplate = this.freetxts;
          cols[0].bodyTemplate = this.freetxtsTimeStamp;
        }
        this.masterComments = val;
      });
  }
}
