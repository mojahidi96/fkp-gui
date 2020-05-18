import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ShoppingCartService} from './shopping-cart.service';

@Injectable()
export class ShoppingCartResolver implements Resolve<any[]> {
  constructor(private cartService: ShoppingCartService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    if (route.paramMap.get('psc') === 't') {
      return this.cartService.setSessionCart();
    }
  }
}