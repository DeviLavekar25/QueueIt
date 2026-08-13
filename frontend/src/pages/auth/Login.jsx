import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import api from "../../api/axios"
import {useAuth} from "../../context/AuthContext"
import "./Auth.css";

const Login = ()=>{
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const {login}= useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError("");

        try{
            const response = await api.post("/auth/login",{
                email,password,
            });
            console.log("Login response: ", response.data);

            login(response.data.data.user,
                response.data.data.token
            );
            navigate("/");
        }catch(error){
            console.error("Login failed:", error.response?.data || error.message); 
            setError("Invalid email or password")
        }
    };

    return(
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-header">
             <h1>Welcome</h1>
             <p>Login to continue using QueueIt</p>
            </div>

            {error && (
                <p className="auth-error">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
               <div className="form-group">
                 <label>Email</label>
                 <input type="email" placeholder="Enter you email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                 <label>Password</label>
                 <input type="password" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} required/>
                </div>

                <button type="submit" className="auth-button">
                    Login
                </button>
            </form>

            <p className="auth-footer"> Don't have an account? {" "}
                <Link to="/register">Register</Link>
            </p>
        </div>
        </div>
    )
}

export default Login;