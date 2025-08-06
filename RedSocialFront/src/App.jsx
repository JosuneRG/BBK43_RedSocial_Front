import Login from './components/Login'
import Register from './pages/Register'
import Header from './components/Header'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostDetail from "./components/Posts/PostDetail"
import Search from './components/Search'
import Footer from './components/Footer'
import './App.css' // Asegúrate de tener el estilo aquí

function App() {
  return (
      <BrowserRouter>
        <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/search/:postName" element={<Search />} />
          </Routes>
        <Footer />
      </BrowserRouter>
  )
}

export default App
