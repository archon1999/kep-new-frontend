import ForgotPasswordForm from 'shared/components/sections/authentications/default/ForgotPasswordForm';
import type { ForgotPasswordFormValues } from 'shared/components/sections/authentications/default/ForgotPasswordForm';
import { useSendPasswordResetLink } from '../../application/mutations';

const ForgotPasswordPage = () => {
  const { trigger: sendResetLink } = useSendPasswordResetLink();

  const handleSendResetLink = async (data: ForgotPasswordFormValues) => {
    return await sendResetLink(data).catch((error) => {
      throw new Error((error as any)?.data?.message || (error as Error).message);
    });
  };

  return <ForgotPasswordForm handleSendResetLink={handleSendResetLink} />;
};

export default ForgotPasswordPage;
