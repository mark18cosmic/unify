export function bankConfig() {
  return {
    name: process.env.BANK_NAME || "Bank of Maldives (BML)",
    accName: process.env.BANK_ACCOUNT_NAME || "Unify Games Pvt Ltd",
    accNo: process.env.BANK_ACCOUNT_NUMBER || "7730000000000",
  };
}
