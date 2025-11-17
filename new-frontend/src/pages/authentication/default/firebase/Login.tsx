import { useNavigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import paths, { rootPaths } from 'app/routes/paths';
import { defaultJwtAuthCredentials } from 'config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginForm, {
  LoginFormValues,
} from 'shared/components/sections/authentications/default/LoginForm';
import { firebaseAuth } from 'shared/services/firebase/firebase';

const Login = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const handleLogin = async (data: LoginFormValues) => {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      data.email,
      data.password,
    ).catch((error) => {
      console.log({ error });
    });

    if (userCredential) {
      const user = userCredential.user;
      setSession(
        {
          id: user.uid,
          name: user.displayName as string,
          email: user.email as string,
          avatar: user.photoURL,
        },
        //@ts-ignore
        user.accessToken,
      );
      navigate(rootPaths.root);
    }
  };

  return (
    <LoginForm
      provider="firebase"
      handleLogin={handleLogin}
      signUpLink={paths.defaultFirebaseSignup}
      forgotPasswordLink={paths.defaultFirebaseForgotPassword}
      defaultCredential={defaultJwtAuthCredentials}
    />
  );
};

export default Login;
