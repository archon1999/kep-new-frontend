import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ShopProduct } from 'modules/shop/domain/entities/product.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';

interface ShopProductCardProps {
  product: ShopProduct;
}

const ShopProductCard = ({ product }: ShopProductCardProps) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasImages = product.images.length > 0;
  const hasMultipleImages = product.images.length > 1;
  const currentImage = hasImages ? product.images[currentImageIndex] : undefined;

  const visibleThumbnails = useMemo(() => {
    const images = product.images;

    if (images.length <= 1) {
      return [];
    }

    if (images.length <= 3) {
      return images.map((image, index) => ({ image, index }));
    }

    const total = images.length;
    const indexes = [
      (currentImageIndex - 1 + total) % total,
      currentImageIndex,
      (currentImageIndex + 1) % total,
    ];

    return indexes.map((index) => ({ image: images[index], index }));
  }, [currentImageIndex, product.images]);

  const handlePrevious = () => {
    if (!hasMultipleImages) return;

    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNext = () => {
    if (!hasMultipleImages) return;

    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handleSelect = (index: number) => {
    if (!hasImages || index === currentImageIndex) return;

    setCurrentImageIndex(Math.max(0, Math.min(index, product.images.length - 1)));
  };

  const primaryColor = product.colors[0];
  const themeMode = useThemeMode();

  return (
    <Card
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        outline: 'none',
        bgcolor: themeMode.mode == 'light' ? 'grey.50' : 'grey.900',
        overflow: 'hidden',
      }}
      elevation={0}
    >
      <Box sx={{ position: 'relative', bgcolor: 'background.neutral', aspectRatio: '4 / 3' }}>
        {hasImages ? (
          <Box
            component="img"
            src={currentImage?.url}
            alt={currentImage?.name || product.title}
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
            }}
          />
        ) : (
          <Stack
            sx={{
              width: 1,
              height: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: 'text.secondary',
            }}
          >
            <KepIcon name="shop" fontSize={36} />
            <Typography variant="body2">{t('shop.noImage')}</Typography>
          </Stack>
        )}

        {hasImages && (
          <>
            <IconButton
              size="small"
              onClick={handlePrevious}
              disabled={!hasMultipleImages}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 12,
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(15, 23, 42, 0.45)',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'rgba(15, 23, 42, 0.7)',
                },
              }}
            >
              <IconifyIcon icon="mdi:chevron-left" />
            </IconButton>

            <IconButton
              size="small"
              onClick={handleNext}
              disabled={!hasMultipleImages}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 12,
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(15, 23, 42, 0.45)',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'rgba(15, 23, 42, 0.7)',
                },
              }}
            >
              <IconifyIcon icon="mdi:chevron-right" />
            </IconButton>

            {visibleThumbnails.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  p: 1.5,
                  bgcolor: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(6px)',
                  justifyContent: 'center',
                }}
              >
                {visibleThumbnails.map(({ image, index }) => (
                  <IconButton
                    key={`${image.url}-${index}`}
                    onClick={() => handleSelect(index)}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      border: (theme) =>
                        index === currentImageIndex
                          ? `2px solid ${theme.palette.primary.main}`
                          : '2px solid transparent',
                      overflow: 'hidden',
                      bgcolor: 'background.paper',
                      opacity: index === currentImageIndex ? 1 : 0.8,
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={image.url}
                      alt={image.name || product.title}
                      sx={{ width: 1, height: 1, objectFit: 'cover' }}
                    />
                  </IconButton>
                ))}
              </Stack>
            )}
          </>
        )}
      </Box>

      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={1}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {t('shop.colorLabel')}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {product.colors.map((color) => (
              <Box
                key={`${product.title}-${color.name}`}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'background.paper',
                  boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider}`,
                  bgcolor: color.color,
                }}
                title={color.name}
              />
            ))}
          </Stack>
        </Stack>

        {primaryColor?.sizes?.length ? (
          <Stack direction="row" spacing={1}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {t('shop.sizeLabel')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {primaryColor.sizes.map((size) => (
                <Chip label={size.name} color="primary" />
              ))}
            </Stack>
          </Stack>
        ) : null}

        <Box sx={{ mt: 'auto' }}>
          <KepcoinValue
            label={t('shop.kepcoinValue', { value: product.kepcoin })}
            iconSize={18}
            spacing={0.5}
            textVariant="body2"
            fontWeight={700}
            color="inherit"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export const ShopProductCardSkeleton = () => (
  <Card
    sx={{
      height: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      border: 'none',
      bgcolor: 'grey.50',
      overflow: 'hidden',
    }}
    elevation={0}
  >
    <Skeleton variant="rectangular" height={300} animation="wave" />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
      <Stack direction="row" spacing={1}>
        <Skeleton width="70%" height={24} />
        <Skeleton width="100%" height={18} />
        <Skeleton width="85%" height={18} />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" spacing={1}>
        <Skeleton width={60} height={16} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="circular" width={28} height={28} />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Skeleton width={40} height={16} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width={52} height={32} />
          <Skeleton variant="rounded" width={52} height={32} />
          <Skeleton variant="rounded" width={52} height={32} />
        </Stack>
      </Stack>

      <Skeleton variant="rounded" width={120} height={36} sx={{ mt: 'auto' }} />
    </CardContent>
  </Card>
);

export default ShopProductCard;
