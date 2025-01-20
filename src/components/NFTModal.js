import React from "react";

const NFTModal = ({ show, imageUrl, transactionHash, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">NFT Minted Successfully!</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Minted NFT"
                className="img-fluid rounded mb-3"
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
              />
            )}
            {transactionHash && (
              <div className="alert alert-success mt-4" role="alert">
                Transaction successful! View details on{" "}
                <a
                  href={`https://holesky.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alert-link"
                >
                  Etherscan
                </a>
                .
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTModal;
