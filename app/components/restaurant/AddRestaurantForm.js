import React,{useRef, useState, useEffect} from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Input, Button, Avatar, Image, Divider } from 'react-native-elements';
import * as Permission  from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import {map, size, filter } from "lodash";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";
import uuid from "random-uuid-v4";
import { fireBaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(fireBaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props){
    const {setLoading, toastRef, navigation} = props
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);
    const [error, setError] = useState({name: "", address:"", description:"", camera:null })
    
    
    const addRestaurant = () =>{
        if (!name || !address || !description) {
            setError({
                name: "Campo obligatorio",
                address: "Campo obligatorio",
                description: "Campo obligatorio"
            });
        }else if(size(imageSelected) === 0){
             setError({
                 camera: "Campo obligatorio"
                });
        }else if (!locationRestaurant) {
            setError({
                addRestaurant: "Debes seleccionar una ubicación en el mapa"
               });
            
        }else{
            setError({});
            setLoading(true);

            uploadImageStorage().then((response)=>{
               db.collection("restaurants")
               .add({
                   name: name,
                   address: address,
                   description: description,
                   location: locationRestaurant,
                   images: response,
                   rating: 0,
                   ratingTotal: 0,
                   quantityVoting: 0,
                   createAt: new Date(),
                   createBy: firebase.auth().currentUser.uid,
               })
               .then(() =>{
                    setLoading(false);
                    navigation.navigate("restaurants")
                   
               }).catch(() => {
                   setLoading(false);
                   toastRef.current.show("Error, contacte con servicio al cliente", 5000);

               })
            }).catch(err => {
                setLoading(false);
                toastRef.current.show("Error, contacte con servicio al cliente", 5000);
            })


        }

        // console.log(`Datos: ${name} ${address} ${description}`)
        // console.log(imageSelected);
        // console.log("*****Localización del restaurante*****");
        // console.log(locationRestaurant);
    };

    const uploadImageStorage = async() =>{
        const imageBlob = [];
        await Promise.all(
            map(imageSelected, async(image) =>{
            
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then(async result =>{
                    // console.log(result);
                    await firebase
                    .storage()
                    .ref(`restaurants/${result.metadata.name}`)
                    .getDownloadURL()
                    .then(photoUrl => {
                        imageBlob.push(photoUrl);
                    })
                })
            })
        ) 
        return imageBlob;
        
    }
    return(
        <ScrollView style={styles.containerScroll}>
            <ImageRestaurant imageSelected={imageSelected[0]} />
            <UploadImage 
            toastRef= {toastRef}
            setImageSelected={setImageSelected}
            imageSelected={imageSelected}
            />
            {error.camera && (
            <Text style={{color: "red", marginLeft:20, fontSize:12}}>{error.camera}</Text>
            )}
        <View>
            <FormAdd 
            setName={setName} 
            setAddress={setAddress}
            setDescription={setDescription}
            setIsVisibleMap={setIsVisibleMap}
            error={error}
            />
            <Button
            title="Crear Restaurante"
            containerStyle={styles.btnAddRestaurant}
            buttonStyle={{backgroundColor: "#00a680",}}
            onPress={addRestaurant}
            />
            <Map
            isVisibleMap={isVisibleMap}
            setIsVisibleMap={setIsVisibleMap}
            toastRef={toastRef}
            setLocationRestaurant={setLocationRestaurant}
            />
            {/* <Text>Formulario</Text> */}
        </View>
        </ScrollView>
    );
};

function FormAdd(props){
    const { setName, setAddress, setDescription, setIsVisibleMap, error } =props;
    return(
        
        <View style={styles.viewForm}>
            <Input
            label="Nombre del restaurante"
            placeholder="El Faisan"
            containerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
            onChange={e => setName(e.nativeEvent.text)}
            errorMessage={error.name}
            />
             <Input
            label="Dirección"
            placeholder="Cuernavaca"
            containerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
            rightIcon={
                <Icon
                    type="material-community"
                    name="google-maps"
                    color="#c2c2c2"
                    onPress={() => setIsVisibleMap(true)}
                />
            }
            onChange={e => setAddress(e.nativeEvent.text)}
            errorMessage={error.address}
            />
            <Input
             label="Descripción del restaurant"
             placeholder="Somos un restaurante de 5 estrellas"
             labelStyle={styles.inputLabel} 
             multiline={true}
             inputContainerStyle={styles.textArea}
             onChange={e => setDescription(e.nativeEvent.text)}
             errorMessage={error.description}
            />
        </View>
       
    );
}
function UploadImage(props){
    const { toastRef, setImageSelected, imageSelected } = props;
    const removeImage = (image) => {
        Alert.alert(
            "Eliminar imagen", //Título
            "¿Estás seguro de que quieres eliminar la imagen", //Subtítulo
            [ //Array Button
                { //Primer botón 
                    text: "Cancelar",
                    style:"cancel"
                },
                {//Segundo botón
                    text:"Eliminar",
                    onPress:() =>{
                        setImageSelected(filter(imageSelected,(imageUrl) => imageUrl !== image))
                    }
                }

            ],
            { cancelable: false }
        )
    }
    const imageSelect = async() =>{
        const resultPermission = await Permission.askAsync(Permission.CAMERA);
        console.log(resultPermission);
        if(resultPermission.status === 'denied'){
            // toastRef.current.show("Debes aceptar los permisos para acceder a la galería", 5000);
            toastRef.current.show("Debes aceptar los permisos para acceder a la galería", 5000);
        }else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [5,4]

            });

            if (result.cancelled) {
                toastRef.current.show("Has cerrado el selector de la imagen", 4000);
            }else{
                setImageSelected([... imageSelected, result.uri]);
                // setImageSelected(result.uri)

            }
            // console.log(result);
        }

    }
    return(
        <ScrollView horizontal={true}>
        <View style={styles.viewImage}>
            {size(imageSelected)<4 &&(
            <Icon
            reverse
            type="material-commmunity"
            name="camera"
            color={"#7a7a7a"}
            containerStyle={styles.containerIcon}
            onPress={imageSelect} 
            />
            )}
            {map(imageSelected, (imageRestaurant, index) => (
                <Avatar
                key={ index }
                style={styles.miniatureAvatar}
                source={{uri: imageRestaurant}}
                onPress={() => removeImage(imageRestaurant)}
                />
                
            ))}
        </View>
        </ScrollView>
    );
}
function ImageRestaurant(props){
    const { imageSelected } = props;
    return(
        <View style={styles.viewPhoto}> 
            <Image
            source={imageSelected ? {uri: imageSelected} : require("../../../assets/img/no-image.png")}
            style={{width: widthScreen, height: 200, }}

            />
        </View>
    );
};
function Map (props){
    const{ isVisibleMap, setIsVisibleMap, toastRef,setLocationRestaurant }= props;
    const [location, setLocation] = useState(null);
    useEffect(() => {
       (async() =>{
        const resultPermissions = await Permission.askAsync(
            Permission.LOCATION
        );
        if (resultPermissions.status === 'denied') {
            toastRef.current.show("Debes de aceptar los permisos de localización", 4000);
        }else{
            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,

            })
            console.log(location);
        }

       })(); // Función anónima auto ejecutable
    }, [])

    const confirmLocation = () =>{
        setLocationRestaurant(location);
        setIsVisibleMap(false);
        toastRef.current.show("Localización guardada");
    }

    return(
        <Modal
        isVisible={isVisibleMap} 
        setIsVisible={setIsVisibleMap}
        >
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) =>{
                            setLocation(region)
                        }}
                    >
                        <MapView.Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        draggable
                        />
                        
                

                    </MapView>

                )}
                <View style={styles.viewMapBtn}>
                            <Button
                            title="Cancelar ubicación"
                            containerStyle={styles.btnContainerCancel}
                            buttonStyle={styles.btnCancel}
                            onPress={()=> setIsVisibleMap(false)}
                            />
                            <Button
                            title="Guardar ubicación"
                            containerStyle={styles.btnContainerSave}
                            buttonStyle={styles.btnSave}
                            onPress={confirmLocation}
                            />
                            {/* <Divider/> */}
                        </View>
            </View>
        </Modal>

    );
}




const styles = StyleSheet.create({
    viewMapBtn:{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    btnContainerCancel:{
        paddingRight: 5,
    },
    btnContainerSave:{
        paddingRight: 5,
    },
    btnCancel:{
        backgroundColor: "#a60a0d"
    },
    btnSave:{
        backgroundColor:"#00a680"
    },
    mapStyle: {
        width: "100%",
        height: 560,
    },
    miniatureAvatar:{
        width: 70,
        height: 70,
        marginBottom: 20,
        marginRight: 10,
    },
    viewImage:{
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
        marginBottom: 20,
    },
    containerIcon:{
        alignItems:"center",
        justifyContent:"center",
        marginRight: 10,
        height: 70,
        width:70,
    },
    btnAddRestaurant: {
        margin: 20,
        marginBottom: 30, 
    },
    textArea:{
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    containerScroll:{
        height: "100%",
        backgroundColor: "#fff",
    },
    viewForm:{
        marginLeft: 10,
        marginRight: 10,
        marginTop:20,
    },
    inputContainer:{
        marginBottom: 15,

    },
    inputLabel:{
        fontSize: 10,
        color: "#00a680",

    },

});