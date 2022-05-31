import { NavLink } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {

  return (
    <div className='navBar'>
        <NavLink to={'signin'}><p>Log In</p></NavLink>
        <NavLink to={'signout'}><p>Log out</p></NavLink>
        <NavLink to={'products'}><p>Producst</p></NavLink>
        <NavLink to={'productForm'}><p>Create Products</p></NavLink>
        <NavLink to={'cart'}><p>Cart</p></NavLink>
    </div>
  )
};

export default NavBar