import React from "react";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";

import Restaurants from "../screen/restaurant/Restaurants";
import AddRestaurant from "../components/restaurant/AddRestaurant";
import Restaurant from "../screen/restaurant/Restaurant";
import Login from "../screen/acount/Login";
import AddReviewRestaurant from "../screen/restaurant/AddReviewRestaurant";
const Stack = createStackNavigator();

export default function RestaurantStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="restaurants" component={Restaurants} options={{title: "Restaurantes"}}/>
            <Stack.Screen name="addRestaurant" component={AddRestaurant} options={{title: "Agregar Restaurante"}}/>
            <Stack.Screen name="restaurant" component={Restaurant} options={{title: "Restaurante"}}/>
            <Stack.Screen name="login" component={Login} options={{
                title: "Inicio de sesión",
                HeaderTitleAling: "center"
                }}/>
            <Stack.Screen name="addReview" component={AddReviewRestaurant} options={{
                title: "Agregar nuevo comentario",
                HeaderTitleAling: "center"
                }}/>    


        </Stack.Navigator>
    )
}