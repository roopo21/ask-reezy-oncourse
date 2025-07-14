export type FlashcardItem = {
  front: string;
  back: string;
};

export type QuestionItem = {
  question: string;
  options: string[];
};

export type QuizType = 'flashcard' | 'pyq';
