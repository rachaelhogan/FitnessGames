import { AppModule } from './../../app/app.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    //WelcomePage,
  ],
  imports: [
    IonicPageModule.forChild(AppModule),
  ],
})
export class WelcomePageModule {}
