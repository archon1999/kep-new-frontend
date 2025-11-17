import { useAuth } from 'app/providers/AuthProvider';
import paths from 'app/routes/paths';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import SignupForm, {
  SignupFormValues,
} from 'shared/components/sections/authentications/default/SignupForm';
import { firebaseAuth } from 'shared/services/firebase/firebase';

const Signup = () => {
  const { setSession } = useAuth();

  const handleSignup = async (data: SignupFormValues) => {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      data.email,
      data.password,
    );

    if (userCredential) {
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
          displayName: data.name,
        });
      }
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
    }
  };

  return (
    <SignupForm
      provider="firebase"
      handleSignup={handleSignup}
      loginLink={paths.defaultFirebaseLogin}
    />
  );
};

export default Signup;
