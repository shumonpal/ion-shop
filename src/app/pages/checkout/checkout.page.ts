import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/providers/cart.service';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { UtilityService } from 'src/app/providers/utility.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  carts: any = [];
  product:object = {};
  totalPrice:number;
  grandTotal;

  checkoutForm:FormGroup;

  constructor(
    private cartSrvc:CartService,
    private navC:NavController,
    private payPal: PayPal,
    private util: UtilityService
  ) {
    this.cartSrvc.getAll().then((items) => {
      this.carts = items;
      var total = 0;
      items.forEach((item) => {
        total += Number(item.price * item.qty);
      });
      this.totalPrice = total;
      this.grandTotal = total;
    });
    this.createCheckoutForm();
   }

  ngOnInit() {
  }

  createCheckoutForm(){
    this.checkoutForm = new FormGroup({
      shipping: new FormControl('', [Validators.required]),
      payment_opt: new FormControl('', [Validators.required])
    });
    this.checkoutForm.valueChanges.subscribe((res)=> {
      // console.log("this.checkoutForm", this.checkoutForm.controls.shipping.value);      
      this.grandTotal = this.totalPrice + Number(this.checkoutForm.controls.shipping.value);    
    });    
  }

  checkoutSubmit(){
    if (this.checkoutForm.controls.payment_opt.value == "paypal") {
      console.log("payment_opt", this.checkoutForm.controls.payment_opt.value)
      this.payPalCheckout();
    } else if(this.checkoutForm.controls.payment_opt.value == "master") {
      console.log("payment_opt", this.checkoutForm.controls.payment_opt.value)      
    }
  }

  payPalCheckout(){
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'ATtjq27iXgwWeSfSCEpmnJFOer41sgCg_MyDyewA1avPC2-CuCzD2M7ONZYUY1rRZ5LyAOoFeo9Zq99P'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        const pckIDescp = "Package-"+Date.now();
        let payment = new PayPalPayment(this.grandTotal, 'USD', pckIDescp, 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          // Successfully paid
          this.util.defaultToast("Successfully paid" + res.response.id);
          console.log("Successfully paid", res);
          //save to database
          //delete cart
          //redirect to order page
          this.navC.navigateForward("/order");
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
          console.log("Error or render dialog closed without being successful");
          this.util.defaultToast("Error or render dialog closed without being successful")
          
        });
      }, () => {
        // Error in configuration
        console.log("Error in configuration");
        this.util.defaultToast("Error in configuration")

      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log(" Error in initialization, maybe PayPal isn't supported or something else");
      this.util.defaultToast("Error in initialization, maybe PayPal isn't supported or something else")
      
    });
  }

  goBack(){
    this.navC.back();
  }

}
