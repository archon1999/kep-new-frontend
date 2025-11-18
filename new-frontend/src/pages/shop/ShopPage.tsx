import { Alert, Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import { useShopProducts } from 'modules/shop/application/queries';
import ShopProductCard, { ShopProductCardSkeleton } from './components/ShopProductCard';

const ShopPage = () => {
  const { t } = useTranslation();
  const { data: products, isLoading, error } = useShopProducts();

  const showEmptyState = !isLoading && !products?.length && !error;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {t('shop.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('shop.subtitle')}
          </Typography>
        </Stack>

        {error ? (
          <Alert severity="error" variant="outlined">
            {t('shop.loadError')}
          </Alert>
        ) : null}

        {showEmptyState ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              borderRadius: 3,
              border: (theme) => `1px dashed ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('shop.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('shop.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <Grid key={`shop-skeleton-${index}`} xs={4} sm={4} md={3}>
                    <ShopProductCardSkeleton />
                  </Grid>
                ))
              : products?.map((product) => (
                  <Grid key={product.title} xs={4} sm={4} md={3}>
                    <ShopProductCard product={product} />
                  </Grid>
                ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default ShopPage;
