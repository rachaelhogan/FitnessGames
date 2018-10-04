import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScavengerHuntPage } from './scavenger-hunt';

@NgModule({
  declarations: [
    ScavengerHuntPage,
  ],
  imports: [
    IonicPageModule.forChild(ScavengerHuntPage),
  ],
})
export class ScavengerHuntPageModule {}
