import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './modalOverlay.css';

const HourListModal = ({ isOpen, onRequestClose, schedules, onHourClick }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Select an Hour</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onRequestClose}></button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group">
                            {schedules.map((schedule, index) => (
                                <li key={index} className="list-group-item">
                                    <button className="btn btn-link" onClick={() => onHourClick(schedule)}>
                                        {schedule.startTime}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HourListModal;
