import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPokemons, getTypes, removeDetails, orderByHp, orderByName, orderByStrength, filterByOrigin, filterByType } from "../../actions/index";
import { Link } from "react-router-dom";
import s from "./Home.module.css";
// import loading from '../../img/pokeBall.gif'
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import Card from "../Card/Card";
import Pagination from "../Pagination/Pagination";

export default function Home() {
    const dispatch = useDispatch();
    const allPokemons = useSelector((state)=>state.allPokemons);
    const types = useSelector((state)=>state.types);

    const [loadedPokemons /*, setLoadedPokemons*/] = useState(allPokemons.length ? true : false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pokemonPage /*, setPokemonPage*/] = useState(12);
    const indexLast = currentPage * pokemonPage;
    const indexFirst = indexLast - pokemonPage;
    const currentPokemons = allPokemons.slice(indexFirst, indexLast);
    const pagination = (pageNumber) => {setCurrentPage(pageNumber)}

    const [order, setOrder] = useState('')

    useEffect(()=>{
        dispatch(removeDetails());
        if(!loadedPokemons){
            dispatch(getPokemons());
            dispatch(getTypes());
        }
    }, [loadedPokemons, dispatch])

    useEffect(() =>{
        setCurrentPage(1);
    }, [allPokemons.length, setCurrentPage])

    function handleHpSort(e){
        e.preventDefault();
        dispatch(orderByHp(e.target.value));
        setOrder(`Hit Points ${e.target.value} order`);
        setCurrentPage(1);
        e.target.value= 'default';
    }

    function handleSort(e){
        e.preventDefault();
        dispatch(orderByName(e.target.value));
        setOrder(`Alphabetical ${e.target.value} order`);
        setCurrentPage(1);
        e.target.value= 'default';
    }

    function handleSortAttack(e) {
        e.preventDefault();
        dispatch(orderByStrength(e.target.value));
        setOrder(`Ordered by ${e.target.value} Pokemon`);
        setCurrentPage(1);
        e.target.value= 'default';
    }

    function handleFilterType(e) {
        e.preventDefault();
        dispatch(filterByType(e.target.value));
        setOrder(`Filtered by Type: ${e.target.value}`);
        e.target.value= 'default';
    }

    function handleFilterByOrigin(e){
        e.preventDefault();
        dispatch(filterByOrigin(e.target.value));
        setOrder(`Filtered by Origin: ${e.target.value}`);
        e.target.value= 'default';
    }

    function handleClearFilters() {
        document.querySelectorAll('select').forEach(select => {
          select.value = 'default';
        });
      
        handleSort({target: {value: 'default'}});
        handleHpSort({target: {value: 'default'}});
        handleSortAttack({target: {value: 'default'}});
        handleFilterType({target: {value: 'default'}});
        handleFilterByOrigin({target: {value: 'default'}});
    }
      
    return(
        <div className={s.home}>
            <NavBar/>
            <SearchBar/>
            <form className={s.filters}>
                <select className={s.homeFilters} value='default' onChange={e => handleSort(e)}>
                    <option disabled value = "default"> Name...</option>
                    <option value = "asc">A - Z</option>
                    <option value = "desc">Z - A</option>
                </select>
                <select className={s.homeFilters} value='default' onChange={e => handleHpSort(e)}>
                    <option disabled value = "default">Hit Points...</option>
                    <option value = "asc">Asc. order</option>
                    <option value = "desc">Desc. order</option>
                </select>
                <select className={s.homeFilters} value='default' onChange={e => handleSortAttack(e)}>
                    <option disabled value = "default">Strength...</option>
                    <option value = "strongest">Strongest attack</option>
                    <option value = "weakest">Weakest attack</option>
                </select>
                <select className={s.homeFilters} value='default' onChange={e => handleFilterType(e)}>
                    <option disabled value = "default">Type...</option>
                    <option value = 'all'>All</option>
                    {types?.map((type) => (
                    <option value = {type.name} key={type.name}>{type.name.charAt(0).toUpperCase()+type.name.slice(1)}</option>
                    ))}
                </select>
                <select className={s.homeFilters} value='default' onChange={e => handleFilterByOrigin(e)}>
                    <option disabled value = "default">Origin...</option>
                    <option value = "all">Show all...</option>
                    <option value = "originals">Originals...</option>
                    <option value = "created by User">Created By User...</option>
                </select>
                {order.length > 0 && (<span className={s.filtered}>{order}</span>)}
                <button className={s.clearFilters} onClick={handleClearFilters}>Clear Filters</button>
            </form>
            <div className={s.containerCards}>
                { currentPokemons.length === 0 ?
                    <h3>There are no Pokemon to show...</h3>
                    :
                    currentPokemons.map((pokemon)=>{
                        return(
                            <div className={s.homeCards} key={pokemon.id}>
                                <Link to={`/pokemon/${pokemon.id}`} className={s.homeCardsLink}>
                                    <Card
                                        name={pokemon.name}
                                        img={pokemon.img}
                                        hp={pokemon.hp}
                                        types={pokemon.types}
                                        id={pokemon.id}
                                        key={pokemon.id}
                                    />
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <Pagination
                    pokemonPage={pokemonPage}
                    Pokemons={allPokemons.length}
                    pagination={pagination}
                    page={currentPage}/>
            </div>
        </div>
    )
}