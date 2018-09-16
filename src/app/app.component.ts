import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { NotificationDataProvider } from '../providers/notification-data/notification-data';
import {Events} from 'ionic-angular';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private push:Push,private storage:Storage,private fcm:FCM, private notificationData:NotificationDataProvider, public events:Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.pushSetup();

      //Notifications
      fcm.subscribeToTopic('all');
      fcm.getToken().then(token=>{
          console.log(token);
      })
      fcm.onNotification().subscribe(data=>{
        console.log(data['data'])
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      })
      fcm.onTokenRefresh().subscribe(token=>{
        console.log(token);
      });
      //end notifications

    });
  }
  pushSetup()
  {
    const options: PushOptions = {
      android: {
        senderID:'406452227174'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
   };
   
   const pushObject: PushObject = this.push.init(options);
   
   // On Recieving a Notification
   pushObject.on('notification').subscribe((notification: any) => {
     console.log('Received a notification', notification); 
     let data = notification['additionalData'];
      console.log("DATA RECIEVED", data);
      this.notificationData.setNotificationType(data['type']);
      this.notificationData.setGameInstanceID(data['gameInstanceID']);
      this.notificationData.setTimeRemaining(data['timeRemaining']);
      this.notificationData.setCurrentUser(data['currentUser']);
      this.notificationData.setStageInterval(data['stageInterval']);
      this.notificationData.setStartTime(data['startTime']);
      this.notificationData.setSelf(data['self']);    
      this.notificationData.setActiveUserName(data['currentUserName']);
      if(data['type']== 'gameStart')
      {
        
        this.notificationData.addActiveGame(data['gameInstanceID']);
        if(data['self'])
        {
          this.notificationData.setStartSteps(data['currentSteps']);
          this.storage.set("startSteps",data['currentSteps']);
        }
        this.events.publish('gameStart', data);
      }
      else if(data['type']=='potatoPassed')
      {
        this.events.publish('potatoPassed',data);
      }
      else if(data['type']=='gameOver')
      {
        this.events.publish('gameOver',data);
      }
    });
   
   pushObject.on('registration').subscribe((registration: any) => {console.log('Device registered', registration['registrationID']);this.storage.set('registrationID',registration['registrationId'])});
   
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}

