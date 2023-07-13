import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import InfoUser from '../acount/InfoUser';
import * as firebase from 'firebase';
import AccountOption from "../../screen/acount/AccountOption";


export default function UserLogged(props){
    const toastRef = useRef();
    // const {toastRef} = props;
    const [userInfo, setUserInfo] = useState();
    const [reloadUser, setReloadUser] = useState()
    
    useEffect(() => {
        (async()=>{
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
            // console.log(userInfo);
        })(); 
        setReloadUser(false);
    }, [reloadUser]);

    return (
        <View style={styles.viewUserInfo}>
          {userInfo && <InfoUser userInfo={userInfo} toastRef={toastRef}/>}
         <AccountOption
         userInfo={userInfo}
         toastRef={toastRef} 
         setReloadUser={setReloadUser} 
         />
            <Button 
                title= "Cerrar sesión"
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
                onPress={()=> firebase.auth().signOut()}
            /> 
           
            <Toast ref={toastRef} position="center" opacity={0,9}/>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo:{
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSession: {
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10, 

     },
     btnCloseSessionText: {
         color: "#00a680",
     }


})