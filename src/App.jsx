import LinkContainer from "./components/LinkContainer"
import PokemonSearchForm from "./components/PokemonSearchForm"
import SearchResults from "./components/SearchResults"
import './index.css'
import { useState } from "react"

function App() {
  //"pokemonData" will hold the full object returned by PokeAPI (or null before we fetch)
  const [pokemonData, setPokemonData] = useState(null)
  const [isPokemon, setIsPokemon] = useState(true)
  

  // This function is called by PokemonSearchForm when the user submits a name.
  const handleSearch = async (pokemonName) => {
    try {
      let API_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      const response = await fetch(API_URL)

      // If the response is not in the 200 range, throw an error we can catch below.
      if(!response.ok) {
        setIsPokemon(false)
        setPokemonData(null)
      }

      // Await pauses here until the HTTP response comes back
      // Convert the response body from JSON text into JavaScript object.
      const data = await response.json();

      // Save the data into state so React will re-render and pass it to SearchResults
      setPokemonData(data)
      setIsPokemon(true)
    } catch (error) {
      console.error(error)
      // If there is an error (network error or Pokemon not found),
      // clear any previous data so SearchResults can show an error message instead.
      setPokemonData(null)
      setIsPokemon(false)
    }
  }

  return (
    <div className="pt-10">
        <img src="src/assets/images/Pokesearch.png" className="w-auto h-[150px] block; mx-auto" />
        {/* <LinkContainer /> */}

        {/* Pass handleSearch into the form so it can call this when the user submits. */}
        <PokemonSearchForm onSearch={handleSearch} />

        {/* Pass the fetched data down to SearchResults as a prop called "pokemonData" */}
        <SearchResults pokemonData={pokemonData} isPokemon={isPokemon}/>
        
      
    </div>
    
  )
}

export default App