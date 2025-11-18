import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { useCalendarEvents } from 'modules/calendar/application/queries';
import CalendarEventCard from './components/CalendarEventCard';
import CalendarEventCardSkeleton from './components/CalendarEventCardSkeleton';

const CalendarPage = () => {
  const { t } = useTranslation();
  const { data: events, isLoading, error } = useCalendarEvents();

  const orderedEvents = useMemo(
    () =>
      [...(events ?? [])].sort((a, b) => {
        const firstDate = a.startTime ? new Date(a.startTime).getTime() : 0;
        const secondDate = b.startTime ? new Date(b.startTime).getTime() : 0;

        if (firstDate === secondDate) return (b.uid || 0) - (a.uid || 0);
        return firstDate - secondDate;
      }),
    [events],
  );

  const showEmptyState = !isLoading && !orderedEvents.length && !error;

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {t('calendar.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('calendar.subtitle')}
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" variant="outlined">
            {t('calendar.error')}
          </Alert>
        )}

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
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              {t('calendar.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('calendar.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Box
            display="grid"
            gap={2.5}
            sx={{
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
            }}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => <CalendarEventCardSkeleton key={idx} />)
              : orderedEvents.map((event) => <CalendarEventCard key={`${event.uid}-${event.type}`} event={event} />)}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default CalendarPage;
