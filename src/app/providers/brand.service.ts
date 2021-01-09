import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  ROOT: string = "https://errora-shop.herokuapp.com/api";
  constructor(
    private http: HttpClient
  ) { }

  allBrands(){
    return this.http.get(`${this.ROOT}/brands`).toPromise();
  }
}
