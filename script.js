// JS Step 1: API configuration
const API_KEY = "e3e67a17db844b4735380b87e232a8cd"; // Your API key goes in the empty string
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// JS Step 2: DOM Elements (Finished already -- no edits needed)
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResultsContainer = document.getElementById("search-results");
const favoritesContainer = document.getElementById("favorites");
const searchViewBtn = document.getElementById("search-view-btn");
const favoritesViewBtn = document.getElementById("favorites-view-btn");

// JS Step 3: State
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// JS Step 4: Event Listeners

// 4.1: Click searchButton or press Enter key in searchInput to trigger searchMovies()
searchButton.addEventListener("click", searchMovies);
searchInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter"){
        searchMovies();
    }
})

// 4.2: Click searchViewBtn to activate the search view and hide the favorites
searchViewBtn.addEventListener("click", () => {
    searchViewBtn.classList.add("active");
    favoritesViewBtn.classList.remove("active");
    searchResultsContainer.classList.add("active");
    favoritesContainer.classList.remove("active");
})

// 4.3: Click favoritesViewBtn to activate the favorites view and hide the search view
favoritesViewBtn.addEventListener("click", () => {
    favoritesViewBtn.classList.add("active");
    searchViewBtn.classList.remove("active");
    favoritesContainer.classList.add("active");
    searchResultsContainer.classList.remove("active");
    displayFavorites();
})


// JS Step 5: Define core functions

// 5.1: searchMovies()
async function searchMovies(){
    const searchTerm = searchInput.ariaValueMax.trim();

    if (searchTerm === ""){
        return; 
    }

    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`
        );

        const data = await response.json();
        displayMovies(data.results, searchResultsContainer);
    } catch (error){
        console.error("Error search movies:", error);
        searchResultsContainer.innerHTML = '<div class="no-results">An error occured. Please try again. </div>';
    }
}



// 5.2: displayMovies()

function displayMovies(movies, container) {
    container.innerHTML = "";
  
    if (movies.length === 0) {
      container.innerHTML = '<div class="no-results">No movies found</div>';
      return;
    }
  
    movies.forEach((movie) => {
      const isFavorite = favorites.some((fav) => fav.id === movie.id);
  
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
  
      const posterPath = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image+Available";
  
      movieCard.innerHTML = `
              <img class="movie-poster" src="${posterPath}" alt="${movie.title}">
              <div class="movie-info">
                  <div class="movie-title">${movie.title}</div>
                  <div class="movie-release">${
                    movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"
                  }</div>
                  <button class="favorite-btn ${
                    isFavorite ? "active" : ""
                  }" data-id="${movie.id}">
                      <i class="${
                        isFavorite ? "fas fa-heart" : "far fa-heart"
                      }"></i>
                  </button>
              </div>
          `;
  
      container.appendChild(movieCard);
  
      // Add event listener to favorite button
      const favoriteBtn = movieCard.querySelector(".favorite-btn");
      favoriteBtn.addEventListener("click", () =>
        toggleFavorite(movie, favoriteBtn)
      );
    });
  }
  
  function toggleFavorite(movie, button) {
    const index = favorites.findIndex((fav) => fav.id === movie.id);
  
    if (index === -1) {
      // Add to favorites
      favorites.push(movie);
      button.classList.add("active");
      button.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
      // Remove from favorites
      favorites.splice(index, 1);
      button.classList.remove("active");
      button.innerHTML = '<i class="far fa-heart"></i>';
  
      // If we're in favorites view, remove the card
      if (favoritesContainer.classList.contains("active")) {
        button.closest(".movie-card").remove();
  
        if (favorites.length === 0) {
          favoritesContainer.innerHTML =
            '<div class="no-results">No favorite movies yet</div>';
        }
      }
    }
  
    // Save to localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
  
  function displayFavorites() {
    if (favorites.length === 0) {
      favoritesContainer.innerHTML =
        '<div class="no-results">No favorite movies yet</div>';
      return;
    }
  
    displayMovies(favorites, favoritesContainer);
  }
  
  // Initialize the app
  searchViewBtn.click(); // Start with search view active


// IF TIME: 5.3: toggleFavorite()




// IF TIME: 5.4: displayFavorites()