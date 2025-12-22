import { useMemo } from 'react';
import { Box, Portal, useTheme } from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import { useSettingsContext } from 'app/providers/SettingsProvider';

type Snowflake = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
};

type Sparkle = {
  left: number;
  top: number;
  delay: number;
  duration: number;
  scale: number;
};

const snowfall = keyframes`
  0% {
    transform: translate3d(0, -10%, 0) translateX(var(--drift, 0px));
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  100% {
    transform: translate3d(0, 110vh, 0) translateX(calc(var(--drift, 0px) * -1));
    opacity: 0;
  }
`;

const garlandGlow = keyframes`
  0%, 100% {
    opacity: 0.6;
    filter: drop-shadow(0 0 3px currentColor);
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 10px currentColor);
  }
`;

const twinkle = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 0.8;
    transform: scale(var(--scale, 1));
  }
  60% {
    opacity: 1;
    transform: scale(calc(var(--scale, 1) * 1.1));
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
`;

const auroraPulse = keyframes`
  0% {
    opacity: 0.18;
  }
  50% {
    opacity: 0.32;
  }
  100% {
    opacity: 0.18;
  }
`;

const createSnowflakes = (count: number): Snowflake[] =>
  Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 12 + Math.random() * 10,
    size: 4 + Math.random() * 7,
    drift: (Math.random() - 0.5) * 40,
    opacity: 0.35 + Math.random() * 0.5,
  }));

const createSparkles = (count: number): Sparkle[] =>
  Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 4,
    scale: 0.6 + Math.random() * 1.4,
  }));

const FestiveEffects = () => {
  const {
    config: { festiveEffectsEnabled },
  } = useSettingsContext();
  const theme = useTheme();

  const snowflakes = useMemo(() => createSnowflakes(70), []);
  const sparkles = useMemo(() => createSparkles(30), []);

  if (!festiveEffectsEnabled) return null;

  const garlandColors = [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.error.main,
  ];

  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: (muiTheme) => muiTheme.zIndex.appBar + 1,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(120% 60% at 10% 0%, ${alpha(
              theme.palette.info.light,
              0.35,
            )} 0%, transparent 45%),
              radial-gradient(80% 50% at 90% 0%, ${alpha(
                theme.palette.primary.main,
                0.3,
              )} 0%, transparent 50%),
              radial-gradient(60% 40% at 50% 100%, ${alpha(
                theme.palette.warning.main,
                0.2,
              )} 0%, transparent 55%)`,
            mixBlendMode: 'screen',
            animation: `${auroraPulse} 10s ease-in-out infinite`,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 6,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'flex-start',
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 0,
              width: '100%',
              height: 2,
              background: `linear-gradient(90deg, ${alpha(
                theme.palette.primary.main,
                0.65,
              )}, ${alpha(theme.palette.info.light, 0.5)}, ${alpha(
                theme.palette.warning.main,
                0.6,
              )})`,
              opacity: 0.5,
              filter: `drop-shadow(0 4px 10px ${alpha(theme.palette.common.black, 0.3)})`,
            }}
          />
          {Array.from({ length: 18 }).map((_, index) => (
            <Box
              key={`garland-${index}`}
              sx={{
                width: { xs: 12, sm: 14, md: 16 },
                height: { xs: 12, sm: 14, md: 16 },
                borderRadius: '50%',
                backgroundColor: garlandColors[index % garlandColors.length],
                animation: `${garlandGlow} 2.4s ease-in-out infinite`,
                animationDelay: `${index * 0.12}s`,
                boxShadow: `0 6px 14px ${alpha(
                  garlandColors[index % garlandColors.length],
                  0.45,
                )}`,
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
          {snowflakes.map((flake, index) => (
            <Box
              key={`snowflake-${index}`}
              sx={{
                position: 'absolute',
                top: '-10%',
                left: `${flake.left}%`,
                width: flake.size,
                height: flake.size,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(
                  theme.palette.common.white,
                  0.95,
                )} 0%, ${alpha(theme.palette.common.white, 0.4)} 60%, transparent 70%)`,
                animation: `${snowfall} ${flake.duration}s linear ${flake.delay}s infinite`,
                opacity: flake.opacity,
                '--drift': `${flake.drift}px`,
                boxShadow: `0 0 6px ${alpha(theme.palette.info.light, 0.35)}`,
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
              key={`sparkle-${index}`}
              sx={{
                position: 'absolute',
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
                width: 2 + sparkle.scale * 5,
                height: 2 + sparkle.scale * 5,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(
                  theme.palette.common.white,
                  0.8,
                )}, transparent 55%)`,
                animation: `${twinkle} ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
                '--scale': sparkle.scale,
                boxShadow: `0 0 12px ${alpha(theme.palette.primary.light, 0.35)}`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Portal>
  );
};

export default FestiveEffects;
