import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import { C } from '../theme/colors';
import { AText, Button, Card, ErrorText, Field } from '../components/UI';

export function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const compact = width < 390 || height < 650;
  const isLandscape = width > height;

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* Unlike the old header crop, these wallpapers have no baked-in card,
          edges, or opaque rectangular patch. They fill the viewport independently. */}
      <Image
        pointerEvents="none"
        source={isLandscape
          ? require('../assets/floral/login-landscape.jpg')
          : require('../assets/floral/login-portrait.jpg')}
        resizeMode="stretch"
        style={StyleSheet.absoluteFillObject}
        accessible={false}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: width < 360 ? 14 : 22, paddingVertical: compact ? 22 : 38 },
          ]}
        >
          <Card
            style={[
              styles.card,
              { maxWidth: width >= 700 ? 480 : 450, padding: compact ? 19 : 26 },
            ]}
          >
            <View style={styles.heading}>
              <AText size={compact ? 24 : 27} weight="extra" style={styles.center}>
                علوان للعطور
              </AText>
              <AText color={C.gold} size={10} style={styles.english}>
                ALWAN PERFUMES
              </AText>
            </View>

            <View style={styles.description}>
              <AText size={14} weight="bold">تسجيل دخول صاحب المحل</AText>
              <AText size={10} color={C.muted}>
                أدخل بيانات الحساب للوصول إلى لوحة الإدارة.
              </AText>
            </View>

            <View style={styles.fields}>
              <Field
                label="اسم المستخدم"
                value={username}
                onChangeText={setUsername}
                placeholder="اسم المستخدم"
                style={styles.fixedField}
              />
              <Field
                label="كلمة المرور"
                value={password}
                onChangeText={setPassword}
                secure
                placeholder="••••••••"
                style={styles.fixedField}
              />
            </View>
            <ErrorText message={error} />
            <Button
              title="دخول إلى لوحة الإدارة"
              loading={loading}
              disabled={!username.trim() || !password}
              onPress={submit}
            />
            <AText size={10} color={C.muted} style={styles.center}>
              الحساب مخصص لصاحب المحل فقط. لا يحتاج الزبائن إلى تسجيل دخول.
            </AText>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: C.paper,
    gap: 15,
    borderWidth: 1,
    borderColor: C.line,
  },
  heading: { alignItems: 'center', gap: 3, paddingBottom: 3 },
  center: { textAlign: 'center' },
  english: { textAlign: 'center', letterSpacing: 0.7 },
  description: { gap: 4 },
  fields: { width: '100%', gap: 16 },
  fixedField: { flexGrow: 0, flexShrink: 0 },
});
