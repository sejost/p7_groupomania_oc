/* -- Comments Update React --*/
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import useAuth from '../../1-hooks/useAuth';
import { BiSend } from 'react-icons/bi';


const CommentUpdate = (props) => {
	const { auth } = useAuth();

	const handleSetUpdate = async (e) => {
		e.preventDefault();
		try{
			await axios({
				method: 'put',
				url: `${process.env.REACT_APP_API}comment/update/${props.postId}`,
				data : { 
					commentId : props.commentId,
					commenterId : auth.userId,
					commentText : props.commentContent.message
				},
				withCredentials : true,
			});
			props.setChangePending(false);
		}
		catch(error){
			alert(error);
		}
	};

	return(
		<BiSend onClick={handleSetUpdate} className='icon icon__tools icon__send'/>
	);

};

export default CommentUpdate;

CommentUpdate.propTypes = {
	postId: PropTypes.string.isRequired,
	commentId: PropTypes.string.isRequired,
	setChangePending: PropTypes.bool.isRequired,
	commentContent: PropTypes.object.isRequired,
};