import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link,  useNavigate } from 'react-router-dom'
import { loadingToggleAction,loginAction,
} from '../../store/actions/AuthActions';

import login from '../../assets/images/login.jpg';

function Login (props) {	
	const navigate = useNavigate();
    const [email, setEmail] = useState('demo@example.com');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    function onLogin(e) {		
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) {
			return ;
		}
			
		dispatch(loadingToggleAction(true));
		dispatch(loginAction(email, password, navigate));
    }
  	return (        
		<div className="page-wraper">
			<div className="authincation ">
				<div className="container ">
					<div className="row justify-content-center h-100 align-items-center">
						<div className="col-md-12 h-100 d-flex align-items-center">
							<div className="authincation-content style-1">
								<div className="row h-100">
									<div className="col-md-6 h-100">
										<div className="img-bx">
											<img src={login} alt="" className="img-fluid" />
										</div>
									</div>
									<div className="col-md-6">
										<div className="auth-form">
											<h4 className="main-title">Sign in </h4>
											{props.errorMessage && (
												<div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
													{props.errorMessage}
												</div>
											)}
											{props.successMessage && (
												<div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
													{props.successMessage}
												</div>
											)}	
											<form onSubmit={onLogin}>
												<div className="form-group mb-3 pb-3">
													<label className="font-w600">Email</label><span className='required'> *</span>
													<input type="email" className="form-control solid" value={email} onChange={(e) => setEmail(e.target.value)} />
													{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
												</div>
												<div className="form-group mb-3 pb-3">
													<label className="font-w600">Password</label><span className='required'> *</span>							
													<input type="password" className="form-control solid" value={password} onChange={(e) => setPassword(e.target.value)} />	
													{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
												</div>
												<div className="text-center">
													<button type="submit" className="btn btn-primary btn-block rounded">Sign Me In</button>
												</div>
											</form>
											{/* <div className="new-account mt-3">
												<p>Don't have an account? <Link to={"/page-register"}  className="text-primary">Sign up</Link></p>
											</div> */}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>            
		
    )
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};
export default connect(mapStateToProps)(Login);