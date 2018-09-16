import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotPotatoTimerPage } from './hot-potato-timer';

@NgModule({
  declarations: [
    HotPotatoTimerPage,
  ],
  imports: [
    IonicPageModule.forChild(HotPotatoTimerPage),
  ],
})
export class HotPotatoTimerPageModule {}
