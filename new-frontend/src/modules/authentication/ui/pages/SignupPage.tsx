import { useNavigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { authPaths, rootPaths } from 'app/routes/paths';
import SignupForm, { type SignupFormValues } from 'shared/components/sections/authentications/default/SignupForm';
import { useRegisterUser } from '../../application/mutations';

const SignupPage = () => {
  const { setCurrentUser } = useAuth();
  const { trigger: signup } = useRegisterUser();
  const navigate = useNavigate();

  const handleSignup = async (data: SignupFormValues) => {
    const res = await signup(data).catch((error) => {
      throw new Error((error as any)?.data?.message || (error as Error).message);
    });
    if (res) {
      setCurrentUser(res);
      navigate(rootPaths.root);
    }
  };

  return <SignupForm handleSignup={handleSignup} loginLink={authPaths.login} />;
};

export default SignupPage;
