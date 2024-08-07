document.addEventListener('DOMContentLoaded', () => {
    const limit = 10;
    let currentPage = 1;

    // Elements for form visibility
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const showMovies = document.getElementById('show-movies');

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const movieList = document.getElementById('movie-list');

    // Static fallback image URL
    const fallbackPoster = 'https://images.pexels.com/photos/1674303/pexels-photo-1674303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

    // Show or hide forms and movie list
    showRegister.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        movieList.classList.add('hidden');
    });

    showLogin.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        movieList.classList.add('hidden');
    });

    showMovies.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.add('hidden');
        movieList.classList.remove('hidden');
        fetchMovies(currentPage); // Fetch movies when showing movie list
    });

    // Function to fetch and display movies
    const fetchMovies = async (page = 1) => {
        const genre = document.getElementById('filter-genre').value;
        const rating = document.getElementById('filter-rating').value;

        try {
            const response = await fetch(`/movies?genre=${genre}&rating=${rating}&page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const { movies, pagination } = await response.json();

            const moviesContainer = document.getElementById('movies');
            moviesContainer.innerHTML = '';
            movies.forEach(movie => {
                const div = document.createElement('div');
                div.className = 'movie-item';

                // Create poster image
                const img = document.createElement('img');
                img.src = movie.poster ? movie.poster : fallbackPoster;  // Use fallback image if no poster URL
                img.alt = movie.title;

                // Create movie details
                const h3 = document.createElement('h3');
                h3.textContent = movie.title;

                const p = document.createElement('p');
                p.textContent = `Release Date: ${new Date(movie.released).toLocaleDateString()} | Rating: ${movie.imdb.rating}`;

                div.appendChild(img);
                div.appendChild(h3);
                div.appendChild(p);

                moviesContainer.appendChild(div);
            });

            // Update pagination controls
            const prevPageButton = document.getElementById('prev-page');
            const nextPageButton = document.getElementById('next-page');
            const pageInfo = document.getElementById('page-info');

            pageInfo.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;

            prevPageButton.disabled = pagination.currentPage === 1;
            nextPageButton.disabled = pagination.currentPage === pagination.totalPages;

            prevPageButton.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    fetchMovies(currentPage);
                }
            };

            nextPageButton.onclick = () => {
                if (currentPage < pagination.totalPages) {
                    currentPage++;
                    fetchMovies(currentPage);
                }
            };

        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    // Register form submission
    const register = document.getElementById('register');
    register.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Registration error:', error);
        }
    });

    // Initialize movie list
    fetchMovies(currentPage);
});
