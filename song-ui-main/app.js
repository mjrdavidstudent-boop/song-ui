const API_BASE_URL = 'https://song-api-g1nk.onrender.com';

const recommendedList = document.getElementById('recommended-list');
const searchInput = document.getElementById('search-input');

// DOM Elements for Featured View
const featTitle = document.getElementById('feat-title');
const featArtist = document.getElementById('feat-artist');
const featBottomTitle = document.getElementById('feat-bottom-title');
const featBottomArtist = document.getElementById('feat-bottom-artist');
const featLink = document.getElementById('feat-link');
const videoFrame = document.getElementById('video-frame');

let allSongs = [];

// Try to resolve a youtube ID for the mockup if one isn't in DB
function getYoutubeId(title) {
    const knownSongs = {
        'one': 'ftjEcrrf7r0',
        'sometimes': 't0bPrt69rag',
        'ligaya': 'XibB-5BPdrY'
    };
    const key = title ? title.toLowerCase() : '';
    return knownSongs[key] || 'dQw4w9WgXcQ'; // Rickroll default if unknown
}

// Fetch and display songs
async function fetchSongs() {
    try {
        // Try common API paths so deployment works even if backend routes vary.
        const endpoints = [`${API_BASE_URL}/songs`, `${API_BASE_URL}/api/songs`];
        let response;

        for (const url of endpoints) {
            response = await fetch(url);
            if (response.ok) break;
        }

        if (!response || !response.ok) throw new Error('Failed to fetch songs');

        allSongs = await response.json();
        
        // Add fake youtube/album data if API doesn't have it
        allSongs = allSongs.map(song => ({
            ...song,
            album: song.album || 'Unknown Album',
            genre: song.genre || 'Pop',
            youtubeId: song.youtubeId || getYoutubeId(song.title)
        }));

        renderRecommended(allSongs);
        if (allSongs.length > 0) {
            setFeatured(allSongs[0]); // Feature the first one by default
        }
    } catch (error) {
        console.error('API Error:', error);
        // Fallback for visual demonstration if API fails or is empty
        const mockSongs = [
            { id: 1, title: 'One', artist: 'U2', album: 'Achtung Baby', genre: 'Rock', youtubeId: 'ftjEcrrf7r0' },
            { id: 2, title: 'Sometimes', artist: 'Britney Spears', album: '...Baby One More Time', genre: 'Pop', youtubeId: 't0bPrt69rag' },
            { id: 3, title: 'Ligaya', artist: 'Eraserheads', album: 'Ultraelectromagneticpop!', genre: 'OPM', youtubeId: 'XibB-5BPdrY' }
        ];
        allSongs = mockSongs;
        renderRecommended(mockSongs);
        setFeatured(mockSongs[0]);
    }
}

function setFeatured(song) {
    const artistText = `${song.artist} • ${song.album} • ${song.genre}`;
    featTitle.textContent = song.title;
    featArtist.textContent = artistText;
    featBottomTitle.textContent = song.title;
    featBottomArtist.textContent = artistText;
    
    // Update player & link
    videoFrame.src = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`;
    featLink.href = `https://www.youtube.com/watch?v=${song.youtubeId}`;

    // Highlight active card
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active');
        if(card.dataset.id == song.id) {
            card.classList.add('active');
        }
    });
}

function renderRecommended(songs) {
    recommendedList.innerHTML = '';
    songs.forEach(song => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = song.id;
        
        // Thumbnail URL from Youtube ID
        const thumbnailUrl = `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`;
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${thumbnailUrl}" alt="${song.title} thumbnail">
            </div>
            <div class="card-info">
                <div class="card-title">${song.title}</div>
                <div class="card-desc">
                    ${song.artist}<br>
                    ${song.album} • ${song.genre}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => setFeatured(song));
        recommendedList.appendChild(card);
    });
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allSongs.filter(song => 
        (song.title && song.title.toLowerCase().includes(term)) || 
        (song.artist && song.artist.toLowerCase().includes(term))
    );
    renderRecommended(filtered);
});

// Init
fetchSongs();
