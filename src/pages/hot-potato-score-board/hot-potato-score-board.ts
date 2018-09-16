import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';
/**
 * Generated class for the HotPotatoScoreBoardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hot-potato-score-board',
  templateUrl: 'hot-potato-score-board.html',
})
export class HotPotatoScoreBoardPage {
  @ViewChild(Navbar) navbar:Navbar;
 status:any;
 gameInstanceID:any;
 username:any;
 accesstoken:any;
 playerList=[];
 playerStatusList=[];
 statusLost=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient) {
    this.status = this.navParams.get('status');
    this.gameInstanceID= this.navParams.get('gameInstanceID');

  }

  ionViewDidLoad() {
    this.navbar.backButtonClick=(e:UIEvent)=>{
      console.log("back button from HotPotatoScoreBoardPage");
      this.navCtrl.pop();
      this.navCtrl.pop();
    }
  
  }

  ionViewWillLoad()
  {
      this.getUsername().then(usernameData=>{
      this.getUserToken().then(usertokendata=>{
        this.getGameDetails().then(gameDetails=>{
        if(gameDetails['error'])
        {
          this.navCtrl.push('InvalidLoginPage', {error: gameDetails['error']});
        }
        else
        {
          while(this.playerList.length>0)
          {this.playerList.pop();this.playerStatusList.pop();}
          let i=0;
          if(this.status=='Lost')
          {
            this.statusLost=true;
          }
          else
          {
            this.statusLost=false;
          }
          for(i=0;i<gameDetails['numberOfPlayers']*3;i=i+3)
              { 
                this.playerList.push(gameDetails[i]);
                this.playerStatusList.push(gameDetails[i+2]);
              }
        }

        })
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
 
  getGameDetails()
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/getGameDetailsPage.php?self=';
    link= link.concat(this.username);
    link = link.concat('&accessToken=');
    link= link.concat(this.accesstoken);
    link=link.concat('&gameInstanceID=');
    link=link.concat(this.gameInstanceID);
   
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
