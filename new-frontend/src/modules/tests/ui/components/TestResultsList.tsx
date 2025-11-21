import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { TestResultItem } from '../../domain/entities/test.entity.ts';

interface Props {
  title: string;
  results?: TestResultItem[];
  total?: number;
}

const TestResultsList = ({ title, results, total }: Props) => (
  <div>
    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
      {title}
    </Typography>
    <List disablePadding>
      {results?.map((result, idx) => (
        <ListItem key={`${result.username}-${idx}`} disableGutters>
          <ListItemAvatar>
            <Avatar>
              <PersonOutlineRoundedIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={result.username || '—'}
            secondary={result.finished}
            primaryTypographyProps={{ fontWeight: 700 }}
          />
          {result.result !== undefined && (
            <Typography variant="subtitle1" color="success.main" fontWeight={800}>
              {`${result.result}${total ? `/${total}` : ''}`}
            </Typography>
          )}
        </ListItem>
      ))}
      {!results?.length && (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      )}
    </List>
  </div>
);

export default TestResultsList;
