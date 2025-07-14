export const getMockedQuiz = async (type: 'question' | 'flashcard', query: string) => {
  // Simulate LLM streaming chunks
  const llmChunks = [
    "Sure! Here's what I found for",
    " your query about the skeletal system.",
    " The human skeletal system consists of 206 bones",
    " and supports structure, movement, and protection.",
  ];

  // Simulate data
  const content =
    type === 'question'
      ? [
          {
            id: '1',
            question: 'Which bone is known as the collarbone?',
            options: ['Scapula', 'Femur', 'Clavicle', 'Humerus'],
            correct_answer: 'Clavicle',
          },
          {
            id: '2',
            question: 'How many bones form the human skull?',
            options: ['22', '12', '32', '26'],
            correct_answer: '22',
          },
        ]
      : [
          {
            id: '1',
            front: 'Which bone is known as the collarbone?',
            back: 'Clavicle',
          },
          {
            id: '2',
            front: 'Number of bones in human skull?',
            back: '22',
          },
        ];

  return {
    llmChunks,
    content,
  };
};
