import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { ProblemDetail } from '../../../domain/entities/problem.entity';

interface HtmlPlaygroundProps {
  problem: ProblemDetail;
  frameHeight?: number;
  frameWidth?: number;
  storageKey?: string;
}

const HtmlPlayground = ({
  problem,
  frameHeight = 260,
  frameWidth = 320,
  storageKey,
}: HtmlPlaygroundProps) => {
  const [html, setHtml] = useState('');
  const [outputWidth, setOutputWidth] = useState(100);

  const key = storageKey ?? `problem-${problem.id}-html-playground`;

  useEffect(() => {
    const initial =
      (localStorage.getItem(key) as string | null) ||
      problem.availableLanguages?.[0]?.codeTemplate ||
      problem.body ||
      '';
    setHtml(initial);
  }, [key, problem.availableLanguages, problem.body]);

  const outputHtml = useMemo(() => {
    const sanitized = html.replace(/<\s*img/gi, '<imga');
    return `
      <html style="height: 100%; width: 100%;">
        <body style="overflow: hidden; height: 100%; width: 100%;">
          ${sanitized}
        </body>
      </html>
    `;
  }, [html]);

  return (
    <Stack spacing={2} mt={1} onMouseLeave={() => setOutputWidth(100)}>
      <Editor
        height={280}
        defaultLanguage="html"
        value={html}
        onChange={(value) => {
          const nextValue = value ?? '';
          setHtml(nextValue);
          localStorage.setItem(key, nextValue);
        }}
        options={{
          minimap: { enabled: false },
          tabSize: 2,
        }}
      />

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Preview
        </Typography>
        <Box
          onMouseMove={(event) => {
            const bounds = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
            const relativeX = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
            setOutputWidth((relativeX / Math.max(bounds.width, 1)) * 100);
          }}
          sx={{
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <iframe
            title={`problem-${problem.id}-preview`}
            srcDoc={outputHtml}
            style={{
              width: `${outputWidth}%`,
              height: frameHeight,
              minWidth: 120,
              maxWidth: frameWidth,
              border: 'none',
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
};

const DisabledButton = ({ label }: { label: string }) => {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setDisabled(true), 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Button variant="contained" disabled={disabled} onClick={() => {}}>
      {label}
    </Button>
  );
};

const HoverBadge = ({ message }: { message: string }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const move = () => {
    setPosition({
      top: Math.floor(Math.random() * 500) + 1,
      left: Math.floor(Math.random() * 500) + 1,
    });
  };

  return (
    <Tooltip title={message}>
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          position: 'relative',
          top: position.top,
          left: position.left,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          cursor: 'pointer',
        }}
        onMouseEnter={move}
      >
        Hover
      </Box>
    </Tooltip>
  );
};

const CountdownBody = ({ finishMessage }: { finishMessage: string }) => {
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      // eslint-disable-next-line no-alert
      alert(finishMessage);
    }
  }, [finishMessage, secondsLeft]);

  const hours = Math.floor(secondsLeft / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((secondsLeft % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(secondsLeft % 60)
    .toString()
    .padStart(2, '0');

  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Stack alignItems="center">
        <Typography variant="h5">{hours}</Typography>
        <Typography variant="body2">{t('problems.detail.hour', { defaultValue: 'Hour' })}</Typography>
      </Stack>
      <Stack alignItems="center">
        <Typography variant="h5">{minutes}</Typography>
        <Typography variant="body2">{t('problems.detail.minute', { defaultValue: 'Minute' })}</Typography>
      </Stack>
      <Stack alignItems="center">
        <Typography variant="h5">{seconds}</Typography>
        <Typography variant="body2">{t('problems.detail.second', { defaultValue: 'Second' })}</Typography>
      </Stack>
    </Stack>
  );
};

interface CustomProblemBodyProps {
  problem: ProblemDetail;
  currentUser?: any;
}

export const CustomProblemBody = ({ problem, currentUser }: CustomProblemBodyProps) => {
  const { t } = useTranslation();

  const usernameWord = useMemo(() => {
    if (!currentUser?.username) return null;
    const words = ['har', 'bir', 'odamda', 'bitta', 'bo`lak', 'bo`larklar', 'sonini', 'toping'];
    const total = currentUser.username
      .split('')
      .reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
    return words[total % words.length];
  }, [currentUser?.username]);

  useEffect(() => {
    if (problem.id === 1628) {
      // eslint-disable-next-line no-console
      console.log('Answer is 1628');
      // eslint-disable-next-line no-console
      console.warn('WARNING! Problem #3 eto swap');
    }
  }, [problem.id]);

  if (problem.id === 1615 || problem.id === 1631) {
    return <DisabledButton label="Click" />;
  }

  if (problem.id === 1623) {
    return (
      <Stack spacing={1} alignItems="flex-start">
        <img
          alt="ugly"
          width={300}
          src="https://www.slashfilm.com/img/gallery/the-good-the-bad-and-the-ugly-ending-explained/intro-1645045469.jpg"
        />
        <audio controls src="/assets/audio/the-ugly.weba" />
      </Stack>
    );
  }

  if (problem.id === 1624) {
    return (
      <img
        alt="ugly"
        width={300}
        src="https://images.news18.com/ibnlive/uploads/2021/12/spiderman-meme-16401651614x3.png"
      />
    );
  }

  if (problem.id === 1630) {
    return <HoverBadge message="A5k12UIc10" />;
  }

  if (problem.id === 1633) {
    return <audio controls src="/assets/audio/1633.mp3" />;
  }

  if (problem.id === 1634) {
    return (
      <video controls width={350}>
        <source src="/assets/video/1634.mp4" />
      </video>
    );
  }

  if (problem.id === 1635) {
    return <Typography>{usernameWord ?? '...'}</Typography>;
  }

  if (problem.id === 1637) {
    return <Typography>{t('problems.detail.problemMissing', { defaultValue: 'Problem statement missing' })}</Typography>;
  }

  if (problem.id === 1638) {
    const content =
      'Salom. Biz yuqori intellektga ega shaxslarni qidiryapmiz. Buning uchun test savollarini bajaring.';
    return <Typography>{content}</Typography>;
  }

  if (problem.id === 1639) {
    return <CountdownBody finishMessage="Oltinni tagi sabr!" />;
  }

  if (
    [
      1703, 1733, 1734, 1735, 1736, 1737, 1739, 1740, 1741, 1742, 1743, 1744, 1840, 1841, 1842,
      1843, 1870, 1903, 1905, 1953, 1954, 1966,
    ].includes(problem.id)
  ) {
    return <HtmlPlayground problem={problem} frameWidth={340} />;
  }

  return null;
};
