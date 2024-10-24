import Layout from "../components/layout";
import './Home.css';

const Home = () => {
  return (
    <Layout>
      <div className="home-container">
        <h1 className="home-title">Welcome to Our Learning Platform!</h1>

        <div className="home-message">
          <p>
            Our purpose is to help young children who want to get into computer science and coding. 
            We believe in building the future, and we’re here to guide kids through their first steps in technology!
          </p>
        </div>

        <div className="home-feature">
          <h2>Your Forest Feature</h2>
          <p>
            Your Forest helps young kids focus and visually see how much they have been working. 
            Each tree represents a day of effort, growing as they engage more with coding challenges and lessons.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
