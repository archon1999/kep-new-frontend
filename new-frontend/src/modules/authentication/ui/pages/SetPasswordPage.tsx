import SetPasswordForm, {
  type SetPasswordFormValues,
} from 'shared/components/sections/authentications/default/SetPassworForm';
import { useSetPassword } from '../../application/mutations';

const SetPasswordPage = () => {
  const { trigger: setPassword } = useSetPassword();

  const handleSetPassword = async (data: SetPasswordFormValues) => {
    return await setPassword(data).catch((error) => {
      throw new Error((error as any)?.data?.message || (error as Error).message);
    });
  };

  return <SetPasswordForm handleSetPassword={handleSetPassword} />;
};

export default SetPasswordPage;
