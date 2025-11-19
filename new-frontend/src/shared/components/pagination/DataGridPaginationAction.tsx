import { useMemo } from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import CustomTablePaginationAction, {
  CustomTablePaginationActionProps,
} from './CustomTablePaginationAction';

const DataGridPaginationAction = (rest: CustomTablePaginationActionProps) => {
  const { page, rowsPerPage, count } = rest;
  const apiRef = useGridApiContext();

  const lastPageIndex = useMemo(
    () => Math.max(0, Math.ceil(count / rowsPerPage) - 1),
    [count, rowsPerPage],
  );

  return (
    <>
      <CustomTablePaginationAction
        onNextClick={() => apiRef.current.setPage(page + 1)}
        onPrevClick={() => apiRef.current.setPage(page - 1)}
        onLastClick={() => apiRef.current.setPage(lastPageIndex)}
        {...rest}
      />
    </>
  );
};

export default DataGridPaginationAction;
