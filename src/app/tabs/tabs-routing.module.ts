import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { IsAuthenticatedGuard } from '../guards/is-authenticated.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../pages/login/login.module').then( m => m.LoginPageModule),
        canActivate: [IsAuthenticatedGuard]
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'product-details/:id',
        loadChildren: () => import('../pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
      },
      {
        path: 'checkout',
        loadChildren: () => import('../pages/checkout/checkout.module').then( m => m.CheckoutPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cart',
        loadChildren: () => import('../pages/cart/cart.module').then( m => m.CartPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/user/profile/profile.module').then( m => m.ProfilePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'registration',
        loadChildren: () => import('../pages/registration/registration.module').then( m => m.RegistrationPageModule),
        canActivate: [IsAuthenticatedGuard]
      },
      {
        path: 'shop',
        loadChildren: () => import('../pages/shop/shop.module').then( m => m.ShopPageModule)
      }
      
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
