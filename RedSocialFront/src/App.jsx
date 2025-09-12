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
import CreatePost from './components/Posts/CreatePost';
import PrivateRoute from './routes/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Protegida */}
        <Route path="/add" element={
                                    <PrivateRoute>
                                        <CreatePost />
                                    </PrivateRoute>
                                   }
        />
      
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
