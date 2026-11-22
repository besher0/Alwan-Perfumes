import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, View, useWindowDimensions } from 'react-native';
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

  const compact = width < 390 || height < 720;
  const tablet = width >= 600;

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: width < 360 ? 14 : 20,
            paddingTop: 18,
            paddingBottom: 32,
          }}
        >
          {/* Keep the floral artwork in its own clipped area. It must never cover the form. */}
          <View
            pointerEvents="none"
            style={{
              width: '100%',
              maxWidth: 480,
              height: tablet ? 152 : compact ? 106 : 125,
              overflow: 'hidden',
              borderRadius: 18,
              marginBottom: 18,
            }}
          >
            <Image
              source={require('../assets/floral/header.png')}
              resizeMode="cover"
              style={{
                position: 'absolute',
                top: tablet ? -32 : -30,
                left: 0,
                width: '100%',
                height: tablet ? 215 : 170,
                opacity: 0.9,
              }}
            />
          </View>

          <Card
            style={{
              width: '100%',
              maxWidth: 460,
              padding: compact ? 18 : 24,
              gap: 14,
              borderRadius: 24,
              backgroundColor: C.paper,
              shadowColor: '#604B43',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 18,
              elevation: 2,
            }}
          >
            <View style={{ alignItems: 'center', gap: 1, paddingBottom: 5 }}>
              <AText size={compact ? 24 : 27} weight="extra" style={{ textAlign: 'center' }}>
                علوان للعطور
              </AText>
              <AText color={C.gold} size={10} style={{ textAlign: 'center', letterSpacing: 0.7 }}>
                ALWAN PERFUMES
              </AText>
            </View>

            <View style={{ gap: 4 }}>
              <AText size={14} weight="bold">تسجيل دخول صاحب المحل</AText>
              <AText size={10} color={C.muted}>
                أدخل بيانات الحساب للوصول إلى لوحة الإدارة.
              </AText>
            </View>

            {/* Do not let input fields flex to fill the parent vertically. */}
            <View style={{ width: '100%', gap: 14 }}>
              <Field
                label="اسم المستخدم"
                value={username}
                onChangeText={setUsername}
                placeholder="اسم المستخدم"
                style={{ flexGrow: 0, flexShrink: 0 }}
              />
              <Field
                label="كلمة المرور"
                value={password}
                onChangeText={setPassword}
                secure
                placeholder="••••••••"
                style={{ flexGrow: 0, flexShrink: 0 }}
              />
            </View>

            <ErrorText message={error} />
            <Button
              title="دخول إلى لوحة الإدارة"
              loading={loading}
              disabled={!username.trim() || !password}
              onPress={submit}
            />
            <AText size={10} color={C.muted} style={{ textAlign: 'center' }}>
              الحساب مخصص لصاحب المحل فقط. لا يحتاج الزبائن إلى تسجيل دخول.
            </AText>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
