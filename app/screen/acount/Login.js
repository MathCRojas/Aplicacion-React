import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import { Divider} from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import LoginForm from "../../components/LoginForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
export default function Login(){
    const toastRef = useRef();
    return (
        <KeyboardAwareScrollView>
       <ScrollView>
           <Image
               source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
               resizeMode="contain"
               style={styles.logo}
               />
            <Divider style={styles.divider} />
            <View>
                <Text style={styles.title}>Inicio de Sesión</Text>
                <LoginForm toastRef={toastRef} />
                <CreateAccount/>
            </View>
            <Toast ref={toastRef} position="center" opacity={0,9} style={styles.toastForm} />
       </ScrollView>
       </KeyboardAwareScrollView>
    );
}

function CreateAccount( props ){
    const navigation = useNavigation();
    return(
        <Text style={styles.textRegistro}>
            ¿Aún no tienes cuenta?
        <Text style={styles.btnRegistro} onPress={()=> navigation.navigate("register")}>
            Registrate</Text>
        </Text>
    );
};
const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    divider: {
        backgroundColor: "#00a680",
        margin:40,      
    },
    title: {
        fontSize: 40,
        textAlign: "center",
    },
    textRegistro: {
        margin: 10,
        textAlign: "center",
    },
    btnRegistro: {
        color: "#00a680"
    },
});