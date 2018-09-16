import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllGamesPage } from './all-games';

@NgModule({
  declarations: [
    AllGamesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllGamesPage),
  ],
})
export class AllGamesPageModule {}
