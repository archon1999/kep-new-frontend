import { ChangeEvent } from 'react';
import { TablePagination, useEventCallback } from '@mui/material';
import { GridSlotProps } from '@mui/x-data-grid';
import DataGridPaginationAction from './DataGridPaginationAction';
import TableLabelDisplayedRows from './TableLabelDisplayedRows';

type BasePaginationProps = GridSlotProps['basePagination'];

type DataGridPaginationProps = BasePaginationProps & {
  showFullPagination?: boolean;
};

const DataGridPagination = function BasePagination({ ref, ...props }: DataGridPaginationProps) {
  const { onRowsPerPageChange, disabled, showFullPagination = false, ...rest } = props;
  const rowsPerPageOptions = [10, 20, 50];

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={rowsPerPageOptions}
      ActionsComponent={(props) => (
        <DataGridPaginationAction showFullPagination={showFullPagination} {...props} />
      )}
      onRowsPerPageChange={useEventCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          onRowsPerPageChange?.(Number(event.target.value));
        },
      )}
      labelDisplayedRows={TableLabelDisplayedRows}
      {...rest}
      ref={ref}
    />
  );
};

export default DataGridPagination;
