import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading";
import { fireBaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(fireBaseApp);

export default function AddReviewRestaurant(props) {
    const { navigation, route } = props;
    // console.log(props);
    const { idRestaurant } = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("")
    const [review, setReview] = useState("")
    const [loading, setLoading] = useState(false);
    const toastRef = useRef();
    const addReview = () => {
        if (!rating) {
            toastRef.current.show("Es obligatorio ingresar una valoración", 5000);
        } else if (!title) {
            toastRef.current.show("Es obligatorio ingresar un titulo", 5000);
        } else if (!review) {
            toastRef.current.show("Es obligatorio ingresar un comentario", 5000);
        } else {
            //console.log("ok");
            setLoading(true);
            const user = firebase.auth().currentUser;
            const preLoad = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date()
            };
            db.collection("reviews")
                .add(preLoad)
                .then(() =>{
                    updateRestaurant();
                }).catch(() =>{
                    setLoading(false);
                    toastRef.current.show("Error", 5000)
                })
        }
        const updateRestaurant =() => {
            const restaurantRef = db.collection("restaurants").doc(idRestaurant);
            restaurantRef.get().then((response) => {
                const restaurantData = response.data();
                const ratingTotal = restaurantData.ratingTotal + rating;
                const quantityVoting = restaurantData.quantityVoting +1;
                const ratingResult = ratingTotal / quantityVoting;
                restaurantRef.update({
                    rating: ratingTotal,
                    ratingTotal,
                    quantityVoting
                }).then(() =>{
                    setLoading(false);
                    navigation.goBack();
                }).catch(() =>{
                    toastRef.current.show("Error")
                })

            })
        }
    

    // console.log("rating", rating);
    // console.log("title", title);
    // console.log("review", review);

}
return (
    <View style={styles.viewBody}>
        <View style={styles.viewRating}>
            <AirbnbRating
                count={5}
                reviews={["Pésimo", "Deficiente", "Normal", "Muy bueno", "Excelente"]}
                defaultRating={0}
                size={35}
                onFinishRating={(value) => setRating(value)}
            />
        </View>
        <View style={styles.formReview}>
            <Input
                placeholder="Título"
                containerStyle={styles.input}
                onChange={(e) => setTitle(e.nativeEvent.text)}
            />
            <Input
                placeholder="Comentario: "
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setReview(e.nativeEvent.text)}
            />
            <Button
                title="Enviar comentario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={addReview}
            />
        </View>
        {/* <Text style={styles.viewBody}></Text> */}
        <Toast
            ref={toastRef}
            position="center"
            opacity={0.9}
        />
        <Loading
            isVisible={loading}
            text="Registrando comentario"
        />
    </View>
)

}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2",

    },
    formReview: {
        flex: 1,
        alignItems: "center",
        marginTop: 40,
        margin: 10,
    },
    input: {
        marginBottom: 15,
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    }
})
