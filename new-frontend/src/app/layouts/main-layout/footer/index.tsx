import { Box, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const Footer = () => {
  const techIcons = [
    { icon: 'logos:python', label: 'Python' },
    { icon: 'logos:django-icon', label: 'Django' },
    { icon: 'logos:react', label: 'React' },
    { icon: 'logos:material-ui', label: 'MUI' },
  ];

  return (
    <>
      <Divider />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={[
          {
            columnGap: 2,
            bgcolor: 'background.default',
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            height: ({ mixins }) => mixins.footer,
            py: 1,
            px: { xs: 3, md: 5 },
            textAlign: { xs: 'center', sm: 'left' },
            rowGap: 1,
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
          }}
        >
          KEP.uz © {dayjs().year()}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          columnGap={1}
          rowGap={0.5}
        >
          <Typography variant="caption" component="span" color="text.secondary">
            Powered by
          </Typography>

          {techIcons.map(({ icon, label }) => (
            <IconifyIcon key={icon} icon={icon} title={label} width={22} height={22} />
          ))}

          <Box
            component="img"
            src="/aurora.svg"
            alt="Aurora"
            sx={{ height: 20, width: 20, objectFit: 'contain' }}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default Footer;
