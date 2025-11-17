import { useNavigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import paths, { rootPaths } from 'app/routes/paths';
import { defaultJwtAuthCredentials } from 'config';
import LoginForm, {
  LoginFormValues,
} from 'shared/components/sections/authentications/default/LoginForm';
import { useLoginUser } from 'shared/services/swr/api-hooks/useAuthApi';

const Login = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const { trigger: login } = useLoginUser();
  const handleLogin = async (data: LoginFormValues) => {
    const res = await login(data).catch((error) => {
      throw new Error(error.data.message);
    });
    if (res) {
      setSession(res.user, res.authToken);
      navigate(rootPaths.root);
    }
  };
  return (
    <LoginForm
      handleLogin={handleLogin}
      signUpLink={paths.defaultJwtSignup}
      forgotPasswordLink={paths.defaultJwtForgotPassword}
      defaultCredential={defaultJwtAuthCredentials}
    />
  );
};

export default Login;
