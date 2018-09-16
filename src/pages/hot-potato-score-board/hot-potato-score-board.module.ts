import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotPotatoScoreBoardPage } from './hot-potato-score-board';

@NgModule({
  declarations: [
    HotPotatoScoreBoardPage,
  ],
  imports: [
    IonicPageModule.forChild(HotPotatoScoreBoardPage),
  ],
})
export class HotPotatoScoreBoardPageModule {}
