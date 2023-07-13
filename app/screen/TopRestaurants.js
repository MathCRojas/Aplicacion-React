import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import ListTopRestaurant from "../components/topRestaurant/ListTopRestaurant";
import Toast from "react-native-easy-toast";
import { fireBaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(fireBaseApp);

export default function TopRestaurants(props){
    const { navigation } = props;
    const toastRef = useRef();
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
        db.collection("restaurants")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then((response) => {
            const restaurantArray = [];
            response.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                restaurantArray.push(data);
            });
            setRestaurants(restaurantArray);
        })
    }, [])

    return(
        <View>
            <ListTopRestaurant 
            navigation={navigation}
            toastRef={toastRef}
            restaurants={restaurants}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
}