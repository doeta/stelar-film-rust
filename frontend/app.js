/**
 * Stellar Movie DApp - Frontend Logic
 * Note: To connect to the real Soroban smart contract, you need to import the
 * @stellar/freighter-api and your generated contract client here.
 * For demonstration purposes, this uses local state as a mock implementation.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Mock State (Ganti dengan integrasi Smart Contract Soroban asli) ---
  let movieCounter = 0;
  const mockMovies = {};
  const mockComments = {};

  // --- DOM Elements ---
  const connectBtn = document.getElementById("connectBtn");
  const walletAddressText = document.getElementById("walletAddress");

  const addMovieForm = document.getElementById("addMovieForm");
  const addMovieResult = document.getElementById("addMovieResult");

  const searchIdInput = document.getElementById("searchId");
  const searchBtn = document.getElementById("searchBtn");
  const movieDetails = document.getElementById("movieDetails");
  const searchResult = document.getElementById("searchResult");

  const addCommentForm = document.getElementById("addCommentForm");
  const commentResult = document.getElementById("commentResult");

  // --- 1. Connect Wallet ---
  // Logika asli: await window.freighterApi.requestAccess();
  connectBtn.addEventListener("click", async () => {
    try {
      // Mock connection
      const simulatedAddress =
        "G" +
        Math.random().toString(36).substring(2, 10).toUpperCase() +
        "...XYZ";

      connectBtn.classList.add("hidden");
      walletAddressText.classList.remove("hidden");
      walletAddressText.textContent = "Connected: " + simulatedAddress;
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  });

  // --- 2. Add Movie ---
  // Logika asli: Memanggil `client.create_movie(...)`
  addMovieForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("movieTitle").value;
    const year = parseInt(document.getElementById("movieYear").value);
    const description = document.getElementById("movieDesc").value;

    try {
      // Simulating blockchain transaction delay
      addMovieResult.textContent = "Transaction in progress...";
      addMovieResult.className = "result-msg";

      setTimeout(() => {
        // Mock Backend Execution
        movieCounter++;
        const newId = movieCounter;
        mockMovies[newId] = {
          id: newId,
          title,
          release_year: year,
          description,
        };
        mockComments[newId] = [];

        addMovieResult.textContent = `Success! Movie Added with ID: ${newId}`;
        addMovieResult.className = "result-msg success";
        addMovieForm.reset();
      }, 800);
    } catch (error) {
      addMovieResult.textContent = "Error: " + error.message;
      addMovieResult.className = "result-msg error";
    }
  });

  // --- 3. Search & Fetch Movie ---
  // Logika asli: Memanggil `client.get_movie(...)` dan `client.get_comments(...)`
  searchBtn.addEventListener("click", async () => {
    const idStr = searchIdInput.value;
    if (!idStr) return;
    const id = parseInt(idStr);

    movieDetails.classList.add("hidden");
    searchResult.textContent = "Searching blockchain...";
    searchResult.className = "result-msg";

    setTimeout(() => {
      const movie = mockMovies[id];

      if (movie) {
        // Render Movie Details
        document.getElementById("displayTitle").textContent = movie.title;
        document.getElementById("displayYear").textContent = movie.release_year;
        document.getElementById("displayId").textContent = movie.id;
        document.getElementById("displayDesc").textContent = movie.description;
        document.getElementById("commentMovieId").value = movie.id;

        // Render Comments
        renderComments(id);

        movieDetails.classList.remove("hidden");
        searchResult.textContent = "";
      } else {
        searchResult.textContent = "Movie not found!";
        searchResult.className = "result-msg error";
      }
    }, 500);
  });

  // --- 4. Add Comment ---
  // Logika asli: Memanggil `client.add_comment(...)`
  addCommentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const movieId = parseInt(document.getElementById("commentMovieId").value);
    const content = document.getElementById("commentContent").value;
    const rating = parseInt(document.getElementById("commentRating").value);

    try {
      commentResult.textContent = "Submitting review to blockchain...";
      commentResult.className = "result-msg";

      setTimeout(() => {
        // Mock Backend Execution
        const newCommentId = Math.floor(Math.random() * 1000000);
        const comment = {
          id: newCommentId,
          movie_id: movieId,
          content,
          rating,
        };

        mockComments[movieId].push(comment);

        commentResult.textContent = "Review successfully added!";
        commentResult.className = "result-msg success";
        addCommentForm.reset();

        // Refresh comments view
        renderComments(movieId);
      }, 600);
    } catch (error) {
      commentResult.textContent = "Error: " + error.message;
      commentResult.className = "result-msg error";
    }
  });

  // --- Helper function ---
  function renderComments(movieId) {
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = "";
    const comments = mockComments[movieId] || [];

    if (comments.length === 0) {
      commentsList.innerHTML = "<li>No reviews yet. Be the first!</li>";
      return;
    }

    comments.forEach((c) => {
      const li = document.createElement("li");
      li.innerHTML = `
                ${c.content} 
                <span class="rating-badge">★ ${c.rating}/5</span>
            `;
      commentsList.appendChild(li);
    });
  }
});
