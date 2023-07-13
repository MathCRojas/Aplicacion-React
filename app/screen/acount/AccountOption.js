import React, {useState} from 'react';
import { StyleSheet, View } from 'react-native';
import  * as firebase from 'firebase';
import { ListItem } from 'react-native-elements';
import {map} from 'lodash';
import Modal from  "../../components/Modal";
import ChangeDisplayName from '../../screen/acount/ChangeDisplayName';
import ChangeEmail from '../../screen/acount/ChangeEmail';
import ChangePassword from '../acount/ChangePassword';


export default function AccountOption(props){
    const { userInfo, toastRef, setReloadUser } = props;
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);
    
    const selectComponent = (key) =>{
        switch (key) {
            case "displayName":
                // console.log("Cambio de nombre");
                setRenderComponent(
                    <ChangeDisplayName
                    displayName={userInfo.displayName}
                    setShowModal={setShowModal}
                    toastRef={toastRef}
                    setReloadUser={setReloadUser}
                    />  
                );
                setShowModal(true);
                break;
            case "email":
                // console.log("Cambio de correo");
                setRenderComponent(
                    <ChangeEmail 
                        email={userInfo.email}
                        // passwordProps={userInfo.password}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUser={setReloadUser}
                    />
                );
                setShowModal(true); 
            
            break;
            case "password":
                // console.log("Cambio de constraseña");
                setRenderComponent(
                    <ChangePassword 
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                );
                setShowModal(true);
                break;
            default:
                console.log("error");
                break;
        }
    }
    const menuOption = generateOption(selectComponent);
    return(
        <View>
            {map(menuOption,(menu, index) => (
                <ListItem
                    key={index}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft,
                    } }
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight
                    }}
                    containerStyle={styles.menuItem}
                    onPress={menu.onPress}
                  />
            ))}
            {renderComponent && (
                <Modal isVisible={showModal}setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            )}
        </View>
    );
};

const generateOption = (selectComponent) => {
    return[
        {
        title: "Cambiar nombre y apellidos",
        iconType: "material-community",
        iconNameLeft: "account-circle",
        iconColorLeft: "#ccc",
        iconNameRight: "chevron-right",
        iconColorRight: "#ccc",
        onPress: () => selectComponent("displayName"),
        },
        {
            title: "Cambiar correo electrónico",
            iconType: "material-community",
            iconNameLeft: "email-outline",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("email"),
        },
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("password"),
            },
    ];
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1,
    },
});