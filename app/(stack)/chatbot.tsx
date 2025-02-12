import { Stack } from 'expo-router';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chatbot() {
  const windowHeight = Dimensions.get('window').height;
  const CHATBOT_URL = 'https://www.berakorean.com/chatbot?platform=app'; // 여기에 실제 챗봇 URL을 넣으세요

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTitle: 'Chatbot',
        }}
      />
      <WebView
        source={{ uri: CHATBOT_URL }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
}
