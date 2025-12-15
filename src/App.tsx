import { useState, useEffect } from 'react'
import './App.css'
import type { Cat } from './types/cat';
import CatCard from './components/CatCard';

function App() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCats = async() => {
      try{
        const response = await fetch('https://cataas.com/api/cats?limit=10&skip=0');
        const data: any[] = await response.json();

        const initialCats: Cat[] = data.map((cat: any) => ({
          id: cat.id,
          url: `https://cataas.com/cat/${cat.id}`,
          tags: cat.tags,
          liked: null,
        }));
        setCats(initialCats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cats:",  error);
        setLoading(false);
      }
    };
    fetchCats()
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDecision = (catId: string, liked: boolean) => {
  setCats(prevCats => 
      prevCats.map(cat => 
          cat.id === catId ? { ...cat, liked: liked } : cat
     )
    );
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  if (loading){
    return <h1>Loading Kitties... </h1>
  }

  if (cats.length === 0){
    return <h1>No cats available</h1>
  }

  const allCatsProcessed = currentIndex >= cats.length;

  if (allCatsProcessed){
  //This is where we will render the Summary component later (Step 4)
    const likedCats = cats.filter(cat => cat.liked === true);
    
    return (
        <div className="summary-container">
            <h1>🎉 All Kitties Reviewed!</h1>
            <p>You liked *{likedCats.length}** out of {cats.length} kitties.</p>
            {/* We'll display the liked cats here later */}
        </div>
    );
  }

  const currentCat = cats[currentIndex];

  return (
    <div className = "app-container">
      <h1>Paws & Preferences: Find your Favourite Kitty</h1>
      {/* For each */}
      <CatCard cat={currentCat} onDecision={handleDecision} />
        
    </div>
  )
}

export default App
