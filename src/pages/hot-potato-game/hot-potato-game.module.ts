import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotPotatoGamePage } from './hot-potato-game';

@NgModule({
  declarations: [
    HotPotatoGamePage,
  ],
  imports: [
    IonicPageModule.forChild(HotPotatoGamePage),
  ],
})
export class HotPotatoGamePageModule {}
