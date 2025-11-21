import { Grid2 as Grid, Stack, Typography } from '@mui/material';
import TestCard from './TestCard.tsx';
import { Test } from '../../domain';

interface Props {
  chapterTitle: string;
  tests: Test[];
}

const ChapterCard = ({ chapterTitle, tests }: Props) => (
  <Stack spacing={2}>
    <Typography variant="h6" fontWeight={800}>
      {chapterTitle}
    </Typography>

    <Grid container spacing={2}>
      {tests.map((test) => (
        <Grid key={test.id} size={{ xs: 12, md: 6 }}>
          <TestCard test={test} />
        </Grid>
      ))}
    </Grid>
  </Stack>
);

export default ChapterCard;
