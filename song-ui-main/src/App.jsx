import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  Box,
  CircularProgress,
  Button,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SearchIcon from '@mui/icons-material/Search'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const API_BASE_URL = 'https://song-api-g1nk.onrender.com'

function App() {
  const [songs, setSongs] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [selectedSong, setSelectedSong] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch songs on mount
  useEffect(() => {
    fetchSongs()
  }, [])

  // Get YouTube ID helper
  const getYoutubeId = (title) => {
    const knownSongs = {
      'one': 'ftjEcrrf7r0',
      'sometimes': 't0bPrt69rag',
      'ligaya': 'XibB-5BPdrY'
    }
    const key = title ? title.toLowerCase() : ''
    return knownSongs[key] || 'dQw4w9WgXcQ'
  }

  // Fetch songs from API
  const fetchSongs = async () => {
    setLoading(true)
    try {
      const endpoints = [`${API_BASE_URL}/songs`, `${API_BASE_URL}/api/songs`]
      let response

      for (const url of endpoints) {
        response = await fetch(url)
        if (response.ok) break
      }

      if (!response || !response.ok) throw new Error('Failed to fetch')

      let data = await response.json()
      data = data.map(song => ({
        ...song,
        album: song.album || 'Unknown Album',
        genre: song.genre || 'Music',
        youtubeId: song.youtubeId || getYoutubeId(song.title)
      }))

      setSongs(data)
      setFilteredSongs(data)
      if (data.length > 0) setSelectedSong(data[0])
    } catch (error) {
      console.error('Error:', error)
      // Fallback
      const mockSongs = [
        { id: 1, title: 'One', artist: 'U2', album: 'Achtung Baby', genre: 'Rock', youtubeId: 'ftjEcrrf7r0' },
        { id: 2, title: 'Sometimes', artist: 'Britney Spears', album: '...Baby One More Time', genre: 'Pop', youtubeId: 't0bPrt69rag' },
        { id: 3, title: 'Ligaya', artist: 'Eraserheads', album: 'Ultraelectromagneticpop!', genre: 'OPM', youtubeId: 'XibB-5BPdrY' }
      ]
      setSongs(mockSongs)
      setFilteredSongs(mockSongs)
      setSelectedSong(mockSongs[0])
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = songs.filter(song =>
      (song.title && song.title.toLowerCase().includes(term)) ||
      (song.artist && song.artist.toLowerCase().includes(term))
    )
    setFilteredSongs(filtered)
  }

  // Select song
  const handleSelectSong = (song) => {
    setSelectedSong(song)
  }

  return (
    <Box className="bg-black min-h-screen text-white">
      {/* Header */}
      <AppBar position="static" className="!bg-black !border-b !border-gray-800">
        <Toolbar className="flex justify-between">
          <div className="flex items-center gap-2">
            <PlayArrowIcon className="!text-orange-500" />
            <Typography variant="h6" className="!font-bold !tracking-widest">
              SONG UI
            </Typography>
          </div>
          <div className="flex-1 mx-8 max-w-xl">
            <TextField
              fullWidth
              size="small"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={handleSearch}
              className="!bg-gray-900 rounded"
              InputProps={{
                startAdornment: <SearchIcon className="mr-2 !text-gray-500" />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#555' },
                },
              }}
            />
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className="py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <CircularProgress className="!text-orange-500" />
          </div>
        ) : (
          <Grid container spacing={4}>
            {/* Featured Player */}
            <Grid item xs={12} md={8}>
              <Box className="bg-gray-900 rounded-lg overflow-hidden">
                {selectedSong && (
                  <>
                    {/* Video Player */}
                    <Box className="aspect-video bg-black relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedSong.youtubeId}?autoplay=0`}
                        title={selectedSong.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <Box className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-full flex items-center gap-1">
                        <FiberManualRecordIcon className="!w-2 !h-2 !text-orange-500" />
                        <Typography variant="caption" className="!text-white">Now playing</Typography>
                      </Box>
                    </Box>

                    {/* Song Info */}
                    <Box className="p-6">
                      <Box className="flex justify-between items-start mb-4">
                        <div>
                          <Typography variant="h4" className="!font-bold !mb-2">
                            {selectedSong.title}
                          </Typography>
                          <Typography className="!text-gray-400">
                            {selectedSong.artist} • {selectedSong.album} • {selectedSong.genre}
                          </Typography>
                        </div>
                        <Button
                          variant="outlined"
                          href={`https://www.youtube.com/watch?v=${selectedSong.youtubeId}`}
                          target="_blank"
                          className="!border-orange-500 !text-orange-500 !hover:bg-orange-500/10"
                        >
                          Open on YouTube
                        </Button>
                      </Box>
                      <Typography className="!text-gray-300">
                        Click any card below to play a different video.
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Grid>

            {/* Sidebar - Recommended Songs */}
            <Grid item xs={12} md={4}>
              <Box className="bg-gray-900 rounded-lg p-4">
                <Typography variant="h6" className="!font-bold !mb-4">
                  Recommended
                </Typography>
                <Box className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredSongs.map((song) => (
                    <Card
                      key={song.id}
                      onClick={() => handleSelectSong(song)}
                      className={`!cursor-pointer !transition-all !transform !hover:-translate-y-0.5 ${
                        selectedSong?.id === song.id
                          ? '!border-2 !border-orange-500 !bg-gray-800'
                          : '!bg-gray-800 !border !border-gray-700 !hover:border-orange-500'
                      }`}
                    >
                      <Box className="flex gap-3">
                        <CardMedia
                          component="img"
                          image={`https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`}
                          alt={song.title}
                          className="!w-24 !h-16 !object-cover"
                        />
                        <CardContent className="!flex-1 !p-2">
                          <Typography className="!font-semibold !line-clamp-1">
                            {song.title}
                          </Typography>
                          <Typography className="!text-xs !text-gray-400 !line-clamp-2">
                            {song.artist}
                            <br />
                            {song.album}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default App
