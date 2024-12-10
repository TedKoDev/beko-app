import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function () {
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // 이것은  Google API의 범위를 나타냅니다. 여기서는 Google 드라이브를 읽기 전용으로 사용하겠습니다.
    webClientId: '1036338973947-7knkhndugs72n9m23c1raksarkec8ugo.apps.googleusercontent.com', // [Android] 클라이언트 ID를
    iosClientId: '1036338973947-dpf6mgoahom2r6e9qm2flsbog29c8me0.apps.googleusercontent.com', // [iOS] 클라이언트 ID를
  });

  return (
    <GoogleSigninButton
      style={{ width: 240, height: 48 }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log(JSON.stringify(userInfo, null, 2));
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User cancelled the login flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Sign in is in progress');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play services not available or outdated');
          } else {
            console.log('Something went wrong', error);
          }
        }
      }}
    />
  );
}
