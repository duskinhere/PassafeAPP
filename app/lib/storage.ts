import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDENTIALS_KEY = 'app_credentials';
const PASSWORDS_KEY = 'saved_passwords';

export async function saveCredentials(creds: { username: string; password: string }) {
  try {
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  } catch (e) {
    // ignore for now
  }
}

export async function getCredentials() {
  try {
    const raw = await AsyncStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function removeCredentials() {
  try {
    await AsyncStorage.removeItem(CREDENTIALS_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

export type PasswordEntry = { pwd: string; createdAt: number; platform?: string; label?: string };

export async function savePassword(
  pwdOrEntry: string | { pwd: string; platform?: string; label?: string }
) {
  try {
    const raw = await AsyncStorage.getItem(PASSWORDS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const entry: PasswordEntry =
      typeof pwdOrEntry === 'string'
        ? { pwd: pwdOrEntry, createdAt: Date.now() }
        : { pwd: pwdOrEntry.pwd, platform: pwdOrEntry.platform, label: pwdOrEntry.label, createdAt: Date.now() };
    arr.unshift(entry);
    await AsyncStorage.setItem(PASSWORDS_KEY, JSON.stringify(arr));
  } catch (e) {
    // ignore
  }
}

export async function getPasswords(): Promise<Array<{ pwd: string; createdAt: number }>> {
  try {
    const raw = await AsyncStorage.getItem(PASSWORDS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return arr;
  } catch (e) {
    return [];
  }
}

export async function deletePassword(pwd: string) {
  try {
    const raw = await AsyncStorage.getItem(PASSWORDS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const updated = arr.filter((item: any) => item.pwd !== pwd);
    await AsyncStorage.setItem(PASSWORDS_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
}
