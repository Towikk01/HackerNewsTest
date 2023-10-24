import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	fetchSubcommentsByCommentId,
	selectSubcomments,
	clearSubcommentsByCommentId,
	selectSubcommentsLoading,
} from '../../../redux/newsItemsSlice'

import './subcomment.scss'

import { AiOutlineArrowDown } from 'react-icons/ai'
const Subcomment = ({ comment }) => {
	const [isVisible, setIsVisible] = useState(false)
	const dispatch = useDispatch()
	const subcomments = useSelector(selectSubcomments)
	const loading = useSelector(selectSubcommentsLoading)

	const loadSubcomments = (commentId) => {
		if (isVisible) {
			dispatch(clearSubcommentsByCommentId(commentId))
		} else {
			dispatch(fetchSubcommentsByCommentId(commentId))
		}
		setIsVisible(!isVisible)
	}

	return (
		<>
			<button
				onClick={() => loadSubcomments(comment.id)}
				className='story-page__comments-container-list-item-button'
				disabled={loading}>
				<AiOutlineArrowDown />
			</button>
			<ol className={`subcomments-list${isVisible ? '_visible' : ''}`}>
				{subcomments[comment.id]?.map((subcomment) => (
					<li className='subcomments-list-item' key={subcomment.id}>
						<span className='subcomments-list-item-text'>
							{subcomment.text}
						</span>
					</li>
				))}
			</ol>
		</>
	)
}

export default Subcomment
