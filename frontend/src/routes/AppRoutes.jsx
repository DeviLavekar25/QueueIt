import { Routes, Route} from "react-router-dom"

import Home from "../pages/user/Home"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Dashboard from "../pages/admin/Dashboard"
import ProtectedRoute from "../components/ProtectedRoute"
import UserDashboard from "../pages/user/UserDashboard"
import Venues from "../pages/user/Venues"
import Queues from "../pages/user/Queues";
import QueueDetails from "../pages/user/QueueDetails"
import MyQueue from "../pages/user/MyQueue"

const AppRoutes = () =>{
    return(
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/admin/dashboard" element={
               <ProtectedRoute role="admin">
                 <Dashboard/>
               </ProtectedRoute>
            }/>
            <Route path="/dashboard" element={
                <ProtectedRoute role="user">
                    <UserDashboard/>
                </ProtectedRoute>
            }/>
            <Route path="/venues/:categoryId" element={
                <ProtectedRoute role="user">
                    <Venues/>
                </ProtectedRoute>
            }/>
            <Route
                 path="/queues/:venueId"
                 element={
                   <ProtectedRoute role="user">
                      <Queues />
                   </ProtectedRoute>
            }/>
            <Route path="/queue/:queueId" element={
                <ProtectedRoute role="user">
                    <QueueDetails />
                </ProtectedRoute>
            }/>
            <Route path="/my-queue" element={
                <ProtectedRoute role="user">
                     <MyQueue/>
                </ProtectedRoute>
            }/>
        </Routes>
    )
}

export default AppRoutes;
