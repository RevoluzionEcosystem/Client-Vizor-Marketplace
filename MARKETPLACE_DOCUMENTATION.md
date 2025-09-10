# LP Marketplace Documentation

## Overview

The Vizor LP Marketplace is a specialized peer-to-peer trading platform designed exclusively for locked liquidity pool (LP) positions. It enables users to buy, sell, and trade LP tokens that are currently locked in various locker platforms like Unicrypt, Team.Finance, and others.

## Core Concept

Typically, when LP tokens are locked, they become illiquid until the unlock date. Our marketplace solves this problem by creating a secondary market where:

- **Sellers** can monetize their locked LP positions before unlock
- **Buyers** can acquire locked LP positions at a discount
- **Both parties** benefit from the liquidity and opportunity

## How It Works

### 1. Creating a Listing (Seller)

1. **Pay Listing Fee**: Sellers pay a small fee (default 0.01 ETH) to create a listing
2. **Provide Details**: Include LP token address, locker URL, unlock date, and asking price
3. **Set Price**: Choose a competitive price (typically at a discount to current value)
4. **Publish**: Listing becomes visible to all potential buyers

### 2. Purchasing (Buyer)

1. **Browse Listings**: Search and filter available LP positions
2. **Due Diligence**: Verify the lock details on the original locker platform
3. **Purchase**: Send exact payment amount to smart contract (held in escrow)
4. **Wait for Transfer**: Seller has time to transfer ownership

### 3. Ownership Transfer (Off-Chain)

1. **Seller Action**: Goes to original locker platform (e.g., Unicrypt)
2. **Transfer Ownership**: Changes owner from seller's address to buyer's address
3. **Submit Proof**: Provides transaction hash as proof of transfer
4. **Confirmation Window**: Buyer has 24 hours to confirm receipt

### 4. Completion

1. **Buyer Confirms**: Verifies they now own the locked LP position
2. **Funds Released**: Smart contract releases escrowed funds to seller
3. **Transaction Complete**: Both parties have successfully traded

## Smart Contract Features

### Security & Trust

- **Escrow System**: Buyer's funds are held safely in smart contract
- **Time Windows**: 24-hour confirmation window prevents indefinite holds
- **Admin Dispute Resolution**: Trusted admin can resolve conflicts
- **On-Chain Verification**: All transactions are transparent and verifiable

### Listing Management

- **Edit Pricing**: Sellers can update prices while listing is available
- **Cancel Anytime**: Sellers can cancel listings before purchase
- **Status Tracking**: Real-time status updates throughout the process

### Fee Structure

- **Listing Fee**: Small fee to create listings (prevents spam)
- **No Trading Fee**: Direct P2P trading without additional fees
- **Admin Revenue**: Platform fees support continued development

## User Benefits

### For Sellers

- **Immediate Liquidity**: Convert locked positions to cash
- **Market Rate Pricing**: Set competitive prices for quick sales
- **Risk Mitigation**: Reduce exposure to impermanent loss
- **Portfolio Rebalancing**: Free up capital for new opportunities

### For Buyers

- **Discounted Entry**: Buy LP positions below market value
- **Future Value**: Benefit from unlock date appreciation
- **Passive Strategy**: Buy and hold until unlock
- **Arbitrage Opportunities**: Profit from market inefficiencies

## Supported Platforms

The marketplace works with LP tokens locked on:

- **Unicrypt**: Leading LP locker platform
- **Team.Finance**: Popular token and LP locker
- **UNCX Network**: Decentralized locker protocol
- **Other Lockers**: Any platform that allows ownership transfer

## Risk Considerations

### For All Users

- **Smart Contract Risk**: Code has been audited but inherent risks exist
- **Platform Dependency**: Relies on external locker platforms
- **Market Volatility**: LP values can fluctuate significantly
- **Impermanent Loss**: Standard DeFi LP risks apply

### For Sellers

- **Opportunity Cost**: May miss out on future appreciation
- **Transfer Complexity**: Must successfully transfer ownership
- **Reputation Risk**: Failed transfers may impact future trading

### For Buyers

- **Verification Required**: Must independently verify lock details
- **Trust Element**: Relies on seller to complete transfer
- **Time Lock Risk**: Still subject to original unlock schedule

## Technical Architecture

### Smart Contract Components

```solidity
struct Listing {
    uint256 id;
    address payable seller;
    address payable buyer;
    uint256 price;
    address tokenAddress;
    address lpAddress;
    string lockUrl;
    string transferProofHash;
    ListingStatus status;
    uint256 purchaseTimestamp;
    uint256 chainId;
    uint256 unlockTimestamp;
    uint256 createdAt;
}
```

### Status Flow

```
Available → InEscrow → AwaitingConfirmation → Completed
    ↓           ↓              ↓
Cancelled   Cancelled    InDispute → Resolved
```

### Key Functions

- `createListing()`: Create new marketplace listing
- `purchaseListing()`: Buy a listing (funds held in escrow)
- `submitTransferProof()`: Seller provides transfer evidence
- `confirmReceiptAndRelease()`: Buyer confirms and releases funds
- `resolveDispute()`: Admin intervention for problems

## Getting Started

### Prerequisites

- Web3 wallet (MetaMask, WalletConnect, etc.)
- Native tokens for gas fees and listing fees
- Basic understanding of DeFi and LP tokens

### Step-by-Step Guide

1. **Connect Wallet**: Connect your Web3 wallet to the platform
2. **Browse or List**: Either browse existing listings or create your own
3. **Verify Details**: Always verify LP details on original locker
4. **Execute Trade**: Follow the guided trading process
5. **Complete Transfer**: Ensure ownership transfer is completed properly

## Support & Resources

- **Documentation**: Complete guides and tutorials
- **Community**: Telegram group for user support
- **Technical Support**: Direct contact for complex issues
- **Dispute Resolution**: Admin support for problem transactions

## Future Enhancements

- **Auction System**: Competitive bidding for premium positions
- **Analytics Dashboard**: Market insights and historical data
- **Mobile App**: Native mobile experience
- **Cross-Chain Support**: Support for multiple blockchain networks
- **Automated Valuation**: AI-powered LP position assessment

## Conclusion

The Vizor LP Marketplace transforms locked liquidity from a constraint into an opportunity. By creating a trusted environment for P2P trading of locked positions, we unlock new possibilities for both liquidity providers and investors in the DeFi ecosystem.
