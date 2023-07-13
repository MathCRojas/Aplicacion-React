import React, { useState } from "react";
import { View, StyleSheet} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "./Loading";

import { size, isEmpty } from 'lodash';
import { validateEmail } from '../utils/validation';
import * as firebase from 'firebase';
import { useNavigation } from "@react-navigation/native";

export default function RegisterForm(props){
    // console.log("**Formulario de registro");
    const { toastRef } = props;
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    // console.log(toastRef);
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setConfirmPassword] = useState(true);
    const [ formData, setFormData ] = useState(defaultFormValue());
    // console.log(formData);

    const onSubmit = () =>{
        console.log(formData);
        if(isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)){
            console.log(toastRef);
            // console.log("Todos los campos son obligatorios");
            toastRef.current.show("Todos los campos son obligatorios");
        }else if(!validateEmail(formData.email)){
            toastRef.current.show("Debes de ingresar un correo electrónico");
           // console.log("Debes de ingresar un correo electrónico");
        }else if(formData.password !== formData.repeatPassword){
            toastRef.current.show("Las contraseñas deben de ser iguales");
            // console.log("Las contraseñas deben de ser iguales");
        }else if(size(formData.password) < 6){
            toastRef.current.show("La contraseña debe tener por lo menos 6 carácteres");
            // console.log("La contraseña debe tener por lo menos 6 carácteres");
        }else{
            setLoading(true);
            firebase
            .auth()
            .createUserWithEmailAndPassword(formData.email, formData.password)
            .then(response=>{
                setLoading(false);
                navigation.navigate("acount");

            })
            .catch(() =>{
                setLoading(false);
                toastRef.current.show("Cuenta existente, favor de ingresar otro correo");

            })
            // toastRef.current.show("ok");
            //console.log("ok"); 

        }
    }
    const onChange = (e, type) =>{
        // console.log(type)
        // console.log(e.nativeEvent.text);
        // setFormData({[type] :  e.nativeEvent.text})
        setFormData({...formData,[type] :  e.nativeEvent.text});

    }
    return(
        <View style={styles.formContainer}>
             <Input
             placeholder="utez@utez.edu.mx"
             rightIcon={
                 <Icon
                    type="material-community"
                    name="email-outline"
                    iconStyle={styles.iconStyle}
                 />
             }
            //  leftIcon={{type:"material-community", name:"email-outline"}}
            //  leftIconContainerStyle={styles.iconStyle}
             label="Correo electrónico"
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
            //  leftIcon={{type:"material-community", name:"lock-outline"}}
            //  leftIconContainerStyle={styles.iconStyle}
             label="Contraseña:*"
             labelStyle={styles.labelInput}
             containerStyle={styles.inputForm}
             password={true}
             secureTextEntry={true}
             onChange={e => onChange(e, "password")}
             />
             <Input
             placeholder="****"
             rightIcon={
                <Icon 
                   type= "material-community"
                   name={showConfirmPassword ? "eye-off-outline" : "eye-outline" }
                   iconStyle={styles.iconStyle}
                   onPress={()=> setConfirmPassword(!showConfirmPassword)}
                />
            }
            //  leftIcon={{type:"material-community", name:"lock-outline"}}
            // leftIconContainerStyle={styles.iconStyle}
             label="Confirmar Contraseña:*"
             labelStyle={styles.labelInput}
             containerStyle={styles.inputForm}
             password={true}
             secureTextEntry={showConfirmPassword}
             onChange={e => onChange(e, "repeatPassword")}
             />
             <Button
                title="Unirse"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
             />
             <Loading isVisible={loading} text="Creando cuenta"/>
        </View>
    );
};
function defaultFormValue(){
    return{
        email: "", 
        password: "",
        repeatPassword: "",
    };
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
        // marginRight: 10,
        color:"#b9bdbc"
    },
});