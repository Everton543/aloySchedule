import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate  } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Logo from '../../components/Logo/Logo'; 
import PrimaryButton from '../../components/Button/PrimaryButton'; 
import $ from 'jquery';
import './Login.css';

const Login = () => {
    const { clientName } = useParams();

    const [imageSrc, setImageSrc] = useState('');
    const navigate = useNavigate ();
    const { t, i18n} = useTranslation();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        // $.ajax({
        //     url: `/ajax/clients`,
        //     method: 'GET',
        //     success: (data) => {
        //         setClients(data);
        //     },
        //     error: (error) => {
        //       console.error('Error fetching clients:', error);
        //     },
        // });
    }, []);

    const handleLogin = () => {
        console.log('login');
    };
    
    return (
        <div >
            <Navbar /> 
            <div>
                <Logo />
                <PrimaryButton>Login in my account</PrimaryButton>
            </div>
        </div>
    );
};

export default Login;
