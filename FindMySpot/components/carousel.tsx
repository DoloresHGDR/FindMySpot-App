import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ImageSourcePropType } from 'react-native';

type CarouselItem = {
  image: ImageSourcePropType;
  title: string;
};

type CarouselProps = {
  title?: string;
  items: CarouselItem[];
};

const Carousel: React.FC<CarouselProps> = ({ title = 'Novedades', items }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <ScrollView
        horizontal
        style={styles.carousel}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.carouselItem}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.textOverlay}>
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
    </View>
    ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },
  
  label: {
    color: '#ffffff',
    fontFamily: 'arial',
    fontWeight: 'bold'
  },
  carousel: {
    marginTop: 20,
  },
  carouselItem: {
    width: 315,
    height: 150,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#20532eff',
    alignItems: "center",
    marginLeft: 12,
    left: -10
  },
  image: {
    width: 100,
    height: 90,
    resizeMode: 'cover',
    right: 85,
    top: 30
  },
  textOverlay: {
    position: 'absolute',
    paddingLeft: 120,
    top: 55
  },
  itemText: {
    color: '#669a74ff',
    fontFamily: 'arial',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
}
});

export default Carousel;
