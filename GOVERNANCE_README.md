# Vizor DAO Governance Frontend

A comprehensive governance frontend built for the Vizor DAO, featuring proposal creation, voting mechanisms, and administrative tools.

## 🚀 Features

### Core Governance Features
- **Proposal Creation**: Multi-step form for creating detailed governance proposals
- **Voting System**: Intuitive voting interface with real-time results
- **Proposal Management**: View, filter, and sort proposals by status
- **Admin Panel**: Administrative tools for authorized wallets
- **User Statistics**: Track voting history and participation metrics

### Smart Contract Integration
- **Governance Contract**: Main contract for proposal management and voting
- **Governance Reader**: Optimized read-only contract for data fetching
- **Real-time Updates**: Live proposal status and voting results
- **Token-based Voting**: Weighted voting based on token holdings

### UI/UX Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Modern dark UI with cyan/blue accent colors
- **Animations**: Smooth Framer Motion animations throughout
- **Real-time Progress**: Live quorum progress and voting statistics
- **Status Indicators**: Clear visual indicators for proposal states

## 📁 File Structure

```
components/modules/view/governance/
├── index.tsx                     # Main governance view
├── hooks/
│   └── use-governance-data.tsx   # Smart contract data hooks
├── components/
│   ├── governance-stats.tsx      # Statistics dashboard
│   ├── admin-panel.tsx          # Admin control panel
│   └── proposal-card-component.tsx # Individual proposal cards
└── abi/
    ├── governance-abi.tsx        # Main governance contract ABI
    └── governance-reader-abi.tsx # Reader contract ABI

app/governance/
├── page.tsx                      # Main governance page
├── create/
│   └── page.tsx                 # Proposal creation form
├── vote/
│   └── [proposalId]/
│       └── page.tsx             # Voting interface
└── proposal/
    └── [proposalId]/
        └── page.tsx             # Detailed proposal view
```

## 🔧 Setup & Configuration

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Governance Contract Addresses
NEXT_PUBLIC_GOVERNANCE_CONTRACT=0x...
NEXT_PUBLIC_GOVERNANCE_READER_CONTRACT=0x...

# Admin Authentication
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

### 2. Contract Deployment

Deploy your governance contracts and update the addresses in your environment file:

1. **Governance Contract**: Main contract handling proposals and voting
2. **Governance Reader Contract**: Optimized for reading proposal data

### 3. Admin Setup

Admin users can:
- Approve/reject proposals
- Manage governance settings
- Access advanced analytics

To enable admin features, ensure the wallet is authorized in the smart contract and knows the admin password.

## 🎯 Usage Guide

### For Regular Users

1. **Connect Wallet**: Use the connect wallet button
2. **View Proposals**: Browse active, pending, and completed proposals
3. **Vote**: Click on active proposals to cast your vote
4. **Create Proposals**: Submit new proposals for community voting
5. **Track Activity**: View your voting history and statistics

### For Administrators

1. **Access Admin Panel**: Available when connected with authorized wallet
2. **Manage Proposals**: Approve or reject pending proposals
3. **View Analytics**: Access detailed governance metrics
4. **Configure Settings**: Adjust governance parameters

## 🔑 Smart Contract Functions

### Governance Contract Functions
- `propose()`: Create new proposals
- `vote()`: Cast votes on active proposals
- `approveProposal()`: Admin function to approve proposals
- `rejectProposal()`: Admin function to reject proposals

### Reader Contract Functions
- `getAllProposals()`: Fetch all proposals with details
- `getUserInfoForAllProposals()`: Get user-specific data
- `getGovernanceMetric()`: Retrieve governance statistics

## 🎨 Design System

The governance UI follows Vizor's design language:

- **Colors**: Slate backgrounds with cyan/blue accents
- **Typography**: Monospace fonts for technical feel
- **Layout**: Card-based components with consistent spacing
- **Animations**: Subtle motion design with Framer Motion
- **Status Colors**: 
  - Active: Green
  - Pending: Yellow
  - Completed: Blue
  - Rejected: Red

## 🚀 Development

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Key Dependencies

- **Wagmi**: Ethereum React hooks
- **Viem**: TypeScript Ethereum library
- **Framer Motion**: Animations
- **Radix UI**: Component primitives
- **Tailwind CSS**: Styling

## 🔐 Security Considerations

1. **Admin Authentication**: Secure admin panel access
2. **Contract Validation**: Validate all contract interactions
3. **Input Sanitization**: Clean user inputs for proposals
4. **Rate Limiting**: Prevent spam proposal creation
5. **Wallet Verification**: Ensure proper wallet connections

## 📊 Analytics & Metrics

The governance system tracks:

- Total proposals created
- Voting participation rates
- Quorum achievement
- User engagement metrics
- Token-weighted voting power

## 🛠 Customization

### Adding New Proposal Categories

1. Update the categories array in `create/page.tsx`
2. Ensure smart contract supports new category IDs
3. Update filtering logic if needed

### Modifying Voting Options

The system supports 2-5 voting options per proposal. Customize in the proposal creation form.

### Styling Adjustments

Colors and styling can be modified through:
- Tailwind CSS classes
- CSS custom properties
- Component-level styling

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Basic proposal creation and voting
- ✅ Admin panel functionality
- ✅ Real-time statistics

### Phase 2 (Future)
- 🔄 Discussion and comments system
- 🔄 Advanced proposal templates
- 🔄 Delegation features
- 🔄 Multi-sig proposal execution

### Phase 3 (Future)
- 🔄 Cross-chain governance
- 🔄 Advanced analytics dashboard
- 🔄 Automated proposal execution
- 🔄 Integration with other protocols

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For technical support:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for the Vizor DAO community
