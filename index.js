const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const movieTitlesEl = document.getElementById('movie-titles')
const watchlistMoviesEl = document.getElementById('watchlist-movies')

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
                            <div>
                                <h1>${movie.Title}</h1>
                                <p>⭐️ : ${movie.imdbRating}</p>
                            </div>

                            <div>
                                <p>${movie.Runtime}</p>
                                <p>${movie.Genre}</p>
                                <button id="watchlist-btn" data-id="${movie.imdbID}">
                                    add to watchlist
                                </button>

                            </div>

                            
                            <p>${movie.Plot}</p>
                        
                        </div>        

                </div> 

                <br>
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

        const emptyHtml = ` <p class="message">Looking kinda empty, <a href="index.html">click here</a> to add some movies.</p>`
        console.log(emptyHtml)
        watchlistMoviesEl.innerHTML = emptyHtml



        
    }
    else {
        
        const watchlistMoviesHtml = watchlistMoviesData.map((movie => {
            return `
                     
        <div class="movie-container">
                <img src="${movie.Poster}"/>
                <div class="movie-info">
                    <div>
                        <h1>${movie.Title}</h1>
                        <p>⭐️ : ${movie.imdbRating}</p>
                    </div>

                    <div>
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <button id="remove-watchlist-btn" data-id="${movie.imdbID}">remove from watchlist</button>
                            

                    </div>

                    
                    <p>${movie.Plot}</p>
                
                </div>        

        </div> 

        <br>
                    
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
                movieTitlesEl.innerHTML = `<h1 class="message" >There are too many results, please be more specific and try another search </h1>`
            }   
            else (movieTitlesEl.innerHTML = `<h1 class="message" >Title does not exist, please try another search </h1>`)
            
        })
    }
    else {
        movieTitlesEl.innerHTML = ` <h1 class="message" >you need to search for a movie</h1>`
    }    
})




