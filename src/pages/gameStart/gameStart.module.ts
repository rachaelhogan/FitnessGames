import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { gameStartPage } from './gameStart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@NgModule({
  declarations: [
    gameStartPage,
  
  ],
  imports: [
    IonicPageModule.forChild(gameStartPage),
  ],
  
})
export class gameStartPageModule {
  
}