import { Alert, Box, Breadcrumbs, Grid, Link, Skeleton, Stack, Typography } from '@mui/material';
import { rootPaths } from 'app/routes/paths';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import KepIcon from 'shared/components/base/KepIcon';
import ProductCard from './components/ProductCard';
import { useGetProducts } from 'shared/services/swr/api-hooks/useShopApi';

const ShopSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={`shop-skeleton-${index}`}>
          <Stack spacing={1.5}>
            <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
            <Skeleton variant="text" width="80%" height={28} />
            <Skeleton variant="text" width="60%" />
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

const ShopPage = () => {
  const { t } = useTranslation();
  const { data: products, isLoading, error } = useGetProducts();

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1.25}>
          <Breadcrumbs aria-label={t('shopPage.title')}>
            <Link component={RouterLink} underline="hover" color="inherit" to={rootPaths.root}>
              {t('home')}
            </Link>
            <Typography color="text.primary" variant="body2">
              {t('shopPage.title')}
            </Typography>
          </Breadcrumbs>

          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="shop" sx={{ fontSize: 26, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              {t('shopPage.title')}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {t('shopPage.subtitle')}
          </Typography>
        </Stack>

        {error && <Alert severity="error">{t('shopPage.error')}</Alert>}

        {isLoading ? (
          <ShopSkeleton />
        ) : products && products.length ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.title}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('shopPage.empty')}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default ShopPage;
