import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvalidLoginPage } from './invalid-login';

@NgModule({
  declarations: [
    InvalidLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(InvalidLoginPage),
  ],
})
export class InvalidLoginPageModule {}
