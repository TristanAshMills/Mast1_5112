import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Recipe } from './RootStackParams';
import { RouteProp } from '@react-navigation/native';

type RecipeDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RecipeDetails'>;
type RecipeDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetails'>;

interface Props {
  route: RecipeDetailsScreenRouteProp;
  navigation: RecipeDetailsScreenNavigationProp;
}

const RecipeDetails: React.FC<Props> = ({ route, navigation }) => {
  const { recipeId } = route.params ?? {};
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recipeId) {
      setTimeout(() => {

        const fetchedRecipe: Recipe = {
          id: recipeId,
          name: 'Spaghetti Carbonara',
          description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.',
          image: require('../assets/_images/Spaghetti.jpg'),
          ingredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Parmesan Cheese', 'Black Pepper'],
          instructions: 'Cook the pasta. Fry the pancetta. Mix eggs and cheese. Combine all ingredients and serve.',
          course: 'main',
          price: 12.99,
        };
        setRecipe(fetchedRecipe);
        setLoading(false);
      }, 1000);
    } else {
      setError('Recipe not found');
      setLoading(false);
    }
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubText}>Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe?.name}</Text>
      {recipe?.image && <Image source={recipe.image} style={styles.image} />}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{recipe?.description}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe?.ingredients?.map((ingredient, index) => (
        <Text key={index} style={styles.ingredientText}>• {ingredient}</Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{recipe?.instructions}</Text>

      <Text style={styles.sectionTitle}>Course</Text>
      <Text style={styles.course}>{recipe?.course}</Text>

      <Text style={styles.sectionTitle}>Price</Text>
      <Text style={styles.price}>${recipe?.price.toFixed(2)}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
container: {
  flexGrow: 1,
  padding: 20,
  backgroundColor: '#f5f5f5',
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 15,
},
image: {
  width: '100%',
  height: 200,
  borderRadius: 10,
  marginBottom: 20,
},
sectionTitle: {
  fontSize: 20,
  fontWeight: '600',
  marginTop: 20,
  marginBottom: 5,
},
description: {
  fontSize: 16,
  color: '#333',
},
ingredientText: {
  fontSize: 16,
  color: '#555',
},
instructions: {
  fontSize: 16,
  color: '#333',
  marginTop: 10,
  marginBottom: 15,
},
course: {
  fontSize: 16,
  color: '#333',
},
price: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
},
errorContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
errorText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: 'red',
  marginBottom: 10,
},
errorSubText: {
  fontSize: 16,
  color: '#666',
},
});

export default RecipeDetails;
