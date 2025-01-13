### zustand

## 애니메이션을 구현한 스플래시 스크린 (MP4, GIF처럼 보이게)

expo install expo-av

## 구글 로그인

npx expo install expo-auth-session

## axios

npm install axios

## carousel

npm install react-native-reanimated-carousel react-native-reanimated

## svg

npm install react-native-svg
npm install --save-dev react-native-svg-transformer

## reanimation

npx expo install react-native-reanimated react-native-gesture-handler

## 디바운스를 위한

npm install --save-dev @types/lodash

### 날짜

npm install date-fns

### react-query

npm install @tanstack/react-query

### npx expo install expo-image

특수 컴포넌트의 경우
expo-image와 같은 특수 컴포넌트들은 네이티브 구현에 더 가깝기 때문에 style 속성을 선호
이러한 컴포넌트들은 className을 통한 스타일링을 완전히 지원하지 않을 수 있음
따라서 expo-image에서는 style 속성을 사용하는 것이 더 안정적이고 성능이 좋습니다. 일반적인 React Native 컴포넌트에서는 className을 사용해도 문제없지만, 특수한 네이티브 기능을 사용하는 컴포넌트의 경우 style 속성을 사용하는 것이 좋습니다.

### expo notification push notification을 위한 것 expo SDK 52버전까지 사용이 가능하고 53버전 부터는 사용불가함 이후에 추가로 푸쉬 노티피케이션 사용 방법 검토해서 수정필요함.

expo install expo-notifications
알림을 보내는 함수 예시:

eas build --platform android --profile production --local
eas build --platform ios --profile production --local

 <!-- 
async function sendNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "제목입니다!",
      body: "알림 내용입니다.",
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 }, // 2초 후에 알림 발송
  });
} 
  -->
