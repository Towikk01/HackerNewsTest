import React, { useEffect, useState } from 'react'
import './storyPage.scss'
import background from '../../../assets/main-background2.avif'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
	fetchCommentsByStoryId,
	fetchStoryDetails,
	selectComments,
	clearComments,
	selectSubcomments,
	clearSubcomments,
} from '../../../redux/newsItemsSlice'

import { AiOutlineReload } from 'react-icons/ai'
import Loader from '../../common/loader/Loader'
import { AiFillStar } from 'react-icons/ai'
import Comment from '../../common/comment/Comment'

const StoryPage = ({ story }) => {
	const [currStory, setCurrStory] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const [isCommentsVisible, setIsCommentVisible] = useState(true)
	const { storyId } = useParams()
	const storyIdNumber = parseInt(storyId, 10)
	const stories = useSelector((state) => state.stories)
	const comments = useSelector(selectComments)
	const dispatch = useDispatch()

	useEffect(() => {
		if (storyIdNumber) {
			dispatch(fetchCommentsByStoryId(storyIdNumber))
			setCurrStory(stories.find((s) => s.id === storyIdNumber))
		}
	}, [dispatch, stories, storyIdNumber])

	useEffect(() => {
		dispatch(clearComments())
		if (!currStory) {
			dispatch(fetchStoryDetails(storyIdNumber))
		}
	}, [storyIdNumber, currStory])

	const showComments = () => {
		setIsCommentVisible(!isCommentsVisible)
	}

	const updateComments = () => {
		dispatch(clearComments())
		dispatch(clearSubcomments())
		setIsLoading(true)
		dispatch(fetchCommentsByStoryId(storyIdNumber))
			.then(() => setIsLoading(false))
			.catch((error) => {
				console.error('Error fetching data:', error)
				setIsLoading(false)
			})
	}

	useEffect(() => {
		updateComments()
		const intervalId = setInterval(updateComments, 60000)

		return () => {
			clearInterval(intervalId)
		}
	}, [dispatch])

	return (
		<div className='story-page'>
			<img
				src={background}
				alt='story-background'
				className='story-page__background'
			/>
			{currStory ? (
				<div className='story-page__content'>
					<h2 className='story-page__title'>{currStory.title}</h2>
					<p className='story-page__author'>Author: {currStory.by}</p>
					<p className='story-page__score'>
						Score: {currStory.score} / 100 <AiFillStar />
					</p>
					<p className='story-page__url'>
						<a href={currStory.url} target='_blank' rel='noopener noreferrer'>
							Read more
						</a>
					</p>
					<p className='story-page__time'>
						Published: {new Date(currStory.time * 1000).toLocaleString()}
					</p>
				</div>
			) : (
				<p className='story-page__loading'>Loading...</p>
			)}
			<div className='story-page__comments'>
				<div className='story-page__comments-container'>
					<div className='story-page__comments-container-header'>
						<div className='story-page__comments-container-header-left'>
							<h3 className='story-page__comments-container-header-title'>
								Comments [{comments.length}]
							</h3>
							<button
								className='story-page__comments-container-header-show'
								onClick={showComments}>
								{isCommentsVisible ? 'Hide' : 'Show'} comments
							</button>
						</div>
						<button
							className='story-page__comments-button'
							onClick={updateComments}>
							<AiOutlineReload className='header-button__svg' /> Update comments
						</button>
					</div>
					{comments.length > 0 && (
						<>
							<ol
								className={`story-page__comments-container-list${
									isCommentsVisible ? '-visible' : ''
								}`}>
								{isLoading ? (
									<Loader />
								) : (
									<>
										{comments.map((comment) => (
											<Comment comment={comment} />
										))}
									</>
								)}
							</ol>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default StoryPage
