import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate  } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import $ from 'jquery';

const Login = () => {
    const { clientName } = useParams();
    const [selectedClient, setSelectedClient] = useState(clientName || '');
    const [clients, setClients] = useState([]);
    const navigate = useNavigate ();
    const { t, i18n} = useTranslation();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        $.ajax({
            url: `/ajax/clients`,
            method: 'GET',
            success: (data) => {
                setClients(data);
            },
            error: (error) => {
              console.error('Error fetching clients:', error);
            },
        });
    }, []);

    const handleClientChange = (event) => {
        setSelectedClient(event.target.value);
    };

    const handleLogin = () => {
        console.log('login');
    };
    
    const handleCosturmerAccess = () => {
        const clientIdentification = document.getElementById('clientIdentification').value;
        if (clientIdentification !== '') {
            navigate(`/${clientIdentification}`);
        }
    };

    return (
        <div>
            <Navbar /> 
            <h2>Login Page</h2>
            <form>
                {!clientName ? (
                    <div>
                        <label htmlFor="clientIdentification">{t('tagSelectClient')}:</label>
                        <select id="clientIdentification" value={selectedClient} onChange={handleClientChange}>
                            <option value="" disabled>{t('emptyOptionSelectClient')}</option>
                            {clients ? (clients.map((client) => (
                                <option key={client.clientIdentification} value={client.clientIdentification}>
                                    {client.clientName}
                                </option>
                            ))) : (
                                ''
                            )}
                        </select>
                    </div>
                ) : (
                    <input type="hidden" id="clientIdentification" value={selectedClient} />
                )}
                <div>
                    <label htmlFor="user">{t('tagUserInput')}:</label>
                    <input id="user" type="text" value = '' onChange={handleClientChange} /> 
                </div>
                <div>
                    <label htmlFor="user">{t('tagPasswordInput')}:</label>
                    <input id="user" type="text" value = '' onChange={handleClientChange} /> 
                </div>
                <button onClick={handleLogin}>Login</button>
                <div>
                    <button onClick={handleCosturmerAccess}>{t('btnCostumerAccess')}</button>
                    <a href="/createEstablishmentAccount">{t('linkCreateEstablishmentAccount')}</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
