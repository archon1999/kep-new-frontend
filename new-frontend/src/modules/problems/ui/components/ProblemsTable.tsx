import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Problem, difficultyColors } from '../../domain/entities/problem.entity.ts';

interface ProblemsTableProps {
  problems: Problem[];
}

const ProblemsTable = ({ problems }: ProblemsTableProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h6">{t('problems.listTitle')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('problems.listSubtitle')}
            </Typography>
          </Stack>

          {!problems.length && <LinearProgress />}

          {!!problems.length && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('problems.columns.title')}</TableCell>
                  <TableCell>{t('problems.columns.difficulty')}</TableCell>
                  <TableCell>{t('problems.columns.stats')}</TableCell>
                  <TableCell>{t('problems.columns.tags')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {problems.map((problem) => (
                  <TableRow hover key={problem.id} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {problem.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('problems.authorLabel', { username: problem.authorUsername ?? t('problems.anonymousAuthor') })}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={problem.difficultyTitle}
                        color={difficultyColors[problem.difficulty] ?? 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} divider={<Divider flexItem orientation="vertical" />} alignItems="center">
                        <Box>
                          <Typography variant="overline" color="text.secondary">
                            {t('problems.solved')}
                          </Typography>
                          <Typography variant="subtitle2">{problem.solvedCount}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="overline" color="text.secondary">
                            {t('problems.attempts')}
                          </Typography>
                          <Typography variant="subtitle2">{problem.attemptsCount}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {problem.tags.slice(0, 3).map((tag) => (
                          <Chip key={`${problem.id}-${tag.name}`} size="small" label={tag.name} variant="outlined" />
                        ))}
                        {!problem.tags.length && (
                          <Typography variant="body2" color="text.secondary">
                            {t('problems.noTags')}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsTable;
