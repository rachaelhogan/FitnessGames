import { Component,NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Events } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ResultsPage } from '../results/results';

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
  p1Image: any;
  p2Image: any;
  p3Image: any;
  p4Image: any;
  p5Image: any;
  p6Image: any;
  wWidth: number;
  brightnessValue = 0;
  playerCount = 0;
  selfName = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage,public httpClient:HttpClient,private zone : NgZone,public events: Events, private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScavengerHuntPage');
    this.wWidth = window.innerWidth;
    this.p1Image="bg-start";
    this.p2Image="bg-start";
    this.p3Image="bg-start";
    this.p4Image="bg-start";
    this.p5Image="bg-start";
    this.p6Image="bg-start";
  }

  getWidth(){
    return this.wWidth;
  }

  getImage() {
    let list = ["bg-image1","bg-image2","bg-image3","bg-image4",
                "bg-image5","bg-image6","bg-image7","bg-image8",
                "bg-image9","bg-image10","bg-image11","bg-image12",
                "bg-image13","bg-image14","bg-image15","bg-image16","bg-image17"]
    let index = Math.floor(Math.random() * 17);
    var temp = this.p1Image;
    this.p1Image = list[index];
    if(temp == this.p1Image){
      this.getImage();
    }
  }

  endGame(){
    this.navCtrl.push('ResultsPage')
  }
}
