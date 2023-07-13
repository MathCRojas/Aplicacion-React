import React, {useState} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button, Divider, Icon } from "react-native-elements";
import { reauthenticate } from '../../utils/api';
import * as firebase from 'firebase';
// La vista ChageEmail, deberá de contener dos input y un botón: 
// Correo electrónico y Contraseña (keyBoardType del correo debe de ser email y la contraseña debe de tener la funcionalidad para visualizarla y ocultarla)
// Botón: Modificar correo electrónico (mandar un console.log("ok");
export default function ChangeEmail(props){
    const { email, setShowModal, toastRef, setReloadUser } = props;
    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState(defaultFormValue());
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text});
    }

    const onSubmit = () => {
        setError({});
        if(!formData.email || !formData.password){
            setError({
                email: "Ingresa un correo electrónico",
                password:"Ingresa tu contraseña",
            });
        }else if(formData.email === email){
            setError({
                email: "El correo no puede ser igual al actual",
            });
        }else{
            setLoading(true);
            reauthenticate(formData.password).then(response => {
                firebase.auth().currentUser.updateEmail(formData.email).then(() => {
                    setLoading(false);
                    setShowModal(false);
                    setReloadUser(true);
                    toastRef.current.show("Correo actualizado");
                }).catch(() => {
                    setLoading(false);
                    setError({password: "Error al actualizar el correo electrónico"})
                })
            }).catch(() => {
                setLoading(false);
                setError({
                    password: "Contraseña incorrecta"
                })
            })
        }
    }

    return(
        <View style={styles.view}>
            <Text style={styles.textHeader}>Modificar nombre completo</Text>
            <Divider style={styles.divider} />
            <Input 
                label="Introduce tu nombre: *"
                labelStyle={styles.label}
                containerStyle={styles.containerInput}
                rightIcon={{
                    type: "material-community",
                    name: "email-outline",
                    color: "#E2E2E2",
                }}
                defaultValue={email && email}
                errorMessage={error.email}
                onChange={e => onChange(e, "email")}
            />
            <Input 
                label="Introduce tu contraseña actual: *"
                labelStyle={styles.label}
                containerStyle={styles.containerInput}
                rightIcon={
                    <Icon 
                        type= "material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                        color = "#E2E2E2"
                    />
                }
                secureTextEntry={showPassword}
                errorMessage={error.password}
                onChange={e => onChange(e, "password")}
            />
            <Button 
                title="Cambiar correo"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnButton}
                onPress={onSubmit}
            />
        </View>
    );

    function defaultFormValue(){
        return{
            email: email,
            password: "",
        };
    }

}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    textHeader: {
        fontSize: 20,
        fontWeight: "bold",
    },
    divider: {
        backgroundColor: "#00a680",
        width: "80%",
        marginBottom: 20,
    },
    label: {
        color: "#00a680"
    },
    containerInput: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 10,
        width: "95%",
    },
    btnButton: {
        backgroundColor: "#00a680",
    },
});