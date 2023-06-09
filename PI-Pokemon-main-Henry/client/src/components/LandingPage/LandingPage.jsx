import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import { getPokemons, getTypes, restore } from '../../actions/index';
import {Link} from "react-router-dom";
import s from'./LandingPage.module.css';

export default function LandingPage(){

    const dispatch = useDispatch();
    const allPokemons = useSelector((state)=>state.allPokemons);
    const [loadedPokemons /*, setLoadedPokemons*/] = useState(allPokemons.length ? true : false);

    useEffect(() =>{
        dispatch(restore())
        if(!loadedPokemons){
            dispatch(getTypes());
            dispatch(getPokemons());
        }
    }, [loadedPokemons, dispatch])

    // return(
    //     <div className={s.landingPageContainer}>
    //         { allPokemons.length ?
    //         <div className={s.landing}>
    //             <Link to='/pokemon'>
    //                 <button className={s.landingBtn}>Go!</button>
    //             </Link>
    //         </div>
    //         :
    //         <div className={s.loadingApp}>
    //             <h4>Loading Pokemon App...</h4>
    //         </div>
    //         }
    //     </div>
    // )
    return (
        <div className={s.landingPageContainer}>
          {allPokemons.length &&
            <div className={s.landing}>
              <Link to='/pokemon'>
                <button className={s.landingBtn}>Go!</button>
              </Link>
            </div>
          }
        </div>
    );      
}