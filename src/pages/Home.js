import React, { useState, useEffect } from "react";
import { connectWallet, checkWalletIsConnected, disconnectWallet, mintNFT, getTotalSupply } from "../services/walletService";
import { handleMintError, handleTransactionError } from "../services/errorHandler"; // ฟังก์ชันจัดการข้อผิดพลาด
import NFTModal from "../components/NFTModal";

function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [web3, setWeb3] = useState(null);  // เพิ่ม web3 state
  const [transactionHash, setTransactionHash] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ตรวจสอบการเชื่อมต่อกระเป๋าและโหลดข้อมูลเบื้องต้นเมื่อโหลดเพจ
  useEffect(() => {
    const initWallet = async () => {
      try {
        const connectedAccount = localStorage.getItem("connectedAccount"); // ดึงข้อมูลบัญชีจาก localStorage
        if (connectedAccount) {
          const { account, contractInstance } = await checkWalletIsConnected();
          if (account && contractInstance) {
            setCurrentAccount(account);
            setContractInstance(contractInstance);

            const supply = await getTotalSupply(contractInstance);
            setTotalSupply(supply);
          }
        }
      } catch (error) {
        console.error("Failed to initialize wallet:", error);
        alert(error.message);
      }
    };

    initWallet();
  }, []);

  // ฟังก์ชันสำหรับการ Mint NFT
  const mintNFTHandler = async () => {
    if (!contractInstance || !currentAccount) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setIsTransactionPending(true);

      // เรียกใช้ฟังก์ชัน mintNFT จาก walletService.js
      const { transactionHash, imageUrl } = await mintNFT(contractInstance, currentAccount);
      setTransactionHash(transactionHash);
      setImageUrl(imageUrl);
      setShowModal(true);

      // ตรวจสอบจำนวน NFT ที่ mint แล้ว
      const supply = await getTotalSupply(contractInstance);
      setTotalSupply(supply);
    } catch (error) {
      // จัดการข้อผิดพลาดจากการ Mint
      const errorMessage = handleMintError(error);
      console.error("Minting error:", errorMessage);
      alert(errorMessage);
    } finally {
      setIsTransactionPending(false); // ปิดสถานะกำลังทำงาน
    }
  };

  // ฟังก์ชันสำหรับการเชื่อมต่อกระเป๋า
  const connectWalletHandler = async () => {
    try {
      const { account, contractInstance } = await connectWallet();
      if (account && contractInstance) {
        setCurrentAccount(account);
        setContractInstance(contractInstance);

        const supply = await getTotalSupply(contractInstance);
        setTotalSupply(supply);

        // บันทึกสถานะการเชื่อมต่อใน localStorage
        localStorage.setItem("connectedAccount", account);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(error.message);
    }
  };

  // ฟังก์ชันสำหรับการตัดการเชื่อมต่อกระเป๋า
  const disconnectWalletHandler = () => {
    disconnectWallet(setCurrentAccount, setContractInstance, setTotalSupply);

    // ลบสถานะการเชื่อมต่อออกจาก localStorage
    localStorage.removeItem("connectedAccount");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Pokemon TCG</h1>
      <h2 className="text-center mb-4">Total NFTs Minted: {totalSupply}</h2>
      <div className="text-center">
        {currentAccount ? (
          <>
            <button
              onClick={mintNFTHandler}
              className="btn btn-primary me-3"
              disabled={isTransactionPending}
            >
              {isTransactionPending ? "Processing..." : "Mint NFT"}
            </button>
            <button
              onClick={disconnectWalletHandler}
              className="btn btn-danger"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <button onClick={connectWalletHandler} className="btn btn-success">
            Connect Wallet
          </button>
        )}
      </div>

      <NFTModal
        show={showModal}
        imageUrl={imageUrl}
        transactionHash={transactionHash}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default Home;
