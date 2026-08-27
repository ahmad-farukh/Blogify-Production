import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex items-center'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo />
            </Link>
          </div>

          <ul className='flex ml-auto items-center space-x-2'>
            {navItems.map((item) => (
              item.active ? (
                <li key={item.name}>
                  <button 
                    onClick={() => navigate(item.slug)}
                    className='bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            ))}

            {/* Logout Button directly rendered without nested <Button> wrapper */}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header