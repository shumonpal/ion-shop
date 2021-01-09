import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  ROOT: string = "https://errora-shop.herokuapp.com/api";
  constructor(
    private http: HttpClient
  ) { }

  allCategories(){
    return this.http.get(`${this.ROOT}/categories`).toPromise();
  }
}
