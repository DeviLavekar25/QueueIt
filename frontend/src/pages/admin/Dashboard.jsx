import {useEffect, useState} from "react"
import api from "../../api/axios"
import socket from "../../socket"
import "./Dashboard.css";

const Dashboard = () =>{
  const [queues, setQueues] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);

  useEffect(()=>{
    const fetchQueues = async() =>{
      try{
        const response = await api.get("/queues");
        console.log("Admin Queues:", response.data);
        setQueues(response.data.queues);
      }catch(error){
        console.error("Failed to fetch queues:", error.response?.data || error.message)
      }
    }
    fetchQueues();
  },[]);

  useEffect(()=>{
    const handleQueueUpdate = (data)=>{
      console.log("Admin Queue Updated:", data);

      setQueues((prevQueues)=>
          prevQueues.map((queue)=>
             queue._id === data.queueId 
               ? {
                ...queue,
                currentToken: data.currentToken,
                lastToken: data.lastToken,
                peopleWaiting:data.peopleWaiting,
               } : queue

          )     
       )
    };

    socket.on("queueUpdated", handleQueueUpdate);

    return () =>{
      socket.off("queueUpdated", handleQueueUpdate);
     }
  }, []);

  useEffect(()=>{
    if(queues.length ===0){
      return;
    }

    queues.forEach((queue)=>{
      socket.emit("joinQueue",queue._id);
    })

    return () =>{
      queues.forEach((queue)=>{
        socket.emit("leaveQueue",queue._id);
      })
    }
  },[queues]);

  const handleServeNext = async(queueId)=>{
    try{
      const response = await api.post(`/queues/${queueId}/next`);
      console.log("Serve Next: ", response.data);

    }catch(error){
      console.error("Failed to serve next: ", error.response?.data || error.message);
    }
  }

  const handleViewHistory = async (queueId)=>{
    try{
      const response = await api.get(`/queues/${queueId}/history`);
      console.log("Queue History: ", response.data);
      setHistory(response.data.history);
      setSelectedQueue(queueId);

    }catch(error){
      console.error("Failed to fetch queue history", error.response?.data || error.message);
    }
  };

  return(
    <div className="dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

       <p className="dashboard-subtitle">
          Manage queues and monitor customers in real time.
       </p>

      <div className="summary-container">
        <div className="summary-card">
          <span>Total Queues</span>
          <strong>{queues.length}</strong>
        </div>

        <div className="summary-card">
          <span>Open Queues</span>
          <strong>
            {queues.filter((queue)=> queue.status === "open").length}
          </strong>
        </div>

        <div className="summary-card">
          <span>Waiting Customers</span>
          <strong>
            {queues.reduce(
              (total,queue)=> total + (queue.peopleWaiting || 0), 0
            )}
          </strong>
        </div>

      </div>


      <h2>Queues</h2>

      <div className="queues-container">

      {queues.map((queue)=>(
        <div className="queue-card" key={queue._id}>
          <h3>{queue.serviceName}</h3>
          <p className="queue-info">Venue: {queue.venue?.name}</p>

          <div className="current-token"><span>Currently Serving </span><strong>{queue.currentToken}</strong></div>

          <p className="queue-info">Last Token: {queue.lastToken}</p>

          <div className="status-row"><span>Status</span> 
            <span className={`status-badge ${queue.status}`}>
              {queue.status}
            </span>
          </div>

          <div className="queue-actions">

          <button onClick={()=>handleServeNext(queue._id)}>
            Serve Next
          </button>

          <button onClick={()=>handleViewHistory(queue._id)}>
            View History
          </button>

          </div>
        </div>
      ))}

    </div>
      {selectedQueue && (
  <div className="history-section">
    <h2>Queue History</h2>

    <button onClick={()=>setSelectedQueue(null)}>
       Hide History
    </button>

    {history.length === 0 ? (
      <p>No history available.</p>
    ) : (
      <table className="history-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>User</th>
            <th>Email</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Served</th>
          </tr>
        </thead>

        <tbody>
          {history.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.tokenNumber}</td>
              <td>{entry.user?.name || "Unknown"}</td>
              <td>{entry.user?.email || "N/A"}</td>
              <td>
                <span className={`history-status ${entry.status}`}>
                {entry.status}
                </span>
              </td>
              <td>
                {new Date(entry.joinedAt).toLocaleString()}
              </td>
              <td>
                {entry.servedAt
                  ? new Date(entry.servedAt).toLocaleString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}
    </div>
  )
}

export default Dashboard;