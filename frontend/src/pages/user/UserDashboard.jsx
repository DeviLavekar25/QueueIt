import {useEffect, useState} from "react";
import api from "../../api/axios"
import {useNavigate} from "react-router-dom"
import "./UserDashboard.css";

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchCategories = async () =>{
      try{
          const response = await api.get("/categories");

          console.log("Categories: ", response.data);

          setCategories(response.data.categories);
      }catch(error){
         console.error(
          "Failed to fetch categories",
          error.response?.data || error.message
         );
      }
    };
    fetchCategories();
  },[]);

  return (
    <div className="user-dashboard">

      <div className="user-dashboard-header">
        <h1>Find a Service</h1>
        <p>Choose a category to find available services and join a queue.</p>
      </div>

      <div className="category-grid">

       {categories.map((category)=>(
        <div className="category-card"
            key= {category._id} 
            onClick={() => navigate(`/venues/${category._id}`)}
            style={{ cursor: "pointer" }}>
          <h2>{category.name}</h2> 
          <p>{category.description}</p>

          <span className="category-link">
              View Venues 
          </span>
        </div>
      ))}
    </div>
    </div>
  );
};

export default UserDashboard;