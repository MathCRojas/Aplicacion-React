import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import Loading from '../../components/Loading'
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';


export default function InfoUser(props){
   //  const toastRef = useRef();
   
    const { userInfo:{uid, photoURL, displayName, email},toastRef } = props;
    const [loading, setLoading] = useState(false);
    
    const changeAvatar = async () =>{
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA);
       // const resultPermissionCamera = resultPermission.permissions.camera.status;
    //    console.log(resultPermission.status);
       if(resultPermission.status === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria ");   
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
               allowsEditing: true,
               aspect: [4,5]

               
            });
            console.log(result)
            if (result.cancelled) {
                toastRef.current.show("Has cerrado la seleccion de la imagen");    
            }else{
                uploadImage(result.uri).then(() =>{
                    // console.log("ok");
                    updatePhothoUrl();

                }).catch(() =>{
                    toastRef.current.show("Error al actualizar el avatar");
                })
            }
        } 

        // console.log("Aquí pediré permiso para abrir la galería");
    };

    const uploadImage = async (uri) =>{
        setLoading(true);
        const response = await fetch(uri);
        // console.log(JSON.stringify(,response));
        const { _bodyBlob } = response;
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(_bodyBlob);
        };
        const updatePhothoUrl = () =>{
            firebase
            .storage()
            .ref( `avatar/${uid}`)
            .getDownloadURL()
            .then(async (response) =>{
                console.log(response);
                const update={
                    photoURL: response,
                };
                await firebase.auth().currentUser.updateProfile(update);
                setLoading(false);
                toastRef.current.show("Imagen actualizada");
            }).catch(()=>{
                setLoading(false);
                toastRef.current.show("Error al actualizar la imagen");
            })
        };
 

    // console.log(props.userInfo);
    return(
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={photoURL ? {uri: photoURL} : require("../../../assets/img/user-guest.jpg")}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email ? email : "Red social"}
                </Text>
                <Loading isVisible={loading} text="Actualizando imagen"/>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    viewUserInfo:{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar: {
        marginRight: 20,
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },





})