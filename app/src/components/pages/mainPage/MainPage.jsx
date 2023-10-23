import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	fetchTopStoryIds,
	fetchStoryDetails,
	selectStories,
	selectTopStoriesIds,
	clearStories,
} from '../../../redux/newsItemsSlice'
import { AiOutlineReload } from 'react-icons/ai'

import NewsItem from '../../common/newsItem/NewsItem'
import storyBack from '../../../assets/background-item.avif'
import Loader from '../../common/loader/Loader'

import './mainPage.scss'

function MainPage() {
	const [isLoading, setIsLoading] = useState(true)
	const dispatch = useDispatch()
	const topStorysIds = useSelector((state) => state.topStoryIds)
	const stories = useSelector((state) => state.stories)

	const updateNews = () => {
		dispatch(clearStories())
		setIsLoading(true)
		dispatch(fetchTopStoryIds())
			.then((action) => {
				const top100StoryIds = action.payload.slice(0, 100)
				return Promise.all(
					top100StoryIds.map((storyId) => dispatch(fetchStoryDetails(storyId)))
				)
			})
			.then(() => setIsLoading(false))
			.catch((error) => {
				console.error('Error fetching data:', error)
				setIsLoading(false)
			})
	}

	useEffect(() => {
		updateNews()
		const intervalId = setInterval(updateNews, 60000)
		return () => {
			clearInterval(intervalId)
		}
	}, [dispatch])

	const sortedStories = [...stories]
	sortedStories.sort((a, b) => b.time - a.time)

	return (
		<div className='main-page'>
			<img src={storyBack} alt='background' className='main-page__background' />
			<h2 className='main-page__title'>
				Check fresh news and stories from Hacker News!
			</h2>
			<button onClick={updateNews} className='main-page__reload'>
				<AiOutlineReload className='header-button__svg' /> Update news
			</button>
			{console.log(sortedStories)}
			{isLoading ? (
				<Loader />
			) : (
				<div className='main-page__news-list'>
					{sortedStories.map((story) => (
						<NewsItem story={story} key={story.id} />
					))}
				</div>
			)}
		</div>
	)
}

export default MainPage
