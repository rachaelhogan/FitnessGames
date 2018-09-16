import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InvalidLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invalid-login',
  templateUrl: 'invalid-login.html',
})
export class InvalidLoginPage {

  errormsg = null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.errormsg = this.navParams.get('error');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvalidLoginPage');
  }

}
