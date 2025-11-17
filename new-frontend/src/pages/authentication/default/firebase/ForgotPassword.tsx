import { sendPasswordResetEmail } from 'firebase/auth';
import ForgotPasswordForm from 'shared/components/sections/authentications/default/ForgotPasswordForm';
import { firebaseAuth } from 'shared/services/firebase/firebase';

const ForgotPassword = () => {
  const handleSendResetLink = async ({ email }: { email: string }) => {
    return await sendPasswordResetEmail(firebaseAuth, email).catch((error) => {
      throw new Error(error.message);
    });
  };

  return <ForgotPasswordForm provider="firebase" handleSendResetLink={handleSendResetLink} />;
};

export default ForgotPassword;
