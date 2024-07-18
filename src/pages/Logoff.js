import React, { useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import $ from 'jquery';

function Logoff(){
    useEffect(() => {
        $.ajax({
            url: '/ajax/user/logoff',
            method: 'POST',
            success: function(response) {
                window.location.href = "/";
            },
            error: function(error) {
                window.location.href = "/";
            }
        });
    }, []);
    return <LoadingSpinner></LoadingSpinner>;
}
export default Logoff;
