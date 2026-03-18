function SearchResults({ pokemonData, isPokemon }) {
    if(isPokemon === false) {
        return(
            <div className="stats">
                {/* Shown when there is no Pokemon loaded yet */}
                Looks like we can't find that Pokemon...
            </div>
        )
    }

    if(!pokemonData) {
        // If there is no data yet (user has not searched, or error occurred)
        // we can return a simple message or nothing at all
        return(
            <div className="stats">
                {/* Shown when there is no Pokemon loaded yet */}
                Start searching for a Pokemon!
            </div>
        )
    }

    

    const temp_name = pokemonData.name;                     // e.g., "Pikachu"
    const name = temp_name.replace("-"," ")
    const imageUrl = pokemonData.sprites.front_default;     // a small front-facing sprite
    const base_experience = pokemonData.base_experience;    // numeric value
    const height = pokemonData.height;                      // in decimeters
    const weight = pokemonData.weight;                      // in hectograms
    const types = pokemonData.types.map(t => t.type.name)   // array like ["electric"]

    return (
        <div className = "search-results">
            <section className = "stats">
            {/* Name with first letter capitalized */}
            
            <h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>

            {/* Pokemon image */}
            
            {imageUrl && (
                <img src={imageUrl} alt={name} className="pokemonimg"/>
            )}

            {/* Basic info list */}
            
            <ul>
                <li><strong>Base experience:</strong> {base_experience}</li>
                <li><strong>Height:</strong> {height}</li>
                <li><strong>Weight:</strong> {weight}</li>
                <li>
                    <strong>Types:</strong> {types.join(", ")}
                </li>
            </ul>
            </section>
        </div>
    )

}

export default SearchResults