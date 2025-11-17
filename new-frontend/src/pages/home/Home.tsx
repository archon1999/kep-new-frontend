import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import BirthdaysSection from './components/BirthdaysSection';
import HomeHeader from './components/HomeHeader';
import NewsSection from './components/NewsSection';
import PostsSection from './components/PostsSection';
import RanksSection from './components/RanksSection';
import SystemSection from './components/SystemSection';
import TopRatingSection from './components/TopRatingSection';
import UsersChartCard from './components/UsersChartCard';

const Home = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', py: 3 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <HomeHeader />
          <Grid container spacing={3}>
            <Grid xs={12}>
              <RanksSection />
            </Grid>
            <Grid xs={12}>
              <NewsSection />
            </Grid>
            <Grid xs={12}>
              <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                  <TopRatingSection />
                </Grid>
                <Grid xs={12} md={4}>
                  <SystemSection />
                </Grid>
                <Grid xs={12} md={4}>
                  <UsersChartCard />
                </Grid>
              </Grid>
            </Grid>
            <Grid xs={12}>
              <Grid container spacing={3}>
                <Grid xs={12} md={3}>
                  <BirthdaysSection />
                </Grid>
                <Grid xs={12} md={9}>
                  <PostsSection />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
