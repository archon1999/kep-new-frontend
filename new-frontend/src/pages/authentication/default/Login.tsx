import { useNavigate } from 'react-router';
import { defaultAuthCredentials } from 'app/config.ts';
import { useAuth } from 'app/providers/AuthProvider';
import paths, { rootPaths } from 'app/routes/paths';
import LoginForm, {
  LoginFormValues,
} from 'shared/components/sections/authentications/default/LoginForm';
import { useLoginUser } from 'shared/services/swr/api-hooks/useAuthApi';

const Login = () => {
  const { updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { trigger: login } = useLoginUser();
  const handleLogin = async (data: LoginFormValues) => {
    const res = await login(data).catch((error) => {
      throw new Error(error.data.message);
    });
    if (res) {
      updateCurrentUser(res);
      navigate(rootPaths.root);
    }
  };
  return (
    <LoginForm
      handleLogin={handleLogin}
      signUpLink={paths.authSignup}
      forgotPasswordLink={paths.authForgotPassword}
      defaultCredential={defaultAuthCredentials}
    />
  );
};

export default Login;
