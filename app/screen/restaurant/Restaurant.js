import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, ScrollView, Text, View, Dimensions } from "react-native";
import Loading from "../../components/Loading";
import { Rating, ListItem} from "react-native-elements"
import Carousel from "../../components/restaurant/Carrousel";
import Map from "../../components/Map";
import {useFocusEffect} from "@react-navigation/native"
import { map } from "lodash"
import { fireBaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListReview from "../../components/restaurant/ListReview";
const db = firebase.firestore(fireBaseApp);
const screenWidth = Dimensions.get("window").width;


export default function Restaurant(props) {
    const { navigation, route } = props;
    // console.log(props);
    const { id, name } = route.params;
    const [aRestaurant, setARestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    console.log(aRestaurant);

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);
    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
                .doc(id) //Traer el restaurante por id
                .get()
                .then((response) => {
                    const data = response.data();
                    data.id = response.id;
                    setARestaurant(data);
                    setRating(data.rating);
                }).catch(err => {
                    console.log(err);
                })
        }, [])
    )
    if (!aRestaurant) return <Loading isVisible={true} text="Cargando..." />



    return (
        <ScrollView vertical style={styles.viewBody}>
            <Carousel
                arrayImages={aRestaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant
                name={name}
                description={aRestaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                location={aRestaurant.location}
                name={aRestaurant.name}
                address={aRestaurant.address}
            />
            <ListReview
                navigation={navigation}
                idRestaurant={aRestaurant.id}
                setRating={setRating}
            />
        </ScrollView>

    );

}
function TitleRestaurant(props) {
    const { name, description, rating } = props;
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.titleRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

function RestaurantInfo(props) {
    const { location, name, address } = props;
    const listInfo = [
        {
            text: address,
            iconName: "map",
            iconType: "material-community",
            action:null
        },
        {
            text: "20193tn029@utez.edu.mx",
            iconName: "at",
            iconType: "material-community",
            action:null
        },
        {
            text: "7331488482",
            iconName: "phone",
            iconType: "material-community",
            action:null
        }
    ]
    return(
        <View style={styles.viewRestaurantMap}>
           <Text style={styles.restaurantMapTitle}>
               Información sobre el restaurante
           </Text>
           <Map
           location={location}
           name={name}
           height={200}
           />
           {map(listInfo,(item, index) =>(
               <ListItem
                key={index}
                title={item.text}
                leftIcon={{
                    name: item.iconName,
                    type: item.iconType,
                    color: "#00a680"
                }}
                 containerStyle={styles.containerListItem}
               />
           ))}
        </View>
    )
}

const styles = StyleSheet.create({
    containerListItem:{
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1,      
    },
    restaurantMapTitle:{
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    viewRestaurantMap:{
        margin: 15,
        marginTop: 25,
    },
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    titleRestaurant: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },
    viewRestaurantTitle: {
        padding: 15,
    },
    rating: {
        position: "absolute",
        right: 0
    },
    description: {
        marginTop: 5,
        color: "grey"
    }
});

