import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Easing, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Recipe, RootStackParamList } from './RootStackParams';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

type AddRecipeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddRecipe'>;

const AddRecipe: React.FC = () => {
  const navigation = useNavigation<AddRecipeScreenNavigationProp>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('starter');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null); 
  const [errors, setErrors] = useState<{ name?: string, description?: string, price?: string }>({});
  const [buttonAnim] = useState(new Animated.Value(0));

  const validateFields = () => {
    let valid = true;
    let newErrors: { name?: string, description?: string, price?: string } = {};
    

    if (!name) {
      newErrors.name = "Dish name is required.";
      valid = false;
    }

    if (!description) {
      newErrors.description = "Description is required.";
      valid = false;
    }

    if (!price || isNaN(parseFloat(price))) {
      newErrors.price = "Valid price is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

 
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera roll permission is required to select an image');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddRecipe = () => {
    if (validateFields()) {
      const newRecipe: Recipe = {
        id: Math.random().toString(),
        name,
        description,
        course,
        price: parseFloat(price),
        image,
        ingredients: [],
        instructions: '',
      };



      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.bounce,
      }).start(() => {
        navigation.navigate('RecipeList', { newRecipe });

        setName('');
        setDescription('');
        setPrice('');
        setCourse('starter');
        setErrors({});
        setImage(null);
        buttonAnim.setValue(0);
      });
    } else {
      Alert.alert("Invalid Input", "Please correct the errors and try again.");
    }
  };

  return (
    <LinearGradient colors={['#ff9966', '#ff5e62']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add New Dish</Text>

        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="Dish Name"
          value={name}
          onChangeText={setName}/>
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <TextInput
          style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline/>
        {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

        <Picker
          selectedValue={course}
          style={styles.picker}
          onValueChange={(itemValue) => setCourse(itemValue)}>

          <Picker.Item label="Starter" value="starter" />
          <Picker.Item label="Main" value="main" />
          <Picker.Item label="Dessert" value="dessert" />
        </Picker>

        <TextInput
          style={[styles.input, errors.price ? styles.inputError : null]}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"/>
          <Text>R {(+price).toFixed(2)}</Text>
        {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerButtonText}>Pick an Image</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <Animated.View style={[styles.animatedButtonContainer, { transform: [{ scale: buttonAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }]}>
          <TouchableOpacity style={styles.customButton} onPress={handleAddRecipe}>
            <Text style={styles.buttonText}>Add Dish</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
gradient: {
  flex: 1,
},
container: {
  padding: 20,
  alignItems: 'center',
  backgroundColor: 'transparent',
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 20,
  textAlign: 'center',
},
input: {
  height: 50,
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 8,
  paddingHorizontal: 15,
  fontSize: 16,
  marginBottom: 10,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
},
textArea: {
  height: 80,
  textAlignVertical: 'top',
},
picker: {
  width: '100%',
  height: 50,
  backgroundColor: '#fff',
  borderRadius: 8,
  marginBottom: 10,
},
inputError: {
  borderColor: 'red',
  borderWidth: 1,
},
errorText: {
  color: 'red',
  alignSelf: 'flex-start',
  marginBottom: 5,
},
imagePickerButton: {
  backgroundColor: '#007bff',
  paddingVertical: 15,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginVertical: 10,
},
imagePickerButtonText: {
  color: '#fff',
  fontSize: 16,
  textAlign: 'center',
},
imagePreview: {
  width: '100%',
  height: 200,
  borderRadius: 10,
  marginTop: 10,
},
animatedButtonContainer: {
  width: '100%',
  alignItems: 'center',
  marginTop: 20,
},
customButton: {
  backgroundColor: '#333',
  paddingVertical: 15,
  paddingHorizontal: 60,
  borderRadius: 30,
  width: '100%',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
},
buttonText: {
  fontSize: 18,
  color: '#fff',
  fontWeight: '600',
},
});

export default AddRecipe;
