import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export function QuickQuestions({ questions, onQuestionClick }: QuickQuestionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs sm:text-sm text-gray-400">Quick questions:</p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="professional-button-small text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
