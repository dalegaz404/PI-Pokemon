const axios = require('axios');
const { Pokemon, Type } = require('../db');

const URL_API_POKEMON = 'https://pokeapi.co/api/v2/pokemon?limit=58';
const URL_API_POKEMON_NAME_OR_ID = 'https://pokeapi.co/api/v2/pokemon/';
const URL_API_POKEMON_TYPE = 'https://pokeapi.co/api/v2/type';

const getApiPokemons = async () => {
  try {
    const apiPokemons = [];
    const pokemonRequest = await axios.get(URL_API_POKEMON);
    const urlPokemonSubrequest = pokemonRequest.data.results.map((pokemon) => pokemon.url); // se crea la lista mapeando porcada Pokemon

    await axios.all(urlPokemonSubrequest.map((urlPokemonSubrequest) => axios.get(urlPokemonSubrequest))).then( // múltiples solicitudes HTTP en paralelo a las URLs 
      (foundPokemons) => {
        foundPokemons.map((foundPokemon) => apiPokemons.push({
          id: foundPokemon.data.id,
          name: foundPokemon.data.name,
          img: foundPokemon.data.sprites.other['official-artwork'].front_default,
          hp: foundPokemon.data.stats[0].base_stat, // data estadis
          attack: foundPokemon.data.stats[1].base_stat,
          defense: foundPokemon.data.stats[2].base_stat,
          speed: foundPokemon.data.stats[5].base_stat,
          height: foundPokemon.data.height,
          weight: foundPokemon.data.weight,
          createdInDb: false,
          types: foundPokemon.data.types.map((t) => t.type.name),
        }));
      },
    );
    return apiPokemons;
  } catch (error) {
    console.log(error);
  }
};

// const getApiPokemons = () => {
//   return fetch(URL_API_POKEMON)
//     .then((response) => response.json())
//     .then((data) => {
//       const urlPokemonSubrequest = data.results.map((pokemon) => pokemon.url);
//       const apiPokemons = [];

//       const pokemonPromises = urlPokemonSubrequest.map((url) => {
//         return fetch(url).then((response) => response.json());
//       });

//       return Promise.all(pokemonPromises).then((foundPokemons) => {
//         foundPokemons.forEach((foundPokemon) => {
//           apiPokemons.push({
//             id: foundPokemon.id,
//             name: foundPokemon.name,
//             img: foundPokemon.sprites.other['official-artwork'].front_default,
//             hp: foundPokemon.stats[0].base_stat,
//             attack: foundPokemon.stats[1].base_stat,
//             defense: foundPokemon.stats[2].base_stat,
//             speed: foundPokemon.stats[5].base_stat,
//             height: foundPokemon.height,
//             weight: foundPokemon.weight,
//             createdInDb: false,
//             types: foundPokemon.types.map((t) => t.type.name),
//           });
//         });

//         return apiPokemons;
//       });
//     })
//     .catch((error) => console.log(error));
// };


const getDbPokemons = async () => {
  const pokemonsDb = await Pokemon.findAll({
    include: {
      model: Type,
    },
  });
  const pokemonDb = pokemonsDb.map((pokemon) => {
    const result = pokemon.toJSON();
    return {
      ...result,
      types: result.types.map((type) => type.name),
    };
  });
  return pokemonDb;
};

const getAllPokemons = async () => {
  try {
    const apiPokemons = await getApiPokemons();
    const dbPokemons = await getDbPokemons();
    return [...apiPokemons, ...dbPokemons];
  } catch (error) {
    console.log(error);
  }
};

const getPokemonByNameOrId = async (id, name) => {
  if (id && !name) {
    try {
      const apiPokemon = await axios.get(`${URL_API_POKEMON_NAME_OR_ID}${id}`);
      const foundPokemon = apiPokemon.data;
      const pokemon = {
        id: foundPokemon.id,
        name: foundPokemon.name,
        img: foundPokemon.sprites.other['official-artwork'].front_default,
        hp: foundPokemon.stats[0].base_stat,
        attack: foundPokemon.stats[1].base_stat,
        defense: foundPokemon.stats[2].base_stat,
        speed: foundPokemon.stats[5].base_stat,
        height: foundPokemon.height,
        weight: foundPokemon.weight,
        types: foundPokemon.types.map((t) => t.type.name),
      };
      return pokemon;
    } catch (error) {
      console.log(error);
    }
  }
  if (!id && name) {
    try {
      const apiPokemon = await axios.get(`${URL_API_POKEMON_NAME_OR_ID}${name}`);
      const foundPokemon = apiPokemon.data;
      const pokemon = {
        id: foundPokemon.id,
        name: foundPokemon.name,
        img: foundPokemon.sprites.other['official-artwork'].front_default,
        hp: foundPokemon.stats[0].base_stat,
        attack: foundPokemon.stats[1].base_stat,
        defense: foundPokemon.stats[2].base_stat,
        speed: foundPokemon.stats[5].base_stat,
        height: foundPokemon.height,
        weight: foundPokemon.weight,
        types: foundPokemon.types.map((t) => t.type.name),
      };
      return pokemon;
    } catch (error) {
      console.log(error);
    }
  }
};

const getApiType = async () => {
  const typeApi = await axios.get(URL_API_POKEMON_TYPE);
  const types = typeApi.data.results;
  types.forEach((type) => {
    Type.findOrCreate({
      where: { name: type.name },
    });
  });
  const allTypes = await Type.findAll();
  return allTypes;
};

module.exports = {
  getAllPokemons,
  getDbPokemons,
  getPokemonByNameOrId,
  getApiType,
};
