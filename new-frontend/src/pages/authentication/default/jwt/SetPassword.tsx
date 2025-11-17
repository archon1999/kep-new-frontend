import SetPasswordForm, {
  SetPasswordFormValues,
} from 'shared/components/sections/authentications/default/SetPassworForm';
import { useSetPassword } from 'shared/services/swr/api-hooks/useAuthApi';

const SetPassword = () => {
  const { trigger: setPassword } = useSetPassword();

  const handleSetPassword = async (data: SetPasswordFormValues) => {
    return await setPassword(data).catch((error) => {
      throw new Error(error.data.message);
    });
  };

  return <SetPasswordForm handleSetPassword={handleSetPassword} />;
};

export default SetPassword;
