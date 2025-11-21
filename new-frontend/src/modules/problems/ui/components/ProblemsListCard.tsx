import { Button, Card, CardActions, CardContent, CardHeader, Divider, List, ListItemButton, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources.ts';
import KepIcon from 'shared/components/icons/KepIcon.tsx';
import { ProblemListItem } from '../../domain/ports/problems.repository.ts';

interface ProblemsListCardProps {
  titleKey: string;
  icon?: string;
  items?: ProblemListItem[] | null;
  loading?: boolean;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const ProblemsListCard = ({
  titleKey,
  icon,
  items,
  loading,
  actionLabel,
  actionHref,
  onAction,
}: ProblemsListCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = (problemId?: number) => {
    if (!problemId) return;
    navigate(getResourceById(resources.Problem, problemId));
  };

  const handleAction = () => {
    if (onAction) onAction();
    if (actionHref) navigate(actionHref);
  };

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            {icon ? <KepIcon name={icon} fontSize={20} /> : null}
            <Typography variant="subtitle1" fontWeight={700}>
              {t(titleKey)}
            </Typography>
          </Stack>
        }
      />
      <Divider />
      <CardContent>
        {loading ? (
          <Stack direction="column" spacing={1}>
            <Skeleton height={32} />
            <Skeleton height={32} />
            <Skeleton height={32} />
          </Stack>
        ) : (
          <List disablePadding>
            {(items ?? []).map((item) => (
              <ListItemButton key={item.id} onClick={() => handleNavigate(item.id)}>
                <Typography variant="body2" color="text.primary">
                  {item.symbol ? `${item.symbol}. ` : ''}
                  {item.title}
                </Typography>
              </ListItemButton>
            ))}
            {(items ?? []).length === 0 && (
              <Typography variant="body2" color="text.secondary">
                {t('problems.emptyList')}
              </Typography>
            )}
          </List>
        )}
      </CardContent>
      {actionLabel ? (
        <CardActions>
          <Button fullWidth size="small" variant="contained" onClick={handleAction}>
            {t(actionLabel)}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
};

export default ProblemsListCard;
