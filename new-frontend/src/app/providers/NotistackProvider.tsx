import { PropsWithChildren } from 'react';
import { SnackbarProvider } from 'notistack';
import SnackbarCloseButton from 'shared/components/snackbar/SnackbarCloseButton';
import SnackbarIcon from 'shared/components/snackbar/SnackbarIcon';

const NotistackProvider = ({ children }: PropsWithChildren) => {
  return (
    <SnackbarProvider
      maxSnack={10}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      iconVariant={{
        default: (
          <SnackbarIcon variant="default" icon="material-symbols:waving-hand-outline-rounded" />
        ),
        success: (
          <SnackbarIcon variant="success" icon="material-symbols:check-box-outline-rounded" />
        ),
        error: <SnackbarIcon variant="error" icon="material-symbols:info-outline-rounded" />,
        warning: <SnackbarIcon variant="warning" icon="material-symbols:warning-outline-rounded" />,
        info: <SnackbarIcon variant="info" icon="material-symbols:info-outline-rounded" />,
      }}
      action={(key) => <SnackbarCloseButton snackbarKey={key} />}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotistackProvider;
