import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';
import { AddUserPage } from '../add-user/add-user';
import { ScavengerHuntPage } from '../scavenger-hunt/scavengerhunt'



@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {
  @ViewChild(Navbar) navbar:Navbar;
 status:any;
 gameInstanceID:any;
 username:any;
 accesstoken:any;
 playerList=[];
 playerStatusList=[];
 statusLost=false;
<<<<<<< HEAD
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient) {
    this.status = this.navParams.get('status');
    this.gameInstanceID= this.navParams.get('gameInstanceID');
=======
 gameDetails:any;
 selfGameStatus="";
 selfID=0;
 playerWinNameList=[];
 playerWinIDList=[];
 playerWinStatusList=[];
 playerWinStepsList=[];
 playerIDList=[];
 playerStepList=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient) {
   this.gameDetails = this.navParams.get('data');
>>>>>>> origin/RachaelBranch

  }

  exit(){
    this.navCtrl.popToRoot()
  }


  newGame(){
    this.navCtrl.push('AddUserPage')
  }

  stats(){
    console.log("You took _ steps in _ time")
  }


  ionViewDidLoad() {
    this.navbar.backButtonClick=(e:UIEvent)=>{
      console.log("back button from ResultsPage");
      this.navCtrl.pop();
      this.navCtrl.pop();
    }
  
  }

<<<<<<< HEAD
  ionViewWillLoad()
  {
      this.getUsername().then(usernameData=>{
=======
  ionViewWillEnter()
  {
    let i=0;
    console.log(this.gameDetails);
    while(this.playerWinIDList.length>0)
    {
      this.playerWinIDList.pop();
      this.playerWinNameList.pop();
      this.playerWinStatusList.pop();
      this.playerWinStepsList.pop();
    }
    while(this.playerIDList.length>0)
    {
      this.playerIDList.pop();
      this.playerList.pop();
      this.playerStatusList.pop();
      this.playerStepList.pop();
    }
    this.selfGameStatus = this.gameDetails['selfGameStatus'];
    if(this.selfGameStatus=='userWon')
    {
      let str = this.gameDetails['selfName'].concat('( ').concat(this.gameDetails['selfStepsAccumulated']).concat(' steps ) ').concat('\t').concat('Won.');
      this.playerWinNameList.push(str);
      this.selfGameStatus = 'won';
      //this.bgImage= "flower-image4";
    }
    for (i=0;i<this.gameDetails['numberOfPlayers']*4;i=i+4)
    {
      if(this.gameDetails[i+2]=='userWon')
      {
        this.playerWinIDList.push(this.gameDetails[i+1]);
        let str = this.gameDetails[i].concat('( ').concat(this.gameDetails[i+3]).concat(' steps ) ').concat('\t').concat('Won.');
        this.playerWinNameList.push(str);
        this.playerWinStepsList.push(this.gameDetails[i+3]);
        this.playerWinStatusList.push(this.gameDetails[i+2]);
      }
      else
      {
        this.playerIDList.push(this.gameDetails[i+1]);
        let str = this.gameDetails[i].concat('( ').concat(this.gameDetails[i+3]).concat(' steps ) ').concat('\t').concat('Lost.');
        this.playerList.push(str);
        this.playerStepList.push(this.gameDetails[i+3]);
        this.playerStatusList.push(this.gameDetails[i+2]);
      } 
      if(this.selfGameStatus=='userLost')
      {
        let str = this.gameDetails['selfName'].concat('( ').concat(this.gameDetails['selfStepsAccumulated']).concat(' steps ) ').concat('\t').concat('Lost.');
        this.playerList.push(str);
        this.selfGameStatus='lost';
        //this.bgImage= "bg-imageLose"
      }
    }              
    console.log('playerList',this.playerList);
    console.log('playerWinNameList', this.playerWinNameList);
      /*this.getUsername().then(usernameData=>{
>>>>>>> origin/RachaelBranch
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
<<<<<<< HEAD
      })
=======
      })*/
>>>>>>> origin/RachaelBranch
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
