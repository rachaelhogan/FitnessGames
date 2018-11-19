import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { InvalidLoginPage } from '../invalid-login/invalid-login';

/**
 * Generated class for the AddPlayersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage {
  data:any={};
  players=[]
  username:any;
  accesstoken:any;
  gameID:any;
  gameInstanceID:any;
  name:any;
  i=0
  constructor(public navCtrl: NavController, public navParams: NavParams,public httpClient:HttpClient,private storage:Storage,private zone:NgZone) {
    this.name = this.navParams.get('name');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlayersPage');
    this.zone.run(()=>this.refreshView());
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

  inviteFriends()
  {
    this.getGameID().then(data=>
    {
      if(data['error']){
        this.navCtrl.push('InvalidLoginPage', {error:data['error']});
      }
      else{
        this.navCtrl.push('EscapeTheTunnelInviteFriendsPage', {gameID:data['gameID']});
      }
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

getInvitedPlayers()
{
  var link = 'https://kidsteam.boisestate.edu/kidfit/getPlayersFromGameInstance.php?gameInstanceID=';
  link=link.concat(this.gameInstanceID);
  link= link.concat('&self=');
  link= link.concat(this.username);
  link = link.concat('&accessToken=')
  link= link.concat(this.accesstoken);
  link = link.concat('&userGameStatus=userInvited');
  return new Promise(resolve => {
    this.httpClient.get(link)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        })
  })
}

getReadyToPlayPlayers()
{
  var link = 'https://kidsteam.boisestate.edu/kidfit/getPlayersFromGameInstance.php?gameInstanceID=';
  link=link.concat(this.gameInstanceID);
  link= link.concat('&self=');
  link= link.concat(this.username);
  link = link.concat('&accessToken=')
  link= link.concat(this.accesstoken);
  link = link.concat('&userGameStatus=userReadyToPlay');
  return new Promise(resolve => {
    this.httpClient.get(link)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        })
  })
}

addPlayers()
{
  var link = 'https://kidsteam.boisestate.edu/kidfit/addPlayerToGameInstance.php?gameInstanceID=';
  link= link.concat(this.gameInstanceID);
  link= link.concat('&self=');
  link= link.concat(this.username);
  link=link.concat('&friend=');
  link = link.concat(this.data.frndemail);
  link = link.concat('&accessToken=')
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

createGameInstance()
{
 var link = 'https://kidsteam.boisestate.edu/kidfit/createGameInstance.php?gameID=';
  link= link.concat(this.gameID);
  link= link.concat('&self=');
  link= link.concat(this.username);
  link=link.concat('&friend=');
  link = link.concat(this.data.frndemail);
  link = link.concat('&accessToken=')
  link= link.concat(this.accesstoken);
  link = link.concat('&gameID=')
  link= link.concat(this.gameID);
  
  console.log("creating game instance",link)
  return new Promise(resolve => {
    this.httpClient.get(link)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        })
  })
}

addFriend()
{
  if(this.data.frndemail.length==0)
  { //check for valid email
    this.navCtrl.push('InvalidLoginPage', {error:"no email"})
  }
  else
  {
    this.getGameID().then(data=>{
      if(data['error'])
      {
        this.navCtrl.push('InvalidLoginPage', {error:"Game Not Found"})
      }
      else
      {
        this.gameID=data['gameID'];
        this.getUsername().then(userNamedata=>{
        this.getUserToken().then(userTokendata=>{
         if(this.players.length==0)
         {
           // Create New Game Instance
           this.createGameInstance().then(creategameInstancedata=>{
             if(creategameInstancedata['error']){this.navCtrl.push('InvalidLoginPage',{error:creategameInstancedata['error']})}
            else{
              console.log('Create Game Instance response', creategameInstancedata)
              this.gameInstanceID=creategameInstancedata['gameInstanceID'];
              this.zone.run(()=>this.refreshView());
            }
          })
         }// create new game instance
         else
         {
           //add more players to the game instance
           this.addPlayers().then(addPlayerData=>{
             if(addPlayerData['error']){this.navCtrl.push('InvalidLoginPage',{error:addPlayerData['error']})}
             else
             {
               console.log("add player repsone ",addPlayerData)
              this.zone.run(()=>this.refreshView());
             }
           })  }
        })})
      }})
  }
}

refreshView()
{
  console.log('refreshing view')
  this.getUsername().then(usernameData=>{
  this.getUserToken().then(usertokendata=>{
  this.getGameID().then(data=>{
  while(this.players.length>0){this.players.pop()}
  this.getInvitedPlayers().then(invitedPlayersdata=>{
    if(invitedPlayersdata['error']){this.navCtrl.push('InvalidLoginPage',{error:invitedPlayersdata['error']})}
    else
    {
      console.log("Get Invited players data", invitedPlayersdata)
      for(this.i=0;this.i<invitedPlayersdata['numberOfPlayers'];this.i++)
      {
        let str = invitedPlayersdata[this.i];
        this.players.push(str);
      }
      this.getReadyToPlayPlayers().then(readyToPlayPlayersData=>{
        if(readyToPlayPlayersData['error']){this.navCtrl.push('InvalidLoginPage',{error:invitedPlayersdata['error']})}
        else{
          console.log("Get readyToPlay players data", readyToPlayPlayersData)
      for(this.i=0;this.i<readyToPlayPlayersData['numberOfPlayers'];this.i++)
      {
        let str = readyToPlayPlayersData[this.i];
        this.players.push(str);
      }
        }
      })
      
      
      
        console.log("Number of players are", this.players.length)
      this.data.frndemail="";
    }
  })
  })  
  })
  })
}
}