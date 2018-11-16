import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ResultsPage } from '../results/results';

/**
 * Generated class for the ScavengerHuntPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gameStart',
  templateUrl: 'gameStart.html',
})
export class gameStartPage {
  
  userSteps;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  //constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userSteps= this.navParams.get('steps');
  
  }
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad gameStartPage');
  }

  startGame(){
    this.navCtrl.push('ScavengerHuntPage',{steps:this.userSteps});
  }

}
