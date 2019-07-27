<h1 align="center">Chat App with Maps Tracking</h1>

<p align="center">
  <img src="https://cdn-images-1.medium.com/max/2400/1*iTAHnz8gq1UkwTa_1sGYdw.png" height=300 />
</p>

<br>

## Table of contents
* [Introduction](#introduction)
* [Requirements](#requirements)
* [Setting up Firebase](#setting-up-firebase)

## Introduction
[![React Native](https://img.shields.io/badge/React%20Native-0.59-blue.svg?style=rounded-square)](https://facebook.github.io/react-native/)
[![Firebase](https://img.shields.io/badge/Firebase-orange.svg?style=rounded-square)](https://console.firebase.google.com)
[![React Navigation](https://img.shields.io/badge/React%20Navigation-^3.11-purple.svg?style=rounded-square)](https://reactnavigation.org)
<br>

Here is my new github repository that is build an Chat App with User Map Tracking that i named with '**Kuy! Chat**', i build this app less than a week :D.

In this project i'am using firebase as database. Why ? because Firebase provides a realtime database and backend as a service. The service provides application developers an API that allows application data to be synchronized across clients and stored on Firebase's cloud.

**Note**<br>
If u want develope and take a part to make this app more better, feel free to fork or clone this repository and tag me as creator.

## Requirements
1. `node`, `npm`, `react-native-cli`
1. This repository, clone into your local disk
2. Firebase Account
3. Google Cloud (to make API Maps SDK)

## Setting up Firebase

The most important from this app is the database, yes, you must setup the database first at firebase. You can follow the instuctions how to create a real time database here :[Create and Integrating Firebase in React Native](https://www.metizsoft.com/blog/real-time-firebase-integration-with-react-native).

fter you create a real time database at firebase and you got a Web Configuration, you must put the firebase web configuration at this file [AuthLoadingScreen](https://github.com/andreferi3/ChatApp-ReactNative/blob/master/src/screens/AuthLoadingScreen.js)

## Create and Implement API Maps SDK

To make a new API Maps SDK and Implement it to your react native project, you can follow this instructions : [Get API Key](https://developers.google.com/maps/documentation/android-sdk/get-api-key)

Don't forget after you create a new Maps SDK API, you must put the API to this file : **[AndroidManifest.xml](https://github.com/andreferi3/ChatApp-ReactNative/blob/master/android/app/src/main/AndroidManifest.xml)**

## Last Step

After you follow the instructions above, now you can go ahead to the last step, follow the instruction as well :
1. Open the terminal in the project, if u use text editor Visual Studio Code you can do with **CTRL + SHIFT + `**
2. Type in the terminal `npm install`
3. Then, type `react-native link` to link all dependencies in this project
4. And then type `react-native run-android` to run the project in your phone or emulator, the first be sure you connecting your Android Phone or Emulator with enabling USB Debugging.
5. Enjoy the app! If you have a question feel free to send me email : [andreferi135@gmail.com](mailto:andreferi135@gmail.com)
