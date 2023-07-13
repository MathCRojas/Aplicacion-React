import React,{useRef, useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements';
import Toast from "react-native-easy-toast";
import Loading from "../Loading";
import AddRestaurantForm from "./AddRestaurantForm";

export default function AddRestaurant(props){
    const { navigation } = props;
    const [loading, setLoading] = useState(false);
    const toastRef = useRef();
    return(
        <View style={styles.viewContainer}> 
            <AddRestaurantForm setLoading={setLoading} toastRef={toastRef} navigation={navigation}/>
            <Loading isVisible={loading} text="Creando..."/>
            <Toast ref={toastRef} position="center" opacity={0, 9}/>
        </View>
    );
}
const styles = StyleSheet.create({

});