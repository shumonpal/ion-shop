import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NgEventBus } from 'ng-event-bus';
import { CartService } from 'src/app/providers/cart.service';
import { CheckoutPage } from '../../pages/checkout/checkout.page'

@Component({
  selector: 'app-carts',
  templateUrl: './carts.page.html',
  styleUrls: ['./carts.page.scss'],
})
export class CartsPage implements OnInit {
  carts: any = [];
  cartCounter: number;

  constructor(
    private mCntrl: ModalController,
    private cartS: CartService,
    private eventBus: NgEventBus,
    private router: Router
  ) { 
    this.cartS.getAll().then((items) => {
      this.carts = items;
      this.cartCounter = items.length;
    });
   }

  ngOnInit() {
  }

  dismissModal() {    
    this.mCntrl.dismiss({
      'dismissed': true
    });
  }
  daleteCart(cart){    
    this.cartS.delete(cart.id).then((res) => {
      if(res){
        this.eventBus.cast('cartDeleted', cart.pdt_id);
        this.carts = this.carts.filter((item) => {
          return item.id !== cart.id;
        });
      }      
    })    
  }

  goToCartPage(){
    var modals = document.getElementsByTagName("ion-modal");
    [].forEach.call(modals, function (el:any) {
        el.parentNode.removeChild(el);
    });
    this.router.navigate(["/cart"])
  }
  goToCheckoutPage(){
    var modals = document.getElementsByTagName("ion-modal");
    [].forEach.call(modals, function (el:any) {
        el.parentNode.removeChild(el);
    });
    this.router.navigate(["/checkout"]);
  }
}
