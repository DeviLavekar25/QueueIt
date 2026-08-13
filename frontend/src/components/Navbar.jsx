import {Link} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

const Navbar = () => {
    const {user,logout} = useAuth();
    
    return (
        <nav className="flex items-center justify-between bg-slate-900 px-8 py-4 text-white">
            <Link to="/" className="text-2xl font-bold">QueueIt</Link>
            
            <div className="flex items-center gap-6">

                <Link to="/" className="hover:text-blue-400">Home </Link>

                {user ? (
                   <>
                   {user.role==="admin" ? (
                     <Link to="/admin/dashboard" className="hover:text-blue-400">
                        Admin Dashboard
                     </Link>
                   ) : (
                    <Link to="my-queue" className="hover:text-blue-400">
                        My Queue
                    </Link>
                   )}
                                       
                    <span>Welcome, {user.name}</span>

                    <button onClick={logout} className="hover:text-red-400">
                        Logout
                    </button>
                  </>
                ) :(
                <>
                <Link to="/login" className="hover:text-blue-400">Login</Link>
                <Link to="/register" className="hover:text-blue-400">Register</Link>
               </>
                )}
               
            </div>
        </nav>
    )
}

export default Navbar;