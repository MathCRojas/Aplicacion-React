import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
export default function UserGuest(){
    const navigation = useNavigation();
    // console.log(navigation);
    return (
        <ScrollView centerContent="center" style={styles.viewBody}> 
            <Image
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.text}>Consulta tu perfil de 5 tenedores</Text>
            <Text style={styles.description}> ¿Cómo describirías tu mejor restaurante? Busca y visualiza los mejores restaurantes de una forma sencilla
                vota cual te ha gustado más y comenta como ha sido tu experiencia.</Text>
        <View style={styles.ViewBtn}>
            <Button
            title="Ver tu perfil"
            buttonStyle={styles.btnButton}
            containerStyle={styles.btnContainer}
            onPress={()=> navigation.navigate("login")}
            />
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        marginLeft:30,
        marginRight:30,
    },
    image:{
        height: 300,
        width: "100%",
        marginTop: 40,
        marginTop: 20,
    },
    text: {
        fontWeight: "bold",
        fontSize:19,
        textAlign: "center",
        marginBottom:20,

    },
    description :{
        textAlign: "center",
        marginBottom:20,
    },
    ViewBtn :{
        flex: 1,
        alignItems: "center"
    },
    btnButton :{
        backgroundColor: "#00a680"
    },
    btnContainer :{
        width: "70%"
    }

});