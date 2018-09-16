import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HotPotatoInviteFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hot-potato-invite-friends',
  templateUrl: 'hot-potato-invite-friends.html',
})
export class HotPotatoInviteFriendsPage {
  data:any = {}
  gameID=0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.gameID = this.navParams.get('gameID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HotPotatoInviteFriendsPage');
  }

}
