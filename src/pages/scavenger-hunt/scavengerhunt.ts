import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ScavengerHuntPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface CountdownTimer {
    seconds: number;
    secondsRemaining: number;
    runTimer: boolean;
    hasStarted: boolean;
    hasFinished: boolean;
    displayTime: string;
}

@IonicPage()
@Component({
  selector: 'page-scavengerhunt',
  templateUrl: 'scavengerhunt.html',
})
export class ScavengerHuntPage {
  gameInstanceID = null;
  username: any;
  accesstoken: any;
  groupName = "";
  ifOwner: boolean;
  playerList = [];
  userIDList = [];
  playerStatusList = [];
  data: any = {};
  editing: boolean = false;
  gameInvited = false;
  gameInProgress = false;
  gameReadyToPlay = false;
  gameOver = false;
  gameID = null;
  gameWonOrLost: null;
  currentActivityTime = 0;
  startActivityTime = 0;
  endingActivityTime = 0;
  timeRemaining: any;
  timer: CountdownTimer;
  bgImage: any;
  brightnessValue = 0.8;
  selfName = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScavengerHuntPage');
  }

  getImage(player:string) {
    let list = ["bg-image1","bg-image2","bg-image3","bg-image4",
                "bg-image5","bg-image6","bg-image7","bg-image8",
                "bg-image9","bg-image10","bg-image11","bg-image12",
                "bg-image13","bg-image14","bg-image15","bg-image16","bg-image17"]
    let index = Math.floor(Math.random() * 16);
    var temp = this.bgImage;
    this.bgImage = list[index];
    if(temp == this.bgImage){
      this.getImage(player);
    }
  }

}
