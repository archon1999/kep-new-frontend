import { useNavigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { rootPaths } from 'app/routes/paths';
import { defaultAuthCredentials } from 'app/config.ts';
import LoginForm, {
  LoginFormValues,
} from 'shared/components/sections/authentications/default/LoginForm';
import { useLoginUser } from 'shared/services/swr/api-hooks/useAuthApi';

const Login = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { trigger: login } = useLoginUser();
  const handleLogin = async (data: LoginFormValues) => {
    const res = await login(data).catch((error) => {
      throw new Error(error.data.message);
    });
    if (res) {
      setCurrentUser(res);
      navigate(rootPaths.root);
    }
  };
  return (
    <LoginForm
      handleLogin={handleLogin}
      defaultCredential={defaultAuthCredentials}
    />
  );
};

export default Login;
