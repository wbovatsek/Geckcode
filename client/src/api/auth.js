import axios from 'axios'
axios.defaults.withCredentials = true

export async function onRegistration(registrationData) {
  return await axios.post(
    'http://localhost:8000/api/register',
    registrationData
  )
}

export async function onLogin(loginData) {
    const response = await axios.post('http://localhost:8000/api/login', loginData);
    return response.data;
}

export async function onLogout() {
  return await axios.get('http://localhost:8000/api/logout')
}

export async function fetchProtectedInfo() {
  return await axios.get('http://localhost:8000/api/protected')
}

export async function fetchCourseInfo(){
  return await axios.get('http://localhost:8000/api/get-courses')
}

export async function addCourses(courseData){
  return await axios.post('http://localhost:8000/api/add-courses', courseData)
}

export async function fetchLoginStreak(){
    return await axios.get('http://localhost:8000/api/login-streak');
};