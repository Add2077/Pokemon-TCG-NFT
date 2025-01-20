export const handleMintError = (error) => {
    // ถ้าเกิด error ที่มีข้อความ "revert" จาก Smart Contract
    if (error.message.includes("revert")) {
      const errorMessage = error.message.split("revert")[1]?.trim();
      alert(`Error: ${errorMessage}`);
      return errorMessage;
    }
  
    // ถ้ามีข้อผิดพลาดอื่น ๆ
    alert("An unexpected error occurred. Please try again.");
    console.error("Error during minting:", error);
    return error.message || "An unexpected error occurred.";
  };
  
  export const handleTransactionError = (error) => {
    // ตรวจสอบข้อผิดพลาดเมื่อมีการทำการส่ง transaction
    if (error.message.includes("User denied transaction")) {
      alert("Transaction was denied by the user.");
      return "Transaction denied.";
    }
  
    // ถ้า error มาจากสาเหตุอื่น ๆ
    alert("An error occurred while sending the transaction.");
    console.error("Transaction Error:", error);
    return error.message || "An error occurred while sending the transaction.";
  };
  