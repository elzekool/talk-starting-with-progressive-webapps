/**
 * View Todo
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function Todo(props) {
  return (
    <div>
        <h2>Todo #{props.id}</h2>
        <Link to="/">Back to home</Link>
    </div>
  )
}