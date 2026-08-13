import {useState, useEffect} from "react"
import api from "../../api/axios"
import socket from "../../socket"
import "./MyQueue.css"

const MyQueue = () =>{
    const [queueEntry, setQueueEntry] = useState(null);
    const [cancelling,setCancelling] = useState(false);

    useEffect(()=>{
        const fetchMyQueue = async() =>{
            try{
                const response = await api.get("/queue-entry/my");
                console.log("My Queue:", response.data);
                setQueueEntry(response.data.queueEntry);

            }catch(error){
                console.error("Failed to fetch my queue", error.response?.data || error.message)
            }
        }
        fetchMyQueue();
    },[]);

    useEffect(()=>{
        if(!queueEntry?.queue?._id){
            return;
        }

        socket.emit("joinQueue",queueEntry.queue._id);
        console.log("Joined Socket.IO queue:", queueEntry.queue._id);

        return()=>{
            socket.emit("leaveQueue",queueEntry.queue._id);

            console.log("Left Socket.IO queue: ",queueEntry.queue._id )
        }
    }, [queueEntry]);

    useEffect(()=>{
        const handleQueueUpdate = (data)=>{
            console.log("Queue updated: ",data);

            if(data.queueId === queueEntry?.queue?._id){
                setQueueEntry((prev)=>({
                    ...prev,
                    queue:{
                        ...prev.queue,
                        currentToken: data.currentToken,
                    },

                    ...(data.servedToken === prev.tokenNumber ?
                        {status:"served"} : {}
                    ),
                }));
            }
        };

        socket.on("queueUpdated", handleQueueUpdate);

        return() =>{
            socket.off("queueUpdated", handleQueueUpdate);
        }
    }, [queueEntry?.queue?._id])

    const handleCancel = async() =>{
        try{
            setCancelling(true);

            const response = await api.post(
                `/queue-entry/${queueEntry._id}/cancel`
            );
            console.log("Cancelled: ",response.data);
            setQueueEntry((prev)=>({
                ...prev,
                status:"cancelled"
            }));

        }catch(error){
            console.error("Failed to cancel queue:", error.response?.data || error.message);
        }finally{
            setCancelling(false);
        }
    }

    if(!queueEntry){
        return <div>Loading...</div>
    }

    const peopleAhead = Math.max(
        queueEntry.tokenNumber - queueEntry.queue.currentToken -1, 0
    )

    const estimatedWaitTime = peopleAhead * queueEntry.queue.estimatedServiceTime;

    return(
      <div className="my-queue-page">
        <h1 className="my-queue-title">My Queue</h1>
        
      <div className="my-queue-card">
      <h2>{queueEntry.queue.serviceName}</h2>

      <p className="venue-name">
        Venue: {queueEntry.queue.venue?.name}
      </p>

      <div className="my-token">
        <span>
        Your Token </span>
        <strong>{queueEntry.tokenNumber} </strong>
      </div>

      <div className="queue-stats">

       <div>
       <span> Currently Serving</span>
       <strong>{queueEntry.queue.currentToken} </strong> 
      </div>

      <div>
        <span>People Ahead</span>
        <strong>{peopleAhead}</strong>
      </div>

      <div>
        <span>Estimated Wait</span>
        <strong>{estimatedWaitTime} min</strong>
      </div>


      <div className="status-container">
        <span>Status</span> 
        <strong className={`my-status ${queueEntry.status}`}>
          {queueEntry.status}
        </strong>
      </div>

    </div>

    {queueEntry.status === "waiting" && (
      <button className="cancel-button" onClick={handleCancel} disabled={cancelling}>
         {cancelling ? "Cancelling..." : "Cancel Queue"}
      </button>
    )}

      <p className="joined-time">
        Joined At: {new Date(queueEntry.joinedAt).toLocaleString()}
      </p>
    </div>

    </div>
    
)
}

export default MyQueue