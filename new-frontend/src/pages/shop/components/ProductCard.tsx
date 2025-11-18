import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import { Product } from 'app/types/shop';
import KepIcon from 'shared/components/base/KepIcon';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Image from 'shared/components/base/Image';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images || [];
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  const sizes = product.colors?.[0]?.sizes || [];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  const visibleThumbnails = useMemo(() => {
    if (images.length <= 1) return [];
    if (images.length <= 3) return images.map((image, index) => ({ index, image }));

    const total = images.length;
    const orderedIndexes = [
      (currentImageIndex - 1 + total) % total,
      currentImageIndex,
      (currentImageIndex + 1) % total,
    ];

    return orderedIndexes.map((index) => ({ index, image: images[index] }));
  }, [currentImageIndex, images]);

  const handlePrevious = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleSelect = (index: number) => {
    if (!hasMultipleImages || index === currentImageIndex) return;
    setCurrentImageIndex(Math.max(0, Math.min(index, images.length - 1)));
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: (theme) => theme.shadows[3],
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        {hasImages ? (
          <Box
            sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'background.default',
            }}
          >
            <Image
              src={images[currentImageIndex]?.url}
              alt={images[currentImageIndex]?.name || product.title}
              sx={{
                width: 1,
                height: { xs: 220, sm: 260, md: 300 },
                objectFit: 'cover',
              }}
            />

            <IconButton
              onClick={handlePrevious}
              disabled={!hasMultipleImages}
              sx={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: 12,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'common.white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <IconifyIcon icon="solar:alt-arrow-left-bold" />
            </IconButton>

            <IconButton
              onClick={handleNext}
              disabled={!hasMultipleImages}
              sx={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: 12,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'common.white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <IconifyIcon icon="solar:alt-arrow-right-bold" />
            </IconButton>

            {visibleThumbnails.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 12,
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(0,0,0,0.6)',
                  borderRadius: 999,
                  p: 0.75,
                  backdropFilter: 'blur(4px)',
                }}
              >
                {visibleThumbnails.map((thumbnail) => (
                  <IconButton
                    key={thumbnail.index}
                    onClick={() => handleSelect(thumbnail.index)}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      border: (theme) =>
                        `2px solid ${
                          thumbnail.index === currentImageIndex
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                      bgcolor: 'background.paper',
                      overflow: 'hidden',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Image
                      src={thumbnail.image.url}
                      alt={thumbnail.image.name || product.title}
                      sx={{ width: 1, height: 1, objectFit: 'cover' }}
                    />
                  </IconButton>
                ))}
              </Stack>
            )}
          </Box>
        ) : (
          <Stack
            spacing={1}
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              height: { xs: 220, sm: 260, md: 300 },
              borderRadius: 3,
              bgcolor: 'background.elevation1',
              color: 'text.secondary',
            }}
          >
            <IconifyIcon icon="mdi:image-off-outline" style={{ fontSize: 32 }} />
            <Typography variant="body2">{t('shopPage.noImage')}</Typography>
          </Stack>
        )}
      </Box>

      <CardContent sx={{ pt: 0, display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
            {product.title}
          </Typography>
          {product.description && (
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
          )}
        </Stack>

        <Stack spacing={1.5}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {t('shopPage.colors')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {product.colors.length ? (
                product.colors.map((color) => (
                  <Tooltip title={color.name} key={color.name}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: color.color,
                      }}
                    />
                  </Tooltip>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('shopPage.colorsUnavailable')}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {t('shopPage.sizes')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {sizes.length ? (
                sizes.map((size) => (
                  <Chip key={size.name} label={size.name} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('shopPage.sizesUnavailable')}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Divider />

        <Stack direction="row" alignItems="center" spacing={1}>
          <KepIcon name="kepcoin" sx={{ fontSize: 24, color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1 }}>
            {t('shopPage.kepcoinValue', { value: product.kepcoin })}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
