import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_VALUE_ACCESSOR } from '@angular/forms/src/directives/default_value_accessor';
import { DisplayDataPage } from '../display-data/display-data';
import { InvalidLoginPage } from '../invalid-login/invalid-login';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  username:any={};
  accesstoken:any={};

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage:Storage,public httpClient: HttpClient) {
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad WelcomePage');
   
    if(!(this.storage.get('accessToken')===null) && !(this.storage.get('username')===null)  )
    {
      
      console.log("first if");
      this.getUsername().then(   // Get User name
        data1=>{  
          this.getUserToken().then(    // Get user access token
          data2=>{
      
            this.getLoginDetails().then(
            data=>{
                if(data['error']){
                  console.log(data)
                
                 //this.navCtrl.push('InvalidLoginPage',{error: this.storage.get('accessToken')});
                 //this.navCtrl.push('LoginPage');
                  }
                else if(data['login']=="success"){
                  
                  this.navCtrl.push('DisplayDataPage',{data:data});
                  console.log(data);


                }
                
                 
              } 
              
      );
    })
  })
  
  }
    
  }
  

  GetStarted()
  {
    
   let page =null;
    if(this.storage.get('accessToken') && this.storage.get('username')  )
    {
      console.log("first if");
      this.getUsername().then(   // Get User name
        data1=>{  
          this.getUserToken().then(    // Get user access token
          data2=>{
      
            this.getLoginDetails().then(
            data=>{
                if(data['error']){
                  console.log(data)
                  
                 page = '';
                 this.navCtrl.push('LoginPage');
                  }
                else if(data['login']=="success"){
                  page=  'DisplayDataPage';
                  this.navCtrl.push('DisplayDataPage',{data:data});
                  console.log(data);


                }
                 
              } 
              
      );
    })
  })
  
  }
  else{
    this.navCtrl.push('LoginPage');
  }
    
  }

  getLoginDetails()
  {
    console.log("getLoginDetails");
    var link = 'http://kidsteam.boisestate.edu/kidfit/direct_login.php?username=';
    link = link.concat(this.username);
    link = link.concat('&accessToken=');
    link=link.concat(this.accesstoken);

    console.log(link);
    return new Promise(resolve => {
      this.httpClient.get(link)
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error);
          })
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




}

