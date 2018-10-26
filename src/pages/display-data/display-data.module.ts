import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayDataPage } from './display-data';

@NgModule({
  declarations: [
    DisplayDataPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayDataPage),
  ],
})
export class DisplayDataPageModule {}