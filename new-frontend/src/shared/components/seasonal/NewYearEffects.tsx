import { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';

interface Snowflake {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  blur: number;
}

interface GarlandBulb {
  color: string;
  delay: number;
  duration: number;
  offset: number;
}

interface Sparkle {
  left: number;
  top: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

const SNOWFLAKE_COUNT = 70;
const GARLAND_BULB_COUNT = 18;
const SPARKLE_COUNT = 14;

const NewYearEffects = () => {
  const {
    config: { showHolidayEffects },
  } = useSettingsContext();
  const theme = useTheme();

  const garlandPalette = useMemo(
    () => [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
    ],
    [theme],
  );

  const snowflakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: SNOWFLAKE_COUNT }, (_) => ({
      left: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 6 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.35,
      drift: Math.random() * 40 - 20,
      blur: Math.random() * 1.5,
    }));
  }, []);

  const garlandBulbs = useMemo<GarlandBulb[]>(() => {
    return Array.from({ length: GARLAND_BULB_COUNT }, (_, index) => ({
      color: garlandPalette[index % garlandPalette.length],
      delay: (index % 4) * 0.2 + Math.random() * 0.6,
      duration: 1.8 + Math.random() * 1.2,
      offset: (index % 2 === 0 ? 2 : 8) + Math.random() * 6,
    }));
  }, [garlandPalette]);

  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: SPARKLE_COUNT }, (_, index) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 16 + 10,
      color: garlandPalette[(index + 1) % garlandPalette.length],
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 3,
    }));
  }, [garlandPalette]);

  if (!showHolidayEffects) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: (muiTheme) => muiTheme.zIndex.appBar + 1,
        '@keyframes snow-fall': {
          '0%': { transform: 'translate3d(0, -10%, 0)', opacity: 'var(--snow-opacity, 0.9)' },
          '100%': { transform: 'translate3d(var(--snow-drift, 0px), 110vh, 0)', opacity: 0.1 },
        },
        '@keyframes garland-twinkle': {
          '0%': { filter: 'brightness(0.65) drop-shadow(0 0 6px currentColor)' },
          '100%': { filter: 'brightness(1.2) drop-shadow(0 0 12px currentColor)' },
        },
        '@keyframes sparkle-pulse': {
          '0%': { transform: 'scale(0.85)', opacity: 0.65 },
          '50%': { transform: 'scale(1.08)', opacity: 1 },
          '100%': { transform: 'scale(0.85)', opacity: 0.65 },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: { xs: 96, md: 112 },
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: { xs: 2, md: 6 },
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 26,
            left: '2%',
            right: '2%',
            height: 3,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent 0%, ${theme.palette.info.light} 12%, ${theme.palette.primary.main} 45%, ${theme.palette.success.light} 70%, transparent 100%)`,
            opacity: 0.38,
            boxShadow: `0 6px 18px rgba(0, 0, 0, 0.18)`,
          }}
        />

        {garlandBulbs.map((bulb, index) => (
          <Box
            key={`${bulb.color}-${index}`}
            sx={{
              width: 14,
              height: 18,
              borderRadius: '0 0 12px 12px',
              backgroundColor: bulb.color,
              boxShadow: `0 0 14px 2px ${bulb.color}`,
              transform: `translateY(${bulb.offset}px) rotate(-2deg)`,
              animation: `${bulb.duration}s ease-in-out ${bulb.delay}s infinite alternate garland-twinkle`,
              opacity: 0.86,
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        {snowflakes.map((snowflake, index) => (
          <Box
            key={`${snowflake.left}-${index}`}
            component="span"
            sx={{
              position: 'absolute',
              top: '-10%',
              left: `${snowflake.left}%`,
              width: snowflake.size,
              height: snowflake.size,
              backgroundColor: theme.palette.common.white,
              borderRadius: '50%',
              opacity: snowflake.opacity,
              filter: `blur(${snowflake.blur}px)`,
              animation: `${snowflake.duration}s linear ${snowflake.delay}s infinite snow-fall`,
              transform: 'translate3d(0, 0, 0)',
              mixBlendMode: 'screen',
              '--snow-drift': `${snowflake.drift}px`,
              '--snow-opacity': snowflake.opacity,
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
        }}
      >
        {sparkles.map((sparkle, index) => (
          <Box
            key={`${sparkle.left}-${sparkle.top}-${index}`}
            sx={{
              position: 'absolute',
              top: `${sparkle.top}%`,
              left: `${sparkle.left}%`,
              width: sparkle.size,
              height: sparkle.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${sparkle.color} 0%, rgba(255,255,255,0.8) 60%, transparent 70%)`,
              animation: `${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite sparkle-pulse`,
              opacity: 0.45,
              filter: 'blur(0.2px)',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default NewYearEffects;
