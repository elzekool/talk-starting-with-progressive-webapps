/**
 * Header
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React from 'react';

export default () => {
    return (
        <header>
            <div className="navbar navbar-dark bg-dark box-shadow">
                <div className="container d-flex justify-content-between">
                    <a href="#" className="navbar-brand d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="mr-2">
                            <path d="M22.413 18.855l-7.413-12.352v-5.003h0.75c0.413 0 0.75-0.337 0.75-0.75s-0.337-0.75-0.75-0.75h-7.5c-0.413 0-0.75 0.338-0.75 0.75s0.337 0.75 0.75 0.75h0.75v5.003l-7.413 12.352c-1.698 2.83-0.387 5.145 2.913 5.145h15c3.3 0 4.611-2.315 2.913-5.145zM5.649 15l4.851-8.084v-5.416h3v5.416l4.851 8.084h-12.701z"></path>
                        </svg>
                        <strong>Isomorphic SPA app</strong>
                    </a>
                </div>
            </div>
        </header>
    );
}