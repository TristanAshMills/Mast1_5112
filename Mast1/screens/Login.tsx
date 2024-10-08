import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParams';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigation = useNavigation<LoginScreenProp>();

  useEffect(() => {
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    } catch (e) {
      console.error('Failed to load credentials:', e);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      setIsLoading(false);
      if (email === 'chef@example.com' && password === 'Password123') {
        if (rememberMe) {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('password');
        }

        navigation.navigate('HomePage');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    }, 1500); 
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <LinearGradient colors={['#ff9966', '#ff5e62']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={[styles.input, !validateEmail(email) && email ? styles.invalidInput : null]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {!validateEmail(email) && email && (
          <Text style={styles.errorText}>Please enter a valid email address</Text>
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.rememberMeContainer}>
          <TouchableOpacity onPress={toggleRememberMe} style={styles.rememberMeButton}>
            <Ionicons name={rememberMe ? 'checkbox' : 'square-outline'} size={24} color="#fff" />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
gradient: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
container: {
  width: '90%',
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
},
title: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},
input: {
  width: '100%',
  padding: 12,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  backgroundColor: '#f9f9f9',
},
invalidInput: {
  borderColor: '#ff5e62',
},
passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
},
eyeIcon: {
  position: 'absolute',
  right: 10,
  top: 12,
},
rememberMeContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: 20,
},
rememberMeButton: {
  flexDirection: 'row',
  alignItems: 'center',
},
rememberMeText: {
  marginLeft: 8,
  color: '#fff',
},
errorText: {
  color: '#ff5e62',
  fontSize: 12,
  marginBottom: 10,
},
});

export default LoginScreen;
