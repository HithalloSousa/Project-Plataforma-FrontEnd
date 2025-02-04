import React, { createContext, useContext, useState } from 'react';

const StudentContext = createContext();

export const useStudent = () => {
  return useContext(StudentContext);
};

export const StudentProvider = ({ children }) => {
  // eslint-disable-next-line
  const [studentData, setStudentData] = useState({ 
    profile: {
      name: 'Lucas Oliveira',
      email: 'lucas@example.com',
      level: 'B1',
    },
    lessons: [
      { id: 1, title: 'Introdução ao presente simples', date: '2025-01-10' },
      { id: 2, title: 'Passado simples', date: '2025-01-20' },
    ],
    homework: [
      { id: 1, title: 'Escrever 5 frases no presente simples', dueDate: '2025-01-30' },
      { id: 2, title: 'Ler texto sobre viagem e resumir', dueDate: '2025-02-05' },
    ],
    grades: [
      { subject: 'Inglês', grade: 8, feedback: 'Bom progresso, continue praticando o vocabulário.' },
    ],
    progress: {
      vocabulary: '70%',
      grammar: '60%',
      fluency: '50%',
    },
  });

  const value = { studentData };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};
