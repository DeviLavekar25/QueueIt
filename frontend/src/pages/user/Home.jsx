import {Link } from "react-router-dom";
import "./Home.css";

const Home = () =>{
  return(
    <div className="home-page">

       <section className="hero-section">
          <div className="hero-content">

            <h1> 
              Skip the wait.
              <span> Join the queue smarter.</span>
            </h1>

            <p>
              QueueIt helps you join queues remotely, track your position,
            and get real-time updates without standing in line.
            </p>

            <div className="hero-buttons">
              <Link to="/dashboard" className="primary-button">
              Find a Queue
              </Link>

              <Link to="/register" className="secondary-button">
               Get Started
              </Link>

            </div>

          </div>
       </section>

       <section className="features-section">

        <div className="feature-card">
          <h3>Real-Time Updates</h3>
           <p>
            Track your queue position instantly with live updates.
          </p>
        </div>

        <div className="feature-card">
          <h3>Join Remotely</h3>
           <p>
            Join a queue without physically waiting at the venue.
          </p>
        </div>
        <div className="feature-card">
          <h3>Simple and Fast</h3>
           <p>
            Get your token and monitor your wait with ease.
          </p>
        </div>

       </section>
    </div>
  )
}

export default Home;