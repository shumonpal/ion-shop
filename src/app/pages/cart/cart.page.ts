import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/providers/cart.service';
import { NgEventBus } from 'ng-event-bus';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  carts: any = [];
  product:object = {};
  totalPrice:Number = 0;

  constructor(
    private cartSrvc:CartService,
    private navC:NavController,
    private eventBus: NgEventBus,
  ) { 
    this.cartSrvc.getAll().then((items) => {
      this.carts = items;
      var total:number = 0;
      items.forEach((item, val) => {
        total += Number(item.price * item.qty);
      });
      this.totalPrice = total;
      // console.log('Total', total);
    });
  }

  ngOnInit() {
    
  }

  daleteCart(cart){    
    this.cartSrvc.delete(cart.id).then((res) => {
      if(res){
        this.eventBus.cast('cartDeleted', cart.pdt_id);
        this.carts = this.carts.filter((item) => {
          return item.id !== cart.id;
        });
      }      
    })    
  }

  goBack(){
    this.navC.back();
  }


}
