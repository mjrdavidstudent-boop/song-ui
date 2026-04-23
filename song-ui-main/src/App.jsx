import { useState, useEffect } from 'react'
import {
  Typography,
  TextField,
  Box,
  CircularProgress,
  IconButton,
  Button
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SearchIcon from '@mui/icons-material/Search'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import HomeIcon from '@mui/icons-material/Home'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import ShareIcon from '@mui/icons-material/Share'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import axios from 'axios'
import ReactPlayer from 'react-player'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
    },
    background: {
      default: '#0f0f0f',
      paper: '#1a1a1a'
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
})

const API_BASE_URL = 'https://song-api-33pe.onrender.com'

function App() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSong, setActiveSong] = useState(null)

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/david/songs`)
      setSongs(response.data)
      if (response.data.length > 0) {
        setActiveSong(response.data[0])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching songs:', error)
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      fetchSongs()
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/david/songs/search/${searchTerm}`)
      setSongs(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error searching songs:', error)
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-screen bg-[#0f0f0f] text-white font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col p-6 hidden md:flex border-r border-[#222]">
          <Typography variant="h6" className="font-bold tracking-widest mb-10 text-white">
            SONG UI
          </Typography>
          
          <nav className="flex flex-col gap-4">
            <a href="#" className="flex items-center gap-4 text-white hover:text-gray-300 font-medium">
              <HomeIcon /> Home
            </a>
            <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white font-medium">
              <WhatshotIcon /> Trending
            </a>
            <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white font-medium">
              <LibraryMusicIcon /> Music
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Header Search */}
          <header className="h-16 flex items-center justify-center border-b border-transparent mt-4 mb-4">
            <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto px-4">
               <div className="relative flex items-center">
                 <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <SearchIcon className="text-gray-500" fontSize="small" />
                 </div>
                 <input 
                   type="text"
                   className="w-full bg-[#121212] border border-[#333] text-white rounded-full py-2 pl-12 pr-4 focus:outline-none focus:border-gray-500 transition-colors"
                   placeholder="Search"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </form>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-10 flex flex-col lg:flex-row gap-8">
            
            {/* Left: Active Player */}
            {activeSong && (
              <div className="flex-1 lg:max-w-4xl flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="h5" className="font-extrabold text-white">
                      {activeSong.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400 mt-1">
                      {activeSong.artist} • {activeSong.album} • {activeSong.genre}
                    </Typography>
                  </div>
                  <Button 
                    variant="outlined" 
                    endIcon={<OpenInNewIcon fontSize="small" />} 
                    size="small"
                    component="a"
                    href={activeSong.url}
                    target="_blank"
                    sx={{ color: '#ff4444', borderColor: '#333', '&:hover': { borderColor: '#ff4444' } }}
                  >
                    OPEN
                  </Button>
                </div>
                
                {/* Video Player */}
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-6 relative">
                   <ReactPlayer 
                     url={activeSong.url} 
                     width="100%" 
                     height="100%" 
                     controls={true}
                     playing={true}
                   />
                </div>

                <div className="border-t border-[#333] pt-6 mb-4">
                  <Typography variant="h6" className="font-bold text-white mb-2">
                    {activeSong.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-400 mb-6">
                    {activeSong.artist} • {activeSong.album} • {activeSong.genre}
                  </Typography>
                  <Typography variant="body2" className="text-gray-300">
                    Search like YouTube, then click a card in "Recommended" to play.
                  </Typography>
                </div>
              </div>
            )}

            {/* Right: Recommended List */}
            <div className="w-full lg:w-80 flex flex-col">
              <Typography variant="h6" className="font-bold text-white mb-4">
                Recommended
              </Typography>
              
              <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="flex justify-center p-10"><CircularProgress color="primary" /></div>
                ) : songs.length > 0 ? (
                  songs.map((song) => (
                    <div 
                      key={song.id} 
                      onClick={() => setActiveSong(song)}
                      className={`cursor-pointer group flex flex-col bg-[#1a1a1a] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-[#252525] ${activeSong?.id === song.id ? "ring-1 ring-red-500" : ""}`}
                    >
                      <div className="w-full aspect-video bg-black relative">
                         {/* Thumbnail placeholder or miniature player for visual */}
                         <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity">
                           <ReactPlayer url={song.url} width="100%" height="100%" light={true} playIcon={<PlayArrowIcon fontSize="large" color="error"/>} />
                         </div>
                      </div>
                      <div className="p-4">
                        <Typography className="font-bold text-white line-clamp-1 text-sm">
                          {song.title}
                        </Typography>
                        <Typography className="text-gray-400 text-xs mt-1">
                          {song.artist}
                        </Typography>
                        <Typography className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {song.album} • {song.genre}
                        </Typography>
                      </div>
                    </div>
                  ))
                ) : (
                  <Typography className="text-gray-500 text-center py-8">
                    No songs found.
                  </Typography>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App




