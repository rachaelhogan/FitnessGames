import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';

/*
  Generated class for the NotificationDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationDataProvider {

  notificationType:String="";
  gameInstanceID=0;
  timeRemaining=0;
  currentUser=0;
  stageInterval=0;
  startTime=null;
  self:boolean;
  activeGames=[];
  startSteps=0;
  activeUserName ="";
  constructor(public http: HttpClient) {
    console.log('Hello NotificationDataProvider Provider');
  }

  setNotificationType(type)
  {
    this.notificationType=type;
  }
  setGameInstanceID(num)
  {
    this.gameInstanceID=num;
  }
  setTimeRemaining(num)
  {
    this.timeRemaining=num;
  }
  setCurrentUser(num)
  {
    this.currentUser=num;
  }
  setStageInterval(num)
  {
    this.stageInterval=num;
  }
  setStartTime(num)
  {
    this.startTime=num;
  }
  setSelf(val)
  {
    this.self=val;
  }
  setStartSteps(steps)
  {
    this.startSteps=steps;
  }

  setActiveUserName(name)
  {
    this.activeUserName=name;
  }
  addActiveGame(num)
  {
    this.activeGames.push(num);
  }
  removeActiveGame(num)
  {
    var index = this.activeGames.indexOf(num);
    if(index>0)
    delete this.activeGames[index];
  }

  getNotificationType()
  {
    return this.notificationType;
  }
  getGameInstanceID()
  {
    return this.gameInstanceID;
  }
  getTimeRemaining()
  {
    return this.timeRemaining;
  }
  getCurrentUser()
  {
    return this.currentUser;
  }
  getStageInterval()
  {
    return this.stageInterval;
  }
  getStartTime()
  {
    return this.startTime;
  }
  getSelf()
  {
    return this.self;
  }
  getActiveGames()
  {
    return this.activeGames;
  }
  getStartSteps()
  {
    return this.startSteps;
  }
  getActiveUserName()
  {
    return this.activeUserName;
  }
}
