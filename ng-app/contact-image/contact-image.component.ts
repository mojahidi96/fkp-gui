import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TimeoutService} from '../app/timeout/timeout.service';
import {ContactImageService} from './contact-image.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslationService} from 'angular-l10n';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'contactimage-app',
  templateUrl: 'contact-image.component.html',
  styleUrls: ['contact-image.component.scss']
})
export class ContactImageComponent implements OnDestroy {

  isLoading = false;
  toggle = true;
  data: any;
  formSubmitting: boolean;

  sendEmailOptions = [
    {text: 'SENDEMAILOPTIONS_AREAOFISSUES_BENUTZER_ADMINISTRATION', description: 'User Administration', value: 'Benutzer-Administration'},
    {text: 'SENDEMAILOPTIONS_AREAOFISSUES_TEILNEHMER_VERWALTUNG', description: 'Affiliate Management', value: 'Teilnehmer-Verwaltung'},
    {text: 'SENDEMAILOPTIONS_AREAOFISSUES_ANDERER_BEREICH', description: 'Other area', value: 'Anderer Bereich'}
  ];

  radioButtonOptions = [
    {text: 'RADIO_BUTTON_EMAIL', description: 'Email', value: 'Email'},
    {text: 'RADIO_BUTTON_RECALL', description: 'Recall', value: 'Rückruf'}
  ];

  @ViewChild('content') content: TemplateRef<any>;
  private modalRef: NgbModalRef;
  saveForm: FormGroup;
  private phoneNumberSubscription: Subscription;

  constructor(public translation: TranslationService,
              private formBuilder: FormBuilder,
              private contactImageService: ContactImageService,
              private route: ActivatedRoute,
              private timeoutService: TimeoutService,
              private modalService: NgbModal) {
  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
    if (this.phoneNumberSubscription) {
      this.phoneNumberSubscription.unsubscribe();
    }
  }

  createForm() {
    this.saveForm = this.formBuilder.group({
      sendRequestTo: ['', Validators.required],
      concern: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
      enterPhoneNumber: [''],
      customerOrPhoneNumber: ['', Validators.compose([this.customerOrPhoneNumberValidation()])],
      contactedBy: ['Email']
    });
  }

  enterPhoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (UtilsService.notNull(this.saveForm)) {
        if (this.saveForm.controls['contactedBy'].value === 'Email') {
          return null;
        } else {
          let value = control['value'];
          if (value !== '' && UtilsService.notNull(value)) {
            const pattern = /^[0-9]*$/;
            if (value.match(pattern)) {
              return null;
            } else {
              return {phoneEmptyCheck: true};
            }
          } else {
            return {phoneCheckNumber: true};
          }
        }
      }
    };
  }

  customerOrPhoneNumberValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let value = control['value'];
      if (value !== '' && UtilsService.notNull(value)) {
        const pattern = /^[0-9]*$/;
        if (value.match(pattern)) {
          return null;
        } else {
          return {phoneOrCustCheckNumber: true};
        }
      } else {
        return {phoneOrCustEmptyCheck: true};
      }
    };
  }

  toggleContact(status) {
    this.isLoading = true;
    this.toggle = status;
    if (this.toggle) {
      this.isLoading = false;
    }
  }

  openPopUp() {
    this.createForm();
    let phoneNumber = this.saveForm.get('enterPhoneNumber');
    this.phoneNumberSubscription = this.saveForm.get('contactedBy').valueChanges.subscribe(val => {
      if (val && val === 'Email') {
        phoneNumber.setValue('');
        phoneNumber.clearValidators();
      } else {
        phoneNumber.setValidators([Validators.required, this.enterPhoneNumberValidator()]);
      }
      phoneNumber.updateValueAndValidity();
    });
    this.modalRef = this.modalService.open(this.content, {backdrop: 'static'});
  }

  saveContact() {
    if (this.saveForm && this.saveForm.valid) {

      let contact = {
        sendRequestTo: this.saveForm.controls['sendRequestTo'].value,
        concern: this.saveForm.controls['concern'].value,
        enterPhoneNumber: this.saveForm.controls['enterPhoneNumber'].value,
        customerOrPhoneNumber: this.saveForm.controls['customerOrPhoneNumber'].value,
        contactedBy: this.saveForm.controls['contactedBy'].value,
        pageUrl: window.location.href
      };

      this.contactImageService.updateContactOption(contact).then((data) => {
        this.formSubmitting = true;
        this.modalRef.close('ok');
        console.log('data : ' + data);
      }).catch((ex) => {
        this.modalRef.close('ok');
        this.formSubmitting = true;
        console.log('ex : ' + ex);
      });
    }
  }
}
