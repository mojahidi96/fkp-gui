import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SncrConfirmDeactivateModalComponent} from './sncr-confirm-deactivate-modal.component';

@Injectable()
export class SncrConfirmDeactivateGuard implements CanDeactivate<any> {

  constructor(private modalService: NgbModal) {

  }

  canDeactivate(component: any,
                route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Promise<boolean> | boolean {
    return component.canDeactivate() ||
      this.modalService.open(SncrConfirmDeactivateModalComponent, {size: 'sm'})
        .result.then(
        (close) => true,
        (dismiss) => false
      );
  }
}