import { Component,Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HotPotatoScoreBoardPage } from '../hot-potato-score-board/hot-potato-score-board';
import * as math from 'mathjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { HotPotatoScoreBoardPageModule } from '../hot-potato-score-board/hot-potato-score-board.module';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { InvalidLoginPage } from '../invalid-login/invalid-login';

export interface CountdownTimer {
  seconds: number;
  secondsRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;
  gaeID
}
/**
 * Generated class for the HotPotatoTimerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hot-potato-timer',
  templateUrl: 'hot-potato-timer.html',
})
export class HotPotatoTimerPage {
  username:any={};
  accesstoken:any={};
  
  gamesteps=0;
  gameActiveTime=0;
  @Input() timeInSeconds: number;
  timer: CountdownTimer;
  gameID:any={};
  //ngOnInit() {
    //this.initTimer();
  //}

  hasFinished() {
    return this.timer.hasFinished;
  }

  initTimer() {
    if (!this.timeInSeconds) { this.timeInSeconds = 0; }

    this.timer = <CountdownTimer>{
      seconds: this.timeInSeconds,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      secondsRemaining: this.timeInSeconds
    };

    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    this.startTimer();
  }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  pauseTimer() {
    this.timer.runTimer = false;
  }

  resumeTimer() {
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {
      if (!this.timer.runTimer) { return; }
      this.timer.secondsRemaining--;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
      if (this.timer.secondsRemaining > 0) {
        this.timerTick();
      } else {
        this.timer.hasFinished = true;


        this.getUsername().then(   // Get User name
          data1=>{  
            
            this.getUserToken().then(    // Get user access token
            data2=>{
             
              this.getGameData().then(
              data=>{
                  if(data['error']){
                    console.log(data)
                  
                   this.navCtrl.push('InvalidLoginPage',{error:this.username})
                   
                    }
                  else //if(data['login']=="success")
                  {
                  // this.gamesteps = this.userdata['steps'] - data['steps'];
                   //this.gameActiveTime= this.userdata['veryActiveMinutes']+this.userdata['fairlyActiveMinutes']-data['fairlyActiveMinutes']-data['veryActiveMinutes'];
                    // this.navCtrl.push('HotPotatoScoreBoardPage');
                    
                    this.navCtrl.push('HotPotatoScoreBoardPage',{data:data});
                    console.log(data);
                  }
                } 
        );
      })
    })
}
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = (hours < 10) ? '0' + hours : hours.toString();
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private storage:Storage) {
    
    this.timeInSeconds = 10; 
    this.timeInSeconds = math.random(900,2700);
    this.timeInSeconds = math.random(120,240);
    this.gameID = this.navParams.get('gameID');

    this.initTimer();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HotPotatoTimerPage');
  }

  getUsername()
{
  console.log("getUserDetails");
  return new Promise(resolve => {
    this.storage.get('username').then((val) => {
      this.username =val;
      resolve(val);
    });})
}

getUserToken()
{
  console.log("getUserToken");
  return new Promise(resolve => {
    this.storage.get('accessToken').then((val) => {
      this.accesstoken = val;
      resolve(val);
    });})
  }

  getGameData()
  {
    console.log("getLoginDetails");
    var link = 'http://kidsteam.boisestate.edu/kidfit/get_game_data.php?username=';
    link = link.concat(this.username);
    link = link.concat('&accessToken=');
    link=link.concat(this.accesstoken);
    link=link.concat('&gameID=');
    link=link.concat(this.gameID);
    
    console.log(link);
    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })

  }

}
