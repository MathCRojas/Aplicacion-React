import React from 'react';
import { LogBox } from 'react-native';
import Navigation from "./app/navigations/Navigation";
import { fireBaseApp } from './app/utils/FireBase';
import * as firebase from 'firebase';
import { decode, encode } from "base-64";
//componente -> Comenzando con mayúscula
//funciones -> comenzando con minúscula
//archivos -> Comenzando con mayúsculas
LogBox.ignoreAllLogs(true);
if (!global.btoa)global.btoa= encode; 
if (!global.atob)global.atob= decode; 

export default function App() {
  return <Navigation/>;
}


