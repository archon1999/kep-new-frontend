import Container from '@mui/material/Container';
import UsersListContainer from 'shared/components/sections/users/users-list/UsersListContainer';

const UsersListPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      <UsersListContainer />
    </Container>
  );
};

export default UsersListPage;
