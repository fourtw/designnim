export const erc20Abi = [
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

// Fundraising Contract ABI
export const fundraisingAbi = [
  {
    type: 'function',
    name: 'createFundraiser',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_location', type: 'string' },
      { name: '_description', type: 'string' },
      { name: '_targetAmount', type: 'uint256' },
      { name: '_recipient', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'donate',
    stateMutability: 'payable',
    inputs: [{ name: '_fundraiserId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'withdrawFunds',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_fundraiserId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getFundraiser',
    stateMutability: 'view',
    inputs: [{ name: '_fundraiserId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'owner', type: 'address' },
          { name: 'name', type: 'string' },
          { name: 'location', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'targetAmount', type: 'uint256' },
          { name: 'raisedAmount', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'recipient', type: 'address' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getNextFundraiserId',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getDonationCount',
    stateMutability: 'view',
    inputs: [{ name: '_fundraiserId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getDonations',
    stateMutability: 'view',
    inputs: [
      { name: '_fundraiserId', type: 'uint256' },
      { name: '_offset', type: 'uint256' },
      { name: '_limit', type: 'uint256' },
    ],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'donor', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'fundraiserId', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'event',
    name: 'FundraiserCreated',
    inputs: [
      { name: 'fundraiserId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'targetAmount', type: 'uint256', indexed: false },
      { name: 'recipient', type: 'address', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'DonationMade',
    inputs: [
      { name: 'fundraiserId', type: 'uint256', indexed: true },
      { name: 'donor', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'FundsWithdrawn',
    inputs: [
      { name: 'fundraiserId', type: 'uint256', indexed: true },
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
] as const


