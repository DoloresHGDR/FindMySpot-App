import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";

type FlipCardProps = {
    plate: {
        id: number;
        number: string;
        vehicleDetails: {
            model: string;
            brand: string;
            type: string;
            chassis: string;
            engine: string;
        };
    };
};

export default function FlipCard({ plate }: FlipCardProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });


  const flipCard = () => {
    if (flipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setFlipped(false);
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setFlipped(true);
    }
  };

  const isNewFormat = (plateNumber: any) => {
    return (/^[A-Z]{2}\s?[0-9]{3}\s?[A-Z]{2}$/.test(plateNumber));
  }

  const imageSource = isNewFormat(plate.number)
      ? require('@/assets/images/plate_new.png')
      : require('@/assets/images/plate_old.png');

  return (
    <TouchableOpacity activeOpacity={1} onPress={flipCard}>
      <View style={styles.card}>
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            { transform: [{ rotateY: frontInterpolate }] },
          ]}
        >
            <ImageBackground
            source={imageSource}
            resizeMode="stretch"
            style={styles.plateImageBackground}
            >
            <Text
                style={[
                styles.plateNumberText,
                isNewFormat(plate.number) ? styles.newPlateText : styles.oldPlateText
                ]}
            >
                {plate.number}
            </Text>
            </ImageBackground>
        </Animated.View>

        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            { transform: [{ rotateY: backInterpolate }] },
          ]}
        >
            <View style={styles.cardInfo}>
                {[
                    {label: 'Modelo', value: plate.vehicleDetails.model},
                    {label: 'Marca', value: plate.vehicleDetails.brand}, 
                    {label: 'Tipo', value: plate.vehicleDetails.type},
                    {label: 'Chasis', value: plate.vehicleDetails.chassis},
                    {label: 'Motor', value: plate.vehicleDetails.engine}
                ].map((item, index) => (
                    <View key={index} >
                        <Text style={styles.label}>
                            {item.label}:
                            <Text style={styles.text}> {item.value}</Text>
                        </Text>
                    </View>
                ))}
            </View>

        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 270,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  cardFront: {
    backgroundColor: "#43975a",
    borderWidth: 10,
    borderColor: "#43975a",
  },
  cardBack: {
    backgroundColor: "#43975a",
    borderWidth: 4,
    borderColor: "black",
  },
  cardInfo: {
    flexDirection: "column",
    gap: 5,
    alignSelf: 'flex-start',
    left: 18
  },
  label: {
    color: "#e6e6e6",
    fontSize: 15,
    fontWeight: "bold",
    textShadowColor: 'black',
    textShadowOffset: {width: 0, height: 0.7},
    textShadowRadius: 10,

  },
  text: {
    color: "#e6e6e6",
    fontSize: 13,
    textShadowColor: 'black',
    textShadowOffset: {width: 0, height: 0.7},
    textShadowRadius: 10,
  },
  plateNumberText: {
    fontFamily: 'FE-Font',
    fontSize: 28,
  },
  oldPlateText: {
    color: '#fff',
    fontSize: 40,
    top: 1,
  },
  newPlateText: {
    color: '#000',
    fontSize: 40,
    top: 6,
  },
    plateImageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 7
  },
});