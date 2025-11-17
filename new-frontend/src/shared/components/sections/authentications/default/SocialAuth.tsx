import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { rootPaths } from 'app/routes/paths';
import { OAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'shared/components/base/Image';
import { firebaseAuth, googleProvider, microsoftProvider } from 'shared/services/firebase/firebase';

const SocialAuth = () => {
  const navigate = useNavigate();
  const {
    config: { assetsDir },
  } = useSettingsContext();

  return (
    <Grid
      container
      spacing={2}
      sx={{
        alignItems: 'center',
      }}
    >
      <Grid
        size={{
          xs: 12,
          lg: 6,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="neutral"
          size="large"
          sx={{ flex: 1, whiteSpace: 'nowrap' }}
          startIcon={
            <Image src={`${assetsDir}/images/logo/1.svg`} height={21} width={21} alt="icon" />
          }
          onClick={async () => {
            await signInWithPopup(firebaseAuth, googleProvider);
            navigate(rootPaths.root);
          }}
        >
          Sign in with google
        </Button>
      </Grid>
      <Grid
        size={{
          xs: 12,
          lg: 6,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="neutral"
          size="large"
          sx={{ flex: 1, whiteSpace: 'nowrap' }}
          startIcon={
            <Image src={`${assetsDir}/images/logo/2.svg`} height={21} width={21} alt="icon" />
          }
          onClick={async () => {
            const res = await signInWithPopup(firebaseAuth, microsoftProvider);
            console.log({ res });
            const credential = OAuthProvider.credentialFromResult(res);
            console.log({ credential });
          }}
        >
          Sign in with Microsoft
        </Button>
      </Grid>
    </Grid>
  );
};

export default SocialAuth;
