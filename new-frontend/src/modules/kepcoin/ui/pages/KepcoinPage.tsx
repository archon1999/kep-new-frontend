import { SyntheticEvent, useMemo, useState } from 'react';
import { Box, Chip, Container, Divider, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import KepIcon from 'shared/components/base/KepIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import { useKepcoinContent } from '../../application/queries';

type TransactionView = 'earns' | 'spends';

const KepcoinPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [transactionView, setTransactionView] = useState<TransactionView>('earns');
  const { summary, transactions, guides } = useKepcoinContent();

  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);

  const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );

  const handleTabChange = (_: SyntheticEvent, value: TransactionView) => setTransactionView(value);

  const renderGuideItems = (items: typeof guides.earn) => (
    <Stack spacing={1.25} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
      {items.map((item) => (
        <Stack
          key={item.id}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
        >
          <KepcoinValue label={item.value} fontWeight={600} textVariant="body2" />
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            {t(item.labelKey)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  const selectedTransactions = transactions[transactionView] ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={{ xs: 4, md: 6 }}>
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  {t('kepcoinPage.header')}
                </Typography>
                <KepcoinValue
                  label={numberFormatter.format(summary.balance)}
                  textVariant="h3"
                  fontWeight={700}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinPage.subtitle')}
              </Typography>
            </Stack>

            <Box
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Stack spacing={2.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  >
                    <KepIcon name="streak-freeze" fontSize={30} />
                  </Box>
                  <Stack spacing={0.5} flex={1}>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {t('kepcoinPage.freeze.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.freeze.description')}
                    </Typography>
                  </Stack>
                  <Chip
                    label={t('kepcoinPage.freeze.chips', { value: summary.streakFreeze })}
                    color="info"
                    variant="filled"
                    sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                  />
                </Stack>

                <Divider />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.freeze.labels.streak')}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                      {summary.streak}
                    </Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.freeze.labels.freezes')}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                      {summary.streakFreeze}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {t('kepcoinPage.transactions.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.transactions.subtitle')}
                    </Typography>
                  </Stack>
                  <Tabs
                    value={transactionView}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab label={t('kepcoinPage.transactions.earns')} value="earns" />
                    <Tab label={t('kepcoinPage.transactions.spends')} value="spends" />
                  </Tabs>
                </Stack>

                <Divider />

                {selectedTransactions.length ? (
                  <Stack spacing={2.5} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
                    {selectedTransactions.map((transaction) => {
                      const amountLabel = `${
                        transactionView === 'earns' ? '+' : '-'
                      }${numberFormatter.format(transaction.amount)}`;

                      return (
                        <Stack key={transaction.id} spacing={1.25}>
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            justifyContent="space-between"
                            alignItems={{ sm: 'center' }}
                          >
                            <KepcoinValue
                              label={amountLabel}
                              fontWeight={700}
                              textVariant="h6"
                              color={transactionView === 'earns' ? 'success' : 'error'}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {formatDateTime(transaction.datetime)}
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                            {transaction.title}
                          </Typography>
                          {transaction.description && (
                            <Typography variant="body2" color="text.secondary">
                              {transaction.description}
                            </Typography>
                          )}
                        </Stack>
                      );
                    })}
                  </Stack>
                ) : (
                  <Stack spacing={0.5} textAlign="center" py={5}>
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                      {t(`kepcoinPage.transactions.empty.${transactionView}.title`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(`kepcoinPage.transactions.empty.${transactionView}.subtitle`)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack spacing={3} divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 72, height: 72 }} />
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {t('kepcoinPage.guides.earn.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('kepcoinPage.guides.earn.description')}
                    </Typography>
                  </Stack>
                </Stack>
                {renderGuideItems(guides.earn)}
              </Stack>

              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {t('kepcoinPage.guides.spend.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('kepcoinPage.guides.spend.description')}
                </Typography>
                {renderGuideItems(guides.spend)}
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default KepcoinPage;
