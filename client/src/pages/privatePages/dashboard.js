import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCourseInfo, onLogout, addCourses } from '../../api/auth';
import Layout from '../../components/layout';
import { unauthenticateUser } from '../../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import './Dashboard.css'; 

const CoursesAndLessons = ({ courses }) => {
  const selectedCourses = courses.filter((course) => course.checked);

  return (
    <div className="courses-container">
      <h2 className="dashboard-title">Courses</h2>
      {selectedCourses.length > 0 ? (
        selectedCourses.map((course) => (
          <div key={course.id} className="course-block">
            <h3>{course.label}</h3>
            <ul className="lesson-list">
              {course.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link to={`/lesson/${lesson.id}`} className="lesson-link">
                    {lesson.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No courses selected.</p>
      )}
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [courseList, setCourseList] = useState([
    { id: 1, label: 'Data Structures', lessons: [{id : 101, name : 'What are data structures?'}, {id : 102, name : 'Basic Data Structures'}], checked: false },
    { id: 2, label: 'Algorithms', lessons: [{id : 201, name : 'What are algorithms?'}, {id : 202, name : 'Basic Algorithms'}], checked: false },
    { id: 3, label: 'App Development', lessons: [{id : 301, name : 'What is the Backend'}, {id : 302, name : 'What is the Frontend'}], checked: false },
  ]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const fetchAndUpdateCourses = async () => {
    try {
      const { data } = await fetchCourseInfo();
      if (data && data.courses) {
        const updatedCourseList = courseList.map((course) => ({
          ...course,
          checked: data.courses.includes(course.label),
        }));
        setCourseList(updatedCourseList);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course data:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
      setLoading(false);
    }
  };

  const saveCourses = async () => {
    const selectedCourses = courseList
      .filter((item) => item.checked)
      .map((item) => item.label);

    try {
      await addCourses({ courses: selectedCourses });
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  };

  useEffect(() => {
    fetchAndUpdateCourses();
  }, []);

  const togglePopup = () => {
    if (isPopupVisible) {
      saveCourses();
    }
    setIsPopupVisible(!isPopupVisible);
  };

  const handleCheckboxChange = (id) => {
    const updatedCourseList = courseList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setCourseList(updatedCourseList);
  };

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1/>
        <CoursesAndLessons courses={courseList} />
        <button className="edit-courses-btn" onClick={togglePopup}>
          Edit Courses
        </button>

        {isPopupVisible && (
          <>
            <div className="overlay" onClick={togglePopup}></div>
            <div className="popup">
              <h3>Edit Courses</h3>
              <ul>
                {courseList.map((item) => (
                  <li key={item.id}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
              <button className="close-btn" onClick={togglePopup}>
                Close
              </button>
            </div>
          </>
        )}
      </Layout>
    </div>
  );
};

export default Dashboard;
