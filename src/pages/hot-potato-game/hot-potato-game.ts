import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HotPotatoTimerPage } from '../hot-potato-timer/hot-potato-timer';
import { HttpClient } from '@angular/common/http';
import { InvalidLoginPage } from '../invalid-login/invalid-login';
import { HotPotatoInviteFriendsPage } from '../hot-potato-invite-friends/hot-potato-invite-friends';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the HotPotatoGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hot-potato-game',
  templateUrl: 'hot-potato-game.html',
})
export class HotPotatoGamePage {

  data:any = {}
  players=[];
  username:any;
  gameID:any;
  gameInstanceID:any;
  accesstoken:any;
  i=0;
  name:any
  constructor(public navCtrl: NavController, public navParams: NavParams,public httpClient :HttpClient,private storage:Storage,private inAppBrowser:InAppBrowser) {
    this.name= this.navParams.get('name');
    
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad HotPotatoGamePage');

  }

  GetStarted()
  {
  /*  this.getGameID().then(
      data=>{
        if(data['error']){
          this.navCtrl.push('InvalidLoginPage', {error:data['error']});
        }
        else{

        
        this.navCtrl.push('HotPotatoTimerPage', {gameID:data['gameID']});
        }
      }
    )
    */
    
  }

  getGameID()
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/get_gameID.php?gameName=hotPotato';
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

    
    this.getGameID().then(
      data=>{
        if(data['error']){
          this.navCtrl.push('InvalidLoginPage', {error:data['error']});
        }
        else{

        
        this.navCtrl.push('HotPotatoInviteFriendsPage', {gameID:data['gameID']});
        }
      }
    )

  }

  addFriend()
  {

    
      if(this.data.frndemail.length ==0 )
      { 
        // TODO add check for valid email
        this.navCtrl.push('InvalidLoginPage', {error:"no email"});

      }
      else
      {
        
         

          this.getGameID().then(
          data =>{
            
            if(data['error']){
              this.navCtrl.push('InvalidLoginPage', {error:"Game NOT Found"});
            }
            else{
              this.gameID=data['gameID'];
              this.getUsername().then(   // Get User name
                data1=>{  
                  this.getUserToken().then(
                    datatoken=>{
                      
                  if(this.players.length==0)
                  {  
                    // Create new Game Instance

                   this.createGameInstance().then(
                    data2=>{
                      if(data2['error'])
                       { this.navCtrl.push('InvalidLoginPage', {error: data2['error']});}
                      else
                       { 
                        this.gameInstanceID = data2['gameInstanceID'];
                        this.getPlayers().then(
                          playersdata=>{
                            {
                             if(playersdata['error'])
                             {
                              this.navCtrl.push('InvalidLoginPage', {error: playersdata['error']});
                             }
                             else{
                              for(this.i=0;this.i<playersdata['numberOfPlayers'];this.i++)
                              {
                               
                               let str = playersdata[this.i];
                               if(str!=this.name)
                                  this.players.push(str);
                                
                                
                             }
                             this.data.frndemail="";
                            }
                            }


                          }
                        )

                        }
                       
                      
                    }) 
                  } // players length was zero
                  else
                  {
                      //Update Game Instance
                      this.addPlayers().then(
                        data=>{
                          if(data['error'])
                          {
                            this.navCtrl.push('InvalidLoginPage', {error: "eror"});
                          }
                          
                          else{
                            while(this.players.length>0)
                            this.players.pop();
                            
                            this.getPlayers().then(
                              playersdata=>{
                                {
                                 if(playersdata['error'])
                                 {
                                  this.navCtrl.push('InvalidLoginPage', {error: playersdata['error']});
                                 }
                                 else{
                                  
                                  for(this.i=0;this.i<playersdata['numberOfPlayers'];this.i++)
                                  {
                                   let str = playersdata[this.i];
                                   
                                   if(str!=this.name)
                                      this.players.push(str); 
                                   
                                 }
                                 this.data.frndemail="";
                                }
                                }

                              }
                            )

                          }
                        }
                      )
                      
            
            
            
                  }
                  })
                })
             }
          }
        )

    }
    
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

createGameInstance()
{
 var link = 'http://kidsteam.boisestate.edu/kidfit/createGameInstance.php?gameID=';
  link= link.concat(this.gameID);
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

addPlayers()
{
  var link = 'http://kidsteam.boisestate.edu/kidfit/addPlayerToGameInstance.php?gameInstanceID=';
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
getPlayers()
{
  var link = 'http://kidsteam.boisestate.edu/kidfit/getPlayersFromGameInstance.php?gameInstanceID=';
  link=link.concat(this.gameInstanceID);
  link= link.concat('&self=');
  link= link.concat(this.username);
  link = link.concat('&accessToken=')
  link= link.concat(this.accesstoken);
  link = link.concat('&userGameStatus=Invited');
  
  
  return new Promise(resolve => {
    this.httpClient.get(link)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        })
  })

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
