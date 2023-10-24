import React from 'react'
import './newsItem.scss'
import backgroundItem from '../../../assets/story-background.jpeg'
import { AiFillStar } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const NewsItem = ({ story }) => {
	return (
		<div className='news-item'>
			<img src={backgroundItem} alt='bg' className='news-item__background' />
			<h3 className='news-item__title'>{story.title}</h3>
			<div className='news-item__content'>
				<div className='news-item__info'>
					<p className='news-item__info-author'>Author: {story.by}</p>
					<p className='news-item__info-rate'>
						Rate: {story.score} / 100 <AiFillStar />
					</p>
					{story.time ? (
						<p className='news-item__info-date'>
							Published in {new Date(story.time * 1000).toLocaleDateString()}{' '}
							{new Date(story.time * 1000).toLocaleTimeString()}
						</p>
					) : (
						<p>Date Unavailable</p>
					)}
					<Link to={`/${story.id}`} className='news-item__button'>
						Check the story!
					</Link>
				</div>
			</div>
		</div>
	)
}

export default NewsItem
