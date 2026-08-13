import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import api from "../../api/axios"
import "./QueueDetails.css"

const QueueDetails = () =>{
    const {queueId} = useParams();

    const [queue,setQueue] = useState(null);
    const [queueEntry,setQueueEntry] = useState(null);
    const [joining,setJoining] = useState(false);

    const handleJoinQueue = async() =>{
      try{
        setJoining(true);

        const response = await api.post(`/queues/${queueId}/join`);
        console.log("Join Queue:", response.data);

        setQueueEntry(response.data);

      }catch(error){
        console.error("FAiled to join queue:", error.response?.data || error.message)
      }finally{
        setJoining(false);
      }
    }

    useEffect(()=>{
        const fetchQueue = async() =>{
          try{
        const response = await api.get(`/queues/${queueId}`)
        console.log("Queue: ",response.data)
        setQueue(response.data.queues);
        }catch(error){
           console.error(
          "Failed to fetch queue:",
          error.response?.data || error.message
        );
        }
    };
    fetchQueue()  ;
    },[queueId]);
   
 if (!queue) {
    return <div>Loading...</div>;
  }

  return (
   <div className="queue-details-page">
      <div className="queue-details-card">
        <div className="queue-details-header">
          <h1>{queue.serviceName}</h1>

          <p>Venue: {queue.venue?.name}</p>
        </div>

      <div className="queue-main-token">
        <span>Currently Serving: </span>
        <strong>{queue.currentToken}</strong>
      </div>

      <div className="queue-details-stats">

       <div>
        <span>
          Last Token
        </span>
        <strong>{queue.lastToken}</strong>
       </div>

      <div>
       <span>Service Time</span>
       <strong> {queue.estimatedServiceTime} min </strong>
      </div>

      </div>

      <div className="queue-detail-status">
        <span>Status</span>
        <span className={`queue-status ${queue.status}`}>
          {queue.status}
        </span>
      </div>


     {queue.status ==="open" ? (
      <button className="join-queue-button"
         onClick={handleJoinQueue} disabled={joining}>
        {joining ? "Joining..." : "Join Queue"}
      </button>
     ):(
      <p className="queue-closed-message">
          This queue is currently closed.
        </p>
     )}

      {queueEntry && (
        <div className="join-success">
           <h2> Queue joined successfully!</h2>

           <div className="joined-token"><span>Your Token </span>
             <strong>{queueEntry.tokenNumber}</strong>
            </div>

           <p>Position: <strong>{queueEntry.position}</strong></p>
           <p>Estimated Wait: {" "}
             <strong>{queueEntry.estimatedWaitTime} min </strong></p>
           <p>
            Status: {" "}
            <span className="joined-status">{queueEntry.queueEntry.status}</span>     
            </p>
        </div>
      )}
    </div>
    </div>
  );
}

export default QueueDetails;