// Code for a simple movie ticket purchasing system
let allMovies = [];
let currentMovie = null;

document.getElementById("buy-ticket").addEventListener("click", function btnClick() {
    if (!currentMovie) {
        // Handle case where no movie is selected
        return; 
    }

    const remainingTickets = currentMovie.capacity - currentMovie.tickets_sold; 
    const ticket = document.getElementById("ticket-num"); 
    const buyTicketButton = document.getElementById("buy-ticket");

    if (remainingTickets > 0) { 
        makeASale(currentMovie); 
    } else { 
        ticket.innerText = "SOLD OUT!!!"; 
        buyTicketButton.textContent = "SOLD OUT"; // Change button text to "SOLD OUT"
        buyTicketButton.disabled = true; // Disable the button when sold out
    } 
});

function getMovies(){
  // Fetch movie data from the server
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://localhost:3000/films", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            allMovies = result;
            listMovies(result) // Populate the movie list after update 
        })
        .catch((error) => console.error(error));
}

function listMovies(movies){
    const movieList = document.getElementById("films");
    let html = '';

    // Populate the HTML list dynamically from the 'movies' array
    for (let i=0;i<movies.length;i++ ) {
        let movie = movies[i];
        html = html+`<li class="film item" onclick="clickedMovie(${i})">${movie.title}</li>`;
    }
    movieList.innerHTML = html;
}
getMovies(); // Fetch the movies on page load

function clickedMovie(i) {
   // Update displayed movie details when a list item is clicked
    let poster = document.getElementById("poster");
    let clickedMovie = allMovies[i];
    poster.src = clickedMovie.poster;
    poster.alt = clickedMovie.title;
    movieInfo(clickedMovie.id); // Load more detailed movie info
}

function movieInfo(id) {
  // Fetch and display detailed movie information
    const movieTitle = document.getElementById("title");
    const runtime = document.getElementById("runtime");
    const info = document.getElementById("film-info");
    const showtime = document.getElementById("showtime");
    const ticket = document.getElementById("ticket-num");

    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch(`http://localhost:3000/films/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            movieTitle.innerText = result.title;
            runtime.innerText = `${result.runtime} minutes`;
            info.innerText = result.description;
            showtime.innerText = result.showtime;
            ticket.innerText = result.capacity - result.tickets_sold;
            currentMovie = result;
        })
        .catch((error) => console.error(error));
}

function makeASale (movie) {
  // Handle a ticket sale and update movie ticket count
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "title": movie.title,
  "runtime": movie.runtime,
  "capacity": movie.capacity,
  "showtime": movie.showtime,
  "tickets_sold": movie.tickets_sold +1,
  "description": movie.description,
  "poster": movie.poster,
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`http://localhost:3000/films/${movie.id}`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    movieInfo(movie.id);
  })
  .catch((error) => console.error(error));
}