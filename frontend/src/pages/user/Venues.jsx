import {useEffect,useState} from "react"
import api from "../../api/axios"
import {useParams,useNavigate} from "react-router-dom"
import "./Venues.css";

const Venues = () =>{
    const {categoryId}= useParams();
    const navigate = useNavigate();
    const [venues,setVenues] = useState([]);

    useEffect(()=>{
        const fetchVenues = async () =>{
            try{
               const response = await api.get("/venues");
               console.log("Venues:", response.data);

               const filteredVenues = response.data.venues.filter(
                  (venue)=> venue.category._id === categoryId
               );
               
               setVenues(filteredVenues);
            }catch(error){
                console.error(
                    "Failed to fetch venues: ",error.response?.data || error.message
                )
            }
        };
        fetchVenues();
    },[categoryId]);

    return(
        <div className="venues-page">

            <div className="venues-header">
            <h1>Available venues</h1>

            <p> Choose a venue to view the available queues.</p>

           <div className="venues-grid">

            {venues.map((venue)=>
                (
                    <div className="venue-card" 
                     key={venue._id}
                     onClick={() => navigate(`/queues/${venue._id}`)}
                     style={{ cursor: "pointer" }}>
                        <h2>{venue.name}</h2>
                        <p>{venue.address}</p>
                        <span className="venue-link"> View Queues</span>
                    </div>
                )
            )}
            </div>
        </div>
        </div>
    
    );
}

export default Venues