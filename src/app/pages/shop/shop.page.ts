import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CategoryService } from 'src/app/providers/category.service';
import { ProductService } from 'src/app/providers/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  products:any = [];
  subcategoryByCategory:any = [];
  Qparams:any = [];

  constructor(
    private acRoute: ActivatedRoute,
    private pdtS: ProductService,
    private catS: CategoryService,
    private navC: NavController,

    ) { 
    this.acRoute.queryParams.subscribe((res) => {
      this.Qparams = res;  
      console.log('Qparams', res);    
    });
    
   }

  ngOnInit() {
    if (this.Qparams['category_id']) {
      this.getPdtByCat();      
    }
    else if (this.Qparams['brand_id']) {
      this.getPdtByCat();      
    }
  }

  getPdtByCat(){
    this.pdtS.pdtByCategory(this.Qparams['category_id']).then((res:any) => {
      this.products = res.data;
      this.catS.categoryById(this.Qparams['category_id']).then((res:any) => {
        this.subcategoryByCategory = res.data.subcategories
        console.log('subcategory', this.subcategoryByCategory);   
      })
    })
  }
  getPdtByBrand(){
    this.pdtS.pdtByCategory(this.Qparams['brand_id']).then((res:any) => {
      this.products = res.data;
    })
  }

  goBack(){
    this.navC.back();
  }

}
