import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';
import DataGridPaginationAction from 'shared/components/pagination/DataGridPaginationAction';
import TableLabelDisplayedRows from 'shared/components/pagination/TableLabelDisplayedRows';

const TablePagination: Components<Omit<Theme, 'components'>>['MuiTablePagination'] = {
  defaultProps: {
    rowsPerPageOptions: [10, 20, 50],
    labelDisplayedRows: TableLabelDisplayedRows,
    ActionsComponent: DataGridPaginationAction,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.vars.palette.background.elevation1,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    }),
    toolbar: {
      paddingRight: '24px !important',
      minHeight: '46px !important',
    },
    spacer: {
      display: 'none',
    },
    actions: {
      marginLeft: 8,
      flex: 1,
    },
    selectLabel: ({ theme }) => ({
      paddingLeft: 10,
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: 600,
      fontSize: theme.typography.subtitle2.fontSize,
    }),
    input: {
      display: 'inline-flex',
    },
    displayedRows: ({ theme }) => ({
      lineHeight: 1.2,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    }),
  },
};

export default TablePagination;
