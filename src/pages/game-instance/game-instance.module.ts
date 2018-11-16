import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameInstancePage } from './game-instance';

@NgModule({
  declarations: [
    GameInstancePage,
  ],
  imports: [
    IonicPageModule.forChild(GameInstancePage),
  ],
})
export class GameInstancePageModule {}
