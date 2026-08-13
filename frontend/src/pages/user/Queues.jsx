import {useState, useEffect} from "react"
import api from "../../api/axios"
import {useParams,useNavigate} from "react-router-dom"
import "./Queues.css"

const Queues = () =>{
    const navigate = useNavigate();
    const {venueId} = useParams()
    const [queues,setQueues] = useState([]);

    useEffect(()=>{
       
        const fetchQueues = async() =>{
            try{
                const response = await api.get("/queues")
                console.log("Queues: ", response.data)
                const filteredQueues = response.data.queues.filter(
                    (queue)=> queue.venue._id === venueId
                );

                console.log("Filtered Queues: ",filteredQueues)

                setQueues(filteredQueues);
            }catch(error){
                console.error(
                  "Failed to fetch queues:",
                   error.response?.data || error.message
            );
            }
        }
        fetchQueues();
    },[venueId]);

return(
    <div className="queues-page">

        <div className="queues-header">
        <h1>Available Queues</h1>
        <p> Choose a service to view its current queue status.</p>
        </div>

      <div className="queues-grid">

        {queues.map((queue)=>(
            <div className="queue-list-card"
                key={queue._id}
                onClick={()=>navigate(`/queue/${queue._id}`)}
                style = {{cursor:"pointer"}}>

                <h2>{queue.serviceName}</h2>

            <div className="queue-list-info">

            <div>
              <span>Currently Serving</span>
              <strong>{queue.currentToken}</strong>
            </div>

            <div>
              <span>Last Token</span>
              <strong>{queue.lastToken}</strong>
            </div>

          </div>

           <div className="queue-list-status">
             <span>Status</span>

             <span className={`queue-status ${queue.status}`}>
              {queue.status}
            </span>
          </div>

          <p className="service-time">
            Estimated Service Time:{" "}
            <strong>{queue.estimatedServiceTime} min</strong>
          </p>

          <span className="queue-link">
            View Queue
          </span>
                
        </div>
        ))}
    </div>
    </div>
)
};

export default Queues