import { Breadcrumbs, BreadcrumbsProps, Link, SxProps, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type BreadcrumbItem = {
  label: string;
  url?: string;
  active?: boolean;
};

interface PageBreadcrumbProps extends BreadcrumbsProps {
  items: BreadcrumbItem[];
  sx?: SxProps;
}

const PageBreadcrumb = ({ items, sx, ...rest }: PageBreadcrumbProps) => {
  return (
    <Breadcrumbs separator="/" sx={{ color: 'text.secondary', ...sx }} {...rest}>
      {items.map((item, index) =>
        item.active ? (
          <Typography key={index} color="text.primary" variant="body2" fontWeight={600}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={index}
            color="text.secondary"
            underline="hover"
            component={item.url ? RouterLink : undefined}
            to={item.url ?? ''}
            variant="body2"
            fontWeight={600}
          >
            {item.label}
          </Link>
        ),
      )}
    </Breadcrumbs>
  );
};

export default PageBreadcrumb;
export type { BreadcrumbItem };
