import { Box, Divider, Stack, Typography } from '@mui/material';

import IconifyIcon from 'shared/components/base/IconifyIcon';

const Footer = () => {
  return (
    <>
      <Divider />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={[
          {
            columnGap: 2,
            rowGap: 0.5,
            bgcolor: 'background.default',
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            height: ({ mixins }) => mixins.footer,
            py: 1,
            px: { xs: 3, md: 5 },
            textAlign: { xs: 'center', sm: 'left' },
          },
        ]}
      >
        <Typography
          variant="caption"
          component="p"
          sx={{
            lineHeight: 1.6,
            fontWeight: 'light',
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          KEP.uz ©
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          flexWrap="wrap"
          justifyContent={{ xs: 'center', sm: 'flex-end' }}
        >
          <Typography
            variant="caption"
            component="p"
            sx={{
              fontWeight: 'light',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            Powered by
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap" rowGap={1}>
            <IconifyIcon icon="logos:python" width={24} />
            <IconifyIcon icon="devicon:django" width={24} />
            <IconifyIcon icon="logos:react" width={24} />
            <IconifyIcon icon="logos:material-ui" width={24} />
            <Box component="img" src="/aurora.svg" alt="Aurora logo" sx={{ height: 20 }} />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Footer;
