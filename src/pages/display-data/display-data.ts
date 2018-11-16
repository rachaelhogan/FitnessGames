import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
//import { InvalidLoginPage } from '../invalid-login/invalid-login';
import { Events } from 'ionic-angular';
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
  userdata=null;
  userActiveMinutes=0;
  userName="";
  username:any=null;
  accesstoken:any=null;
  gameID:null;
  userSteps:null;
  // Invited Games
  invitedGameInstances=[];
  invitedGames=[];
  invitedAcceptedGames=[]
  invitedAcceptedGameInstance=[];
  invitedGroupNameList=[];
  invitedAcceptedGroupNameList=[]
  invitedGameArrow ="arrow-dropdown"
  expandInvitedGame=false;

  // Active Games 
  activeGamesList=[];
  activeGameInstances=[];
  ReadyToPlayList=[];
  ReadyToPlayInstances=[];
  activeGroupNameList=[];
  readyToPlayGroupNameList=[]
  displayTimeList=[];
  activeGameArrow="arrow-dropdown"
  expandActiveGame =false;
  
  
  // Completed Games
  gameOverPlayersList =[];
  gameOverInstances=[];
  gameOverMyStatusList=[];
  gameOverGroupNameList =[];
  completedGameArrow="arrow-dropdown"
  expandCompletedGame=false;

  gameStartSubscription:any;
  gameOverSubscription:any;
  
  
  
  
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,private zone : NgZone,public httpClient:HttpClient,public events: Events) {
    this.userdata=this.navParams.get('data')
    this.userActiveMinutes =this.userdata['fairlyActiveMinutes']+this.userdata['veryActiveMinutes'];
    this.userName=this.userdata['username'] 
    this.userSteps=this.userdata['steps'];
    console.log("data in displaydatapage",this.userdata)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayDataPage');
  }

  ionViewWillEnter()
  {
    // Notification for gameStart
     this.gameStartSubscription = this.events.subscribe('gameStart',(data)=>{
      this.zone.run(()=> this.refreshView());
    });

    // Notification for gameOver
    this.gameOverSubscription = this.events.subscribe('gameOver',(data)=>{
      this.zone.run(()=> this.refreshView());
    });

    this.zone.run(()=>this.refreshView());
  }

  ionViewWillLeave()
  {
    this.events.unsubscribe('gameStart')
    this.events.unsubscribe('gameOver');
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

Logout()
{
  console.log("Logging out");
  this.storage.remove('accessToken');
  this.storage.remove('username');
  this.navCtrl.pop() 
}
//create new game 
escapeTheTunnel()
{
  this.navCtrl.push('AddUserPage', {name:this.userName});
}
getInvitedGames()
{
  var link = 'https://kidsteam.boisestate.edu/kidfit/getInvitedGames.php?self=';
  link= link.concat(this.username);
  link = link.concat('&accessToken=');
  link= link.concat(this.accesstoken);
  link=link.concat('&gameID=')
  link=link.concat(this.gameID);

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
  var link = 'https://kidsteam.boisestate.edu/kidfit/getActiveGames.php?self=';
  link= link.concat(this.username);
  link = link.concat('&accessToken=');
  link= link.concat(this.accesstoken);
  link=link.concat('&gameID=')
  link=link.concat(this.gameID);
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
  var link = 'https://kidsteam.boisestate.edu/kidfit/getFinishedGames.php?self=';
  link= link.concat(this.username);
  link = link.concat('&accessToken=');
  link= link.concat(this.accesstoken);
  link = link.concat('&gameID=').concat(this.gameID)
  console.log('getting finished games', link)
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
  var link = 'https://kidsteam.boisestate.edu/kidfit/getActiveGameDetail.php?self=';
  link= link.concat(this.username);
  link = link.concat('&accessToken=');
  link= link.concat(this.accesstoken)
  link = link.concat('&gameInstanceID=');
  link = link.concat(gameIID);
  link=link.concat('&gameID=')
  link=link.concat(this.gameID);
 console.log("getting active game detail ",link)
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
          var link = 'https://kidsteam.boisestate.edu/kidfit/acceptGameInvite.php?self=';
          link= link.concat(this.username);
          link = link.concat('&accessToken=');
          link= link.concat(this.accesstoken);
          link=link.concat('&gameInstanceID=');
          link = link.concat(gameInstance);
          console.log("Going to accept Invite",link)
          this.updateInvitation(link).then(
            data =>
            {
              this.zone.run(()=> this.refreshView());
              })
        })
    })
}

DeclineInvite(invite,i)
{
  let gameInstance = this.invitedGameInstances[i];
  this.getUsername().then(
    userNameData =>
    {
      this.getUserToken().then(
        userTokenData =>
        {
          var link = 'https://kidsteam.boisestate.edu/kidfit/declineGameInvite.php?self=';
          link= link.concat(this.username);
          link = link.concat('&accessToken=');
          link= link.concat(this.accesstoken);
          link=link.concat('&gameInstanceID=');
          link = link.concat(gameInstance);
          console.log("Going to decline Invite",link)
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

   this.navCtrl.push('GameInstancePage',{gameInstanceID:gameInstance,steps:this.userSteps});
  }

refreshView()
{
  let i=0;
  this.getUsername().then(userNameData=>{
  this.getUserToken().then(accesstokenData=>{
  this.getGameID().then(gameIDdata =>{
  this.gameID=gameIDdata['gameID'];
      this.refreshInvitedGames();
    this.refreshActiveGames();
    this.refreshFinishedGames();
  })
  
  })
  })
}

refreshInvitedGames()
{
  let i=0;
  
  this.getInvitedGames().then(InvitedGamesData=>{
    console.log("Invited Games data ",InvitedGamesData )
    if(InvitedGamesData['error'])
    {
      console.log("error in refreshView loading Invited Games");
      this.navCtrl.push("InvalidLoginPage", {error: JSON.stringify(InvitedGamesData['error'])})
    }
    else
    {
      // Empty invited games and invited accepted games
      while(this.invitedAcceptedGameInstance.length>0){this.invitedAcceptedGameInstance.pop();this.invitedAcceptedGames.pop();this.invitedAcceptedGroupNameList.pop()}
      while(this.invitedGameInstances.length>0){this.invitedGameInstances.pop();this.invitedGames.pop();this.invitedGroupNameList.pop()}
    
    console.log("Response to get Invited Games ",InvitedGamesData);
    // Invited Game Data format 
    // numberOfInvitedGames,for each game(gameInstanceID,groupName, String with name of players and self status in each game
    
    
    for(i=0;i<4*InvitedGamesData['numberOfInvitedGames'];i=i+4)
    {
      //update invited accepted games data
      if(InvitedGamesData[i+3]=='userReadyToPlay')
      {
        this.invitedAcceptedGameInstance.push(InvitedGamesData[i]);
        this.invitedAcceptedGames.push(InvitedGamesData[i+2]);
        let displayString = InvitedGamesData[i+1].concat(' (').concat(InvitedGamesData[i+2]).concat(' )')
        this.invitedAcceptedGroupNameList.push(displayString);
      }
      else
      {
        // update invited game data
        this.invitedGameInstances.push(InvitedGamesData[i]);
        this.invitedGames.push(InvitedGamesData[i+2]);
        let displayString = InvitedGamesData[i+1].concat(' (').concat(InvitedGamesData[i+2]).concat(' )')
        this.invitedGroupNameList.push(displayString)
      }
    }
  }})
}

refreshActiveGames()
{
  let i=0;
  this.getActiveGames().then(activeGamesData=>{
    if(activeGamesData['error'])
    {
      console.log("error in refreshView loading active Games");
      this.navCtrl.push("InvalidLoginPage", {error: JSON.stringify(activeGamesData['error'])})
    }
    else
    {
      while(this.activeGamesList.length>0){this.activeGamesList.pop();this.activeGameInstances.pop();this.activeGroupNameList.pop()}
      while(this.ReadyToPlayList.length>0){this.ReadyToPlayList.pop();this.ReadyToPlayInstances.pop();this.readyToPlayGroupNameList.pop()}
    
    // Active Game Data format 
    // numberOfActiveGames,for each game(gameInstanceID, groupName, String with name of players and self status in each game
    for(i=0;i<activeGamesData['numberOfActiveGames']*4;i=i+4)
    {
      //READY TO PLAY GAMES
      if(activeGamesData[i+3]=='gameReadyToPlay')
      {
        this.ReadyToPlayList.push(activeGamesData[i+1]);
        this.ReadyToPlayInstances.push(activeGamesData[i]);
        let displayString = activeGamesData[i+1].concat(' (').concat(activeGamesData[i+2]).concat(' )')
        this.readyToPlayGroupNameList.push(displayString);
      }
      else
      { // Already active games
        this.activeGamesList.push(activeGamesData[i+1]);
        this.activeGameInstances.push(activeGamesData[i]);
        let displayString = activeGamesData[i+1].concat(' (').concat(activeGamesData[i+2]).concat(' )')
        this.activeGroupNameList.push(displayString)
        // Get Time remaining for active games
        this.getActiveGameDetail(activeGamesData[i]).then(activeGameData=>{
          if(!activeGameData)
          {
            console.log("error in refreshView loading active Game data to find remaining time")
            this.navCtrl.push("InvalidLoginPage", {error: JSON.stringify(activeGameData)})
          }
          else
          {
            var str="";
            if(activeGameData['timeRemaining']>=0){
              //Time remaining
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
              //Time Over
              str="Game Over"
            }
            this.displayTimeList.push(str);
          }
        })
      }
    }
  }})
}

refreshFinishedGames()
{
  this.getFinishedGames().then(finishedGameData=>{
    if(!finishedGameData['error']){
      console.log('finished games are' , finishedGameData)
    while(this.gameOverInstances.length>0)
    {
      this.gameOverInstances.pop();this.gameOverMyStatusList.pop();this.gameOverPlayersList.pop(); this.gameOverGroupNameList.pop()
    }
    if(finishedGameData['noOfFinishedGames']>0)
    {
      let i=0;
      for(i=0;i<4*finishedGameData['noOfFinishedGames'];i=i+4)
      {
        this.gameOverInstances.push(finishedGameData[i]);
        this.gameOverPlayersList.push(finishedGameData[i+2]);
        if(finishedGameData[i+3]=='userLost')
        this.gameOverMyStatusList.push('You Lost');
        else
        this.gameOverMyStatusList.push('You Won')
        let displayString = finishedGameData[i+1].concat(' (').concat(finishedGameData[i+2]).concat(' )')
        this.gameOverGroupNameList.push(displayString)
      }
    }  
  }
  })
  
}


getGameID()
{
  var link = 'https://kidsteam.boisestate.edu/kidfit/get_gameID.php?gameName=scavengerHunt';
  link=link.concat('&metric=')
  link=link.concat('steps')
  return new Promise(resolve => {
    this.httpClient.get(link)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        })
  })
}

expandInvitedGames()
{
  console.log('expanding Invited Games')
  
  if(this.invitedGameArrow=="arrow-dropdown")
  { 
    this.invitedGameArrow='arrow-dropup';
    this.zone.run(()=> this.refreshInvitedGames());
  }
  else if(this.invitedGameArrow=="arrow-dropup")
    this.invitedGameArrow='arrow-dropdown'

  
  
  if(this.invitedGames.length+this.invitedAcceptedGames.length>0)
  {
    if(this.expandInvitedGame==true)
    { 
      this.expandInvitedGame=false;
    }
    else
    {
      this.expandInvitedGame=true;
    }
  }
}
expandActiveGames()
{
  console.log('expanding Active Games')
  if(this.activeGameArrow=="arrow-dropdown")
  {
    this.activeGameArrow='arrow-dropup';
    this.zone.run(()=> this.refreshActiveGames());
  }
  else if(this.activeGameArrow=="arrow-dropup")
    this.activeGameArrow='arrow-dropdown'
  
  if(this.ReadyToPlayList.length+this.activeGamesList.length>0)
  {
    if(this.expandActiveGame==true)
    { 
      this.expandActiveGame=false;
    }
    else
    {
      this.expandActiveGame=true;
    }
  }
  
}
expandCompletedGames()
{
  console.log('expanding Completed Games')
  if(this.completedGameArrow=="arrow-dropdown")
  {
    this.completedGameArrow='arrow-dropup';
    this.zone.run(()=>this.refreshFinishedGames())
  }
  else if(this.completedGameArrow=="arrow-dropup")
    this.completedGameArrow='arrow-dropdown'
  
  
  if(this.gameOverInstances.length>0)
  {
    if(this.expandCompletedGame==true)
    { 
      this.expandCompletedGame=false;
    }
    else
    {
      this.expandCompletedGame=true;
    }
  }
}
}