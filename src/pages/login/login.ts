import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AES256 } from '@ionic-native/aes-256';
import { AlertController } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import { ScavengerHuntPage } from '../scavenger-hunt/scavengerhunt';

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
  userdata:any={}
  username:any={};
  accessToken :any={};
  registrationID:any={};
  type="password";
  password_icon="eye";
  private secureKey= "12345678123456781234567812345678";
  private secureIV = '1234567812345678';
  encrypticPassowrd="";
  registering=false;
  registerButtonColor="gray"
  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient:HttpClient,public inAppBrowser:InAppBrowser,private aes256: AES256,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    console.log(this.getRegistrationID())
    
    
  }
  ionViewWillEnter(){
  this.registering=false;
  this.data.username="";
  this.data.password="";
  this.userdata.gender="";
  this.userdata.nickname="";

  
  
  }
  presentAlert(message :string) {
    let alert = this.alertCtrl.create({
      title: 'Invalid Input',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  

  login(){
    this.navCtrl.push(ScavengerHuntPage)
  }


  loginOriginal() {
    if(!this.data.username)
    {
      this.presentAlert('Please enter an email address')
    //  this.navCtrl.push('InvalidLoginPage',{error: 'Please enter an email address'});
    }
    else if(!this.data.password)
    {
      this.presentAlert('Please enter a password');
      //this.navCtrl.push('InvalidLoginPage',{error: 'Please enter a password'});
    }
    else{
    
      this.encryptPswrd(this.data.password).then(encryptpswrd=>{
    console.log(this.data.password)
   
    var link_register = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22D8TS&redirect_uri=https%3A%2F%2Fkidsteam.boisestate.edu%2Fkidfit%2Fhandle_redirect_work.php&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&prompt=login consent&state=';
    var link = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22D8TS&redirect_uri=https%3A%2F%2Fkidsteam.boisestate.edu%2Fkidfit%2Fhandle_redirect_work.php&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&state=';
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
        let browser = this.inAppBrowser.create(link,"_blank");
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
         }) 
        }
      }) 
    })
     this.data.password="";
  }
  }

  // VERIFY USER LOGIN
  getLoginUserDetails()
  {
    var link = 'https://kidsteam.boisestate.edu/kidfit/verify_login.php?username='.concat(this.data.username);
    link = link.concat('&password=');
    link = link.concat(this.encrypticPassowrd);
    link = link.concat('&loginType=login'); 
    link = link.concat('&registrationID=')
    link = link.concat(this.registrationID);
    console.log('logging at',link)
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
    
    console.log(this.data.password)
    if(!this.userdata.nickname && this.registering)
    {
      this.presentAlert('Please enter a nickname')
      //this.navCtrl.push('InvalidLoginPage',{error: 'Please enter a nickname'});
    }
    else if(!this.userdata.age && this.registering)
    {
      this.presentAlert('Please enter your age')
      //this.navCtrl.push('InvalidLoginPage',{error: 'Please enter age'});
    }
    else if(!this.userdata.gender && this.registering)
    {
      this.presentAlert('Please select a gender')
      //this.navCtrl.push('InvalidLoginPage',{error: 'Please select a gender'});
    }
    else if(!this.data.username)
    {
      this.presentAlert('Please enter an email address')
      //this.navCtrl.push('InvalidLoginPage',{error: 'Please enter an email address'});
    }
    else if(!this.data.password)
    {
      this.presentAlert('Please enter a password')
      //this.navCtrl.push('InvalidLoginPage',{error: 'Please enter a password'});
    }
    else if(this.userdata.age < 6)
    {
      this.presentAlert('You are too young to play this game. Players need to be atleast 6 to play this game')
    }
    else{
        if(this.registering==false)
        {
          this.registering=true;
        }
        else{
      this.encryptPswrd(this.data.password).then(encryptpswrd=>{

    
      var link = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22D8TS&redirect_uri=https%3A%2F%2Fkidsteam.boisestate.edu%2Fkidfit%2Fhandle_redirect_work.php&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&prompt=login consent&state=';
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
      let browser = this.inAppBrowser.create(link,"_blank");
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
            this.storage.set('nickname',data['username'])
            this.navCtrl.push('DisplayDataPage',{data:data});
            console.log(data);
          }
        })
      }     
    )}
    })
  })
    this.data.password="";
}}
  }


  // Method to verify Login
  getRegisterUserDetails()
    {
      
      var link = 'https://kidsteam.boisestate.edu/kidfit/verify_login.php?username='.concat(this.data.username);
      link = link.concat('&password=');
      link = link.concat(this.encrypticPassowrd);
      link = link.concat('&loginType=register');
      link=link.concat('&nickname=')
      link=link.concat(this.userdata.nickname);
      link=link.concat('&age=')
      link=link.concat(this.userdata.age)
      link=link.concat('&gender=');
      link=link.concat(this.userdata.gender)
      link = link.concat('&registrationID=')
      link = link.concat(this.registrationID);
      console.log('registering at',link)
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
      var link = 'https://kidsteam.boisestate.edu/kidfit/direct_login.php?username=';
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

  encryptPswrd(pwd:string)
  {
   // this.aes256.encrypt(this.secureKey,this.secureIV,pwd).then( res=> this.encrypticPassowrd=res).catch((error: any)=> console.error(error))
    return new Promise(resolve => {
      this.aes256.encrypt(this.secureKey,this.secureIV,pwd).then( res=> {
        this.encrypticPassowrd=res;resolve(res)}
      )})
  }
  
  

}