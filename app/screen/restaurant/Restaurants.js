import React, {useEffect, useState, useCallback} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/native"
import { fireBaseApp } from '../../utils/FireBase';
import firebase from "firebase/app";
import "firebase/firestore";
import ListRestaurants from "../../components/restaurant/ListRestaurants";
const db = firebase.firestore(fireBaseApp);
const limitResults = 8;
export default function Restaurants(props){
    // console.log(props);
    const { navigation }= props;
    const [user, setuser] = useState(null);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [start, setStart] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
       firebase.auth().onAuthStateChanged((userInfo) =>{
           setuser(userInfo);
       });
    }, []);

    useFocusEffect(
        useCallback(() => {
            const resultRestaurants = [];
            db.collection("restaurants").get().then((snap) =>{
                setTotalRestaurants(snap.size);
     
            });
            db.collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitResults).get().then((response)=>{
             //    console.log(response);
             setStart(response.docs[response.docs.length-1]);
             response.forEach(doc =>{
                 const restaurant = doc.data();
                 //Agregar id
                 restaurant.id = doc.id;
                 //console.log(restaurant);
                 resultRestaurants.push(restaurant);
             });
             setRestaurants(resultRestaurants);
            }).catch(err =>{
                console.log(err);
            });
     

        },[])
    )

    // useEffect(() => {
    //    const resultRestaurants = [];
    //    db.collection("restaurants").get().then((snap) =>{
    //        setTotalRestaurants(snap.size);

    //    });
    //    db.collection("restaurants")
    //    .orderBy("createAt", "desc")
    //    .limit(limitResults).get().then((response)=>{
    //     //    console.log(response);
    //     setStart(response.docs[response.docs.length-1]);
    //     response.forEach(doc =>{
    //         const restaurant = doc.data();
    //         //Agregar id
    //         restaurant.id = doc.id;
    //         //console.log(restaurant);
    //         resultRestaurants.push(restaurant);
    //     });
    //     setRestaurants(resultRestaurants);
    //    }).catch(err =>{
    //        console.log(err);
    //    });

    // }, []);


    const hadleLoadMore = () =>{
        const resultRestaurants = [];
        restaurants.length < totalRestaurants && setLoading(true)
        db.collection("restaurants")
        .orderBy("createAt", "desc")
        .startAfter(start.data().createAt)
        .limit(limitResults)
        .get()
        .then(response => {
            if (response.docs.length > 0) {
                setStart(response.docs[response.docs.length-1]);

            }else{
                setLoading(false);
            }
            response.forEach((doc) =>{
                const restaurant = doc.data();
                restaurant.id = doc.id;
                resultRestaurants.push(restaurant)
            })

            setRestaurants([...restaurants, ...resultRestaurants]);
        }).catch(err =>{
            console.log(err);
        })
    }



    return(
        <View style={styles.viewBody}>
            <ListRestaurants restaurants={restaurants} loading={loading} hadleLoadMore={hadleLoadMore} />
           {user && (
               <Icon
               reverse
               type="material-community"
               name="plus"
               color="#00a680"
               containerStyle={styles.btnContainer}
               onPress={() => navigation.navigate("addRestaurant")} 
               />

           )}


        </View>
    );
};

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer: {
        position: "absolute",
        right: 10,
        bottom: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
    },
})
