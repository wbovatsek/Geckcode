import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCourseInfo, onLogout, addCourses } from '../../api/auth';
import Layout from '../../components/layout';
import { unauthenticateUser } from '../../redux/slices/authSlice';
import { Link } from 'react-router-dom';


// Courses and Lessons Component
const CoursesAndLessons = ({ courses }) => {
  const selectedCourses = courses.filter((course) => course.checked); // Filter only checked courses

  return (
    <div>
      <h2>Courses and Lessons</h2>
      {selectedCourses.length > 0 ? (
        selectedCourses.map((course) => (
          <div key={course.id}>
            <h3>{course.label}</h3>
            <ul>
              {course.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link to={`/lesson/${lesson.id}`}>{lesson.name}</Link>
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
    { id: 1, label: 'Course 1', lessons: [{id : 101, name : 'Lesson 1.1'}, {id : 102, name : 'Lesson 1.2'}], checked: false },
    { id: 2, label: 'Course 2', lessons: [{id : 201, name : 'Lesson 2.1'}, {id : 202, name : 'Lesson 2.2'}], checked: false },
    { id: 3, label: 'Course 3', lessons: [{id : 301, name : 'Lesson 3.1'}, {id : 302, name : 'Lesson 3.2'}], checked: false },
  ]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Function to log out the user
  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // Function to fetch course information and update the courseList state
  const fetchAndUpdateCourses = async () => {
    try {
      const { data } = await fetchCourseInfo();
      console.log("Fetched course data:", data); // Debugging log to check fetched data

      // Check if courses exist in the API response
      if (data && data.courses) {
        const updatedCourseList = courseList.map((course) => ({
          ...course,
          checked: data.courses.includes(course.label), // Check if the course is in the fetched list
        }));
        setCourseList(updatedCourseList);
      } else {
        console.error("No courses found in response");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course data:", error);

      // Only log out if it's an authentication error
      if (error.response && error.response.status === 401) {
        logout(); // Log out for authentication errors
      } else {
        console.error("Non-authentication related error, no logout.");
      }

      setLoading(false); // Avoid infinite loading state in case of error
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

  // Fetch the courses on the first load
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
        <h1>Dashboard</h1>

        {/* Display only checked Courses and Lessons */}
        <CoursesAndLessons courses={courseList} />

        {/* Button to open the popup */}
        <button onClick={togglePopup}>Edit Courses</button>

        {/* Popup courseList */}
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

      {/* Popup and overlay styling */}
      <style jsx>{`
        .popup {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          padding: 20px;
          border: 1px solid #ccc;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          width: 300px;
          border-radius: 10px;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .close-btn {
          cursor: pointer;
          padding: 8px 12px;
          background-color: red;
          color: white;
          border: none;
          border-radius: 5px;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        ul li {
          margin: 10px 0;
        }

        input[type='checkbox'] {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
