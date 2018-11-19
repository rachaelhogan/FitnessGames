import { ScavengerHuntPage } from './../scavenger-hunt/scavengerhunt';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');

  }

  GetStarted() {
    //this.navCtrl.push('AddUserPage');
    //this.navCtrl.push('LoginPage');
    this.navCtrl.push('ScavengerHuntPage');
    //this.navCtrl.push('AddUserPage')
    //this.navCtrl.push('ResultsPage')
  }
}
