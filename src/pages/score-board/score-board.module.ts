import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScoreBoardPage } from './score-board';


@NgModule({
  declarations: [
    ScoreBoardPage,
  ],
  imports: [
    IonicPageModule.forChild(ScoreBoardPage),
  ],
})
export class ScoreBoardPageModule {}