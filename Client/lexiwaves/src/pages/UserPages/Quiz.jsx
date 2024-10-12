import React, { useState } from 'react';

const Quiz = ({ questions, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);

    const handleAnswer = (answerId) => {
        setAnswers([...answers, { questionId: questions[currentQuestion].id, answerId }]);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            onComplete(answers);
        }
    };

    if (questions.length === 0 ) return <div>Loading quiz...</div>

    const question = questions[currentQuestion];
    return(
        <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">{question.text}</h2>
        <ul className="space-y-2">
            {question.answers.map((answer) => (
                <li key={answer.id}>
                    <button
                        onClick={() => handleAnswer(answer.id)}
                        className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition duration-150 ease-in-out"
                    >
                        {answer.text}
                    </button>
                </li>
            ))}
        </ul>
        </div>
    )
}

export default Quiz;