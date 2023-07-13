import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Register  from "../screen/acount/Register";
import Acount from "../screen/acount/Acount";
import Login from "../screen/acount/Login";
const Stack = createStackNavigator();

export default function AcountStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
             name="acount" 
             component={Acount} 
             options={{title: "Perfil"}}/>
            <Stack.Screen
            name="login"
            component={Login}
            options={{title: "Iniciar Sesión"}}
            />
            <Stack.Screen
            name="register"
            component={Register}
            options={{title: "Registro"}}
            />
        </Stack.Navigator>
    

    );
}