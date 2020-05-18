
export class FnAlertMessageHandler {
  alert = {
    type: '',
    message: ''
  };


  constructor() {
  }

  resetAlertMessage(): void {
    setTimeout(() => {
      this.alert = {
        type: '',
        message: ''
      };
    }, 5000);
  }


  printSuccessMessage(message: string) {
    this.printMessage('success', message);
  }

  printWarningMessage(message: string) {
    this.printMessage('warning', message);
  }

  printErrorMessage(message: any) {
    this.printMessage('danger', message);
  }

  printMessage(type: string, message: any) {
    this.alert.type = type;
    this.alert.message = message;
    this.resetAlertMessage();
  }
}