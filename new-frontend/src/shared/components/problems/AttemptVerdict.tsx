import { Chip, ChipProps } from '@mui/material';
import { useMemo } from 'react';

export type VerdictKey =
  | -2
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18;

interface AttemptVerdictProps extends Omit<ChipProps, 'label' | 'color'> {
  verdict?: VerdictKey;
  title: string;
  testCaseNumber?: number | null;
  balls?: number | null;
}

const verdictColorMap: Record<VerdictKey, ChipProps['color']> = {
  [-2]: 'warning', // In queue
  [-1]: 'secondary', // Running
  0: 'default', // Judgement failed
  1: 'success', // AC
  2: 'error', // WA
  3: 'error', // RE
  4: 'error', // TL
  5: 'warning', // PE
  6: 'error', // ML
  7: 'secondary', // Rejected
  8: 'error', // CE
  9: 'info', // CEE
  10: 'warning', // IL
  11: 'warning', // SE
  12: 'default', // Checker not found
  13: 'default', // Only Python
  14: 'default', // Object not found
  15: 'warning', // Partial solution
  16: 'warning', // Not available language
  17: 'success', // Fake accepted
  18: 'error', // Hacked
};

const verdictShortTitle: Record<VerdictKey, string> = {
  [-2]: 'InQ',
  [-1]: 'Run',
  0: 'JF',
  1: 'AC',
  2: 'WA',
  3: 'TL',
  4: 'RE',
  5: 'PE',
  6: 'ML',
  7: 'RJ',
  8: 'CE',
  9: 'CEE',
  10: 'IL',
  11: 'SE',
  12: '',
  13: '',
  14: '',
  15: '',
  16: '',
  17: 'AC',
  18: '',
};

const hideTestCaseFor: VerdictKey[] = [1, -2, -1, 0, 7, 12, 13, 15, 17, 18];

const AttemptVerdict = ({ verdict, title, testCaseNumber, balls, ...rest }: AttemptVerdictProps) => {
  const color = verdict !== undefined && verdictColorMap[verdict] ? verdictColorMap[verdict] : 'default';
  const shortTitleRaw = verdict !== undefined ? verdictShortTitle[verdict as VerdictKey] : '';
  const shortTitle = shortTitleRaw || title;
  const showTestCase =
    typeof testCaseNumber === 'number' &&
    testCaseNumber > 0 &&
    !(hideTestCaseFor as number[]).includes((verdict ?? 0) as number);
  const showBall = verdict === 15 && balls !== undefined && balls !== null;

  const label = useMemo(() => {
    const parts = [shortTitle];
    if (showTestCase) parts.push(`#${testCaseNumber}`);
    if (showBall) parts.push(String(balls));
    return parts.join(' ').trim();
  }, [shortTitle, showTestCase, testCaseNumber, showBall, balls]);

  return (
    <Chip
      size="medium"
      variant="outlined"
      color={color}
      label={label}
      title={title}
      sx={{ fontWeight: 700 }}
      {...rest}
    />
  );
};

export default AttemptVerdict;
