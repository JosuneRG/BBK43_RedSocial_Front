import Login from './components/Login'
import Register from './components/Register'
import Header from './components/Header'
import Home from './components/Home'
import Profile from './components/Profile'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostDetail from "./components/PostDetail"

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App