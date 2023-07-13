import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, icon } from "react-native-elements";

import RestaurantStack from "./RestaurantStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import SearchStack from './SearchStack';
import AcountStack from './AcountStack';
// import Restaurants from "../screen/Restaurants";
// import Search from "../screen/Search";
// import TopRestaurants from "../screen/TopRestaurants";
// import Favorites from "../screen/Favorites";
// import Acount from "../screen/Acount";

const Tab = createBottomTabNavigator(); 

export default function Navigation(){
    return(
        <NavigationContainer>
            <Tab.Navigator 
            initialRouteName="restaurants"
            tabBarOptions={{
                inactiveTintColor: "#000000",
                activeTintColor: "#FF0000"

            }}
            screenOptions={({route}) =>({
                tabBarIcon: ({color})=> screenOptions(route,color),

            })}> 
                <Tab.Screen name="restaurants" component={RestaurantStack} options={{title: "Restaurante" }} />
                <Tab.Screen name="topRestaurants" component={TopRestaurantsStack} options={{title: "Top Restaurantes" }} />
                <Tab.Screen name="favorites" component={FavoritesStack} options={{title: "Favoritos" }} />
                <Tab.Screen name="search" component={SearchStack} options={{title: "Buscar" }} />
                <Tab.Screen name="acount" component={AcountStack} options={{title: "Perfil" }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

function screenOptions(route,color){
    let iconName;
    switch(route.name){
        case "restaurants":
            iconName = "compass-outline";
            break;
        case "topRestaurants":
            iconName = "heart-circle";
            break;
        case "favorites":
            iconName = "cards-heart"
            break;
        case "search":
            iconName = "magnify";
            break;
        case "acount":
            iconName = "account"
            break;
        default:
            break;    
    }
    return(
        <Icon type="material-community" name = {iconName} size={22} color={color}/>
    )
}