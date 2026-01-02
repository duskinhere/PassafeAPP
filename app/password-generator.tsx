import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { savePassword } from './lib/storage';
import { useRouter } from 'expo-router';
import AnimatedPressable from '../components/ui/animated-pressable';

function generatePassword(length: number, options: any) {
  let chars = '';
  if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (options.numbers) chars += '0123456789';
  if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let out = '';
  for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

export default function PasswordGenerator() {
  const router = useRouter();
  const [pwd, setPwd] = useState('');
  const [len, setLen] = useState('16');
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [platform, setPlatform] = useState('');
  const [label, setLabel] = useState('');

  const onGenerate = async () => {
    const n = Math.max(6, Math.min(64, Number(len) || 16));
    const generated = generatePassword(n, { uppercase, lowercase, numbers, symbols });
    setPwd(generated);
    await savePassword({ pwd: generated, platform: platform || undefined, label: label || undefined });
    Alert.alert('✓ Kaydedildi', 'Şifre otomatik olarak kaydedildi');
  };

  const onCopy = async () => {
    try {
      await Clipboard.setStringAsync(pwd);
      Alert.alert('✓ Kopyalandı');
    } catch {
      Alert.alert('Hata', 'Kopyalama başarısız');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Şifre Oluşturucu</Text>
        <AnimatedPressable style={styles.homeButton} onPress={() => router.push('/post-login')}>
          <Text style={styles.homeButtonText}>Ana Ekrana Dön</Text>
        </AnimatedPressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Uzunluk: {len}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={len}
          onChangeText={setLen}
          placeholder="6-64"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Platform (örn. example.com)</Text>
        <TextInput style={styles.input} value={platform} onChangeText={setPlatform} placeholder="Platform" placeholderTextColor="#666" />
        <Text style={[styles.label, { marginTop: 8 }]}>Etiket / Kullanıcı Adı</Text>
        <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="Etiket (ör. email veya kullanıcı)" placeholderTextColor="#666" />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Karakter Türleri</Text>
        <View style={styles.checkboxRow}>
          <Switch value={uppercase} onValueChange={setUppercase} />
          <Text style={styles.checkboxLabel}>Büyük Harfler (A-Z)</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Switch value={lowercase} onValueChange={setLowercase} />
          <Text style={styles.checkboxLabel}>Küçük Harfler (a-z)</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Switch value={numbers} onValueChange={setNumbers} />
          <Text style={styles.checkboxLabel}>Sayılar (0-9)</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Switch value={symbols} onValueChange={setSymbols} />
          <Text style={styles.checkboxLabel}>Semboller (!@#$%)</Text>
        </View>
      </View>

        <AnimatedPressable style={styles.generateButton} onPress={onGenerate}>
          <Text style={styles.generateButtonText}>Oluştur</Text>
        </AnimatedPressable>

      {pwd ? (
        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Oluşturulan Şifre:</Text>
          <Text selectable style={styles.pwd}>
            {pwd}
          </Text>
          <AnimatedPressable style={styles.copyButton} onPress={onCopy}>
            <Text style={styles.copyButtonText}>Kopyala</Text>
          </AnimatedPressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pwd: {
    marginVertical: 12,
    fontSize: 14,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    fontFamily: 'Courier New',
    color: '#333',
  },
  copyButton: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  homeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
