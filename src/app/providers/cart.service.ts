import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const ITEMS_KEY = "carts";
@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  constructor(
    private storage: Storage
  ) { }

  putVal(data){
    return this.storage.get(ITEMS_KEY).then((items) => {
      if(items){
        items.push(data);
        return this.storage.set(ITEMS_KEY, items);
      }else{
        return this.storage.set(ITEMS_KEY, [data]);
      }
    });
  }

  getAll(){
    return this.storage.get(ITEMS_KEY);
  }

  cartCounter(){
    return this.getAll().then((items) => {
      return items.length;
    });
  }

  getById(id){
    return this.storage.get(ITEMS_KEY).then((items) => {
      return items.filter((item) => {
        return item.id === id;
      })
    });
  }

  update(pdtId, item){
    return this.getAll().then((items) => {
      const newItems = [];
      for(let p of items){               
        if(p.pdt_id === pdtId){
          const nItem = Object.assign(p, item); 
          newItems.push(nItem)           
          console.log("cart_update", nItem)
        }
        else{
          newItems.push(p)
        }
      }
      this.storage.set(ITEMS_KEY, newItems);
      return true;
    });
  }

  delete(id){
    return this.getAll().then((items) => {
      const keepItems = items.filter((item) => {
        return item.id != id;
      });
      this.storage.set(ITEMS_KEY, keepItems);
      return true;
    })
  }
}
