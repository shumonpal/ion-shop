import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BrandService } from 'src/app/providers/brand.service';
import { CategoryService } from 'src/app/providers/category.service';
import { ProductService } from 'src/app/providers/product.service';
import { CartsPage } from 'src/app/modals/carts/carts.page';
import { CartService } from 'src/app/providers/cart.service';
import { NgEventBus } from 'ng-event-bus';
import { MetaData } from 'ng-event-bus/lib/meta-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  banners: any = [];
  featureProducts: any = [];
  categories:any = [];
  sub_banner1: string = "";
  newProducts: any = [];
  brands: any = [];
  weekOfDeal: any = [];
  
  cartCounter:number;

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true,
    pager: true,
    speed:1000,
    loop:true
   };
   
  options = {
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: -60,
  };

  categoriesSlider = {
    slidesPerView: 2.5,
  };
  constructor(
    private pdtSrvc: ProductService,
    private catS: CategoryService,
    private brand: BrandService,
    private cartSrvc: CartService,
    private mCntrl: ModalController,
    private eventBus: NgEventBus,
  ) { 
    this.getCategories();    
    this.getBrands();
   }

  ngOnInit() {
    this.cartSrvc.cartCounter().then((res) => {
      this.cartCounter = res;
    }) 
    this.updateCartWhenDelete();
    this.updateCartWhenAdded();
  }

  async getFeatureProducts(){
    await this.pdtSrvc.featureProducts().then((res: any) => {
      this.banners = res.data.slice(0, 5);
      this.featureProducts = res.data.slice(0, 10);      
    }).catch((err) => {
      console.log(err.message)
    });

  }

  async getCategories(){
    await this.catS.allCategories().then((res: any) => {
      this.categories = res.data.slice(0, 9);
      // console.log('categories', res.data.slice(0, 10))
      }).then(() => {
        this.getFeatureProducts();
      }).then(() => {
        this.allProducts();
      }).catch((err) => {
        console.log(err.message)
    });
  }

  async allProducts(){
    await this.pdtSrvc.newArrived().then((res: any) => {
      
      const pdt = res.data.filter(val => {
        return val.composition_id == 2;
      });
      this.sub_banner1 = pdt[0].banner_image;

      this.newProducts = res.data.slice(0, 10);
      
    }).catch((err) => {
      console.log(err.message)
    });
  }

  async getBrands(){
    await this.brand.allBrands().then((res: any) => {
      this.brands = res.data;
      console.log('brands', this.brands);
      
    }).then(() => {
      this.weekOfDealPdt();
    }).catch((err) => {
      console.log(err.message)
    });
  }

  async weekOfDealPdt(){
    await this.pdtSrvc.weekDeal().then((res: any) => {
      this.weekOfDeal = res.data;
      // console.log('weekOfDeal', this.weekOfDeal);
    }).catch((err) => {
      console.log(err.message)
    });
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
      this.cartSrvc.cartCounter().then((res) => {
        this.cartCounter = res;
      });
      // console.log(meta.id);           // will print "d9c31eb0-b3f3-4764-a96d-6a703112a696"
      // console.log(meta.key);          // will print "app:start"
      console.log(meta.data);         // will print "started"
      // console.log(meta.timestamp);    // will print 1605934473553
    });
  }

  updateCartWhenAdded(){
    this.eventBus.on('cartAdded').subscribe((meta: MetaData) => {
      this.cartSrvc.cartCounter().then((res) => {
        this.cartCounter = res;
        console.log('cartAdded', res);        
      });
    });
  }

}
