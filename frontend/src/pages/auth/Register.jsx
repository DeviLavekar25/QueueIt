import "./Auth.css"
import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import api from  "../../api/axios"
import {useAuth} from "../../context/AuthContext"

const Register = () =>{

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("")

  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{
      const response = await api.post("/auth/register",{
        name,email,password,
      });

      console.log("Register response: ",response.data);

      login(
        response.data.data.user,
        response.data.data.token
      );
      navigate("/");

    }catch(error){
      console.error(
        "Registration failed:", error.response?.data || error.message
      );

      if(error.response?.status === 409){
        setError("An account with this email already exists.");
      }else{
        setError("Unable to create account. Please try again.")
      }
    }
  }

  return(
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join QueueIt and manage your queues easily</p>
        </div>

        {error && (
          <p className="auth-error">
             {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>

            <input type="text" placeholder="Enter your name" value={name} 
                   onChange={(e)=> setName(e.target.value)}
                   required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email}
                   onChange={(e)=>setEmail(e.target.value)}
                   required/>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password}
                   onChange={(e)=>setPassword(e.target.value)} required/>
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>

        </p>

      </div>

    </div>
  )
}

export default Register