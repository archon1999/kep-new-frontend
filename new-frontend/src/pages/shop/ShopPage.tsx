import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { useShopProducts } from 'modules/shop/application/queries';
import ShopProductCard, { ShopProductCardSkeleton } from './components/ShopProductCard';

const ShopPage = () => {
  const { t } = useTranslation();
  const { data: products, isLoading, error } = useShopProducts();

  const showEmptyState = !isLoading && !products?.length && !error;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          {t('shop.title')}
        </Typography>

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
          <Box
            display="grid"
            gap={3}
            sx={{
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
            }}
          >
            {isLoading
              ? Array.from({ length: 8 }).map((_, idx) => <ShopProductCardSkeleton key={idx} />)
              : products?.map((product) => (
                  <ShopProductCard key={product.title} product={product} />
                ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ShopPage;
