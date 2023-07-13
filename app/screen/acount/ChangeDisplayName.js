import React, {useState} from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { Input, Button, Divider} from 'react-native-elements';
import * as firebase from 'firebase';

export default function ChangeDisplayName(props){
    const { displayName, setShowModal, toastRef, setReloadUser} = props;
    const [newDisplayName,setNewDisplayName] = useState(displayName);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState(null);
    const onSubmit = () =>{
        // console.log("Vamos a actualizar el nombre");
        if (!newDisplayName) {
            setError("El nombre no puede estar vacio"); 
        }else if (displayName === newDisplayName) {
            setError("El nombre no puede ser el mismo");    
        }else{
            setLoading(true);
            setError(null);
            // console.log("ok");
            const update = { 
                displayName: newDisplayName,
            }
            firebase.auth().currentUser.updateProfile(update).then(() =>{
                setLoading(false);
                setShowModal(false);
                setReloadUser(true);
                toastRef.current.show("Nombre modificado");
            }).catch(() => {
                setError("Error al actualizar el nombre");
                setLoading(false);
 
            })
        }
    }
   return(
    <View style={styles.view}>
        <Text style={styles.textHeader}>Modificar nombre completo</Text>
        <Divider style={styles.divider}/>
        <Input
        label="Introduce tu nombre"
        labelStyle={styles.label}
        containerStyle={styles.containerInput}
        rightIcon={{
            type: "material-community",
            name: "account-circle-outline",
            color: "#e2e2e2"
        }}
        keyboardType={"default"}
        defaultValue={displayName || ""}
        onChange={e =>setNewDisplayName(e.nativeEvent.text)}
        errorMessage={error}
        />
      <Button 
                title="Modificar nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnButton}
                onPress={onSubmit}
                loading={loading}
     />
    </View>
   );
   
};

const styles = StyleSheet.create({
    view:{
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    textHeader:{
        fontSize: 20,
        fontWeight: "bold",
    },
    divider: {
        backgroundColor: "#00a680",
        width: "80%",
        marginBottom: 20,
    },
    label: {
        color: "#00a680",
    },
    containerInput: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btnButton: {
        backgroundColor:"#00a680",
    },
    
});