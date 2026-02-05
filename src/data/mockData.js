export const users = [
  {
    id: 1,
    name: "Rahul Sharma",
    accountNumber: "4521876543",
    upiId: "rahul@vaultsight",
    mobile: "9876543210",
    status: "Active",
    balance: 85240.50,
    address: "B-42, Sector 5, Mumbai",
    username: "rahul_s",
    debitCardNumber: "4532 8876 1234 5678",
    expiry: "08/28",
    limit: 200000,
    availableLimit: 145000,
  },
  {
    id: 2,
    name: "Priya Mehta",
    accountNumber: "7823451209",
    upiId: "priya@vaultsight",
    mobile: "9988776655",
    status: "Locked",
    balance: 125000.00,
    address: "Flat 201, Green Heights, Delhi",
    username: "priya_m",
    debitCardNumber: "5105 4432 9988 7766",
    expiry: "12/27",
    limit: 500000,
    availableLimit: 375000,
    lockReason: "High-value transaction from new location",
    lockedAt: "2026-04-11T14:30:00Z"
  },
  {
    id: 3,
    name: "Amit Patel",
    accountNumber: "3310987654",
    upiId: "amit@vaultsight",
    mobile: "9123456789",
    status: "Active",
    balance: 42300.75,
    address: "7th floor, Sky Tower, Pune",
    username: "amit_p",
    debitCardNumber: "4000 1122 3344 5566",
    expiry: "05/29",
    limit: 150000,
    availableLimit: 107699,
  },
  {
    id: 4,
    name: "Sneha Joshi",
    accountNumber: "9087654321",
    upiId: "sneha@vaultsight",
    mobile: "8877665544",
    status: "Active",
    balance: 15600.20,
    address: "House 12, Rose Colony, Bangalore",
    username: "sneha_j",
    debitCardNumber: "4242 5566 7788 9900",
    expiry: "01/30",
    limit: 100000,
    availableLimit: 84399,
  },
  {
    id: 5,
    name: "Rajan Nair",
    accountNumber: "6543219870",
    upiId: "rajan@vaultsight",
    mobile: "7766554433",
    status: "Blocked",
    balance: 540.00,
    address: "Block C, Metro View, Chennai",
    username: "rajan_n",
    debitCardNumber: "5566 7788 9900 1122",
    expiry: "03/26",
    limit: 50000,
    availableLimit: 50000,
  }
];

export const transactions = [
  {
    id: "TXN10001",
    userId: 1,
    userName: "Rahul Sharma",
    amount: 12500,
    receiver: "Amazon India",
    location: "Mumbai",
    device: "iPhone 15",
    timestamp: "2026-04-12T10:15:00Z",
    riskLevel: "LOW",
    riskScore: 12,
    status: "Success",
    type: "Debit",
    category: "Shopping"
  },
  {
    id: "TXN10002",
    userId: 2,
    userName: "Priya Mehta",
    amount: 150000,
    receiver: "Global Exchange",
    location: "Unknown (VPN)",
    device: "Unknown Device",
    timestamp: "2026-04-12T11:20:00Z",
    riskLevel: "HIGH",
    riskScore: 88,
    status: "Flagged",
    type: "Debit",
    category: "Transfer",
    flaggedReason: "High-value transfer from new device in unknown location",
    ipAddress: "192.168.45.102"
  },
  {
    id: "TXN10003",
    userId: 3,
    userName: "Amit Patel",
    amount: 500,
    receiver: "Starbucks",
    location: "Pune",
    device: "Android Pixel 7",
    timestamp: "2026-04-12T09:45:00Z",
    riskLevel: "LOW",
    riskScore: 5,
    status: "Success",
    type: "Debit",
    category: "Food"
  },
  {
    id: "TXN10004",
    userId: 1,
    userName: "Rahul Sharma",
    amount: 45000,
    receiver: "Credit Card Bill",
    location: "Mumbai",
    device: "iPhone 15",
    timestamp: "2026-04-11T18:30:00Z",
    riskLevel: "MEDIUM",
    riskScore: 45,
    status: "Success",
    type: "Debit",
    category: "Bill Payment"
  },
  {
    id: "TXN10005",
    userId: 4,
    userName: "Sneha Joshi",
    amount: 2500,
    receiver: "Zomato",
    location: "Bangalore",
    device: "iPhone 13",
    timestamp: "2026-04-12T12:05:00Z",
    riskLevel: "LOW",
    riskScore: 8,
    status: "Success",
    type: "Debit",
    category: "Food"
  },
  {
    id: "TXN10006",
    userId: 2,
    userName: "Priya Mehta",
    amount: 50000,
    receiver: "New Beneficiary X",
    location: "Delhi",
    device: "Windows Desktop",
    timestamp: "2026-04-11T22:15:00Z",
    riskLevel: "MEDIUM",
    riskScore: 62,
    status: "Pending",
    type: "Debit",
    category: "Transfer",
    flaggedReason: "UPI transaction to new beneficiary exceeding daily limit"
  },
  {
    id: "TXN10007",
    userId: 5,
    userName: "Rajan Nair",
    amount: 80000,
    receiver: "Unknown Wallet",
    location: "Moscow, RU",
    device: "Unknown Bot",
    timestamp: "2026-04-10T14:50:00Z",
    riskLevel: "HIGH",
    riskScore: 95,
    status: "Blocked",
    type: "Debit",
    category: "Transfer",
    flaggedReason: "Suspicious login pattern followed by high-value transfer"
  },
  {
    id: "TXN10008",
    userId: 3,
    userName: "Amit Patel",
    amount: 5000,
    receiver: "Airtel",
    location: "Pune",
    device: "Android Pixel 7",
    timestamp: "2026-04-12T13:00:00Z",
    riskLevel: "LOW",
    riskScore: 10,
    status: "Success",
    type: "Debit",
    category: "Utility"
  }
];

export const upiTransactions = transactions.filter(t => t.category === "Transfer").map(t => ({
  ...t,
  senderUpiId: users.find(u => u.id === t.userId)?.upiId,
  receiverUpiId: t.receiver.toLowerCase().replace(" ", "") + "@upi"
}));

export const loginActivity = [
  {
    id: 1,
    username: "rahul_s",
    ipAddress: "152.16.4.88",
    device: "iPhone 15",
    location: "Mumbai, IN",
    time: "2026-04-12 10:10:00",
    status: "Success"
  },
  {
    id: 2,
    username: "priya_m",
    ipAddress: "103.45.2.11",
    device: "Unknown Device",
    location: "Unknown",
    time: "2026-04-12 11:15:00",
    status: "Suspicious"
  },
  {
    id: 3,
    username: "amit_p",
    ipAddress: "122.161.4.15",
    device: "Android Pixel 7",
    location: "Pune, IN",
    time: "2026-04-12 09:40:00",
    status: "Success"
  },
  {
    id: 4,
    username: "rajan_n",
    ipAddress: "45.12.33.201",
    device: "Desktop",
    location: "Moscow, RU",
    time: "2026-04-10 14:45:00",
    status: "Blocked"
  },
  {
    id: 5,
    username: "sneha_j",
    ipAddress: "172.16.8.44",
    device: "iPhone 13",
    location: "Bangalore, IN",
    time: "2026-04-12 12:00:00",
    status: "Success"
  }
];

export const threats = [
  {
    id: "TH-001",
    userId: 2,
    userName: "Priya Mehta",
    description: "High-value transfer of ₹1,50,000 from new device in unknown location",
    riskLevel: "CRITICAL",
    riskScore: 88,
    timestamp: "2026-04-12T11:20:00Z",
    status: "Active",
    location: "Unknown (VPN)",
    device: "Linux Desktop",
    similarity: 98 // Mock similarity score for search
  },
  {
    id: "TH-002",
    userId: 2,
    userName: "Priya Mehta",
    description: "3 failed login attempts followed by successful login from different IP",
    riskLevel: "HIGH",
    riskScore: 72,
    timestamp: "2026-04-12T11:10:00Z",
    status: "Investigating",
    location: "Unknown",
    device: "Unknown Webkit",
    similarity: 85
  },
  {
    id: "TH-003",
    userId: 5,
    userName: "Rajan Nair",
    description: "UPI transaction to new beneficiary exceeding daily limit",
    riskLevel: "HIGH",
    riskScore: 81,
    timestamp: "2026-04-10T14:50:00Z",
    status: "Blocked",
    location: "Moscow, RU",
    device: "Unknown Bot",
    similarity: 92
  },
  {
    id: "TH-004",
    userId: 1,
    userName: "Rahul Sharma",
    description: "Unusual login time: 3:45 AM from registered device",
    riskLevel: "MEDIUM",
    riskScore: 42,
    timestamp: "2026-04-11T03:45:00Z",
    status: "Alerted",
    location: "Mumbai",
    device: "iPhone 15",
    similarity: 45
  }
];

export const threatStats = {
  totalThreats: 156,
  highRiskTxns: 12,
  accountsLocked: 4,
  fraudBlocked: 28,
  avgRiskScore: 34,
  activeInvestigations: 5
};

export const chartData = {
  threatActivity: [
    { day: "Mon", threats: 12 },
    { day: "Tue", threats: 18 },
    { day: "Wed", threats: 15 },
    { day: "Thu", threats: 25 },
    { day: "Fri", threats: 20 },
    { day: "Sat", threats: 32 },
    { day: "Sun", threats: 28 }
  ],
  riskDistribution: [
    { name: "Low", value: 45, color: "#22C55E" },
    { name: "Medium", value: 30, color: "#F59E0B" },
    { name: "High", value: 15, color: "#EF4444" },
    { name: "Critical", value: 10, color: "#7F1D1D" }
  ],
  topRiskUsers: [
    { name: "Rahul S", score: 25 },
    { name: "Priya M", score: 85 },
    { name: "Amit P", score: 15 },
    { name: "Sneha J", score: 20 },
    { name: "Rajan N", score: 95 }
  ]
};
