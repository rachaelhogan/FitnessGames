import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the ScavengerHuntPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scavengerhunt',
  templateUrl: 'scavengerhunt.html',
})
export class ScavengerHuntPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScavengerHuntPage');
  }

  getImage() {
    //"assets/imgs/comb.jpg"
    let path = "assets/imgs/";
    let list = ["bowl.jpg","broom.jpg","car.jpg","cards.jpg","comb.jpg","cup.jpg",
                          "fork.jpg","hat.jpg","lego.jpg","plate.jpg","shoes.jpg","socks.jpg",
                          "spatula.jpg","spoon.jpg","teddybear.jpg","toytrain.jpg","winterhat.jpg"]
    let index = Math.floor(Math.random() * 16);
    path = path + list[index];
    return path;
  }

}
