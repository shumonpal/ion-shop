import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';

export const ARROA = {
  ROOT: "https://errora-shop.herokuapp.com/api",

  get products() {
    return this.ROOT + '/products';
  },

}

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  allProducts(pageNo) {
    // return this.http.get(ARROA.products).pipe((map((res:any) => {
    //   res.data.data;
    // })));
    return this.http.get(`${ARROA.products}?page=${pageNo}`).toPromise();
  }
  featureProducts(pageNo) {
    return this.http.get(`${ARROA.ROOT}/product-feature?page=${pageNo}`).toPromise();
  }
  newArrived(pageNo) {
    return this.http.get(`${ARROA.ROOT}/product-new?page=${pageNo}`).toPromise();
  }
  weekDeal(pageNo) {
    return this.http.get(`${ARROA.ROOT}/product-week-deals?page=${pageNo}`).toPromise();
  }

  pdtById(id) {
    return this.http.get(`${ARROA.ROOT}/product/${id}`).toPromise();
  }
  pdtByCategory(id, pageNo) {
    return this.http.get(`${ARROA.ROOT}/products-by-category/${id}?page=${pageNo}`).toPromise();
  }
  pdtBySubcategory(id, pageNo) {
    return this.http.get(`${ARROA.ROOT}/products-by-subcategory/${id}?page=${pageNo}`).toPromise();
  }
  pdtByBrand(id, pageNo) {
    return this.http.get(`${ARROA.ROOT}/products-by-brand/${id}?page=${pageNo}`).toPromise();
  }

  related_pdt(url) {
    return this.http.get(url).toPromise();
  }
}
