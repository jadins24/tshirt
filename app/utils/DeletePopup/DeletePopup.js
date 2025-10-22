import React from 'react';
import './DeletePopup.scss';

const DeletePopup = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <>
      {isOpen && (
        <div className="screen">
            <div className='screen-container delete-popup'>
                <h2>Are you sure you want to delete?</h2>
                <p> This action is Permanent and cannot be undone</p>
                <button onClick={onConfirm} className='delete btn'>Yes, Delete</button>
                <button onClick={onCancel} className='btn-cancel' >No, Cancel</button>
            </div>
        </div>
      )}
    </>
  )
}

export default DeletePopup