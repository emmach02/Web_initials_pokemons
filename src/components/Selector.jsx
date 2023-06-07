import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import './Selector.css'; // Importar archivo de estilos CSS personalizados

const Pokegrid = () => {

    const [pokemons, setPokemons] = useState([]);
    const [generation, setGeneration] = useState('1'); // Estado de la generación seleccionada
    const [region, setRegion] = useState(''); // Estado de la región principal

    useEffect(() => {

        const fetchPokemons = async () => {
            const responseGeneration = await axios.get(`https://pokeapi.co/api/v2/generation/${generation}`);
            const responseRegion = await axios.get(responseGeneration.data.main_region.url);
            
            const pokemonUrls = responseGeneration.data.pokemon_species.slice(0, 3).map(pokemon => pokemon.url);
            const pokemonData = await Promise.all(pokemonUrls.map(url => axios.get(url)));
            const pokemonList = pokemonData.map(response => response.data);

            const pokemonUrlsGen9 = responseGeneration.data.pokemon_species.slice(1, 4).map(pokemon => pokemon.url);
            const pokemonDataGen9 = await Promise.all(pokemonUrlsGen9.map(url => axios.get(url)));
            const pokemonListGen9 = pokemonDataGen9.map(response => response.data);
            
            if (generation === "9")
                setPokemons(pokemonListGen9)
            else {
                setPokemons(pokemonList);
            }
            
            setRegion(responseRegion.data.name);
        };
        
        fetchPokemons();
        }, [generation]); // Actualizar los pokemons y la región cuando cambie la generación seleccionada


    const handleGenerationChange = (event) => {
        setGeneration(event.target.value); 
    };

    console.log(pokemons)
    console.log(region)

    return (
        <div>

            <br></br>

            <div className="generation-selector">
                <label htmlFor="generation">Select Generation: </label>
                <select id="generation" value={generation} onChange={handleGenerationChange}>
                    <option value="1">Generation 1</option>
                    <option value="2">Generation 2</option>
                    <option value="3">Generation 3</option>
                    <option value="4">Generation 4</option>
                    <option value="5">Generation 5</option>
                    <option value="6">Generation 6</option>
                    <option value="7">Generation 7</option>
                    <option value="8">Generation 8</option>
                    <option value="9">Generation 9</option>
                </select>
            </div>

            <br></br>

            {region && (
                <h1 className="region-title">Region de {region} </h1>
            )}

            <br></br>

            {pokemons.map((pokemon, index) => (
                <div className="card" key={index}>
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} className="card-img-top pokemon-image" alt={pokemon.name} />
                    <div className="card-body">
                        <h5 className="card-title">{pokemon.name}</h5>
                        <p className="card-text">Habitat: {pokemon.habitat ? pokemon.habitat.name : 'Desconocido'}</p>
                        <p className="card-text">Capture Rate: {pokemon.capture_rate}</p>
                        <p className="card-text">Pokedex National Number: {pokemon.pokedex_numbers[0].entry_number}</p>
                        <p className="card-text">Pokedex {region} Number: {pokemon.pokedex_numbers[1].entry_number}</p>
                    </div>
                </div>
            
            ))}
            </div>
        );
};

export default Pokegrid;

