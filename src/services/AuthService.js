import axios from 'axios';
import Swal from "sweetalert2";
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';

export function signUp(email, password) {
    //axios call
    const postData = {
        email,
        password,
    };
    return axios.post(
        `http://localhost:5000/api/auth/signup`,
        postData,
    );
}

export function login(email, password) {
    const postData = {
        email,
        password,
    };
    
    return axios.post(
        `http://localhost:5000/api/auth/login`,
        postData,
    );
}

export function formatError(errorResponse) {
    const message = errorResponse.message || 'An error occurred';
    Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: message,                        
    });
    return message;
}

export function saveTokenInLocalStorage(tokenDetails) {
    const userDetails = {
        token: tokenDetails.token,
        user: tokenDetails.user,
        expireDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
    };
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
}

export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {
        //dispatch(Logout(history));
        dispatch(Logout(navigate));
    }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
    const tokenDetailsString = localStorage.getItem('userDetails');
    let tokenDetails = '';
    if (!tokenDetailsString) {
        dispatch(Logout(navigate));
		return;
    }

    tokenDetails = JSON.parse(tokenDetailsString);
    let expireDate = new Date(tokenDetails.expireDate);
    let todaysDate = new Date();

    if (todaysDate > expireDate) {
        dispatch(Logout(navigate));
        return;
    }
		
    // Format the token details to match the new structure
    const authData = {
        token: tokenDetails.token,
        user: tokenDetails.user,
        success: true
    };
    dispatch(loginConfirmedAction(authData));
	
    const timer = expireDate.getTime() - todaysDate.getTime();
    runLogoutTimer(dispatch, timer, navigate);
}

export function isLogin() {
    const tokenDetailsString = localStorage.getItem('userDetails');

    if (tokenDetailsString) {
        return true;
    }else{
        return false;
    }
}