import { QuestionType } from '../enums/question-type.enum.ts';

export interface QuestionOption {
  option?: string;
  optionMain?: string;
  optionSecondary?: string;
  selected?: boolean;
}

export interface Question {
  id: number;
  number: number;
  type: QuestionType;
  text: string;
  body?: string;
  audio?: string;
  options?: QuestionOption[];
  input?: string;
  answered?: boolean;
}
