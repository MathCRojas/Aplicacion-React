import React from "react";
import {StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity} from "react-native";
import {image, ListItem} from "react-native-elements";
import {size} from "lodash";
import {useNavigation} from "@react-navigation/native"
import { Touchable } from "react-native";
import { Image } from "react-native";

export default function ListRestaurants(props){
    const {restaurants, loading,  hadleLoadMore}= props;
    const navigation = useNavigation();

    return(
        <View>
            {size(restaurants) > 0 ?(
                <FlatList
                data={restaurants}
                renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation}/>}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={hadleLoadMore}
                ListFooterComponent={<FooterList loading={loading}/>}
                />
            ) : (
                <View style={styles.loaderRestaurant}>
                    <ActivityIndicator size="large" color="#00a680"/>
                    <Text>Cargando restaurantes...</Text>
                </View>
            )}
        </View>
    )
};

function Restaurant(props){
    const{ restaurant, navigation } = props;
    const {id, name, images, description, address} = restaurant.item;
    const imageRestaurant = images[0];
    // console.log(restaurant);
    const goRestaurant=() =>{
        //Nuevas lineas
        navigation.navigate("restaurant",{
            id, 
            name,
        });
        // console.log(`clic en el restaurante; ${name}`);
    }
    return (
        <TouchableOpacity onPress={goRestaurant}>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                <Image
                    resizeMode="cover"
                    PlaceholderContent={<ActivityIndicator
                    size="large"
                    color="#00a680"
                    />}
                    source={
                        imageRestaurant ? {uri: imageRestaurant} : require("../../../assets/img/no-image.png")
                    }
                    style={styles.imageRestaurant}
                
                />

                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDesc}>{description.substr(0,60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
        // <View>
        //     <Text>{restaurant.item.name}</Text>
        // </View>
    );

}
function FooterList(props){
    const{ loading } = props;

    if (loading) {
        return(
            <View style={styles.loaderRestaurant}>
                <ActivityIndicator
                size="large"
                color="#00a680"
                />
            </View>
        )
        
    }else{
        return(
            <View  style={styles.notFoundRestaurant} >
                <Text style={{color:"blue"}}>No quedan restaurantes por cargar</Text>
            </View>
        )
    }



}
const styles = StyleSheet.create({
    viewRestaurant: {
        flexDirection: "row",
        margin: 10,

    },
    viewRestaurantImage: {
        marginRight: 15,

    },
    imageRestaurant: {
        width: 100,
        height: 100,
    },
    restaurantName: {
        fontWeight: "bold"
    },
    restaurantAddress: {
        paddingTop: 2,
        color: "grey"
    },
    restaurantDesc: {
        paddingTop: 2,
        color: "grey",
        width: 300
    },
    loaderRestaurant: {
        marginTop: 10,
        marginBottom:10,
        alignItems: "center",
    },
    notFoundRestaurant: {
        marginTop:10,
        marginBottom: 20,
        alignItems: "center",
    }
}); 
