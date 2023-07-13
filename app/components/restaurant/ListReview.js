import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Avatar, Button, Rating} from "react-native-elements";
import { fireBaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";

const db = firebase.firestore(fireBaseApp);


export default function ListReview(props) {
    const { navigation, id, idRestaurant, setRating } = props;
    const [userLogged, setUserLogged] = useState(false)
    useEffect(() => {
       firebase.auth().onAuthStateChanged((user) => {
           user ? setUserLogged(true) : setUserLogged(false);
       })
    }, [])
    return (
        <View>
            {userLogged ? (
                <Button
                title= "Escribe una opinion"
                buttonStyle={styles.btnReview}
                titleStyle={styles.btnTitleReview}
                icon={{type:"material-community", name: "square-edit-outline", color:"#00a680"}}
                onPress={() => navigation.navigate("addReview",{idRestaurant})}
                />
            ):(
                <View>
                    <Text
                    style={{textAlign:"center", color: "#00a680", padding:20}}
                    onPress={() => navigation.navigate("login")}
                    >
                        Para escribir un comentario es necesario tener un usuario{" "}
                        <Text style={{fontWeight:"bold"}}>
                            Pulsa AQUÍ para iniciar sesión
                        </Text>
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    btnReview:{
        backgroundColor: "transparent"

    },
    btnTitleReview:{
        color: "#00a680"
    }
})
