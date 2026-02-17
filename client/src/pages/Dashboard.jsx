import React from 'react'
import {useEffect,useState} from 'react'
import API from '../Api'

function Dashboard() {

    const [recipe,setRecipe]=useState([]);
    const [loading,setLoading]=useState(true);


    useEffect(()=>{
        const fetchRecipe=async()=>{
            try {
                setLoading(true)
                const response=await API.axios(`/getRecipe`);
                setRecipe(response.data.data);
                setLoading(false);

                
            } catch (error) {
                console.log("error occured while fetching Api",error);
                
            }
        }
        fetchRecipe();
    },[]);
    if (loading) return <div> </div>;
    

  return (
    <div> 
        <h1>My Recipes</h1>
        {recipe.map((item)=>(
          <div key={item._id}>
           <h3>{item.recipeName}</h3> 
          </div>   

        ))}

    </div>
  )
}

export default Dashboard