import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Navbar } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import { DisplayDataPage } from '../display-data/display-data';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { Brightness } from '@ionic-native/brightness'
/**
 * Generated class for the ScoreBoardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-score-board',
  templateUrl: 'score-board.html',
})

export class ScoreBoardPage {
  @ViewChild(Navbar) navBar: Navbar;
  playerStatus:any;
  bckgrnd_img:any;
  username:any;
  accesstoken:any;
  winLoseimage:any;
  win=false;
  lose=false;
  playerStatusDisplay=""
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public httpClient:HttpClient,private storage:Storage, private brightness: Brightness) {
    this.playerStatus=this.navParams.get('playerStatus');
    
    if(this.playerStatus=="userLost" )
     { this.winLoseimage="bg-imageLose";
      this.lose=true;
      this.win=false;
      this.playerStatusDisplay= 'Lost'

  }
    else{
    this.winLoseimage="bg-imageWin"
    this.win=true;
    this.lose=false;
    this.brightness.setBrightness(1)
    this.playerStatusDisplay='win'
    }

    console.log("playerStatus", this.playerStatus)
    console.log("win",this.win)
    console.log("lose",this.lose)
    console.log("winLose",this.winLoseimage)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScoreBoardPage');
    
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.getUsername().then(usernamedata=>{
        this.getUserToken().then(usertokendata=>{
          this.getUserData().then(userData=>{
            this.navCtrl
              .push(DisplayDataPage,{data:userData})
              .then(() => {
      
                  const index = this.viewCtrl.index;
      
                  for(let i = index; i > 0; i--){
                      this.navCtrl.remove(i);
                  }
      
              });
          })
        })
        })
    }
    
  }

  /*ionViewDidLeave(){
  this.getUsername().then(usernamedata=>{
  this.getUserToken().then(usertokendata=>{
    this.getUserData().then(userData=>{
      this.navCtrl
        .push(DisplayDataPage,{data:userData})
        .then(() => {
            const index = this.viewCtrl.index;
            for(let i = index; i > 0; i--){
                this.navCtrl.remove(i);
            }
        });
    })
  })
  })
  }*/

  
  getUserData()
    {
      console.log("getting user data");
      var link = 'https://kidsteam.boisestate.edu/kidfit/direct_login.php?username=';
      link = link.concat(this.username);
      link = link.concat('&accessToken=');
      link=link.concat(this.accesstoken);
      return new Promise(resolve => {
        this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })

  
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
}