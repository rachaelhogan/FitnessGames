import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  data:any = {}
  username:any={};
  accessToken :any={};
  type="password";
  password_icon="eye";
  registrationID:any={};

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient,public inAppBrowser:InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
    console.log(this.getRegistrationID())
  }

  // Method to verify Login
  getRegisterUserDetails()
    {
      var link = 'https://kidsteam.boisestate.edu/kidfit/verify_login.php?username='.concat(this.data.username);
      link = link.concat('&password=');
      link = link.concat(this.data.password);
      link = link.concat('&loginType=register');
      link = link.concat('&registrationID=')
      link = link.concat(this.registrationID);
      return new Promise(resolve => {
        this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
      });
    }

  // Method to get device registration ID to send notifications to
  getRegistrationID()
  {
  // TODO get device registration for notifications
    return new Promise(resolve => {
    this.storage.get('registrationID').then((val) => {
    this.registrationID =val;
    console.log("reg ID",val)
    resolve(val);
  });})
  }
}

  //var link_register = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=228NH4&redirect_uri=https%3A%2F%2Fkidsteam.boisestate.edu%2Fkidfit%2Fhandle_redirect.php&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&prompt=login%20consent&state=';