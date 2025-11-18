import ForgotPasswordForm from 'shared/components/sections/authentications/default/ForgotPasswordForm';
import { useSendPasswordResetLink } from 'shared/services/swr/api-hooks/useAuthApi';

const ForgotPassword = () => {
  const { trigger: sendResetLink } = useSendPasswordResetLink();

  const handleSendResetLink = async (data: { email: string }) => {
    return await sendResetLink(data).catch((error) => {
      throw new Error(error.data.message);
    });
  };

  return <ForgotPasswordForm handleSendResetLink={handleSendResetLink} />;
};

export default ForgotPassword;
