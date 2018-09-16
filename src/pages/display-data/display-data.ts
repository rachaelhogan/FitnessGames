import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Events} from 'ionic-angular';
  import { HotPotatoScoreBoardPage } from '../hot-potato-score-board/hot-potato-score-board';
import { HotPotatoGamePage } from '../hot-potato-game/hot-potato-game';
import { HotPotatoInviteFriendsPage } from '../hot-potato-invite-friends/hot-potato-invite-friends';
import { HttpClient } from '@angular/common/http';
import { InvalidLoginPage } from '../invalid-login/invalid-login';
import { GameInstancePage } from '../game-instance/game-instance';
/**
 * Generated class for the DisplayDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-display-data',
  templateUrl: 'display-data.html',
})
export class DisplayDataPage {
  userdata = null;
  userSteps = null;
  userActiveMinutes = null;
  userName = null;
  timeInterval :any={};
  showallGames=false;
  invitedGameInstances=[];
  invitedGames=[];
  invitedAcceptedGames=[]
  invitedAcceptedGameInstance=[];
  username:any;
  accesstoken:any;
  GameInviteHeader ="";
  GameActiveHeader="";
  allGameButtonText="All Games";
  activeGamesList=[];
  activeGameInstances=[];
  ReadyToPlayList=[];
  ReadyToPlayInstances=[];
  displayTimeList=[];
  gameOverPlayersList =[];
  gameOverInstances=[];
  gameOverMyStatusList=[];
  gameOverHeader="";
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient,public events:Events,private zone : NgZone) {
    this.userdata = this.navParams.get('data');
    this.userSteps= this.userdata['steps'];
    this.userName = this.userdata['username'];
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayDataPage');
    this.events.subscribe('gameStart',(notificationData)=>{
      console.log(" DISPLAY DATA notificationData",notificationData);
      this.zone.run(()=>this.refreshView())
    })
    this.events.subscribe('gameOver',(data)=>{
      
      this.zone.run(()=>this.refreshView())
    })


  } 

  ionViewWillEnter() {
    console.log('ionViewDidLoad DisplayDataPage');
    this.allGameButtonText=="All Games";
    this.zone.run(()=> this.refreshView());
  }

  Logout()
  {
    console.log("Logging out");
    this.storage.remove('accessToken');
    this.storage.remove('username');
    this.navCtrl.pop()
    
    
  }

  hotPotatoGame()
  {
   this.navCtrl.push('HotPotatoGamePage', {name:this.userName});
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



  getInvitedGames()
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/getInvitedGames.php?self=';
    link= link.concat(this.username);
    link = link.concat('&accessToken=');
    link= link.concat(this.accesstoken);

    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })
  }
  getActiveGames()
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/getActiveGames.php?self=';
    link= link.concat(this.username);
    link = link.concat('&accessToken=');
    link= link.concat(this.accesstoken);

    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })
  }
  getFinishedGames()
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/getFinishedGames.php?self=';
    link= link.concat(this.username);
    link = link.concat('&accessToken=');
    link= link.concat(this.accesstoken);
    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })
  }
  getActiveGameDetail(gameIID)
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/getActiveGameDetail.php?self=';
    link= link.concat(this.username);
    link = link.concat('&accessToken=');
    link= link.concat(this.accesstoken)
    link = link.concat('&gameInstanceID=');
    link = link.concat(gameIID);
    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })
    
  }

  acceptInvite(invite,i)
  {
    let gameInstance = this.invitedGameInstances[i];
    this.getUsername().then(
      userNameData =>
      {
        this.getUserToken().then(
          userTokenData =>
          {
            var link = 'http://kidsteam.boisestate.edu/kidfit/acceptGameInvite.php?self=';
            link= link.concat(this.username);
            link = link.concat('&accessToken=');
            link= link.concat(this.accesstoken);
            link=link.concat('&gameInstanceID=');
            link = link.concat(gameInstance);
            
            this.updateInvitation(link).then(
              data =>
              {
                this.zone.run(()=> this.refreshView());
                })})})}

  
  

DeclineInvite(invite,i)
{
  let gameInstance = this.invitedGameInstances[i];
  this.getUsername().then(
    userNameData =>
    {
      this.getUserToken().then(
        userTokenData =>
        {
          var link = 'http://kidsteam.boisestate.edu/kidfit/declineGameInvite.php?self=';
          link= link.concat(this.username);
          link = link.concat('&accessToken=');
          link= link.concat(this.accesstoken);
          link=link.concat('&gameInstanceID=');
          link = link.concat(gameInstance);
          
          this.updateInvitation(link).then(
            data =>
            {
              if(data['error'])
              {
                this.navCtrl.push('InvalidLoginPage', {error: JSON.stringify(data)});
              }
              else{

                this.zone.run(()=> this.refreshView());
                }
                  })})})
}

  updateInvitation(link)
  {
    
    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })
  }

  openGameDetails(gameType, gameIndex)
  {
   // this.navCtrl.push('InvalidLoginPage', {error: gameType});
   let gameInstance;
   if(gameType==1)
   {
       gameInstance= this.invitedAcceptedGameInstance[gameIndex];
   }
    if(gameType==2)
    {
       gameInstance = this.invitedGameInstances[gameIndex];
    }
    if(gameType==3)
    {
       gameInstance = this.ReadyToPlayInstances[gameIndex];
    }
    if(gameType==4)
    {
       gameInstance = this.activeGameInstances[gameIndex];
    }

   this.navCtrl.push('GameInstancePage',{gameInstanceID:gameInstance});
  }


refreshView()
{
  this.getUsername().then(userNameData=>
    {this.getUserToken().then(accesstokenData =>
        {
          //  INVITED GAMES
          this.getInvitedGames().then(InvitedGamesData=>{
            if(InvitedGamesData['error'])
            {
              console.log("error in Invited Games");
              this.navCtrl.push('InvalidLoginPage', {error: JSON.stringify(InvitedGamesData['error'])});
            }
            else
            {
              while(this.invitedAcceptedGameInstance.length>0)
              {
                this.invitedAcceptedGameInstance.pop();this.invitedAcceptedGames.pop();
              }
              while(this.invitedGameInstances.length>0)
              {
                this.invitedGameInstances.pop();this.invitedGames.pop();
              }
              let i=0;
              if(InvitedGamesData['numberOfInvitedGames']>0)
              {
                this.GameInviteHeader = " Game Invites";
              }
              else
              {
                this.GameInviteHeader = "";
              }
              for(i=0;i<3*InvitedGamesData['numberOfInvitedGames'];i=i+3)
              {
                if(InvitedGamesData[i+2]=='ReadyToPlay')
                {
                  this.invitedAcceptedGameInstance.push(InvitedGamesData[i]);
                  this.invitedAcceptedGames.push(InvitedGamesData[i+1]);
                }
                else
                {
                  this.invitedGameInstances.push(InvitedGamesData[i]);
                  this.invitedGames.push(InvitedGamesData[i+1]);
                  }}}})
                    // ACTIVE GAMES
          this.getActiveGames().then(activeGamesData=>{
            if(activeGamesData['error'])
            {
              console.log("error in Active Games");
              this.navCtrl.push('InvalidLoginPage', {error: JSON.stringify(activeGamesData['error'])});
            }
            else
            {
              while(this.activeGamesList.length>0)
              {
                this.activeGamesList.pop();this.activeGameInstances.pop();
              }
              while(this.ReadyToPlayInstances.length>0)
              {
                this.ReadyToPlayInstances.pop();this.ReadyToPlayList.pop();
              }
              if(activeGamesData['numberOfActiveGames']>0)
              {
                this.GameActiveHeader = " Active Game";
              }
              else
              {
                this.GameActiveHeader = "";
              }
              let i=0;
              for(i=0;i<activeGamesData['numberOfActiveGames']*3;i=i+3)
              {
                if(activeGamesData[i+2]=='ReadyToPlay')
                {
                  this.ReadyToPlayList.push(activeGamesData[i+1]);
                  this.ReadyToPlayInstances.push(activeGamesData[i]);
                }
                else
                {
                  this.activeGamesList.push(activeGamesData[i+1]);
                  this.activeGameInstances.push(activeGamesData[i]);
                  this.getActiveGameDetail(activeGamesData[i]).then(activeGameData=>{
                  if(activeGameData['error'])
                  {
                    console.log("error in Active Game Data");
                  this.navCtrl.push('InvalidLoginPage', {error: JSON.stringify(activeGameData['error'])});
                  }
                  else
                  {
                    var str ="";
                    if(activeGameData['timeRemaining']>=0)
                    {
                      let x = activeGameData['timeRemaining']/3600;
                      let y = Math.round(x);
                      
                      
                      if(x<y)
                      {
                        str = "Less than ";
                        let z = String(y);
                        str= str.concat(z);
                        str= str.concat(" hour remaining");
                      }
                      else{
                        str = "Over ";
                        let z = String(y);
                        str=str.concat(z);
                        str= str.concat(" hour remaining");
                      }
                    }
                    else{
                      str= "Game Over";
                                   

                    }
                    this.displayTimeList.push(str);
                  }})}}}})})})}




showAllGames()
{
  this.showallGames=true;
  console.log("Before ", this.allGameButtonText)
  if(this.allGameButtonText=="All Games")
  {
    console.log("Case 1")
    this.showallGames=true;
    this.allGameButtonText = "Active Games";
    this.getFinishedGames().then(finishedGameData=>{
      while(this.gameOverInstances.length>0)
      {
        this.gameOverInstances.pop();this.gameOverMyStatusList.pop();this.gameOverPlayersList.pop();
      }
      if(finishedGameData['noOfFinishedGames']>0)
      {
        this.gameOverHeader="Finished Games";
        let i=0;
        for(i=0;i<3*finishedGameData['noOfFinishedGames'];i=i+3)
        {
          this.gameOverInstances.push(finishedGameData[i]);
          let str = finishedGameData[i+1];
          this.gameOverPlayersList.push(finishedGameData[i+1]);
          this.gameOverMyStatusList.push(finishedGameData[i+2]);
        }
      }
      
    })
  
  }
  else
  {
    console.log("case 2")
    this.gameOverHeader="";
    this.showallGames=false;
  this.allGameButtonText= "All Games";
  }
console.log("After ",this.allGameButtonText)
}

}
