import { MouseEvent, useCallback, useMemo } from 'react';
import { Box, Button, Pagination, Stack, TablePaginationOwnProps, buttonClasses } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

export interface CustomTablePaginationActionProps extends TablePaginationOwnProps {
  onNextClick?: () => void;
  onPrevClick?: () => void;
  onLastClick?: () => void;
  showFullPagination?: boolean;
}

const CustomTablePaginationAction = ({
  page,
  rowsPerPage,
  count,
  onPageChange,
  onNextClick,
  onPrevClick,
  onLastClick,
  showFullPagination,
}: CustomTablePaginationActionProps) => {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / rowsPerPage) || 1), [count, rowsPerPage]);
  const isFirstPage = page === 0;
  const isLastPage = page >= totalPages - 1;

  const handlePrev = useCallback(() => {
    if (isFirstPage) return;
    if (onPrevClick) {
      onPrevClick();
    } else {
      onPageChange?.(null, page - 1);
    }
  }, [isFirstPage, onPrevClick, onPageChange, page]);

  const handleNext = useCallback(() => {
    if (isLastPage) return;
    if (onNextClick) {
      onNextClick();
    } else {
      onPageChange?.(null, page + 1);
    }
  }, [isLastPage, onNextClick, onPageChange, page]);

  const handleLast = useCallback(() => {
    if (isLastPage) return;
    if (onLastClick) {
      onLastClick();
    } else {
      onPageChange?.(null, totalPages - 1);
    }
  }, [isLastPage, onLastClick, onPageChange, totalPages]);

  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        ml: {
          sm: 1,
        },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2 },
      }}
    >
      <Button
        variant="text"
        color="primary"
        size="small"
        startIcon={
          <IconifyIcon
            flipOnRTL
            icon="material-symbols:chevron-left-rounded"
            sx={{ fontSize: '18px !important' }}
          />
        }
        disabled={isFirstPage}
        onClick={handlePrev}
        sx={{
          ml: { sm: 'auto' },
          minWidth: 'auto',
          [`& .${buttonClasses.startIcon}`]: {
            mr: { xs: 0, sm: 0.5 },
          },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-block' } }}>
          Previous
        </Box>
      </Button>

      <Pagination
        color="primary"
        variant={showFullPagination ? 'solid' : 'outlined'}
        hidePrevButton
        hideNextButton
        size="small"
        count={totalPages}
        page={Math.min(page + 1, totalPages)}
        onChange={(event: MouseEvent<HTMLButtonElement>, page: number) =>
          onPageChange?.(event, page - 1)
        }
        sx={{ flexShrink: 0 }}
      />

      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="text"
          color="primary"
          size="small"
          disabled={isLastPage}
          onClick={handleLast}
          sx={{ minWidth: 'auto' }}
        >
          Last
        </Button>
        <Button
          disabled={isLastPage}
          onClick={handleNext}
          variant="text"
          color="primary"
          size="small"
          endIcon={
            <IconifyIcon
              flipOnRTL
              icon="material-symbols:chevron-right-rounded"
              sx={{ fontSize: '18px !important' }}
            />
          }
          sx={{
            minWidth: 'auto',
            [`& .${buttonClasses.endIcon}`]: {
              ml: { xs: 0, sm: 0.5 },
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-block' } }}>
            Next
          </Box>
        </Button>
      </Stack>
    </Stack>
  );
};

export default CustomTablePaginationAction;
