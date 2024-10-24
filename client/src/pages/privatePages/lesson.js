import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout';

const Lesson = () => {
  const { lessonId } = useParams();

  return (
    <Layout>
      <h1>Lesson {lessonId}</h1>
      <p>Content for lesson {lessonId} will go here.</p>

      {/* Embedded YouTube Video */}
      <div className="lesson-video">
        <iframe
          width="600"
          height="400"
          src={`https://www.youtube.com/embed/bum_19loj9A`}
          title="Lesson Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </Layout>
  );
};

export default Lesson;

