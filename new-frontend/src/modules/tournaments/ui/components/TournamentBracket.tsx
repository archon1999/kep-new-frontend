import { useEffect, useRef } from 'react';
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'brackets-viewer/dist/brackets-viewer.min.css';
import { TournamentDetail } from '../../domain/entities/tournament.entity';
import { useTournamentBracket } from '../../application/queries';

const SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/brackets-viewer/dist/brackets-viewer.min.js';

declare global {
  interface Window {
    bracketsViewer?: any;
  }
}

const loadBracketsViewer = async () => {
  if (window.bracketsViewer) {
    return window.bracketsViewer;
  }

  const existingScript = document.querySelector(`script[src="${SCRIPT_SRC}"]`) as HTMLScriptElement | null;
  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(), { once: true });
    });
    return window.bracketsViewer;
  }

  const script = document.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;

  await new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });

  return window.bracketsViewer;
};

interface TournamentBracketProps {
  tournament?: TournamentDetail | null;
}

const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data: bracketData, isLoading } = useTournamentBracket(tournament ?? undefined);

  useEffect(() => {
    let active = true;

    const renderBracket = async () => {
      if (!bracketData || !tournament || !containerRef.current) return;
      const viewer = await loadBracketsViewer();
      if (!viewer || !active) return;

      viewer.render(
        {
          stages: bracketData.stages,
          matches: bracketData.matches,
          matchGames: bracketData.matchGames,
          participants: bracketData.participants,
        },
        {
          selector: '#tournament-bracket',
          clear: true,
        },
      );

      if (typeof viewer.setParticipantImages === 'function') {
        viewer.setParticipantImages(bracketData.participantImages);
      }
    };

    renderBracket();

    return () => {
      active = false;
    };
  }, [bracketData, tournament]);

  return (
    <Card background={1} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              {t('tournaments.resultsTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('tournaments.knockoutHint')}
            </Typography>
          </Stack>

          {isLoading ? (
            <Skeleton variant="rounded" height={320} />
          ) : (
            <Box
              id="tournament-bracket"
              ref={containerRef}
              className="brackets-viewer"
              sx={{ width: '100%', overflowX: 'auto' }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentBracket;
