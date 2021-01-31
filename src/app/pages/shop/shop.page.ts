import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController,IonInfiniteScroll } from '@ionic/angular';
import { CategoryService } from 'src/app/providers/category.service';
import { ProductService } from 'src/app/providers/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  products:any = [];
  subcategoryByCategory:any = [];
  Qparams:any = [];
  pageTitleKey:string;
  pageTitleValue:string;

  constructor(
    private acRoute: ActivatedRoute,
    private pdtS: ProductService,
    private catS: CategoryService,
    private navC: NavController,

    ) { 
    this.acRoute.queryParams.subscribe((res) => {
      this.Qparams = res;  
      console.log('Qparams', res);   
      if (this.Qparams['category_id'] && !this.Qparams['subcategory_id']) {
        this.getPdtByCat();      
      }
      else if (this.Qparams['subcategory_id']) {
        this.getPdtBysubCat();
      }
      else if (this.Qparams['brand_id']) {
        this.getPdtByBrand();      
      } 
      else if (this.Qparams['product_list'] == "feature") {
        this.getfeaturePdt();      
      } 
      else if (this.Qparams['product_list'] == "new") {
        this.getNewPdt();      
      } 
      else if (this.Qparams['product_list'] == "weekOfDeal") {
        this.weekOfDealPdt();      
      } 
    });
    
   }

  ngOnInit() {
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.products.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  getPdtByCat(){
    this.pdtS.pdtByCategory(this.Qparams['category_id']).then((res:any) => {
      this.products = res.data;
      this.getSubcat();
    })
  }
  getPdtBysubCat(){
    this.pdtS.pdtBySubcategory(this.Qparams['subcategory_id']).then((res:any) => {
      this.products = res.data;
      this.getSubcat()
    })
  }
  getSubcat(){
    this.catS.categoryById(this.Qparams['category_id']).then((res:any) => {
      this.subcategoryByCategory = res.data.subcategories;
      this.pageTitleKey = "Category";
      this.catS.categoryById(this.Qparams['category_id']).then((res:any)=> {
        this.pageTitleValue = res.data.name;
      })     
      console.log('subcategory', this.subcategoryByCategory);
    })
  }
  
  getPdtByBrand(){
    this.pdtS.pdtByCategory(this.Qparams['brand_id']).then((res:any) => {
      this.products = res.data;
      this.pageTitleKey = "Brand";
    })
  }
  getfeaturePdt(){
    this.pdtS.featureProducts().then((res:any) => {
      this.products = res.data;
      this.pageTitleKey = "Feature Products";
    })
  }
  getNewPdt(){
    this.pdtS.newArrived().then((res:any) => {
      this.products = res.data;
      this.pageTitleKey = "New Products";
    })
  }
  weekOfDealPdt(){
    this.pdtS.weekDeal().then((res:any) => {
      this.products = res.data;
      this.pageTitleKey = "Week of Deal";
    })
  }

  goBack(){
    this.navC.back();
  }

}
