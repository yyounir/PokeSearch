import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {useEffect, useMemo, useState} from "react";

function PokemonSearchForm({onSearch}) {

    const [pokemon, setPokemon] = useState("");
    // "pokemon" holds whatever the user types into the text field.

    // Full list (loaded once)
    const [allNames, setAllNames] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [listError, setListError] = useState("");

    // UI state for dropdown
    const [isOpen, setIsOpen] = useState(false);

    // Fetch the list of al pokemon names exactly once when this component mounts
    useEffect(() => {
        let cancelled = false; // protoect against setting state after unmount

        async function loadNames() {
            try {
                setListLoading(true);
                setListError("");

                // Ask PokeAPI for up to 2000 Pokemon (names + urls)
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0");
                if(!response.ok) throw new Error("Failed to load Pokemon list");

                const data = await response.json();

                // Extract just the name from each result
                const names = (data?.results ?? []).map((r) => r.name)

                if (!cancelled) setAllNames(names);
                } catch (e) {
                    if (!cancelled) setListError(e.message || 'Failed to load Pokémon list');
                } finally {
                    if (!cancelled) setListLoading(false);
                }

        }

        loadNames();

        return () => {
            cancelled = true;
        };

    }, []);

        
      // Compute the current list of suggestions from the full list + current input
        const suggestions = useMemo(() => {
            const q = pokemon.trim().toLowerCase();
            if (!q) return []; // nothing typed → no suggestions
            // Filter names that start with the typed text and limit to first 8
            return allNames
            .filter((name) => name.startsWith(q))
            .slice(0, 8);
        }, [pokemon, allNames]);
    

    // Runs when the user submits the form (click or enter)
    let handleSubmit = (event) => {
        event.preventDefault();
        const name = pokemon.trim();
        if (!name) return;
        onSearch(name);              // Call the function from App, passing the typed name.
        // console.log(pokemon)
        
        setIsOpen(false);
        setPokemon("")                  // clear the input field after submitting
    }

    // Runs every time the user types somthing in the input
    let handlePokeChange = (event) => {
        // console.log(event.target.value)
        const value = event.target.value;
        setPokemon(value)  // Keep "pokemon" state in sync with input value

        // Dropdown opens as user types
        setIsOpen(true);

    }

    function chooseSuggestion(name) {
        // Trigger the same search flow as manual typing + submit
        onSearch(name);

        // Reset input and hide dropdown
        setPokemon(``);
        setIsOpen(false);

    }



    return(
        <form className="bg-[white] text-center w-6/12 p-2.5 rounded-[20px] mx-auto" onSubmit={handleSubmit}  style={{ position: 'relative' }}>
            {/* <label>Search Pokemon:</label><br/> */}
            <input 
            type="text" 
            id="pokemon-name" 
            name="pokemon-name" 
            className="px-4 py-2 bg-red-100 text-red-950 rounded-4xl focus:rounded-xl focus:bg-red-200 transition-all duration-150"
            placeholder='Search a Pokemon'
            onChange={handlePokeChange} // Update state when user types
            value={pokemon}             // Make the input controlled by React state.
            autoComplete="off" // turn off browser's own autocomplete
            onFocus={() => setIsOpen(true)} // show suggestions when input gets focus
            onBlur={() => {
            // Slight delay so a click on a suggestion still fires before closing
            setTimeout(() => setIsOpen(false), 120);
            }}
            />

            {/* Disabled when the input is empty, to avoid blank searches. */}
            <button type="submit" className="px-4 py-2 rounded-4xl bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer active:bg-red-900 active:rounded-xl transition-all duration-150" disabled={pokemon === ""}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>

            {/* Suggestion dropdown, only visible when open and we actually have matches */}
                {isOpen && suggestions.length > 0 && (
                    <ul
                    className='dropdown'
                    >
                    {suggestions.map((name) => (
                        <li key={name}>
                        <button
                            type="button"
                            // Prevent the input from losing focus before click completes
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => chooseSuggestion(name)}
                            className='dropbtn'
                        >
                            {name}
                        </button>
                        </li>
                    ))}
                    </ul>
                )}
        </form>
    )
}

export default PokemonSearchForm