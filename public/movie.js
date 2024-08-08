document.addEventListener('DOMContentLoaded', () => {
    const movieId = new URLSearchParams(window.location.search).get('id');
    const movieTitle = document.getElementById('movie-title');
    const moviePoster = document.getElementById('movie-poster');
    const movieReleaseDate = document.getElementById('movie-release-date');
    const movieRating = document.getElementById('movie-rating');
    const moviePlot = document.getElementById('movie-plot');
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    const commentContent = document.getElementById('comment-content');

    // some posters don't load properly so I'm using an alternate picture 
    const fallbackPoster = 'https://images.pexels.com/photos/1674303/pexels-photo-1674303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

    async function fetchComments() {
        try {
            const movieId = new URLSearchParams(window.location.search).get('id');
            console.log(`Fetching comments for movie ID: ${movieId}`);
            const response = await fetch(`/movies/${movieId}/comments`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const comments = await response.json();
            const commentsContainer = document.getElementById('comments-list');
            commentsContainer.innerHTML = '';
    
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p><strong>${comment.name}</strong>: ${comment.text}</p>
                    <p><em>${new Date(comment.date).toLocaleString()}</em></p>
                `;
                commentsContainer.appendChild(commentElement);
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }
    
    async function fetchMovieDetails() {
        try {
            const movieId = new URLSearchParams(window.location.search).get('id');
            const response = await fetch(`/movies/${movieId}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const movie = await response.json();
            
            document.getElementById('movie-title').textContent = movie.title;
            document.getElementById('movie-poster').src = movie.poster || 'path/to/fallbackPoster.jpg';
            document.getElementById('movie-release-date').textContent = `Release Date: ${new Date(movie.released).toLocaleDateString()}`;
            document.getElementById('movie-rating').textContent = `Rating: ${movie.imdb.rating}`;
            document.getElementById('movie-plot').textContent = `Plot: ${movie.plot}`;
    
            await fetchComments();
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }
    
    document.addEventListener('DOMContentLoaded', fetchMovieDetails);
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = commentContent.value;

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Tester',
                    email: 'TESEmail@testdomain.com',
                    movie_id: movieId,
                    text: commentContent
                })
            });

            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            console.log(response);
            commentContent.value = '';
            await fetchComments();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    });
    fetchMovieDetails();
});