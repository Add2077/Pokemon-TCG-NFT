import Web3 from "web3";
import contract from "../abi/RandomNFT.json";

// กำหนดค่าคงที่สำหรับที่อยู่ของ Smart Contract และ ABI
const contractAddress = "0x2314ff814F0472209F2D6FF19f8aC41042CfB23d";
const abi = contract.abi;
const HOLESKY_CHAIN_ID = "0x4268";  // กำหนด Chain ID ของ Holesky Testnet

// ฟังก์ชันตรวจสอบว่าเชื่อมต่อกับเครือข่ายที่ถูกต้องหรือไม่
export const checkCorrectNetwork = async () => {
  if (window.ethereum) {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== HOLESKY_CHAIN_ID) {
      alert("Please switch your network to Ethereum Holesky Testnet.");
      return false;
    }
    return true;
  }
  return false;
};

// ฟังก์ชันตรวจสอบสถานะการเชื่อมต่อของกระเป๋า
export const checkWalletIsConnected = async () => {
  if (window.ethereum) {
    try {
      const web3Instance = new Web3(window.ethereum);
      
      // ตรวจสอบบัญชีที่เชื่อมต่อ
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const isCorrectNetwork = await checkCorrectNetwork();
        if (!isCorrectNetwork) return null;

        // สร้าง instance ของ smart contract
        const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
        return { account: accounts[0], contractInstance };  // ส่งคืนข้อมูลบัญชีและ contract instance
      } else {
        console.log("No authorized account found");
        return null;
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return null;
    }
  } else {
    console.log("Please install Metamask!");
    return null;
  }
};

// ฟังก์ชันเชื่อมต่อกระเป๋า
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      const isCorrectNetwork = await checkCorrectNetwork();

      console.log("Wallet Connected.");
      console.log("Wallet connected:", accounts[0]);

      if (!isCorrectNetwork) return;

      const web3Instance = new Web3(window.ethereum);

      const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
      return { account: accounts[0], contractInstance };
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  } else {
    alert("Please install Metamask!");
  }
};

// ฟังก์ชันตัดการเชื่อมต่อกระเป๋า
export const disconnectWallet = (setCurrentAccount, setContractInstance, setTotalSupply) => {
  // รีเซ็ตค่าต่าง ๆ ใน state
  setCurrentAccount(null);
  setContractInstance(null);
  setTotalSupply(null);

  // ลบข้อมูลจาก localStorage
  localStorage.removeItem("connectedAccount");
  localStorage.removeItem("web3");

  // ลบ Listener ที่เคยเพิ่มไว้
  if (window.ethereum?.removeAllListeners) {
    window.ethereum.removeAllListeners("accountsChanged");
    window.ethereum.removeAllListeners("chainChanged");
  }

  console.log("Wallet disconnected. Please manually disconnect from MetaMask if needed.");
};


// ฟังก์ชันดึงข้อมูลจำนวน NFT ที่ mint ไปแล้ว
export const getTotalSupply = async (contractInstance) => {
  try {
    // เรียกใช้งาน smart contract เพื่อดึงจำนวน NFT ที่ mint ไปแล้ว
    const supply = await contractInstance.methods.totalSupply().call();
    return supply;
  } catch (error) {
    console.error("Error getting total supply:", error);
    throw new Error("Failed to get total supply");
  }
};

// ฟังก์ชันสำหรับการ mint NFT
export const mintNFT = async (contractInstance, currentAccount) => {
  try {
    // เรียกใช้ smart contract เพื่อ mint NFT
    const mintTransaction = await contractInstance.methods.mint().send({ from: currentAccount });
    console.log("Minting successful:", mintTransaction);

    // รับค่า transaction hash และ URL ของ NFT ที่ได้รับ
    const transactionHash = mintTransaction.transactionHash;
    const imageUrl = `https://ipfs.infura.io/ipfs/${mintTransaction.events.Transfer.returnValues.tokenId}`;

    return { transactionHash, imageUrl };
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw new Error("Minting failed");
  }
};

