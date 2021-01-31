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
  pageNo: number = 1;
  eventTargetDisabled: boolean;

  constructor(
    private acRoute: ActivatedRoute,
    private pdtS: ProductService,
    private catS: CategoryService,
    private navC: NavController,

    ) { 
    this.acRoute.queryParams.subscribe((res) => {
      this.Qparams = res;  
      this.initProducts()
    });
    
   }

  ngOnInit() {
  }

  initProducts(){
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
  }

  loadData(event) {
      console.log('Done');
      this.acRoute.queryParams.subscribe((res) => {
        this.pageNo++;
        this.Qparams = res;  
        console.log('Qparams', res);   
        console.log('pageNo', this.pageNo);   
        this.initProducts()
      });
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.eventTargetDisabled) {
        event.target.disabled = true;
      };
  }

  getPdtByCat(){
    this.pdtS.pdtByCategory(this.Qparams['category_id'], this.pageNo).then((res:any) => {
      //this.products = res.data;
      for (let i = 0; i < res.data.length; i++) {
        this.products.push(res.data[i]);
      }
      if (res.meta.current_page == res.meta.last_page) {
        this.eventTargetDisabled = true;
      }
      console.log('current_page', res.meta.current_page);
      this.getSubcat();
    })
  }
  getPdtBysubCat(){
    this.pdtS.pdtBySubcategory(this.Qparams['subcategory_id'], this.pageNo).then((res:any) => {
      if (res.meta.current_page == 1) {
        this.products = res.data;
        this.getSubcat()
      } else {
        for (let i = 0; i < res.data.length; i++) {
          console.log("pdtBySubcategory", res.data[i]);
          this.products.push(res.data[i]);
        }
      }
      
      if (res.meta.current_page == res.meta.last_page) {
        this.eventTargetDisabled = true;
      }
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
    this.pdtS.pdtByCategory(this.Qparams['brand_id'], this.pageNo).then((res:any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.products.push(res.data[i]);
      }
      if (res.meta.current_page == res.meta.last_page) {
        this.eventTargetDisabled = true;
      }
      if (this.pageNo == 1) {       
        this.pageTitleKey = "Brand";
      }
    })
  }
  getfeaturePdt(){
    this.pdtS.featureProducts(this.pageNo).then((res:any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.products.push(res.data[i]);
      }
      if (res.meta.current_page == res.meta.last_page) {
        this.eventTargetDisabled = true;
      }
      if (this.pageNo == 1) {
        this.pageTitleKey = "Feature Products";        
      }
    })
  }
  getNewPdt(){
    this.pdtS.newArrived(this.pageNo).then((res:any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.products.push(res.data[i]);
      }
      if (res.meta.current_page == res.meta.last_page) {
        this.eventTargetDisabled = true;
      }
      if (this.pageNo == 1) {
        this.pageTitleKey = "New Products";        
      }
    })
  }
  weekOfDealPdt(){
    this.pdtS.weekDeal(this.pageNo).then((res:any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.products.push(res.data[i]);
      }
      if (res.meta.current_page == res.meta.last_page) {
        this.eventTargetDisabled = true;
      }
      if (this.pageNo == 1) {       
        this.pageTitleKey = "Week of Deal";
      }
    })
  }

  goBack(){
    this.navC.back();
  }

}
