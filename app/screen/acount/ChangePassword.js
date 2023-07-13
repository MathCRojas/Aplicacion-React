import React, {useState} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button, Divider, Icon } from "react-native-elements";
import { size } from 'lodash';
import { reauthenticate } from '../../utils/api';
import * as firebase from 'firebase';
// La vista de ChangePassword, deberá de contener tres input y un botón:
// Contraseña Actual, Nueva Contraseña, Confirmar Contraseña (Las contraseñas debe de tener la funcionalidad para visualizarla y ocultarla)
// Botón: Modificar contraseña (console.log("Ok");

export default function ChangePassword(props){
    const { setShowModal, toastRef} = props;
    const [showPassword, setShowPassword] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(true);
    const [formData, setFormData] = useState(defaultFormValue());
    const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(true);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
        if(!formData.currentPassword){
            setError({
                current: "Ingresa tu contraseña actual",
            });
        }else if(!formData.newPassword){
            setError({
                new: "Ingresa tu nueva contraseña",
            });
        }else if(!formData.confirmNewPassword){
            setError({
                confirm: "Confirma tu nueva contraseña",
            });
        }else if(formData.newPassword !== formData.confirmNewPassword){
            setError({
                new: "Las contraseñas no son iguales",
                confirm: "Las contraseñas no son iguales",
            });
        }else if(formData.currentPassword === formData.newPassword){
            setError({
                current: "Las contraseñas no deben ser iguales",
                new: "Las contraseñas no deben ser iguales",
            });
        }else if(size(formData.newPassword) < 6){
            setError({
                new: "La longitud de la contraseña debe ser mínimo 6 caracteres",
            })
        }else{
            setLoading(true);
            reauthenticate(formData.currentPassword).then(response => {
                firebase.auth().currentUser.updatePassword(formData.newPassword).then(() => {
                    setLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                    toastRef.current.show("Se ha actualizado la contraseña");
                }).catch(() => {
                    setLoading(false);
                    setError({
                        current: "Error al actualizar la contraseña",
                    });
                });
            }).catch(() => {
                setLoading(false);
                setError({
                    current: "Contraseña incorrecta",
                });
            });
        }
    }

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text});
    }

    return(
        <View style={styles.view}>
            <Text style={styles.textHeader}>Modificar la contraseña</Text>
            <Divider style={styles.divider} />
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
                onChange={e => onChange(e, "currentPassword")}
                errorMessage={error.current}
            />
            <Input 
                label="Introduce tu nueva contraseña: *"
                labelStyle={styles.label}
                containerStyle={styles.containerInput}
                rightIcon={
                    <Icon 
                        type= "material-community"
                        name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        color = "#E2E2E2"
                    />
                }
                secureTextEntry={showNewPassword}
                onChange={e => onChange(e, "newPassword")}
                errorMessage={error.new}
            />
            <Input 
                label="Confirma tu nueva contraseña: *"
                labelStyle={styles.label}
                containerStyle={styles.containerInput}
                rightIcon={
                    <Icon 
                        type= "material-community"
                        name={showNewConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowNewConfirmPassword(!showNewConfirmPassword)}
                        color = "#E2E2E2"
                    />
                }
                secureTextEntry={showNewConfirmPassword}
                onChange={e => onChange(e, "confirmNewPassword")}
                errorMessage={error.confirm}
            />
            <Button 
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnButton}
                onPress={onSubmit}
                loading={loading}
            />
        </View>
    );

    function defaultFormValue(){
        return{
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
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
        marginTop: 20,
        width: "95%",
    },
    btnButton: {
        backgroundColor: "#00a680",
    },
});