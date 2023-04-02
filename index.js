const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const movieTitlesEl = document.getElementById('movie-titles')
const watchlistMoviesEl = document.getElementById('watchlist-movies')
const messageBoxEl = document.getElementById('message-box')
const watchlistMessageBoxEl = document.getElementById('watchlist-message-box')
   


let searchedMovie = ``
let searchResults = []
let moviesData = []
let watchlistMoviesData = JSON.parse(localStorage.getItem("watchlistMoviesData")) || []


console.log(watchlistMoviesData)


function getMoviesData(){
    const movieTitles = searchResults.map((movie => {
        return movie.Title
    }))

    movieTitles.forEach(movie => {
        fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=ba2bbbf5&t=${movie}`)
        .then(res => res.json())
        .then(data => {
            moviesData.push(data)
            renderMoviesHtml()
        })
    })

    console.log(moviesData)

}

function renderMoviesHtml(){

    const moviesHtml = moviesData.map((movie => {
        return `  
                <div class="movie-container">
                        <img src="${movie.Poster}"/>
                        <div class="movie-info">
                            <div class="movie-title">
                                <h2>${movie.Title}</h2>
                                <p><span>⭐️</span>${movie.imdbRating}</p>
                            </div>

                            <div class="movie-time">
                                <p>${movie.Runtime}</p>
                                <p>${movie.Genre}</p>
                                <button id="watchlist-btn" data-id="${movie.imdbID}">
                                <i class="fa-solid fa-circle-plus" style="color: #000000;"></i> Watchlist
                                </button>

                            </div>

                            
                            <p class="text-content">${movie.Plot}</p>
                        
                        </div>        

                </div> 

                
               `
    }))
    
    movieTitlesEl.innerHTML = moviesHtml.join('')

    

}
    
    

document.addEventListener('click', e => {
    if(e.target.id === 'watchlist-btn'){
        const movieId = e.target.getAttribute('data-id')
        console.log(movieId)
        console.log(moviesData)
        const movieToBeWatchlisted = moviesData.filter(movie => {
            return movie.imdbID === movieId
        })
        if (!watchlistMoviesData.includes(movieToBeWatchlisted[0])){
            console.log('adding to watchlist')
            watchlistMoviesData.push(movieToBeWatchlisted[0])    
        }
        else {
            console.log('already in watchlist')
        }

        console.log(watchlistMoviesData)

        localStorage.setItem("watchlistMoviesData" , JSON.stringify(watchlistMoviesData))
        
        
        

    }
})


document.addEventListener('click', e => {
    if(e.target.id === 'remove-watchlist-btn'){
        const movieId = e.target.getAttribute('data-id')
        console.log(movieId)
        console.log(watchlistMoviesData)
        let moviesToRemain = []
        if(watchlistMoviesData){
            moviesToRemain = watchlistMoviesData.filter(movie => {
                return movie.imdbID !== movieId
            })
        }

        watchlistMoviesData = []
        
        moviesToRemain.forEach(movie => {
            watchlistMoviesData.push(movie)
        })

        console.log(watchlistMoviesData)

        localStorage.setItem("watchlistMoviesData" , JSON.stringify(watchlistMoviesData))
        
        renderWatchlistMoviesHtml()
        

    }
})





function renderWatchlistMoviesHtml(){
  
    /* Could move all watchlist functionality to its own js file and 
    render the function straight away, but i will just keep all the functionality 
    in one file and call this function once the watchlist page loads*/

    if(watchlistMoviesData.length === 0){

        const emptyHtml = ` 

        <div class="message-container watchlist-message" id="watchlist-message-box">    
        <h3>Your watchlist is looking a little empty...</h3>
        <p><a href="index.html" target="_blank"><i class="fa-solid fa-circle-plus" style="color: #000000;"></i>Lets add some movies</a></p>
    </div>   

        
        `
        console.log(emptyHtml)
        watchlistMoviesEl.innerHTML = emptyHtml



        
    }
    else {
        
        const watchlistMoviesHtml = watchlistMoviesData.map((movie => {
            return `<div class="movie-container">
                        <img src="${movie.Poster}"/>
                        <div class="movie-info">
                            <div class="movie-title">
                                <h2>${movie.Title}</h2>
                                <p><span>⭐️</span>${movie.imdbRating}</p>
                            </div>

                            <div class="movie-time">
                                <p>${movie.Runtime}</p>
                                <p>${movie.Genre}</p>
                                <button id="remove-watchlist-btn" data-id="${movie.imdbID}">
                                <i class="fa-solid fa-circle-minus" style="color: #000000;"></i>
                                Remove
                                </button>

                            </div>

                            
                            <p class="text-content">${movie.Plot}</p>
                        
                        </div>        

                </div> 

                
               `

        }))
    
        
    
        console.log(watchlistMoviesHtml)
    
        watchlistMoviesEl.innerHTML = watchlistMoviesHtml.join('')
                                       
        
    }

    

}










/* 
const movieTitlesFullData = movieTitlesData.map(movie => {
     fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=ba2bbbf5&t=${movie}`)
        .then(res => res.json())
        .then(data => data)
    })


 function getTitlesFullData(){

    console.log(listOfMovieTitles)   

    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=ba2bbbf5&t=${movieTitles[0]}`)
        .then(res => res.json())
        .then(data => console.log(data))
    
    
function renderHtml(){

    const moviesHtml = moviesData.map((movie => {
        return `  <p>${movie.Title}</p>
                  <p>${movie.Actors}</p>
                  <p>${movie.Awards}</p>
                  <p>${movie.Language}</p>
                  <p>${movie.imdbRating}</p>
                  <p>${movie.Released}</p>
                `
    }))
    
    movieTitlesEl.innerHTML = moviesHtml.join('')

}



}   
    
*/


searchBtn.addEventListener('click', () => {
     
    
    moviesData = []
    if(searchInput.value){
        searchedMovie = searchInput.value
        console.log(searchedMovie)
        fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=ba2bbbf5&s=${searchedMovie}`)
            .then(res => res.json())
            .then(data => {
            console.log(data) 
            if(data.Search){
                searchResults = data.Search
                console.log(searchResults)
                getMoviesData()
            }
            else if (data.Error === 'Too many results.'){
                messageBoxEl.innerHTML = `<h3 class="message" >There are too many results, please be more specific and try another search </h3>`
            }   
            else (messageBoxEl.innerHTML = `<h3 class="message" >Unable to find what you are looking for, please try another search </h3>`)
            
        })
    }
    else {
        messageBoxEl.innerHTML = ` <h3 class="message" >You need to search for a movie</h3>`
    }    
})




