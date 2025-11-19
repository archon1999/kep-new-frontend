import { useGridApiContext } from '@mui/x-data-grid';
import CustomTablePaginationAction, {
  CustomTablePaginationActionProps,
} from './CustomTablePaginationAction';

const DataGridPaginationAction = (rest: CustomTablePaginationActionProps) => {
  const { page } = rest;
  const apiRef = useGridApiContext();

  return (
    <>
      <CustomTablePaginationAction
        onNextClick={() => apiRef.current.setPage(page + 1)}
        onPrevClick={() => apiRef.current.setPage(page - 1)}
        {...rest}
      />
    </>
  );
};

export default DataGridPaginationAction;
