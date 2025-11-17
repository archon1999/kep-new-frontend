import type {} from '@mui/lab/themeAugmentation';
import { createTheme as muiCreateTheme } from '@mui/material';
import * as locales from '@mui/material/locale';
import type {} from '@mui/material/themeCssVarsAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import createPalette from 'app/theme/palette';
import { SupportedLocales } from 'config';
import mixins from './mixins';
import shadows, { darkShadows } from './shadows';
import Accordion, { AccordionDetails, AccordionSummary } from './shared/components/Accordion';
import Alert from './shared/components/Alert';
import AppBar from './shared/components/AppBar';
import Autocomplete from './shared/components/Autocomplete';
import { Avatar, AvatarGroup } from './shared/components/Avatar';
import Backdrop from './shared/components/Backdrop';
import Breadcrumbs from './shared/components/Breadcrumbs';
import Button, { ButtonBase } from './shared/components/Button';
import ButtonGroup from './shared/components/ButtonGroup';
import Checkbox from './shared/components/Checkbox';
import Chip from './shared/components/Chip';
import CssBaseline from './shared/components/CssBaseline';
import DataGrid from './shared/components/DataGrid';
import Dialog from './shared/components/Dialog';
import Divider from './shared/components/Divider';
import Drawer from './shared/components/Drawer';
import Fab from './shared/components/Fab';
import ImageList, { ImageListItem } from './shared/components/ImageList';
import Link from './shared/components/Link';
import List, { ListItemButton, ListItemIcon, ListItemText } from './shared/components/List';
import { MenuItem } from './shared/components/Menu';
import Pagination, { PaginationItem } from './shared/components/Pagination';
import Paper from './shared/components/Paper';
import Popover from './shared/components/Popover';
import Popper from './shared/components/Popper';
import { CircularProgress, LinearProgress } from './shared/components/Progress';
import Radio from './shared/components/Radio';
import Rating from './shared/components/Rating';
import Select from './shared/components/Select';
import Stack from './shared/components/Stack';
import Stepper, {
  Step,
  StepConnector,
  StepContent,
  StepIcon,
  StepLabel,
} from './shared/components/Stepper';
import Switch from './shared/components/Switch';
import { Tab, Tabs } from './shared/components/Tab';
import Table, {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from './shared/components/Table';
import TablePagination from './shared/components/TablePagination';
import ToggleButton, { ToggleButtonGroup } from './shared/components/ToggleButton';
import Toolbar from './shared/components/Toolbar';
import Tooltip from './shared/components/Tooltip';
import Typography from './shared/components/Typography';
import DateTimePicker from './shared/components/pickers/date-time/DateTimePicker';
import DesktopDateTimePicker from './shared/components/pickers/date-time/DesktopDateTimePicker';
import MobileDateTimePicker from './shared/components/pickers/date-time/MobileDateTimePicker';
import StaticDateTimePicker from './shared/components/pickers/date-time/StaticDateTimePicker';
import DateCalendar from './shared/components/pickers/date/DateCalendar';
import DateField from './shared/components/pickers/date/DateField';
import DatePicker from './shared/components/pickers/date/DatePicker';
import DesktopDatePicker from './shared/components/pickers/date/DesktopDatePicker';
import MobileDatePicker from './shared/components/pickers/date/MobileDatePicker';
import StaticDatePicker from './shared/components/pickers/date/StaticDatePicker';
import DesktopTimePicker from './shared/components/pickers/time/DesktopTimePicker';
import MobileTimePicker from './shared/components/pickers/time/MobileTimePicker';
import MultiSectionDigitalClock from './shared/components/pickers/time/MultiSectionDigitalClock';
import StaticTimePicker from './shared/components/pickers/time/StaticTimePicker';
import TimeClock from './shared/components/pickers/time/TimeClock';
import TimePicker from './shared/components/pickers/time/TimePicker';
import FilledInput from './shared/components/text-fields/FilledInput';
import FormControl from './shared/components/text-fields/FormControl';
import FormControlLabel from './shared/components/text-fields/FormControlLabel';
import FormHelperText from './shared/components/text-fields/FormHelperText';
import Input, { InputBase } from './shared/components/text-fields/Input';
import InputAdornment from './shared/components/text-fields/InputAdornment';
import InputLabel from './shared/components/text-fields/InputLabel';
import OutlinedInput from './shared/components/text-fields/OutlinedInput';
import TextField from './shared/components/text-fields/TextField';
import sxConfig from './sxConfig';
import typography from './typography';

export type MuiSupportedLocales = keyof typeof locales;

export const createTheme = (
  direction: 'ltr' | 'rtl' = 'ltr',
  locale: SupportedLocales = 'en-US',
) => {
  const muiLocales = locales[locale.split('-').join('') as MuiSupportedLocales];

  return muiCreateTheme(
    {
      cssVariables: { colorSchemeSelector: 'data-aurora-color-scheme', cssVarPrefix: 'aurora' },
      shadows: ['none', ...shadows],
      colorSchemes: {
        light: {
          palette: createPalette('light'),
          shadows: ['none', ...shadows],
        },
        dark: {
          palette: createPalette('dark'),
          shadows: ['none', ...Array(shadows.length).fill(darkShadows[0])],
        },
      },
      typography,
      direction,
      unstable_sxConfig: sxConfig,
      mixins,
      components: {
        MuiAppBar: AppBar,
        MuiPaper: Paper,
        MuiDivider: Divider,
        MuiAccordion: Accordion,
        MuiAccordionSummary: AccordionSummary,
        MuiButton: Button,
        MuiFab: Fab,
        MuiToggleButton: ToggleButton,
        MuiToggleButtonGroup: ToggleButtonGroup,
        MuiButtonBase: ButtonBase,
        MuiButtonGroup: ButtonGroup,
        // input fields
        MuiTextField: TextField,
        MuiFilledInput: FilledInput,
        MuiOutlinedInput: OutlinedInput,
        MuiInputLabel: InputLabel,
        MuiInputAdornment: InputAdornment,
        MuiFormHelperText: FormHelperText,
        MuiInput: Input,
        MuiInputBase: InputBase,
        MuiFormControl: FormControl,
        MuiFormControlLabel: FormControlLabel,
        MuiAutocomplete: Autocomplete,
        // ----------
        MuiBreadcrumbs: Breadcrumbs,
        MuiSelect: Select,
        MuiDialog: Dialog,
        MuiAlert: Alert,
        MuiStack: Stack,
        MuiCheckbox: Checkbox,
        MuiRadio: Radio,
        MuiPagination: Pagination,
        MuiPaginationItem: PaginationItem,
        MuiTablePagination: TablePagination,
        MuiChip: Chip,
        MuiSwitch: Switch,
        MuiList: List,
        MuiListItemButton: ListItemButton,
        MuiListItemIcon: ListItemIcon,
        MuiListItemText: ListItemText,
        MuiMenuItem: MenuItem,
        MuiToolbar: Toolbar,
        MuiTooltip: Tooltip,
        MuiTabs: Tabs,
        MuiTab: Tab,
        MuiTypography: Typography,
        MuiCircularProgress: CircularProgress,
        MuiLinearProgress: LinearProgress,
        MuiAvatar: Avatar,
        MuiAvatarGroup: AvatarGroup,
        MuiAccordionDetails: AccordionDetails,
        MuiTableContainer: TableContainer,
        MuiTable: Table,
        MuiTableRow: TableRow,
        MuiTableCell: TableCell,
        MuiDataGrid: DataGrid,
        MuiTableSortLabel: TableSortLabel,
        MuiCssBaseline: CssBaseline,
        MuiLink: Link,
        MuiRating: Rating,
        MuiBackdrop: Backdrop,
        MuiPopover: Popover,
        MuiPopper: Popper,
        MuiDrawer: Drawer,
        MuiStepper: Stepper,
        MuiStep: Step,
        MuiStepIcon: StepIcon,
        MuiStepContent: StepContent,
        MuiStepLabel: StepLabel,
        MuiStepConnector: StepConnector,
        MuiDateCalendar: DateCalendar,
        MuiDatePicker: DatePicker,
        MuiMobileDatePicker: MobileDatePicker,
        MuiStaticDatePicker: StaticDatePicker,
        MuiDesktopDatePicker: DesktopDatePicker,
        MuiDateField: DateField,
        MuiTimeClock: TimeClock,
        MuiTimePicker: TimePicker,
        MuiDesktopTimePicker: DesktopTimePicker,
        MuiMobileTimePicker: MobileTimePicker,
        MuiStaticTimePicker: StaticTimePicker,
        MuiMultiSectionDigitalClock: MultiSectionDigitalClock,
        MuiDateTimePicker: DateTimePicker,
        MuiDesktopDateTimePicker: DesktopDateTimePicker,
        MuiMobileDateTimePicker: MobileDateTimePicker,
        MuiStaticDateTimePicker: StaticDateTimePicker,
        MuiTableHead: TableHead,
        MuiImageList: ImageList,
        MuiImageListItem: ImageListItem,
      },
    },
    muiLocales,
  );
};
