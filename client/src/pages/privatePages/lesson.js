// src/pages/Lesson.js
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout';

const Lesson = () => {
  const { lessonId } = useParams();

  return (
    <Layout>
      <h1>Lesson {lessonId}</h1>
      <p>Content for lesson {lessonId} will go here.</p>
    </Layout>
  );
};

export default Lesson;
