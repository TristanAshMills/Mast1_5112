import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParams';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type RecipeListScreenProps = StackScreenProps<RootStackParamList, 'RecipeList'>;

interface Recipe {
  id: string;
  name: string;
  description: string;
  image?: any;
  course: string;
  price: number;
}

const RecipeList: React.FC<RecipeListScreenProps> = ({ navigation, route }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const storeRecipes = async (newRecipes: Recipe[]) => {
    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(newRecipes));
    } catch (e) {
      console.error('Failed to save the recipes.', e);
    }
  };

  const initialDishes: Recipe[] = [
    {
      id: '1',
      name: 'Grilled Salmon with Herbs',
      description: 'A delicious grilled salmon served with fresh herbs and lemon slices.',
      image: require('../assets/_images/fish.png'), 
      course: 'Main',
      price: 19.99,
    },
    {
      id: '2',
      name: 'Chicken Alfredo',
      description: 'Creamy pasta with grilled chicken, Parmesan cheese, and garlic.',
      image: require('../assets/_images/chicken.png'), 
      course: 'Main',
      price: 15.99,
    },
    {
      id: '3',
      name: 'Beef Stroganoff',
      description: 'Tender strips of beef in a creamy mushroom sauce, served over egg noodles.',
      image: require('../assets/_images/beef.png'),
      course: 'Main',
      price: 18.99,
    },
  ];

  const loadRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      if (storedRecipes) {
        const parsedRecipes = JSON.parse(storedRecipes);
        setRecipes([...initialDishes, ...parsedRecipes]); // Combine initial dishes with stored recipes
      } else {
        setRecipes(initialDishes); // Set initial dishes if no stored recipes found
      }
    } catch (e) {
      console.error('Failed to load the recipes.', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    if (route.params?.newRecipe) {
      const updatedRecipes = [...recipes, route.params.newRecipe];
      setRecipes(updatedRecipes);
      storeRecipes(updatedRecipes);
    }
  }, [route.params?.newRecipe]);

  useEffect(() => {
    setFilteredRecipes(
      recipes.filter((recipe) => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, recipes]);

  const handleDelete = (recipeId: string) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
            setRecipes(updatedRecipes);
            storeRecipes(updatedRecipes);
          },
        },
      ]
    );
  };

  const handlePress = (recipeId: string) => {
    navigation.navigate('RecipeDetails', { recipeId });
  };

  const renderRightActions = (recipeId: string) => (
    <TouchableOpacity onPress={() => handleDelete(recipeId)} style={styles.deleteButton}>
      <Ionicons name="trash-outline" size={32} color="white" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Recipe }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.item}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => handlePress(item.id)}>
          <Text style={styles.viewDetails}>View Details</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#ff9966', '#ff5e62']} style={styles.gradient}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredRecipes.length === 0 ? (
          <Text style={styles.noRecipesText}>No recipes found.</Text>
        ) : (
          <FlatList
            data={filteredRecipes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  viewDetails: {
    color: '#007bff',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#ff5e62',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecipesText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default RecipeList;
