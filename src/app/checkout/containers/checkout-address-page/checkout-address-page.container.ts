import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { getLoggedInUser } from '../../../core/store/user';
import { Address } from '../../../models/address/address.model';
import { Basket } from '../../../models/basket/basket.model';
import { User } from '../../../models/user/user.model';
import { getAddressesLoading, getAllAddresses } from '../../store/addresses';
import { LoadAddresses } from '../../store/addresses/addresses.actions';
import {
  getBasketLoading,
  getCurrentBasket,
  UpdateBasketInvoiceAddress,
  UpdateBasketShippingAddress,
} from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-checkout-address-page-container',
  templateUrl: './checkout-address-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressPageContainerComponent implements OnInit {
  user$: Observable<User>;
  basket$: Observable<Basket>;
  basketLoading$: Observable<boolean>;
  addresses$: Observable<Address[]>;
  addressesLoading$: Observable<boolean>;
  loading$: Observable<boolean>;

  constructor(private store: Store<CheckoutState>, private coreStore: Store<CoreState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.basketLoading$ = this.store.pipe(select(getBasketLoading));

    this.user$ = this.coreStore.pipe(select(getLoggedInUser));

    this.store.dispatch(new LoadAddresses());
    this.addresses$ = this.store.pipe(select(getAllAddresses));
    this.addressesLoading$ = this.store.pipe(select(getAddressesLoading));

    this.loading$ = combineLatest(
      this.store.pipe(select(getBasketLoading)),
      this.store.pipe(select(getAddressesLoading))
    ).pipe(map(([basketLoading, addressesLoading]) => basketLoading || addressesLoading));
  }

  updateBasketInvoiceAddress(addressId: string) {
    this.store.dispatch(new UpdateBasketInvoiceAddress(addressId));
  }

  updateBasketShippingAddress(addressId: string) {
    this.store.dispatch(new UpdateBasketShippingAddress(addressId));
  }
}
