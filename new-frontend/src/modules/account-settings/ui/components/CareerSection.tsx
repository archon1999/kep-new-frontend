import { Stack } from '@mui/material';
import EducationsForm from './EducationsForm';
import WorkExperiencesForm from './WorkExperiencesForm';

const CareerSection = () => (
  <Stack spacing={3}>
    <EducationsForm />
    <WorkExperiencesForm />
  </Stack>
);

export default CareerSection;
