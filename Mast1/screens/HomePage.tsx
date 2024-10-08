import React, { useState } from 'react';
import { Image, Button, ScrollView, StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './RootStackParams';

type HomeScreenProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

const { width, height } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation<HomeScreenProp>();
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigateToRecipeList = () => navigation.navigate('RecipeList');
  const navigateToAddRecipe = () => navigation.navigate('AddRecipe');
  const navigateToRecipeDetails = () => navigation.navigate('RecipeDetails');

  const dishes = [
    {
      name: 'Grilled Salmon with Herbs',
      description: 'A delicious grilled salmon served with fresh herbs and lemon slices.',
      image: require('../assets/_images/fish.png'), 
    },
    {
      name: 'Chicken Alfredo',
      description: 'Creamy pasta with grilled chicken, Parmesan cheese, and garlic.',
      image: require('../assets/_images/chicken.png'), 
    },
    {
      name: 'Beef Stroganoff',
      description: 'Tender strips of beef in a creamy mushroom sauce, served over egg noodles.',
      image: require('../assets/_images/beef.png'),
    },
  ];

  return (
    <LinearGradient colors={['#ff9966', '#ff5e62']} style={styles.gradientBackground}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Chef's Menu</Text>
        <Animated.View style={{ opacity: fadeAnim }}>
          {dishes.map((dish, index) => (
            <DishSection key={index} dish={dish} />
          ))}
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.customButton} onPress={navigateToRecipeList}>
            <Text style={styles.buttonText}>Recipe List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customButton} onPress={navigateToAddRecipe}>
            <Text style={styles.buttonText}>Add New Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customButton} onPress={navigateToRecipeDetails}>
            <Text style={styles.buttonText}>Recipe Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const DishSection = ({ dish }) => (
  <View style={styles.dishSection}>
    <Image source={dish.image} style={styles.dishImage} />
    <Text style={styles.dishName}>{dish.name}</Text>
    <Text style={styles.dishDescription}>{dish.description}</Text>
  </View>
);

const styles = StyleSheet.create({
gradientBackground: {
  flex: 1,
  width: '100%',
  height: '100%',
},
container: {
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  backgroundColor: 'transparent',
},
title: {
  fontSize: 32,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#fff',
},
dishSection: {
  marginBottom: 30,
  alignItems: 'center',
  padding: 15,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: 15,
  width: width * 0.9,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowOffset: { width: 2, height: 2 },
  shadowRadius: 10,
},
dishImage: {
  width: '100%',
  height: height * 0.2,
  borderRadius: 10,
  marginBottom: 10,
  resizeMode: 'cover',
},
dishName: {
  fontSize: 20,
  fontWeight: '600',
  marginBottom: 5,
  color: '#fff',
},
dishDescription: {
  fontSize: 14,
  textAlign: 'center',
  color: '#ddd',
},
buttonContainer: {
  marginTop: 20,
  width: '100%',
  alignItems: 'center',
},
customButton: {
  backgroundColor: '#333',
  paddingVertical: 10,
  paddingHorizontal: 40,
  borderRadius: 25,
  marginBottom: 15,
  width: width * 0.8,
  alignItems: 'center',
},
buttonText: {
  fontSize: 18,
  color: '#fff',
  fontWeight: '600',
},
});

export default HomePage;
