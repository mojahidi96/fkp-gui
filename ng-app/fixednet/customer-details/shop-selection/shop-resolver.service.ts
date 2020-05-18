import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {FnShop} from '../../common/fn-shop';
import {ShopSelectionService} from './shop-selection.service';

@Injectable()
export class ShopResolver {

  constructor(private shopSelectionService: ShopSelectionService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<FnShop[]> {
    return this.shopSelectionService.getShopList();
  }
}