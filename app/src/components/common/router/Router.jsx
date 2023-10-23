import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from '../../pages/mainPage/MainPage'
import StoryPage from '../../pages/storyPage/StoryPage'
import Header from '../header/Header'

const Router = () => {
	return (
		<BrowserRouter>
			<Header />
			<main>
				<Routes>
					<Route path='/' element={<MainPage />} />
					<Route path='/:storyId' element={<StoryPage />} />
				</Routes>
			</main>
		</BrowserRouter>
	)
}

export default Router
