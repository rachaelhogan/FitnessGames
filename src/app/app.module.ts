import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpClientModule} from '@angular/common/http';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Push } from '@ionic-native/push';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { WelcomePage } from '../pages/welcome/welcome';
import { FCM } from '@ionic-native/fcm';
import { NotificationDataProvider } from '../providers/notification-data/notification-data';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxDatatableModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Push,
    FCM,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NotificationDataProvider
  ]
})
export class AppModule {}
