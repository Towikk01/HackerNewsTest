import React, { useState } from 'react'
import { AiOutlineArrowDown } from 'react-icons/ai'
import { useSelector } from 'react-redux'

import { selectSubcommentsLoading } from '../../../redux/newsItemsSlice'

const Comment = ({ comment }) => {
	const [subcomments, setSubcomments] = useState([])
	const [isCommentsVisible, setIsCommentVisible] = useState(true)
	const loading = useSelector(selectSubcommentsLoading)

	const toggleSubcomments = async (commentId) => {
		if (!subcomments.length && !loading) {
			const fetchComments = async (comment) => {
				const comments = comment.kids.map(async (commentId) => {
					const fetchSubcomments = await fetch(
						`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
					)
					const jsonSubcomments = await fetchSubcomments.json()
					return jsonSubcomments
				})
				return comments
			}
			await fetchComments(comment).then((comments) => {
				Promise.all(comments).then((responses) => {
					setSubcomments(responses)
				})
			})
		}
		setIsCommentVisible(!isCommentsVisible)
	}

	return (
		<li className='story-page__comments-container-list-item' key={comment.id}>
			<span className='story-page__comments-container-list-item-text'>
				{comment.text ? (
					<div dangerouslySetInnerHTML={{ __html: comment.text }}></div>
				) : (
					'###Cannot display the comment###'
				)}
			</span>
			{comment.kids ? (
				<button
					onClick={() => toggleSubcomments()}
					className='story-page__comments-container-list-item-button'
					disabled={loading}>
					<AiOutlineArrowDown />
				</button>
			) : (
				''
			)}
			{subcomments.length ? (
				<ol
					className={`story-page__comments-container-list${
						isCommentsVisible ? '-visible' : ''
					}`}>
					{subcomments.map((comment) => (
						<Comment comment={comment} />
					))}
				</ol>
			) : null}
		</li>
	)
}

export default Comment
