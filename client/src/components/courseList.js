// components/CourseList.js
const CourseList = ({ courses }) => {
  return (
    <div>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div key={course.id}>
            <h3>{course.label}</h3>
            <ul>
              {course.lessons.map((lesson, index) => (
                <li key={index}>{lesson}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default CourseList;
