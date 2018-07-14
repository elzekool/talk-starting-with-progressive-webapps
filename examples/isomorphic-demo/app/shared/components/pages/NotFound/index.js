/**
 * 404 / Not Found page
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div>
        <h2>Whooops</h2>
        <p>
            The page you are looking for is not found or just plain gone.. sorry for that ;-)
        <p>
        </p>
            I can recommend you to go <Link to="/">back to home</Link>.
        </p>
    </div>
  )
}