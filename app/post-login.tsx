import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedPressable from '../components/ui/animated-pressable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Storage from './lib/storage';

export default function PostLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const load = async () => {
      const creds = await Storage.getCredentials();
      if (creds?.username) {
        setUsername(creds.username);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hoşgeldiniz!</Text>
      {username && <Text style={styles.subtitle}>{username}</Text>}

      <View style={styles.buttonContainer}>
        <AnimatedPressable style={styles.buttonLarge} onPress={() => router.push('/password-generator')}>
          <Text style={styles.buttonTitle}>🔐 Şifre Oluşturucu</Text>
          <Text style={styles.buttonDesc}>Güçlü şifre oluştur</Text>
        </AnimatedPressable>

        <AnimatedPressable style={styles.buttonLarge} onPress={() => router.push('/password-saver')}>
          <Text style={styles.buttonTitle}>💾 Şifre Kaydedici</Text>
          <Text style={styles.buttonDesc}>Şifrelerinizi saklayın</Text>
        </AnimatedPressable>
      </View>

      <AnimatedPressable
        style={styles.logoutButton}
        onPress={async () => {
          await Storage.removeCredentials();
          router.replace('/login');
        }}
      >
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </AnimatedPressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLarge: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: '100%',
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonDesc: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
