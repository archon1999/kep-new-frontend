import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import type { KPI } from 'types/hrm';
import HRMKPI from 'components/sections/dashboards/hrm/HRMKPI';
import RevealItems from '../common/RevealItems';
import RevealText from '../common/RevealText';
import SectionHeader from '../common/SectionHeader';

interface StatisticsSectionProps {
  data: KPI[];
}

const StatisticsSection = ({ data }: StatisticsSectionProps) => {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 3, md: 6 },
        py: { xs: 6, md: 10 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1320, px: { xs: 0 } }}>
        <Stack spacing={3} sx={{ mb: { xs: 4, md: 6 }, maxWidth: 720 }}>
          <SectionHeader
            title="Platform KPIs"
            subtitle="Last year at a glance"
            sx={{ textAlign: 'left' }}
          />
          <RevealText delay={0.1}>
            <Typography variant="body2" color="text.secondary">
              We surface the same KPIs that appear in the HRM dashboard so visitors can immediately
              understand how the platform is performing. Each card mirrors the HRM layout and
              highlights the year-over-year delta for the core usage metrics.
            </Typography>
          </RevealText>
        </Stack>

        <RevealItems
          component={Grid}
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 12, sm: 12, lg: 12 }}
        >
          {data.map((kpi) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.subtitle}>
              <HRMKPI kpi={kpi} />
            </Grid>
          ))}
        </RevealItems>
      </Container>
    </Box>
  );
};

export default StatisticsSection;
