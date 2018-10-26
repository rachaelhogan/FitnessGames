import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
//import { ScoreBoardPage } from '../score-board/score-board';
import { Events } from 'ionic-angular';
//import { Brightness } from '@ionic-native/brightness';
/**
 * Generated class for the GameInstancePage page.
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
  selector: 'page-game-instance',
  templateUrl: 'game-instance.html',
})
export class GameInstancePage {
  gameInstanceID=null;
  username:any;
  accesstoken:any;
  groupName="";
  ifOwner:boolean;
  playerList=[];
  userIDList=[];
  playerStatusList=[];
  data:any = {};
  editing:boolean=false;
  gameInvited=false;
  gameInProgress=false;
  gameReadyToPlay=false;
  gameOver=false;
  gameID=null;
  gameWonOrLost:null;
  currentActivityTime=0;
  startActivityTime =0;
  endingActivityTime=0;
  timeRemaining:any;
  timer:CountdownTimer;
  bgImage:any;
  brightnessValue =0.8;
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient,private zone : NgZone,public events: Events) {
    this.gameInstanceID = this.navParams.get('gameInstanceID');
    
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInstancePage');
  }

  ionViewWillEnter()
  {
    // Notification for gameStart
    this.events.subscribe('gameStart',(data)=>{
      if(data['gameInstanceID'] == this.gameInstanceID)
        {this.zone.run(()=> this.refreshView());}
    });

    // Notification for gameOver
    this.events.subscribe('gameOver',(data)=>{
      if(data['gameInstanceID'] == this.gameInstanceID)
      { this.zone.run(()=> this.refreshView());}
    });

    console.log('ionViewWillEnter GameInstancePage');
    this.zone.run(()=> this.refreshView());
  }

  ionViewWillLeave()
  {
    this.events.unsubscribe('gameStart')
    this.events.unsubscribe('gameOver');
    //this.brightness.setBrightness(0.75)
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
    var link = 'https://kidsteam.boisestate.edu/kidfit/getGameDetails.php?self=';
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

  deletePlayer(i)
  {
    let userID = this.userIDList[i];
    this.removePlayerFromGameInstance(userID).then(removePlayerData=>{
      if(removePlayerData['error'])
      {
        this.navCtrl.push('InvalidLoginPage', {error:removePlayerData['error']});
      }
      else{
        this.zone.run(()=> this.refreshView());
        }      
    })
  }

  removePlayerFromGameInstance(i)
  {
    var link = 'https://kidsteam.boisestate.edu/kidfit/removePlayerFromGameInstance.php?self=';
    link= link.concat(this.username);
    link = link.concat('&accessToken=');
    link= link.concat(this.accesstoken);
    link=link.concat('&gameInstanceID=');
    link=link.concat(this.gameInstanceID);
    link = link.concat('&friendID=');
    link=link.concat(i);
    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })
  }

  editGroupName()
  {
    this.editing=true;
  }

  // TODO API WONT WORK 
  getActiveGameDetail(gameIID)
  {
    var link = 'https://kidsteam.boisestate.edu/kidfit/getActiveGameDetail.php?self=';
    link= link.concat(this.username);
    link = link.concat('&accessToken=');
    link= link.concat(this.accesstoken)
    link = link.concat('&gameInstanceID=');
    link = link.concat(gameIID);
    link = link.concat('&gameID=')
    link = link.concat(this.gameID)
    
    
    console.log("getting active game detail", link);
    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })   
  }

  updateGroupName()
  {
    if(this.data.groupName.length==0)
    {
      this.navCtrl.push('InvalidLoginPage', {error:"Group Name cannot be empty"});
    }
    else
    {
      this.getGroupNameUpdate().then(groupNameUpdateData=>{
        if(groupNameUpdateData['error'])
        {
          this.navCtrl.push('InvalidLoginPage', {error: groupNameUpdateData['error']});
        }
        else if(groupNameUpdateData['update']){
          this.groupName =groupNameUpdateData['newGroupName'];
          this.editing=false;
          this.zone.run(()=> this.refreshView());

        }
      })
    }
  }

  getGroupNameUpdate()
  {
    var link = 'https://kidsteam.boisestate.edu/kidfit/editGroupName.php?self=';
      link = link.concat(this.username);
      link = link.concat('&accessToken=');
      link = link.concat(this.accesstoken);
      link = link.concat('&gameInstanceID=');
      link = link.concat(this.gameInstanceID);
      link = link.concat('&newGroupName=');
      link = link.concat(this.data.groupName);
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
    if(this.data.frndemail.length ==0 )
      { 
        // TODO add check for valid email
        this.navCtrl.push('InvalidLoginPage', {error:"no email"});

      }
      else{
        this.addPlayers().then(addPlayerData=>{
          if(addPlayerData['error'])
          {
            this.navCtrl.push('InvalidLoginPage', {error:addPlayerData['error']});  
          }
          else{
            this.zone.run(()=> this.refreshView());            
          }
        })
      }
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

  // TODO  ---> DONE 
StartGame()
{
 
  this.getStartGameResponse().then(data=>{
    if(!data['error'])
    {
      console.log("response from startGame",JSON.stringify(data));
      this.zone.run(()=> this.refreshView());
    
    }
    else{
      console.log('startGame response', data);
      this.navCtrl.push('InvalidLoginPage',{error:data['error']});
    }
  })
}

getGameID()
{
  var link = 'https://kidsteam.boisestate.edu/kidfit/get_gameID.php?gameName=escapeTheTunnelSyncCollaborative';
  link=link.concat('&metric=')
  link=link.concat('activityTime')

  return new Promise(resolve => {
    this.httpClient.get(link)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        })
  })
}

//Write new API  --> DONE(not tested)
getStartGameResponse(){
  var link = 'https://kidsteam.boisestate.edu/kidfit/startGame.php?gameInstanceID=';
  link= link.concat(this.gameInstanceID);
  link= link.concat('&self=');
  link= link.concat(this.username);
  link = link.concat('&accessToken=')
  link= link.concat(this.accesstoken);
  link=link.concat('&gameID=');
  link = link.concat(this.gameID);
  
    console.log("starting game ",link)
  return new Promise(resolve => {
    this.httpClient.get(link)
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        })
  })
}
// CHECK
getFitnessData()
{
  var link = 'https://kidsteam.boisestate.edu/kidfit/getFitnessData.php?self=';
  link= link.concat(this.username);
  link = link.concat('&accessToken=')
  link= link.concat(this.accesstoken);
  link=link.concat('&gameInstanceID=');
  link= link.concat(this.gameInstanceID);
  return new Promise(resolve => {
    this.httpClient.get(link)
        .subscribe(data => {
          console.log("fitnessData",data);
          console.log(data['steps']);          
          if(data['steps']!=null){
         // this.currentSteps = data['steps']-this.startSteps;
          }
          if(data['timeRemaining']<=0)
          {
           // this.navCtrl.pop();
            this.navCtrl.push('HotPotatoScoreBoardPage',{status:'Lost', gameInstanceID:this.gameInstanceID});
          }
         /* if(this.currentSteps>200)
         {
            this.passPotato().then(passPotatoResponse=>{
               if(passPotatoResponse['error'])
                {
                  this.navCtrl.push('InvalidLoginPage',{error:JSON.stringify(passPotatoResponse['error'])});
                }
                else
                {
                  this.zone.run(()=> this.refreshView());
                }
             })
            
         }*/
          resolve(data);
        }, error => {
          resolve(error);
        })
  })
}

refreshView()
{
  this.getUsername().then(usernamedata=>{
    this.getUserToken().then(usertokendata=>{
    this.getGameID().then(gameIDdata=>{
      this.gameID = gameIDdata['gameID'];
      this.getGameDetails().then(gameDetails=>{
        
        if(gameDetails['error'])
        {
          this.navCtrl.push('InvalidLoginPage', {error: gameDetails['error']});
        }
        else
        {
          console.log("gameDetails ",JSON.stringify(gameDetails) )
          while(this.playerList.length>0)
          {
            this.playerList.pop();this.userIDList.pop();this.playerStatusList.pop();
          }
          this.groupName = gameDetails['groupName'];
          if(gameDetails['owner']=='true')
            this.ifOwner=true;
          else
            this.ifOwner=false;
          let i=0;
          if(gameDetails['gameStatus']=='gameOver'){
            this.brightnessValue=0.75
            this.gameInvited=false;
            this.gameReadyToPlay=false;
            this.gameInProgress=false;
            this.gameOver=true;
            this.navCtrl.push('ScoreBoardPage',{playerStatus:gameDetails['selfGameStatus']});
            
            // TODO
                // Show total active minutes
            //this.navCtrl.push('HotPotatoScoreBoardPage',{gameInstanceID:this.gameInstanceID})
          }
          if(gameDetails['gameStatus']=='gameInvited')
          {
            this.brightnessValue=0.75
              this.gameInvited=true;
              this.gameOver=false;
              for(i=0;i<gameDetails['numberOfPlayers']*3;i=i+3)
              { 
                let str = gameDetails[i];
                str=str.concat("(");
                str=str.concat(gameDetails[i+2]);
                str=str.concat(")");
                this.playerList.push(str);
                this.userIDList.push(gameDetails[i+1]);
                this.playerStatusList.push(gameDetails[i+2]);
              }
          }
          if(gameDetails['gameStatus']=='gameReadyToPlay')
          {
            this.brightnessValue=0.75
              this.gameReadyToPlay=true;
              this.gameInvited=false;
              for(i=0;i<gameDetails['numberOfPlayers']*3;i=i+3)
              { 
                this.playerList.push(gameDetails[i]);
                this.userIDList.push(gameDetails[i+1]);
                this.playerStatusList.push(gameDetails[i+2]);
              }
          }
          if(gameDetails['gameStatus'] =='gameInProgress' )
          {
              this.gameInProgress=true;
              this.gameReadyToPlay=false;
              this.gameInvited=false;
              for(i=0;i<gameDetails['numberOfPlayers']*3;i=i+3)
              { 
                this.playerList.push(gameDetails[i]);
                this.userIDList.push(gameDetails[i+1]);
                this.playerStatusList.push(gameDetails[i+2]);
              }  
              this.getActiveGameDetail(this.gameInstanceID).then(activeGameData=>
              {
                  
                if(activeGameData['error'])
                  {
                    this.navCtrl.push('InvalidLoginPage',{error:JSON.stringify(activeGameData)});
                  }
                  else
                  {
                    console.log('activegamedetails ', JSON.stringify( activeGameData))
                    if(activeGameData['type']=='GameOver')
                    {
                      this.brightnessValue=0.75
                      this.gameInProgress=false;
                      this.gameReadyToPlay=false;
                      this.gameOver=true;
                      this.gameWonOrLost=activeGameData['playerStatus'];
                      this.navCtrl.push('ScoreBoardPage',{playerStatus:activeGameData['playerStatus']})
                    }
                    else if(activeGameData['type']=='gameInProgress')
                    {
                        this.currentActivityTime=activeGameData['currentActivityTime'];
                        this.startActivityTime=activeGameData['startActiveTime'];
                        this.endingActivityTime=activeGameData['endValue'];
                        this.timeRemaining= activeGameData['timeRemaining'];
                      if(!this.timer)
                       { this.initTimer();
                        this.startTimer();
                       }

                        // DIVIDE ACTIVITY SESSION INTO 4  groups to change background to display persuasive screen
                        // Interval 1 1500>timeRemaining>=1125
                       // Interval 2 1125>timeRemaining >= 750
                       //Interval 3 750> timeRemaining >= 375
                       // Interval 4 375> timeRemaining >=0
                        if(this.timeRemaining>=1125)
                        { this.bgImage="bg-image1";
                       // this.brightness.setBrightness(0)
                          }
                        else if( this.timeRemaining < 1125 && this.timeRemaining>=750)
                        {
                          this.bgImage ="bg-image2"
                        //  this.brightness.setBrightness(0.2)
                        }
                        else if( this.timeRemaining < 750 && this.timeRemaining>=375)
                        {
                          this.bgImage ="bg-image3"
                        //  this.brightness.setBrightness(0.4) 
                        }
                        else
                        {
                          this.bgImage =  "bg-image4"
                         // this.brightness.setBrightness(0.6)
                        }
                    }
                  }



            })

          } 
          if(gameDetails['gameStatus']=='Over')
          {
            this.gameOver=true;

          }
        }  
      })
    })
    })
  })
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

initTimer() {
  if (!this.timeRemaining) { this.timeRemaining = 0; }

  this.timer = <CountdownTimer>{
    seconds: this.timeRemaining,
    runTimer: false,
    hasStarted: false,
    hasFinished: false,
    secondsRemaining: this.timeRemaining
  };

  this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
}
startTimer() {
  console.log('starting timer')
  this.timer.hasStarted = true;
  this.timer.runTimer = true;
  this.timerTick();
}
timerTick() {
  setTimeout(() => {
    if (!this.timer.runTimer) { return; }
    this.timer.secondsRemaining--;
    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    if (this.timer.secondsRemaining > 0) {
      if(this.timer.secondsRemaining%375==0)
      this.zone.run(()=> this.refreshView());
        this.timerTick();
    } else {
      this.timer.hasFinished = true;
      this.timer.hasStarted=false;
      this.zone.run(()=> this.refreshView());
    }
  }, 1000);
}

}