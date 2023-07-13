//import frompairs from "lodash.frompairs";
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import Carousel from "react-native-snap-carousel";




export default function CarrouselRestaurant(props) {
    const { arrayImages, height, width} = props;
    const renderItem = ({ item }) => {
        return <Image PlaceholderContent={<ActivityIndicator size="large" color="#00a680" />}  
        style={{ width, height }} source={{ uri: item }} 
        />
    }
    return (      
            <Carousel
            layaout={"default"}
            data={arrayImages}
            sliderWidth={width}
            itemWidth={width}
            renderItem={renderItem}
            />
      
    )
}


