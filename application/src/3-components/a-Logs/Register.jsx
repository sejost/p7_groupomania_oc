/* --- Register Component&Modal React ---*/
/* --- Purpose : Allow the creation of a new user ---*/
import React, { useRef, useState, useEffect } from 'react';
import {FaCheckSquare, FaTimes, FaInfo } from 'react-icons/fa';
import PropTypes from 'prop-types';
import logo from '../../6-styles/5-images/icon-left-font.png';
import axios from 'axios';

/* -- Regex -- */
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{9,64}$/;

/* -- Main Function Register with setSignUpModal Props from Login -- */
function Register(props) {

	/* -- useRef Déclaratations to memorize position -- */
	const emailRef = useRef();
	const errorRef = useRef();
	
	/* -- UseState Déclaratations -- */
	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);

	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);
	const [passwordFocus, setPasswordFocus] = useState(false);

	const [matchPassword, setMatchPassword] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errorMsg, setErrorMsg] = useState('');
	const [success, setSuccess] = useState(false);

	/* -- UseEffects declarations -- */
	//Define the automatic focus on the email
	useEffect(() => {
		emailRef.current.focus();
	}, [errorMsg]);

	//Test the email regex each email change
	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
		setErrorMsg('');
	}, [email]);

	//Test the password regex each password change
	useEffect(() => {
		setValidPassword(PASSWORD_REGEX.test(password));
		setValidMatch(password === matchPassword);
	}, [password, matchPassword]);

	/* -- Submit Form -- */
	const handleSubmit = async (e) => {
		e.preventDefault();
		//Blocks non-compliant requests if button force validated
		const valid1 = EMAIL_REGEX.test(email);
		const valid2 = PASSWORD_REGEX.test(password);
		if (!valid1 || !valid2) {
			setErrorMsg('Déclaration non conforme');
			return;
		}

		/* -- Axios Request  -- */
		try {
			await axios({
				method: 'post',
				url: `${process.env.REACT_APP_API}auth/register`,
				data : {
					email : email,
					password : password
				},
				withCredentials : true,
			});

			/* -- If Axios Request  succced useState Success change to true -- */
			setSuccess(true);
			setEmail('');
			setPassword('');
			setMatchPassword('');

			/* -- If NOK dsiplay an error collected from the backend -- */
		} catch (error) {
			const errorReceived = error.response.data.error;
			setPassword('');
			setMatchPassword('');
			setErrorMsg(errorReceived);
			errorRef.current.focus();
		}
	};

	/* -- Rendering part -- */
	return (
		<div className="register">
			<img src={logo} alt='' className='login__logo' />
			<section className="register__section">
				{
					success 
						? (
							<>
								{/* Modal part if the signup is complete and successful */}
								<h1>Compte créé avec succès !</h1>
								<p>
									<a
										onClick={() => props.setSignUpModal(false)}
									>
                                Connectez vous
									</a>
								</p>
							</>
						) : (
							<>
								{/* Modal part with the register form */}
								
								<form onSubmit={handleSubmit}>
									<h1>Formulaire d&apos;inscription</h1>
									<p
										ref={errorRef}
										className={errorMsg ? 'errormsg' : 'offscreen'}
										aria-live="assertive"
									>
										{errorMsg}
									</p>
									<label htmlFor="emailcontent">
										<FaCheckSquare className={validEmail ? 'valid' : 'hide'} />
										<FaTimes className={validEmail || !email ? 'hide' : 'invalid'} />
										<br />
										<input
											placeholder='Adresse email'
											type="text"
											id="emailcontent"
											ref={emailRef}
											autoComplete="off"
											onChange={(e) => setEmail((e.target.value).toLowerCase())}
											value={email}
											required
											aria-invalid={validEmail ? 'false' : 'true'}
											aria-describedby="uidnote"
										/>
									</label>

									<label htmlFor="password">
										<FaCheckSquare
											className={validPassword ? 'valid' : 'hide'}
										/>
										<FaTimes
											className={
												validPassword || !password ? 'hide' : 'invalid'
											}
										/>
										<br/>
										<input
											placeholder='Mot de passe'
											type="password"
											id="password"
											onChange={(e) => setPassword(e.target.value)}
											value={password}
											required
											aria-invalid={validPassword ? 'false' : 'true'}
											aria-describedby="passwordnote"
											onFocus={() => setPasswordFocus(true)}
											onBlur={() => setPasswordFocus(false)}
										/>
									</label>

									<p
										id="passwordnote"
										className={
											passwordFocus && !validPassword
												? 'instructions'
												: 'offscreen'
										}
									>
										<FaInfo />
                                Au moins 9 caractères.
										<br />
                                Doit inclure au moins : une lettre majuscule,
                                une miniscule, un chiffre et un caractère
                                spéciale.
									</p>

									<label htmlFor="confirm_password">
										<FaCheckSquare
											className={
												validMatch && matchPassword
													? 'valid'
													: 'hide'
											}
										/>
										<FaTimes
											className={
												validMatch || !matchPassword
													? 'hide'
													: 'invalid'
											}
										/>
										<br/>
										<input
											placeholder='Confirmer mot de passe'
											type="password"
											id="confirm_password"
											onChange={(e) =>
												setMatchPassword(e.target.value)
											}
											value={matchPassword}
											required
											aria-invalid={validMatch ? 'false' : 'true'}
											aria-describedby="confirmnote"
											onFocus={() => setMatchFocus(true)}
											onBlur={() => setMatchFocus(false)}
										/>
									</label>

									<p
										id="confirmnote"
										className={
											matchFocus && !validMatch
												? 'instructions'
												: 'offscreen'
										}
									>
										<FaInfo />
                                Doit correspondre au premier mot de passe
									</p>

									<button
										type="submit"
										disabled={
											!!(!validEmail || !validPassword || !validMatch)
										}
										// disabled={!validEmail || !validPassword || !validMatch ? true : false}
									>
                                S&apos;inscrire
									</button>
									<a className='link'
										onClick={() => props.setSignUpModal(false)}
									>Revenir à la page de connexion</a>
								</form>
								
							</>
						)}
			</section>
		</div>
	);
}

export default Register;

/* -- Proptypes -- */
Register.propTypes = {
	setSignUpModal: PropTypes.func.isRequired,
};