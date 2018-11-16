import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { ScoreBoardPage } from '../score-board/score-board';
import { Events } from 'ionic-angular';
import { Brightness } from '@ionic-native/brightness';
import { AlertController } from 'ionic-angular';
import { ResultsPage } from '../results/results';
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
  itemcount: any;
  bgImage:any;
  p1Image: any;
  brightnessValue =0.8;
  selfName="";
  userSteps;
  playerStepList=[];
  playerActiveMinuteList=[];
  playerIDList=[];
  playerWinStatusList=[];
  playerWinStepsList=[]
  playerWinIDList=[];
  playerWinNameList=[];
  selfID:null;
  selfGameStatus="";
  activeMinutesAccumulated=0;
  stepsAccumulated=0;
  wWidth: number;
  playerCount = 0;


  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient,private zone : NgZone,private alertCtrl: AlertController) {
    this.gameInstanceID = this.navParams.get('gameInstanceID');
    this.userSteps= this.navParams.get('steps');
    console.log(this.gameInstanceID);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInstancePage');
    this.wWidth = window.innerWidth;
    this.p1Image="bg-start";
    this.storage.set("itemCount",0);
  }

  ionViewWillEnter()
  {

    console.log('ionViewWillEnter GameInstancePage');
    this.zone.run(()=> this.refreshView());
  }

  ionViewWillLeave()
  {
  
   
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
        else {
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
            this.data.frndemail="";
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
refreshView()
  {
  
    console.log('refreshView GameInstancePage');
    this.gameReadyToPlay=false;
    this.gameInvited=false;
    this.gameInProgress=false;
    this.getUsername().then(usernamedata=>
    {
      this.getUserToken().then(usertokendata=>
      {
        this.getGameID().then(gameIDdata=>
        {
          this.gameID = gameIDdata['gameID'];
          this.getGameDetails().then(gameDetails=>
          {
            console.log("gameDetails ",JSON.stringify(gameDetails) );
            if(gameDetails['error'])
            {
              if(gameDetails['error'] =="Not an Active Game")
              {
                console.log('Warning','Game Over', 'OK');
              }
              else
              {
                console.log('Warning',gameDetails['error'], 'OK');
              }
            }
            else
            {
              while(this.playerList.length>0)
              {
                this.playerList.pop();
                this.userIDList.pop();
              }
              while(this.playerStatusList.length>0)
              {
                this.playerStatusList.pop();
              }
              while(this.playerStepList.length>0)
              {
                this.playerStepList.pop();
                this.playerActiveMinuteList.pop();
              }
              while(this.playerWinIDList.length>0)
              {
                this.playerWinIDList.pop();
                this.playerWinStatusList.pop();
                this.playerWinNameList.pop();
                this.playerWinStepsList.pop();
              }
              this.groupName = gameDetails['groupName'];
              this.selfName= gameDetails['selfName'];
              
              if(gameDetails['owner']=='true')
              {
                this.ifOwner=true;
              } 
              else
              {
                this.ifOwner=false;
              }


              let i=0;
              
              // GAME QUIT
              if(gameDetails['gameStatus']=='gameQuit')
              {
                this.navCtrl.pop()
              }

              // GAME OVER
              if(gameDetails['gameStatus']=='gameOver')
              {
                this.gameInvited=false;
                this.gameReadyToPlay=false;
                this.gameInProgress=false;
                this.gameOver=true; 
                this.navCtrl.push('ResultsPage',{data:gameDetails})
               
              }
              
              // GAME INVITED
              if(gameDetails['gameStatus']=='gameInvited')
              {
                //this.brightnessValue=0.75
                this.gameInvited=true;
                this.gameOver=false;
                for(i=0;i<gameDetails['numberOfPlayers']*3;i=i+3)
                { 
                  let str = gameDetails[i];
                  str=str.concat(" ( ");
                  str=str.concat(gameDetails[i+2].substr(4));
                  str=str.concat(" )");
                  this.playerList.push(str);
                  this.userIDList.push(gameDetails[i+1]);
                  this.playerStatusList.push(gameDetails[i+2]);
                }
              }

              // GAME READY TO PLAY
              if(gameDetails['gameStatus']=='gameReadyToPlay')
              {
                //this.brightnessValue=0.75
                this.gameReadyToPlay=true;
                this.gameInvited=false;
                for(i=0;i<gameDetails['numberOfPlayers']*3;i=i+3)
                { 
                  this.playerList.push(gameDetails[i]);
                  this.userIDList.push(gameDetails[i+1]);
                  this.playerStatusList.push(gameDetails[i+2]);
                }
              }

               // GAME IN PROGRESS
               if(gameDetails['gameStatus'] =='gameInProgress' )
               {
                 this.gameInProgress=true;
                 this.gameReadyToPlay=false;
                 this.gameInvited=false;
                 this.getActiveGameDetail(this.gameInstanceID).then(activeGameData=>
                {
                  console.log("ActivegameDetails ",JSON.stringify(activeGameData) );
                  if(activeGameData['error'])
                  {
                   // this.presentAlert('Warning','Game Details fetch failed', 'OK');
                   console.log(activeGameData['error']);
                  }
                  else if(activeGameData['syncError'])
                  {
                    console.log('Waiting',activeGameData['syncError']);   
                  }
                  else
                  {
                    if(activeGameData['type']=='gameOver')
                    {
                      
                      //this.brightnessValue=0.75;
                      this.gameInProgress=false;
                      this.gameReadyToPlay=false;
                      this.gameOver=true;
                      this.selfID= activeGameData['selfID'];
                      this.selfGameStatus=activeGameData['playerStatus']; // change to get Winner Status TODO 
                     // this.navCtrl.push('ScoreBoardPage',{playerStatus:activeGameData['playerStatus']})
                     if(this.selfGameStatus=='userWon')
                     {
                       this.selfGameStatus = 'won';
                       this.bgImage= "flower-image4";
                     }
                     else
                     {
                       this.selfGameStatus='lost';
                       this.bgImage = 'bg-imageLose';
                     }
                     console.log("here")
                     for (i=0;i<activeGameData['numberOfPlayers']*4;i=i+4)
                     {
                       if(activeGameData[i+3]=='userWon')
                       {
                         this.playerWinIDList.push(activeGameData[i]);
                         let str = activeGameData[i+1].concat('( ').concat(activeGameData[i+2]).concat(' steps ) ').concat('\t').concat('Won.');
                         this.playerWinNameList.push(str);
                         this.playerWinStepsList.push(activeGameData[i+2]);
                         this.playerWinStatusList.push(activeGameData[i+3]);
                       }
                       else
                       {
                         this.playerIDList.push(activeGameData[i]);
                         let str = activeGameData[i+1].concat('( ').concat(activeGameData[i+2]).concat(' steps ) ').concat('\t').concat('Lost.');
                         this.playerList.push(str);
                         this.playerStepList.push(activeGameData[i+2]);
                         this.playerStatusList.push(activeGameData[i+3]);
                       }
                       

                     }
                     this.zone.run(()=> this.refreshView());
                     console.log('playerList',this.playerList);
                console.log('playerWinNameList', this.playerWinNameList);
                    }
                    else if(activeGameData['type']=='gameInProgress')
                    {
                      this.timeRemaining= activeGameData['timeRemaining'];
                      this.selfID = activeGameData['selfID'];
                      this.userSteps = activeGameData['currentSteps'];
                      for(i=0;i<activeGameData['numberOfPlayers']*4;i=i+4)
                      { 
                        let str = activeGameData[i+1].concat(':').concat('\t').concat(activeGameData[i+2]).concat(' steps')
                        this.playerList.push(str);
                        this.userIDList.push(activeGameData[i]);
                        this.playerStepList.push(activeGameData[i+2]);
                        this.playerActiveMinuteList.push(activeGameData[i+3]);
                        if(activeGameData[i]==this.selfID)
                        {
                          this.stepsAccumulated = activeGameData[i+2];
                          this.activeMinutesAccumulated = activeGameData[i+3];
                        }
                      } 
                      console.log('playerList', this.playerList);
                      if(!this.timer)
                      { 
                        this.initTimer();
                        this.startTimer();
                      }
                      this.timer.secondsRemaining=this.timeRemaining;
                    }

                    

                  }// no error in getActiveGameDetail
                })
              }

            }// no error in getGameDetails
          })
        })
      })
    })
  }


presentAlert(message :string) {
    let alert = this.alertCtrl.create({
      title: 'Invalid Input',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
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
  this.itemcount = (this.storage.get("itemCount"));
  this.itemcount += 1;
  this.storage.set("itemCount", this.itemcount);
}

endGame(){
  this.navCtrl.push('ResultsPage')
}








}