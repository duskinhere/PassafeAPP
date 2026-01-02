import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { getPasswords, savePassword, deletePassword } from './lib/storage';
import { useRouter } from 'expo-router';
import AnimatedPressable from '../components/ui/animated-pressable';

interface Password {
  pwd: string;
  createdAt: number;
  platform?: string;
  label?: string;
}

export default function PasswordSaver() {
  const router = useRouter();
  const [list, setList] = useState<Password[]>([]);
  const [manualPwd, setManualPwd] = useState('');
  const [manualPlatform, setManualPlatform] = useState('');
  const [manualLabel, setManualLabel] = useState('');

  const load = async () => {
    const items = await getPasswords();
    setList(items);
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  useEffect(() => {
    load();
  }, []);

  const onAdd = async () => {
    if (!manualPwd.trim()) {
      alert('Lütfen bir şifre giriniz');
      return;
    }
    await savePassword({ pwd: manualPwd, platform: manualPlatform || undefined, label: manualLabel || undefined });
    setManualPwd('');
    setManualPlatform('');
    setManualLabel('');
    load();
    Alert.alert('✓ Kaydedildi');
  };

  const onDelete = async (pwd: string) => {
    Alert.alert('Sil', 'Bu şifreyi silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          const ok = await deletePassword(pwd);
          if (ok) {
            const updated = list.filter((item) => item.pwd !== pwd);
            setList(updated);
            Alert.alert('Silindi');
          } else {
            Alert.alert('Hata', 'Silme başarısız');
          }
        },
      },
    ]);
  };

  const onCopy = async (pwd: string) => {
    try {
      await Clipboard.setStringAsync(pwd);
      Alert.alert('✓ Kopyalandı');
    } catch {
      Alert.alert('Hata', 'Kopyalama başarısız');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Kaydedilmiş Şifreler</Text>
          <AnimatedPressable style={styles.homeButton} onPress={() => router.push('/post-login')}>
            <Text style={styles.homeButtonText}>Ana Ekrana Dön</Text>
          </AnimatedPressable>
      </View>

      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={manualPwd}
          onChangeText={setManualPwd}
          secureTextEntry={false}
          placeholderTextColor="#666"
        />
        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder="Platform (örn. example.com)"
          value={manualPlatform}
          onChangeText={setManualPlatform}
          placeholderTextColor="#666"
        />
        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder="Etiket / Kullanıcı adı"
          value={manualLabel}
          onChangeText={setManualLabel}
          placeholderTextColor="#666"
        />
          <AnimatedPressable style={styles.addButton} onPress={onAdd}>
            <Text style={styles.addButtonText}>+ Ekle</Text>
          </AnimatedPressable>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item, idx) => item.pwd + idx}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <Text selectable style={styles.itemPwd}>
                {item.pwd}
              </Text>
              {item.label ? <Text style={styles.itemMeta}>Etiket: {item.label}</Text> : null}
              {item.platform ? <Text style={styles.itemMeta}>Platform: {item.platform}</Text> : null}
              <Text style={styles.itemDate}>
                {new Date(item.createdAt).toLocaleDateString('tr-TR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.itemActions}>
                <AnimatedPressable onPress={() => onCopy(item.pwd)} style={styles.actionButton}>
                  <Text style={styles.actionText}>📋</Text>
                </AnimatedPressable>
                <AnimatedPressable onPress={() => onDelete(item.pwd)} style={styles.actionButton}>
                  <Text style={styles.actionText}>🗑️</Text>
                </AnimatedPressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz kayıtlı şifre yok.</Text>
            <Text style={styles.emptySubtext}>Oluşturucudan yeni şifreler ekleyin.</Text>
          </View>
        }
        scrollEnabled={false}
      />
    </View>
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
  addSection: {
    marginBottom: 20,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemPwd: {
    fontSize: 14,
    fontFamily: 'Courier New',
    color: '#333',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  actionText: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
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
