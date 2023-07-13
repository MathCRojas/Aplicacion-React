import React, { useState } from "react";
import { View, StyleSheet} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "./Loading";
import { isEmpty } from "lodash";

import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

export default function LoginForm( props ) {
    const { toastRef } = props
    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const onSubmit = () => {
        console.log(formData);
        if(isEmpty(formData.email) || isEmpty(formData.password)){
            toastRef.current.show("Todos los campos son obligatorios");
        }else{
            setLoading(true);
            firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).then(response =>{
                setLoading(false);
                navigation.navigate("acount");
            }).catch(() => {
                setLoading(false);
                toastRef.current.show("Correo electrónico o contraseña incorrecta");
            })
        }
    }

    const onChange = (e, type) =>{
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }

    return(
        <View>
            <Input
             placeholder="utez@utez.edu.mx"
             rightIcon={
                 <Icon 
                    type= "material-community"
                    name="email-outline"
                    iconStyle={styles.iconStyle}
                 />
             }
             label="Correo electrónico: *"
             labelStyle={styles.labelInput}
             containerStyle={styles.inputForm}
             onChange={e => onChange(e, "email")}
             />
             <Input
             placeholder="****"
             rightIcon={
                <Icon 
                   type= "material-community"
                   name={showPassword ? "eye-off-outline" : "eye-outline"}
                   iconStyle={styles.iconStyle}
                   onPress={() => setShowPassword(!showPassword)}
                />
            }
             label="Contraseña: *"
             labelStyle={styles.labelInput}
             containerStyle={styles.inputForm}
             password={true}
             secureTextEntry={showPassword}
             onChange={e => onChange(e, "password")}
             />
             <Button
                title="Ingresar"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
             />
             <Loading isVisible={loading} text="Ingresando..." />
        </View>
    );

    function defaultFormValue(){
        return{
            email: "",
            password: "",
        };
    }

}

const styles = StyleSheet.create({
    formContainer: {
        marginTop: 30,
        alignItems: "center",
    },
    labelInput: {
        fontSize: 20,
        color: "#0e896b",
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
        marginBottom: 20,
    },
    btnContainer: {
        marginTop: 20,
        width: "100%",
    },
    btnRegister: {
        backgroundColor: "#00a680",
    },
    iconStyle: {
        color: "#B9BDBC"
    },
});
