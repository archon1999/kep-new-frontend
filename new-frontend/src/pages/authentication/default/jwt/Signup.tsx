import { useNavigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import paths, { rootPaths } from 'app/routes/paths';
import SignupForm, {
  SignupFormValues,
} from 'shared/components/sections/authentications/default/SignupForm';
import { useRegisterUser } from 'shared/services/swr/api-hooks/useAuthApi';

const Signup = () => {
  const { setSession } = useAuth();
  const { trigger: signup } = useRegisterUser();
  const navigate = useNavigate();

  const handleSignup = async (data: SignupFormValues) => {
    const res = await signup(data).catch((error) => {
      throw new Error(error.data.message);
    });
    if (res) {
      setSession(res.user, res.authToken);
      navigate(rootPaths.root);
    }
  };

  return <SignupForm handleSignup={handleSignup} loginLink={paths.defaultJwtLogin} />;
};

export default Signup;
