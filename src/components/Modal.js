import React from 'react';

const Modal = ({ isVisible, onClose, imageUrl, transactionHash }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
          <h5>NFT Minted Successfully!</h5>
          {imageUrl && <img src={imageUrl} alt="Minted NFT" className="modal-image" />}
          {transactionHash && (
            <div>
              <p>Transaction Hash:</p>
              <a
                href={`https://holesky.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Etherscan
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
