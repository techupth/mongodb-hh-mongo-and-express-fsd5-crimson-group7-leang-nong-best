import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4008/movies?limit=10');
      setMovies(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Movies</h1>
      <ul>
        {movies
          .filter(movie => 
            movie.poster && // ตรวจสอบว่ามี Poster
            movie.title && movie.imdb && movie.released // ตรวจสอบข้อมูลที่จำเป็นอื่นๆ
          )
          .slice(0, 10)
          .map(movie => (
            <li key={movie._id}>
              <h2>{movie.title}</h2>
              <img src={movie.poster} alt={`${movie.title} Poster`} />
              <div>
                <p>Rating: {movie.imdb.rating}</p>
                <p>Votes: {movie.imdb.votes}</p>
                <p>ID: {movie.imdb.id}</p>
              </div>
              <div>Released: {movie.released}</div>
            </li>
          ))}
      </ul>
    </div>
  );
  
  
  
  
  
  
  
  
};

export default MovieList;