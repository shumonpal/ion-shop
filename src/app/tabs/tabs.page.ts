import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { NgEventBus } from 'ng-event-bus';
import { MetaData } from 'ng-event-bus/lib/meta-data';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  isLogin:boolean;
  constructor(
    private auth: AuthService,
    private router: Router,
    private eventBus: NgEventBus,
    private menu: MenuController
  ) {
    this.auth.isAthenticated().then((res) => {
      if(res){
        this.isLogin = true;
      }else{
        this.isLogin = false;
      };
    })    
  }

  ngOnInit(){
    this.eventBus.on('loggedIn').subscribe((meta: MetaData) => {
      if(meta.data){
        this.isLogin = true;
      }else{
        this.isLogin = false;
      }
    })
  }


  logout(){
    this.auth.logout().then((res) => {
      this.isLogin = false;
      this.router.navigate(['/home']);    

    })
  }

  openSideMenu(){
    this.menu.enable(true, 'user-menu');
    this.menu.open('user-menu');
  }

}
