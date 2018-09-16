import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {Events} from 'ionic-angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { InvalidLoginPage } from '../invalid-login/invalid-login';
import { NotificationDataProvider } from '../../providers/notification-data/notification-data';
import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';
import { HotPotatoScoreBoardPage } from '../hot-potato-score-board/hot-potato-score-board';

/**
 * Generated class for the GameInstancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-instance',
  templateUrl: 'game-instance.html',
})
export class GameInstancePage {
  @ViewChild(Navbar) navbar:Navbar;
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
  activeUserID = 0;
  activeGameTimeRemaining=0;
  activeUserName ="";
  selfActiveUser=false;
  gameSteps=0;
  startSteps=0;
  currentSteps=0;
  IntervalID:any;
  timerID:any; 
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient,public events:Events, private notificationData:NotificationDataProvider,private zone : NgZone) {
    this.gameInstanceID = this.navParams.get('gameInstanceID');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameInstancePage',this.gameInstanceID);
    this.events.subscribe('gameStart',(data)=>{
      
      if(this.notificationData.getNotificationType()=='gameStart')
      {if(this.notificationData.getGameInstanceID()== this.gameInstanceID)
        {
          console.log(" GAME INSTANCE notificationData",data);
      console.log("type",this.notificationData.getNotificationType());
      console.log("this.notificationData", this.notificationData.getGameInstanceID());
      console.log("this game", this.gameInstanceID)
      console.log(this.notificationData.getSelf())
          console.log("refreshing in gameStart Notification")
          clearInterval(this.IntervalID);
          this.IntervalID=null;
            this.zone.run(()=> this.refreshView());
           
        }
      }
    })
    this.events.subscribe('potatoPassed',(data)=>{
      if(data['gameInstanceID']== this.gameInstanceID)
      {
        console.log("refresh view as potato passed", JSON.stringify(data))
        clearInterval(this.IntervalID);
        this.IntervalID=null;
        this.zone.run(()=>this.refreshView());
      }
      // get GameDetail
    })
    
    this.events.subscribe('gameOver',(data)=>{
      if(data['gameInstanceID']== this.gameInstanceID)
      this.navCtrl.push('HotPotatoScoreBoardPage',{status:'Won', gameInstanceID:this.gameInstanceID})
    })
    /*this.navbar.backButtonClick=(e:UIEvent)=>{
      console.log("back button before intervalID", this.IntervalID)
      clearInterval(this.IntervalID);
      this.IntervalID=null;
      console.log("back button after intervalID", this.IntervalID)
      clearInterval(this.timerID);
      this.navCtrl.pop();
    }*/
    
  }

  ionViewWillLeave(){
    console.log("back button before intervalID", this.IntervalID)
      clearInterval(this.IntervalID);
      this.IntervalID=null;
      console.log("back button after intervalID", this.IntervalID)
      clearInterval(this.timerID);
  }
  ionViewWillEnter()
  {
    console.log('ionViewWillEnter GameInstancePage');
    clearInterval(this.IntervalID);
    this.IntervalID=null;
    this.zone.run(()=> this.refreshView());
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
  deletePlayer(i)
  {
    let userID = this.userIDList[i];
    this.removePlayerFromGameInstance(userID).then(removePlayerData=>{
      if(removePlayerData['error'])
      {
        this.navCtrl.push('InvalidLoginPage', {error:removePlayerData['error']});
      }
      else{
        clearInterval(this.IntervalID);
        this.IntervalID=null;
        this.zone.run(()=> this.refreshView());
        }
      
    })

  }

  removePlayerFromGameInstance(i)
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/removePlayerFromGameInstance.php?self=';
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
        }
      })


    }


  }

  getGroupNameUpdate()
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/editGroupName.php?self=';
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
            clearInterval(this.IntervalID);
            this.IntervalID=null;
            this.zone.run(()=> this.refreshView());
            
          }
        })

      }
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

StartGame()
{
  
  this.getStartGameResponse().then(data=>{
    if(!data['error'])
    {
      // IF HOT POTATO WITH ME
      
      
      /*if(data['self'])
      {
         this.startSteps = data['currentSteps'];
        this.storage.set("startSteps",this.startSteps);
        this.selfActiveUser=true;
        this.currentSteps = 0;
      }
      else{
        this.activeUserName = data['currentUserName']
        this.activeGameTimeRemaining = data['timeRemaining'];
      }*/
      //this.zone.run(()=> this.ionViewWillEnter());
      clearInterval(this.IntervalID);
      this.IntervalID=null;
      this.zone.run(()=> this.refreshView());
      var datalink = "gamestart:".concat(data['type']);
      datalink =datalink.concat(" gameInstanceID:").concat(data['gameInstanceID']);
      datalink =datalink.concat(" timeRemaining:").concat(data['timeRemaining']);
      datalink =datalink.concat(" currentUser:").concat(data['currentUser']);
      datalink =datalink.concat(" stageInterval:").concat(data['stageInterval']);
      datalink =datalink.concat(" startTime:").concat(data['startTime']);
      datalink =datalink.concat(" self:").concat(data['self']);
     // this.navCtrl.push('InvalidLoginPage',{error:datalink});
    }
  })
}

getStartGameResponse(){
  var link = 'http://kidsteam.boisestate.edu/kidfit/startGameHotPotato.php?gameInstanceID=';
  link= link.concat(this.gameInstanceID);
  link= link.concat('&self=');
  link= link.concat(this.username);
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
getFitnessData()
{
  var link = 'http://kidsteam.boisestate.edu/kidfit/getFitnessData.php?self=';
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
          this.currentSteps = data['steps']-this.startSteps;
          }
          if(data['timeRemaining']<=0)
          {
            clearInterval(this.IntervalID);
            this.IntervalID=null;
           // this.navCtrl.pop();
            this.navCtrl.push('HotPotatoScoreBoardPage',{status:'Lost', gameInstanceID:this.gameInstanceID});
          }
          if(this.currentSteps>200)
         {
           console.log("before clearing", this.IntervalID);
             clearInterval(this.IntervalID);
             this.IntervalID=null;
             console.log("after clearing", this.IntervalID);
             this.passPotato().then(passPotatoResponse=>{
               if(passPotatoResponse['error'])
                {
                  this.navCtrl.push('InvalidLoginPage',{error:JSON.stringify(passPotatoResponse['error'])});
                }
                else
                {
                  clearInterval(this.IntervalID);
                  this.IntervalID=null;
                  this.zone.run(()=> this.refreshView());
                }
             })
            
         }
          resolve(data);
        }, error => {
          resolve(error);
        })
  })
}
passPotato()
{
  var link = 'http://kidsteam.boisestate.edu/kidfit/passThePotato.php?self=';
  link= link.concat(this.username);
  link = link.concat('&accessToken=')
  link= link.concat(this.accesstoken);
  link = link.concat('&gameInstanceID=');
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

refreshView()
{
  this.getUsername().then(usernamedata=>{
    this.getUserToken().then(usertokendata=>{
      this.getGameDetails().then(gameDetails=>{
        if(gameDetails['error'])
        {
          this.navCtrl.push('InvalidLoginPage', {error: gameDetails['error']});
        }
        else
        {
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
            this.gameInvited=false;
            this.gameReadyToPlay=false;
            this.gameInProgress=false;
            this.gameOver=true;
            this.navCtrl.push('HotPotatoScoreBoardPage',{gameInstanceID:this.gameInstanceID})
          }
          if(gameDetails['gameStatus']=='gameInvited')
          {
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
          if(gameDetails['gameStatus']=='ReadyToPlay')
          {
              this.gameReadyToPlay=true;
              this.gameInvited=false;
              for(i=0;i<gameDetails['numberOfPlayers']*3;i=i+3)
              { 
                this.playerList.push(gameDetails[i]);
                this.userIDList.push(gameDetails[i+1]);
                this.playerStatusList.push(gameDetails[i+2]);
              }
          }
          if(gameDetails['gameStatus'] =='inProgress' )
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
                  // HOT POTATO WITH ME
                  console.log("self",activeGameData['self']);
                  if(activeGameData['error'])
                  {
                    this.navCtrl.push('InvalidLoginPage',{error:JSON.stringify(activeGameData['error'])});
                  }
                  if(activeGameData['self'])
                  {
                    this.selfActiveUser=true;
                    this.currentSteps=activeGameData['currentSteps'];
                    this.startSteps= activeGameData['startSteps'];
                    console.log("starting interval")
                    this.IntervalID = setInterval(()=>{console.log("seetingInterval " , this.IntervalID);if(this.IntervalID)this.getFitnessData();},30000);
                    // START POLLING
                  }// HOT POTATO WITH someone else
                  else
                  {
                    this.selfActiveUser=false;
                    this.activeUserName = activeGameData['currentUserName'];
                    console.log("activeUserName",this.activeUserName);
                    console.log("gameDetails",JSON.stringify(gameDetails))
                
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
}

timeOver(timeRemaining)
{
  console.log("Timer Running");
  this.timerID=setTimeout(()=>{
    timeRemaining--;
    if(timeRemaining>0)
    {
      console.log("Time Remaining ", timeRemaining)
      this.timeOver(timeRemaining);
    }
    else
    {
      console.log("Time Over")
      this.gameOver=true;
      this.gameInvited=false;
      this.gameReadyToPlay=false;
      this.gameInProgress=false;
    }
  },1000)
}

/*sendNotification() 
{  
 let serverKey = 'AAAAXqJwzGY:APA91bEE--VjeC0tLQr21uoHnMjDIx8Cr6nASML1t89r9BIB5RAjanlmXVb8Waglk7IqkiU3s0e7b_GC_eVoBuK9jsLegCegdMaIphzzfP_wazBs0tCaKDyEDYjPwTjtH-BkQotQ1uScfIu1PnM_hZzVGdLD5jptwg';
let body = {
    "notification":{
      "title":"New Notification has arrived",
      "body":"Notification Body",
      "sound":"default",
      "click_action":"FCM_PLUGIN_ACTIVITY",
      "icon":"fcm_push_icon"
    },
    "data":{
      "gameInstanceID":1,
      "param2":"value2"
    },
      "to":'d_otEbLqICI:APA91bGY428eSY71BlSKUK4vN9rNF7xCoUI-YJHz0vrQdRwv1C47nP-nf9qONYAP74k14YuppEzZAYtKG7OdU4VI2tlnVZjeMgQzN3Kkdtd8S8BOu_f3KgeJe9-sWVZxz3SWvWHERxCGYU35pjRysojzW_aV9xK3Vg',
      "priority":"high",
      "restricted_package_name":""
  }
  let options = new HttpHeaders().set('Content-Type','application/json');
  this.httpClient.post("https://fcm.googleapis.com/fcm/send",body,{
    headers: options.set('Authorization', 'key='.concat(serverKey)),
  })
    .subscribe();
}*/

}
