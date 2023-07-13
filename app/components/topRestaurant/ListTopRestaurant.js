import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Image, Icon, Rating } from "react-native-elements";


export default function ListTopRestaurant(props) {
    const { navigation, toastRef, restaurants } = props;
    console.log(restaurants);
    return (
        <FlatList
            data={restaurants}
            renderItem={(restaurants) => <Restaurant restaurant={restaurants} navigation={navigation} />}
            keyExtractor={(item, index) => index.toString()}
        />

    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const { name, rating, images, description, id } = restaurant.item;
    const [color, setColor] = useState("#000");
    useEffect(() => {
        switch (restaurant.index) {
            case 0:
                setColor("#efb819");
                break;
            case 1:
                setColor("#afafad");
                break;
            case 2:
                setColor("#cd7f32");
                break;
            default:
                setColor("#000");
                break;
        }
    }, [])

    return (
        <TouchableOpacity onPress={() => navigation.navigate("restaurants", {
            screen: "restaurant",
            params: { id, name }
        })}>
            <Card styles={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={color}
                    containerStyle={styles.containerIcon}
                />
                <Image
                    style={styles.containerImage}
                    resizeMode="cover"
                    source={
                        images[0] ? { uri: images[0] }
                            : require("../../../assets/img/no-image.png")
                    }
                />
                <View styles={styles.titleRating}>
                    <Text style={styles.title}> {name} </Text>
                    <Rating
                        imageSize={20}
                        startingValue={rating}
                        readonly
                    />
                </View>
                <Text style={styles.description}>{description}</Text> 
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerIcon: {
        position: "absolute",
        top: -17,
        left: -22,
        zIndex: 1,
    },
    containerCard: {
        marginBottom: 30,
        borderWidth: 0,
    },
    containerImage: {
        width: "100%",
        height: 200,
    },
    titleRating: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    description: {
        color: "grey",
        marginTop: 0,
        textAlign: "justify"
    }
})
