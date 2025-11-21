export const contestTypes = [
  'ACM20M',
  'ACM10M',
  'ACM2H',
  'Ball525',
  'Ball550',
  'LessCode',
  'LessLine',
  'OneAttempt',
  'Exam',
  'IQ',
  'MultiL',
  'DC',
  'CodeGolf',
  'Ball',
] as const;

export type ContestType = (typeof contestTypes)[number];
