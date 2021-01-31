import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UtilityService } from './utility.service';

const ACCESS_TOKEN = 'ACCESS_TOKEN';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  ROOT: string = "https://errora-shop.herokuapp.com/api";
  authState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private util: UtilityService,
    
  ) { }
  
  login(cridentials){  
    return this.http.post(`${this.ROOT}/login`, cridentials).pipe(
      take(1),
      map((res:any) => {
        if(res.access_token){
          this.storage.set(ACCESS_TOKEN, `Bearer ${res.access_token}`);
          return true;
        }else{
          return false;
        }
        
      })
    );
  }
  registration(cridentials){  
    return this.http.post(`${this.ROOT}/register`, cridentials).pipe(
      take(1),
      map((res:any) => {
        if(res.access_token){
          this.storage.set(ACCESS_TOKEN, `Bearer ${res.access_token}`);
          return true;
        }else{
          return false;
        }        
      })
    );
  }

  update(id, cridentials){  
    return this.token().then((token) => {
      // let headers = new HttpHeaders();
      // headers.append('Accept', 'application/json');
      // headers.append('Authorization', `${token}`);
      // let cridentials = {
      //   country: 'Singapore',
      //   state: 'SG'
      // }
      console.log("id", id);
      
      let headers = new HttpHeaders({'Content-Type': 'application/json',
                                     'Accept':'application/json',
                                     'Authorization': `${token}`,
                                    });
      return this.http.put(`${this.ROOT}/update/${id}`, JSON.stringify(cridentials), {headers: headers}).toPromise();
    })
  }

  async isAthenticated(){
    return this.storage.get(ACCESS_TOKEN).then((res) => {
      if(res){
        return true;
      }else{
        return false;
      }
    });  
  }

  logout(){
    return this.storage.remove(ACCESS_TOKEN);
  } 

  token(){
    return this.storage.get(ACCESS_TOKEN);
  }

  user(){
    return this.token().then((token) => {
      if (token) {
        let headers = new HttpHeaders({'Content-Type': 'application/json',
                                     'Accept':'application/json',
                                     'Authorization': `${token}`,
                                    });
        return this.http.post(`${this.ROOT}/me`, {}, {headers: headers}).toPromise();
      }
      
    })
  }

}
