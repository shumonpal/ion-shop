import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/providers/cart.service';
import { ProductService } from 'src/app/providers/product.service';
import { UtilityService } from 'src/app/providers/utility.service';
import { CartsPage } from 'src/app/modals/carts/carts.page';
import { ModalController, NavController } from '@ionic/angular';
import { NgEventBus } from 'ng-event-bus';
import { MetaData } from 'ng-event-bus/lib/meta-data';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  pdtId = "";
  product: object = {};
  related_pdt: any = [];
  firstImage:String = "";
  adToCartForm: FormGroup;
  counter = 1;

  carts:any = []
  addToCartButton: boolean = true;
  cartPdtQty :number;
  cartCounter:number;

  slidesOptions = {
    initialSlide: 0,
  };
  constructor(
    private pdtS: ProductService,
    private acRoute: ActivatedRoute,
    private util: UtilityService,
    private cartS: CartService,
    private mCntrl: ModalController,
    private eventBus: NgEventBus,
    private navC: NavController,
  ) {
    this.getPdtId().then(() => {
      this.pdtById();
    });
    this.createForm();
  }

  ngOnInit() { 

    this.cartS.getAll().then((res) => {
      if(res){
        console.log("storage", res);
        this.cartCounter = res.length;
        const cartAdded = res.filter((item) => {
          if(item) {return this.pdtId == item['pdt_id']}
        });
        if(cartAdded.length){
          this.counter = cartAdded[0].qty;
          this.addToCartButton = false;
          this.setFormValue(cartAdded[0])
        }
      }
    });

    this.updateCartWhenDelete()
    this.updateCartWhenAdded()
    
  }

  createForm(){
    this.adToCartForm = new FormGroup({
      color: new FormControl('', [Validators.required]),
      qty: new FormControl(this.cartPdtQty || 1, [Validators.required]),
      size: new FormControl('', [Validators.required]),
    });
    this.adToCartForm.valueChanges.subscribe((data) => {
      if(data.qty > this.product['in_stock']){
        this.util.defaultToast(`Sorry only ${this.product['in_stock']} item in stock`)
        console.log("data", data.qty)
      }
    });
  }

  async getPdtId() {
    await this.acRoute.params.subscribe(param => {
      this.pdtId = param.id;
    });
  }

  async pdtById() {
    await this.pdtS.pdtById(this.pdtId).then((res: any) => {
      this.product = res.data
      this.firstImage = res.data.images[0]['image'];    
    }).then(() => {
      this.pdtS.related_pdt(this.product['related_products']).then((res: any) => {
        this.related_pdt = res.data
      });
    });
  }

  addToCart() {
    if(this.adToCartForm.controls.color.invalid || this.adToCartForm.controls.size.invalid){
      this.util.defaultToast("Please select color/size")
    }
    if(this.adToCartForm.valid){
      const cart = {
        'id': Date.now(),
        "pdt_id": this.pdtId,
        "pdt_name": this.product['name'],
        "size": this.adToCartForm.controls.size.value,
        "color": this.adToCartForm.controls.color.value,
        "price": this.product['price'],
        "image": this.firstImage,
        "qty": this.adToCartForm.controls.qty.value
      };
      this.cartS.putVal(cart).then((res) => {
        this.carts.push(res);
        this.cartS.cartCounter().then(res => {
          this.cartCounter = res;
        });
        this.addToCartButton = false;
        this.util.defaultToast("Product added to cart");

        this.eventBus.cast('cartAdded');
      });
      
    }
  }

  updateCart(value){
    if(value == 'plus'){
      this.handlePlus();
    }else if(value == 'minus'){
      this.handleMinus();
    }    
    this.cartS.update(this.pdtId, this.adToCartForm.value).then((res) => {
      this.util.defaultToast("Cart updated success");
    })
  }

  handleMinus() {
    if(this.counter > 1){
      this.counter--;
      this.adToCartForm.controls.qty.setValue(this.counter);
    }
  }
  handlePlus() {
    if(this.counter < this.product['in_stock']){
      this.counter++;
      this.adToCartForm.controls.qty.setValue(this.counter);
    }
  }

  setFormValue(cart){
    for (let key in this.adToCartForm.controls) {
      this.adToCartForm.controls[key].setValue(cart[key]);      
    }
  }

  async showCartPage(){
    if(this.cartCounter){
      const modal = await this.mCntrl.create({
        component: CartsPage,
        cssClass: 'cart-modal'
      });
      return await modal.present();
    }    
  }

  updateCartWhenDelete(){
    this.eventBus.on('cartDeleted').subscribe((meta: MetaData) => {
      this.cartS.cartCounter().then((res) => {
        this.cartCounter = res;
        if(meta.data == this.pdtId){
          this.addToCartButton = true;
          this.adToCartForm.reset();
          this.counter = 1;
        }
        
      });
      // console.log(meta.id);           // will print "d9c31eb0-b3f3-4764-a96d-6a703112a696"
      // console.log(meta.key);          // will print "app:start"
      // console.log(meta.data);         // will print "started"
      // console.log(meta.timestamp);    // will print 1605934473553
    });
  }

  updateCartWhenAdded(){
    this.eventBus.on('cartAdded').subscribe((meta: MetaData) => {
      this.cartS.cartCounter().then((res) => {
        this.cartCounter = res;
        console.log('cartAdded', res);        
      });
    });
  }

  goBack(){
    this.navC.back();
  }

}
