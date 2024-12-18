// import { AntDesign } from '@expo/vector-icons';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { useRouter } from 'expo-router';
// import { Pressable, StyleSheet, Image, Text } from 'react-native';
// import { useAuthStore } from '~/store/authStore';

// export default function Auth() {
//   const { socialLogin } = useAuthStore();
//   const router = useRouter();

//   GoogleSignin.configure({
//     scopes: ['https://www.googleapis.com/auth/drive.readonly'],
//     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
//     iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
//   });

//   const handleGoogleLogin = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();

//       console.log('userInfo', JSON.stringify(userInfo, null, 2));
//       await socialLogin(
//         'GOOGLE',
//         userInfo?.data?.user?.id || '',
//         userInfo?.data?.user?.email || '',
//         userInfo?.data?.user?.givenName || ''
//       );
//       router.replace('/');
//     } catch (error: any) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         console.log('User cancelled the login flow');
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         console.log('Sign in is in progress');
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         console.log('Play services not available or outdated');
//       } else {
//         console.log('Something went wrong', error);
//         alert('Google login failed. Please try again.');
//       }
//     }
//   };

//   return (
//     <Pressable style={styles.socialButton} onPress={handleGoogleLogin}>
//       <Image
//         source={require('~/assets/icons/android_light.png')} // Google 로고 이미지
//         style={styles.googleIcon}
//       />
//       <Text style={styles.socialButtonText}>Continue with Google</Text>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   socialButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff', // 흰색 배경
//     borderRadius: 10,
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     width: '100%',
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.2)', // 연한 테두리
//   },
//   googleIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 10, // 아이콘과 텍스트 간 여백
//   },
//   socialButtonText: {
//     color: '#000', // 검정색 텍스트
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
