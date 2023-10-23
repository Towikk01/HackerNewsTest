import React from 'react'
import './header.scss'
import { Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'

const Header = () => {
	const dispatch = useDispatch()
	return (
		<header className='header'>
			<Link to='/' className='header-title'>
				Hacker News
			</Link>
		</header>
	)
}

export default Header
