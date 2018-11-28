# FitnessGames

## Pull the newDevelopment branch, then follow these steps to compile
- Preliminary Notes: YOU MUST USE IONIC 3! Ionic changes from version to version and our app may not work for newer versions.
- This app is meant to run on an Android Device. 

1. [Complete the steps to install IonicFramework](https://ionicframework.com/docs/intro/installation/)

2. Enter the Directory, and make sure to switch to the newDevelopment branch

**UPON REINSTALLING IN A VIRTUAL MACHINE, I DID NOT HAVE TO DO THIS BUT IF YOU RUN INTO ISSUES THIS MAY BE A SOLUTION**

3. Run the following commands to setup additional environment variables and rebuild the project so it takes on your system paths and installs the necessary components:
   >- ionic cordova plugin add cordova-sqlite-storage
   >- npm install --save @ionic/storage
   >- ionic cordova plugin add cordova-plugin-inappbrowser
   >- npm install --save @ionic-native/in-app-browser
   >- npm rebuild node-sass --force
4. Start ionic serve to run the app.
   >- ionic serve (for the web browser)
         - this will only work for the welcome and login screen. The fitbit login needs to be able to open in app browser so you much use            a phone to continue to the other pages
         
   >- ionic cordova run android --prod (to run on a plugged in android device)


## Possible Errors

Upon trying to install ionic or packages you may want to add, you may receive an error such as follows. Just run as Root to solve. 


npm WARN checkPermissions Missing write access to /usr/lib/node_modules
npm ERR! path /usr/lib/node_modules
npm ERR! code EACCES
npm ERR! errno -13
npm ERR! syscall access
npm ERR! Error: EACCES: permission denied, access '/usr/lib/node_modules'
npm ERR!  { [Error: EACCES: permission denied, access '/usr/lib/node_modules']
npm ERR!   stack:
npm ERR!    'Error: EACCES: permission denied, access \'/usr/lib/node_modules\'',
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'access',
npm ERR!   path: '/usr/lib/node_modules' }
npm ERR! 
npm ERR! The operation was rejected by your operating system.
npm ERR! It is likely you do not have the permissions to access this file as the current user
npm ERR! 
npm ERR! If you believe this might be a permissions issue, please double-check the
npm ERR! permissions of the file and its containing directories, or try running
npm ERR! the command again as root/Administrator (though this is not recommended).
npm ERR! A complete log of this run can be found in:
npm ERR!     /home/rhogan/.npm/_logs/2018-11-28T17_56_17_416Z-debug.log
