import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  data:any = {}
  username:any={};
  accessToken :any={};
  registrationID:any={};
  type="password";
  password_icon="eye";
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient,public inAppBrowser:InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    console.log(this.getRegistrationID())
  }

  login() {
    var link_register = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=228NH4&redirect_uri=http%3A%2F%2Fkidsteam.boisestate.edu%2Fkidfit%2Fhandle_redirect.php&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&prompt=login consent&state=';
    var link = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=228NH4&redirect_uri=http%3A%2F%2Fkidsteam.boisestate.edu%2Fkidfit%2Fhandle_redirect.php&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&state=';
    this.getLoginUserDetails().then(
     data => {
       console.log('my data (LOGIN): ', data);
       if(data['error']){
          if(data['access'])
          {
            this.storage.set("accessToken",data['access_token']);
            this.storage.set("username",data['username']);
            this.username=data['username'];
            this.accessToken= data['access_token'];
            link_register= link_register.concat(data['username']);
            let browser = this.inAppBrowser.create(link_register,"_blank");
              browser.on("exit").subscribe(data=>{
              this.getUserData().then(data=>{
                if(data['error']){
                  console.log(data)
                   this.navCtrl.push('InvalidLoginPage',{error: "acess denied"});
                  }
                else if(data['login']=="success"){
                  this.navCtrl.push('DisplayDataPage',{data:data});
                  console.log(data);
                }
              })
             }) 
          }
        
         else { 
           this.navCtrl.push('InvalidLoginPage',{error: data['error']});
        }
      }
       else if(data['login']=='success'){
        this.storage.set("accessToken",data['access_token']);
        this.storage.set("username",data['username']);
        this.username=data['username'];
        this.accessToken= data['access_token'];
        link = link.concat(data['username']);
        /*let browser = this.inAppBrowser.create(link,"_blank");
        browser.on("exit").subscribe(data=>{
          this.getUserData().then(data=>{
            if(data['error']){
              console.log(data)
              if(data['error']=="Fitbit Data Access Denied")
                {
                  this.navCtrl.push('InvalidLoginPage',{error: "acess denied"});
                }
            this.navCtrl.push('LoginPage');
              }
            else if(data['login']=="success"){
              this.navCtrl.push('DisplayDataPage',{data:data});
              console.log(data);
            }
          })
         }) */
        }
      }) 
     
     this.data.password="";

  }


  // VERIFY USER LOGIN
  getLoginUserDetails()
  {
    var link = 'http://kidsteam.boisestate.edu/kidfit/verify_login.php?username='.concat(this.data.username);
    link = link.concat('&password=');
    link = link.concat(this.data.password);
    link = link.concat('&loginType=login'); 
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

  register(){
    var link = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=228NH4&redirect_uri=http%3A%2F%2Fkidsteam.boisestate.edu%2Fkidfit%2Fhandle_redirect.php&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&prompt=login consent&state=';
    this.getRegisterUserDetails().then(
    data => {
      console.log('my data (REGISTER): ', data);
      if(data['error']){
        console.log(data['error']);
        this.navCtrl.push('InvalidLoginPage',{error: JSON.stringify(data['error'])});
      }
      else if(data['register']=='success'){
      this.storage.set("accessToken",data['access_token']);
      this.storage.set("username",data['username']);
      this.username=data['username'];
      this.accessToken= data['access_token'];
      link = link.concat(data['username']);
      /*let browser = this.inAppBrowser.create(link,"_blank");
      browser.on("exit").subscribe(data=>{
        this.getUserData().then(data=>{
          if(data['error']){
            console.log(data)
            if(data['access'])
            {

            }
            else{
            this.navCtrl.push('InvalidLoginPage',{error: "data['error']"});
            }
          //this.navCtrl.push('LoginPage');
            }
          else if(data['login']=="success"){
            this.navCtrl.push('DisplayDataPage',{data:data});
            console.log(data);
          }
        })
      }     
    )*/}
    })
    this.data.password="";
  }


  // Method to verify Login
  getRegisterUserDetails()
    {
      var link = 'http://kidsteam.boisestate.edu/kidfit/verify_login.php?username='.concat(this.data.username);
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
  // Method to get user details 
  getUserData()
    {
      console.log("getting user data");
      var link = 'http://kidsteam.boisestate.edu/kidfit/direct_login.php?username=';
      link = link.concat(this.username);
      link = link.concat('&accessToken=');
      link=link.concat(this.accessToken);
      return new Promise(resolve => {
        this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
    })
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

  // SHOW HIDE PASSWORD
  showHide()
  {
    if(this.type=="password")
    {
      this.type="text";
    }
    else
    {
      this.type="password";
    }
  }

}
