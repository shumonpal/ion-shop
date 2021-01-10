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

  allProducts() {
    // return this.http.get(ARROA.products).pipe((map((res:any) => {
    //   res.data.data;
    // })));
    return this.http.get(ARROA.products).toPromise();
  }
  featureProducts() {
    return this.http.get(`${ARROA.ROOT}/product-feature`).toPromise();
  }
  newArrived() {
    return this.http.get(`${ARROA.ROOT}/product-new`).toPromise();
  }
  weekDeal() {
    return this.http.get(`${ARROA.ROOT}/product-week-deals`).toPromise();
  }

  pdtById(id) {
    return this.http.get(`${ARROA.ROOT}/product/${id}`).toPromise();
  }
  pdtByCategory(id) {
    return this.http.get(`${ARROA.ROOT}/products-by-category/${id}`).toPromise();
  }
  pdtByBrand(id) {
    return this.http.get(`${ARROA.ROOT}/products-by-brand/${id}`).toPromise();
  }

  related_pdt(url) {
    return this.http.get(url).toPromise();
  }
}
