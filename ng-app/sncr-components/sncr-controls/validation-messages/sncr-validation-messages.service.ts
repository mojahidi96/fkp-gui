import {Injectable} from '@angular/core';
import {NgControl} from '@angular/forms';
import {TranslationService} from 'angular-l10n';

/**
 * Service to be used internally by validation components and directive.
 */
@Injectable()
export class ValidationMessagesService {

  readonly oldMessages = {
    required: 'Dieses Feld ist erforderlich',
    email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    max: 'Der Wert darf nicht größer als $0 sein',
    min: 'Der Wert darf nicht kleiner als $0 sein',
    maxlength: 'Bitte geben Sie einen Wert mit maximal $0 Zeichen ein',
    minlength: 'Bitte geben Sie einen Wert mit mindestens $0 Zeichen ein',
    onlyNumbers: 'Bitte nur Zahlen benutzen.',
    lengthMismatch: 'Die Gesamtlänge der Felder $0 und $1 muss zwischen $2 und $3 Zeichen betragen',
    pattern: 'Ungültiges Format',
    inValidCharacters: 'Das Feld enthält ungültige Zeichen',
    onlyCharacters: 'Only characters are allowed',
    onlyCharactersAndNumbers: 'Only characters and numbers are allowed',
    phone: 'phone number is invalid',
    sanitizationError: 'Ihre Eingabe enthält ungültige Zeichen',
    invalidInternalCustId: 'Bitte geben Sie eine g\u00FCltige interne Kennziffer ein.',
    invalidHouseNumber: 'Ungültiges Hausnummer.',
    invalidBkAccOwnership: 'Ungültiges bankaccountownership',
    invalidIban: 'Ungültiges IBAN',
    invalidBic: 'Ungültiges BIC',
    invalidCity: 'Ungültiges Stadt',
    invalidVOID: 'Die VO-ID ist ein Pflichtfeld mit 8 numerischen Zeichen.',
    inValidInputCharacters: 'Die Eingabe enthält unzulässige Zeichen.',
    duplicateSerialNo: 'Ihre Eingabe enthält mehrfach benutzte Kartennummern. Bitte korrigieren Sie Ihre Eingabe und versuchen Sie erneut.',
    onlyNumbersWithLimit: 'Die Kartennummer darf nur numerische Werte enthalten und 14 Zeichen lang sein.',
    numberAlreadyUsed: 'Ihre Eingabe enthält mehrfach benutzte Kartennummern. Bitte korrigieren Sie Ihre Eingabe und versuchen Sie erneut.'
  };

  readonly prefix = 'VALIDATION_MSG-';

  warned: boolean;

  constructor(private translation: TranslationService) {

  }

  /**
   * @internal
   */
  hasErrors(ngControl: NgControl, {ngForm = undefined, blurred = false, force = false} = {}): boolean {
    return (this.shouldReturn({ngForm, blurred, force})) ? ngControl.invalid : false;
  }

  /**
   * @internal
   */
  getErrors(ngControl: NgControl, {ngForm = undefined, blurred = false, force = false} = {}): any[] {
    return (this.shouldReturn({ngForm, blurred, force})) ? this.buildMessages(ngControl.errors) : [];
  }

  private shouldReturn({ngForm = undefined, blurred = false, force = false} = {}): boolean {
    return (force || (ngForm && ngForm.submitted) || (!ngForm && blurred));
  }

  buildMessages(errors) {

    return Object.keys(errors || {}).map(error => {
      switch (error) {
        case 'max':
          return this.parseMessage(error, [errors[error].max], errors[error]);
        case 'min':
          return this.parseMessage(error, [errors[error].min], errors[error]);
        case 'maxlength':
        case 'minlength':
          return this.parseMessage(error, [errors[error].requiredLength], errors[error]);
        default:
          if (error.startsWith('lengthMismatch')) {
            const params = errors[error];
            return this.parseMessage('lengthMismatch',
              [params.fields[0], params.fields[1], params.min, params.max], errors[error]);
          }
          return this.parseMessage(error, [], errors[error]) || error;
      }
    });
  }

  private parseMessage(key: string, [...parameters], errors = {}) {
    let translationKey = key.toUpperCase();
    let parsedMessage = this.translation.translate(translationKey, errors);

    if (parsedMessage === translationKey) {
      translationKey = this.prefix + key.toUpperCase();
      parsedMessage = this.translation.translate(translationKey, errors);
    }

    if (parsedMessage === translationKey) {
      parsedMessage = this.oldMessages[key];
      parameters.forEach((param, i) => {
        parsedMessage = parsedMessage.replace(`$${i}`, param);
      });
      if (!this.warned) {
        this.warned = true;
        console.warn('[sncr-validation-messages] Include in the module the common bundle for validation messages');
      }
      return {message: parsedMessage};
    } else {
      return {message: parsedMessage, params: errors};
    }
  }
}
