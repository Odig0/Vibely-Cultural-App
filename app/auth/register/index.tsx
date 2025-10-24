import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import ThemedButton from '@/presentation/theme/components/ThemedButton';
import ThemedLink from '@/presentation/theme/components/ThemedLink';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import ThemedTextInput from '@/presentation/theme/components/ThemedTextInput';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';

const RegisterScreen = () => {
  const { register } = useAuthStore();
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const onRegister = async () => {
    const { fullName, email, password } = form;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const wasSuccessful = await register(email, fullName, password);
      
      setIsLoading(false);

      if (wasSuccessful) {
        Alert.alert(
          'Cuenta creada exitosamente',
          'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
          [
            {
              text: 'Iniciar Sesión',
              onPress: () => router.replace('/auth/login')
            }
          ]
        );
        return;
      }

      Alert.alert('Error', 'No se pudo crear la cuenta. Intenta nuevamente.');
    } catch (error) {
      console.error('💥 Error en onRegister:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        style={{
          paddingHorizontal: 40,
          backgroundColor: backgroundColor,
        }}
      >
        <View
          style={{
            paddingTop: height * 0.35,
          }}
        >
          <ThemedText type="title">Crear cuenta</ThemedText>
          <ThemedText style={{ color: 'grey' }}>
            Por favor crea una cuenta para continuar
          </ThemedText>
        </View>

        {/* Formulario */}
        <View style={{ marginTop: 20 }}>
          <ThemedTextInput
            placeholder="Nombre completo"
            autoCapitalize="words"
            icon="person-outline"
            value={form.fullName}
            onChangeText={(value: string) => setForm({ ...form, fullName: value })}
          />

          <ThemedTextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
          />

          <ThemedTextInput
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
            value={form.password}
            onChangeText={(value: string) => setForm({ ...form, password: value })}
          />
        </View>

        {/* Spacer */}
        <View style={{ marginTop: 10 }} />

        {/* Botón */}
        <ThemedButton 
          icon="arrow-forward-outline"
          onPress={onRegister}
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
        </ThemedButton>

        {/* Spacer */}
        <View style={{ marginTop: 50 }} />

        {/* Enlace a registro */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText>¿Ya tienes cuenta?</ThemedText>
          <ThemedLink href="/auth/login" style={{ marginHorizontal: 5 }}>
            Ingresar
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default RegisterScreen;