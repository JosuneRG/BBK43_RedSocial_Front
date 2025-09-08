// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './components/Login'
import Profile from './pages/Profile'
import PostDetail from './components/Posts/PostDetail'
import Search from './components/Search'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/post/:id' element={<PostDetail />} />
        <Route path='/search/:postName' element={<Search />} />
        <Route path="/search" element={<Search />} />
        {/* compatibilidad con la vieja: /search/:postName */}
        <Route path="/search/:postName" element={<Search />} />       
        {/* si tienes la pantalla de crear: */}
        {/* <Route path='/add' element={<CreatePost />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
