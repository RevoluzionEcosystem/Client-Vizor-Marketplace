// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/********************************************************************************************
  INTERFACE
********************************************************************************************/

/**
 * @title ERC20 Token Standard Interface
 * 
 * @notice Interface of the ERC-20 standard token as defined in the ERC.
 * 
 * @dev See https://eips.ethereum.org/EIPS/eip-20
 */
interface IERC20 {
    
    // EVENT
    
    /**
     * @notice Emitted when `value` tokens are transferred from
     * one account (`from`) to another (`to`).
     * 
     * @param from The address tokens are transferred from.
     * @param to The address tokens are transferred to.
     * @param value The amount of tokens transferred.
     * 
     * @dev The `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @notice Emitted when the allowance of a `spender` for an `owner`
     * is set by a call to {approve}.
     * 
     * @param owner The address allowing `spender` to spend on their behalf.
     * @param spender The address allowed to spend tokens on behalf of `owner`.
     * @param value The allowance amount set for `spender`.
     * 
     * @dev The `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // FUNCTION

    /**
     * @notice Returns the value of tokens in existence.
     * 
     * @return The value of the total supply of tokens.
     * 
     * @dev This should get the total token supply.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @notice Returns the value of tokens owned by `account`.
     * 
     * @param account The address to query the balance for.
     * 
     * @return The token balance of `account`.
     * 
     * @dev This should get the token balance of a specific account.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @notice Moves a `value` amount of tokens from the caller's account to `to`.
     * 
     * @param to The address to transfer tokens to.
     * @param value The amount of tokens to be transferred.
     * 
     * @return A boolean indicating whether the transfer was successful or not.
     * 
     * @dev This should transfer tokens to a specified address and emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @notice Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}.
     * 
     * @param owner The address allowing `spender` to spend on their behalf.
     * @param spender The address allowed to spend tokens on behalf of `owner`.
     * 
     * @return The allowance amount for `spender`.
     * 
     * @dev The return value should be zero by default and
     * changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @notice Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     * 
     * @param spender The address allowed to spend tokens on behalf of the sender.
     * @param value The allowance amount for `spender`.
     * 
     * @return A boolean indicating whether the approval was successful or not.
     * 
     * @dev This should approve `spender` to spend a specified amount of tokens
     * on behalf of the sender and emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @notice Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's allowance.
     * 
     * @param from The address to transfer tokens from.
     * @param to The address to transfer tokens to.
     * @param value The amount of tokens to be transferred.
     * 
     * @return A boolean indicating whether the transfer was successful or not.
     * 
     * @dev This should transfer tokens from one address to another after
     * spending caller's allowance and emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

/**
 * @title ERC20 Token Metadata Interface
 * 
 * @notice Interface for the optional metadata functions of the ERC-20 standard as defined in the ERC.
 * 
 * @dev It extends the IERC20 interface. See https://eips.ethereum.org/EIPS/eip-20
 */
interface IERC20Metadata is IERC20 {

    // FUNCTION
    
    /**
     * @notice Returns the name of the token.
     * 
     * @return The name of the token as a string.
     */
    function name() external view returns (string memory);

    /**
     * @notice Returns the symbol of the token.
     * 
     * @return The symbol of the token as a string.
     */
    function symbol() external view returns (string memory);

    /**
     * @notice Returns the number of decimals used to display the token.
     * 
     * @return The number of decimals as a uint8.
     */
    function decimals() external view returns (uint8);
}

/**
 * @title ERC20 Token Standard Error Interface
 * 
 * @notice Interface of the ERC-6093 custom errors that defined common errors
 * related to the ERC-20 standard token functionalities.
 * 
 * @dev See https://eips.ethereum.org/EIPS/eip-6093
 */
interface IERC20Errors {
    
    // ERROR

    /**
     * @notice Error indicating that the `sender` has inssufficient `balance` for the operation.
     * 
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     *
     * @dev The `needed` value is required to inform user on the needed amount.
     */
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);

    /**
     * @notice Error indicating that the `sender` is invalid for the operation.
     * 
     * @param sender Address whose tokens are being transferred.
     */
    error ERC20InvalidSender(address sender);
    
    /**
     * @notice Error indicating that the `receiver` is invalid for the operation.
     * 
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC20InvalidReceiver(address receiver);
    
    /**
     * @notice Error indicating that the `spender` does not have enough `allowance` for the operation.
     * 
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     * 
     * @dev The `needed` value is required to inform user on the needed amount.
     */
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);
    
    /**
     * @notice Error indicating that the `approver` is invalid for the approval operation.
     * 
     * @param approver Address initiating an approval operation.
     */
    error ERC20InvalidApprover(address approver);

    /**
     * @notice Error indicating that the `spender` is invalid for the allowance operation.
     * 
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC20InvalidSpender(address spender);
}

/**
 * @title Common Error Interface
 * 
 * @notice Interface of the common errors not specific to ERC-20 functionalities.
 */
interface ICommonErrors {

    // ERROR

    /**
     * @notice Error indicating that the `current` state cannot be used in this context.
     * 
     * @param current Boolean state used in the context.
     */
    error CannotUseCurrentState(bool current);

    /**
     * @notice Error indicating that the `current` value cannot be used in this context.
     * 
     * @param current Value used in the context.
     */
    error CannotUseCurrentValue(uint256 current);

    /**
     * @notice Error indicating that the `current` address cannot be used in this context.
     * 
     * @param current Address used in the context.
     */
    error CannotUseCurrentAddress(address current);

    /**
     * @notice Error indicating that all the `current` state cannot be used in this context.
     */
    error CannotUseAllCurrentState();

    /**
     * @notice Error indicating that all the `current` value cannot be used in this context.
     */
    error CannotUseAllCurrentValue();

    /**
     * @notice Error indicating that all the `current` address cannot be used in this context.
     */
    error CannotUseAllCurrentAddress();
    
    /**
     * @notice Error indicating that the `receiver` address cannot be used to initiate the transfer of ether.
     */
    error ReceiverCannotInitiateTransferEther();

    /**
     * @notice Error indicating that all the native token cannot be withdrawn from the smart contract.
     */
    error CannotWithdrawNativeToken();

    /**
     * @notice Error indicating that the `invalid` address provided is not a valid address for this context.
     * 
     * @param invalid Address used in the context.
     */
    error InvalidAddress(address invalid);

    /**
     * @notice Error indicating that the `invalid` value provided is not a valid value for this context.
     * 
     * @param invalid Value used in the context.
     */
    error InvalidValue(uint256 invalid);
}

/********************************************************************************************
  REENTRANCY
********************************************************************************************/

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}

/********************************************************************************************
  ACCESS
********************************************************************************************/

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

/********************************************************************************************
  MARKETPLACE
********************************************************************************************/

/**
 * @title P2P Locked LP Token Marketplace
 * @dev A marketplace for peer-to-peer trading of locked LP token positions
 */
contract P2PLPMarketplace is ReentrancyGuard, Ownable, Pausable {
    
    // DATA
    
    enum ListingStatus {
        Available,              // For sale
        InEscrow,              // Paid by buyer, waiting for seller's action
        AwaitingConfirmation,  // Seller has submitted proof, waiting for buyer
        Completed,             // Buyer confirmed, funds released
        Cancelled,             // Seller cancelled before a sale
        InDispute              // Flagged for admin review
    }
        
    struct Listing {
        uint256 id;                    // Unique ID for the listing
        address payable seller;        // The seller's wallet address
        address payable buyer;         // The buyer's wallet address (initially null)
        uint256 price;                // Price in the native currency (e.g., ETH, MATIC)
        address tokenAddress;          // The contract address of the token
        address lpAddress;             // The contract address of the LP token
        string lockUrl;               // URL to the locker platform
        string transferProofHash;     // Transaction hash of the off-chain ownership transfer
        string contactMethod;          // Contact method for buyer to reach out to seller
        ListingStatus status;         // The current state of the listing
        uint256 purchaseTimestamp;    // Timestamp when the buyer pays
        uint256 createdAt;            // Timestamp when listing was created
    }
        
    IERC20Metadata public governanceToken;

    address public projectOwner;

    uint256 private _listingIdCounter;
    uint256 public totalPlatformFees;
    uint256 public locked = 0;
    uint256 public claimed = 0;
    uint256 public lockedNative = 0;
    uint256 public claimedNative = 0;
    uint256 public listingFee = 0.01 ether; // Default listing fee
    
    uint256 public constant CONFIRMATION_WINDOW = 24 hours;

    // MAPPING

    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public sellerListings;
    mapping(address => uint256[]) public buyerPurchases;
    
    // MODIFIERS
    
    modifier onlySeller(uint256 _listingId) {
        require(listings[_listingId].seller == msg.sender, "Not the seller");
        _;
    }
    
    modifier onlyBuyer(uint256 _listingId) {
        require(listings[_listingId].buyer == msg.sender, "Not the buyer");
        _;
    }
    
    modifier listingExists(uint256 _listingId) {
        require(_listingId > 0 && _listingId <= _listingIdCounter, "Listing does not exist");
        _;
    }
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }
    
    modifier validPrice(uint256 _price) {
        require(_price > 0, "Price must be greater than 0");
        _;
    }
    
    modifier notEmptyString(string calldata _str) {
        require(bytes(_str).length > 0, "String cannot be empty");
        _;
    }
    
    // CONSTRUCTOR
    
    constructor(
        address projectOwnerAdr,
        address governanceTokenAdr
    ) Ownable(projectOwnerAdr) {
        if (projectOwnerAdr == address(0) || projectOwnerAdr == address(0xdead)) {
            revert ICommonErrors.InvalidAddress(projectOwnerAdr);
        }
        projectOwner = projectOwnerAdr;
        governanceToken = IERC20Metadata(governanceTokenAdr);
    }

    // EVENTS
    
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 price,
        address[2] addresses,
        string lockUrl
    );
    
    event ListingPriceUpdated(
        uint256 indexed listingId,
        uint256 oldPrice,
        uint256 newPrice
    );
    
    event ListingCancelled(
        uint256 indexed listingId,
        address indexed seller
    );
    
    event ListingPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 price
    );
    
    event TransferProofSubmitted(
        uint256 indexed listingId,
        address indexed seller,
        string txHash
    );
    
    event FundsReleased(
        uint256 indexed listingId,
        address indexed seller,
        address indexed buyer,
        uint256 amount
    );
    
    event DisputeResolved(
        uint256 indexed listingId,
        address indexed winner,
        uint256 amount,
        bool forSeller
    );
    
    event ListingFeeUpdated(uint256 oldFee, uint256 newFee);
    
    event PlatformFeesWithdrawn(address indexed admin, uint256 amount);
    
    event DisputeFlagged(uint256 indexed listingId, string reason);

    // ========== SELLER FUNCTIONS ==========
    
    /**
     * @dev Creates a new listing on the marketplace
     * @param _price Price in native currency
     * @param _addresses Contract address of the token and LP token [token, LP token]
     * @param _lockUrl URL to the locker platform
     */
    function createListing(
        uint256 _price,
        address[2] calldata _addresses,
        string calldata _lockUrl,
        string calldata _contactMethod
    )
        external
        payable
        nonReentrant
        whenNotPaused
        validPrice(_price)
        validAddress(_addresses[0])
        validAddress(_addresses[1])
        notEmptyString(_lockUrl)
        notEmptyString(_contactMethod)
    {
        require(msg.value == listingFee, "Incorrect listing fee");
        
        _listingIdCounter++;
        uint256 newListingId = _listingIdCounter;
        
        listings[newListingId] = Listing({
            id: newListingId,
            seller: payable(msg.sender),
            buyer: payable(address(0)),
            price: _price,
            tokenAddress: _addresses[0],
            lpAddress: _addresses[1],
            lockUrl: _lockUrl,
            transferProofHash: "",
            contactMethod: _contactMethod,
            status: ListingStatus.Available,
            purchaseTimestamp: 0,
            createdAt: block.timestamp
        });
        
        uint256 amount = _price;
        address[2] calldata adr = _addresses;
        string calldata url = _lockUrl;
        sellerListings[msg.sender].push(newListingId);
        totalPlatformFees += msg.value;
        
        emit ListingCreated(
            newListingId,
            msg.sender,
            amount,
            adr,
            url
        );
    }
    
    /**
     * @dev Allows seller to change the price of their listing
     * @param _listingId ID of the listing
     * @param _newPrice New price for the listing
     */
    function editPrice(uint256 _listingId, uint256 _newPrice)
        external
        listingExists(_listingId)
        onlySeller(_listingId)
        validPrice(_newPrice)
        whenNotPaused
    {
        require(listings[_listingId].status == ListingStatus.Available, "Listing not available");
        
        uint256 oldPrice = listings[_listingId].price;
        listings[_listingId].price = _newPrice;
        
        emit ListingPriceUpdated(_listingId, oldPrice, _newPrice);
    }
    
    /**
     * @dev Allows seller to cancel their listing
     * @param _listingId ID of the listing
     */
    function cancelListing(uint256 _listingId)
        external
        listingExists(_listingId)
        onlySeller(_listingId)
        whenNotPaused
    {
        require(listings[_listingId].status == ListingStatus.Available, "Listing not available");
        
        listings[_listingId].status = ListingStatus.Cancelled;
        
        emit ListingCancelled(_listingId, msg.sender);
    }
    
    /**
     * @dev Allows seller to submit transfer proof
     * @param _listingId ID of the listing
     * @param _txHash Transaction hash of the ownership transfer
     */
    function submitTransferProof(uint256 _listingId, string calldata _txHash)
        external
        listingExists(_listingId)
        onlySeller(_listingId)
        notEmptyString(_txHash)
        whenNotPaused
    {
        require(listings[_listingId].status == ListingStatus.InEscrow, "Listing not in escrow");
        
        listings[_listingId].transferProofHash = _txHash;
        listings[_listingId].status = ListingStatus.AwaitingConfirmation;
        listings[_listingId].purchaseTimestamp = block.timestamp;
        
        emit TransferProofSubmitted(_listingId, msg.sender, _txHash);
    }
    
    // ========== BUYER FUNCTIONS ==========
    
    /**
     * @dev Allows a user to purchase a listing
     * @param _listingId ID of the listing to purchase
     */
    function purchaseListing(uint256 _listingId)
        external
        payable
        nonReentrant
        listingExists(_listingId)
        whenNotPaused
    {
        Listing storage listing = listings[_listingId];
        require(listing.status == ListingStatus.Available, "Listing not available");
        require(msg.value == listing.price, "Incorrect payment amount");
        require(msg.sender != listing.seller, "Seller cannot buy own listing");
        
        listing.buyer = payable(msg.sender);
        listing.status = ListingStatus.InEscrow;
        
        buyerPurchases[msg.sender].push(_listingId);
        
        emit ListingPurchased(_listingId, msg.sender, msg.value);
    }
    
    /**
     * @dev Allows buyer to confirm receipt and release funds
     * @param _listingId ID of the listing
     */
    function confirmReceiptAndRelease(uint256 _listingId)
        external
        nonReentrant
        listingExists(_listingId)
        onlyBuyer(_listingId)
        whenNotPaused
    {
        Listing storage listing = listings[_listingId];
        require(listing.status == ListingStatus.AwaitingConfirmation, "Not awaiting confirmation");
        require(
            block.timestamp <= listing.purchaseTimestamp + CONFIRMATION_WINDOW,
            "Confirmation window expired"
        );
        
        listing.status = ListingStatus.Completed;
        
        uint256 amount = listing.price;
        address payable seller = listing.seller;
        
        // Transfer funds to seller
        (bool success, ) = seller.call{value: amount}("");
        require(success, "Transfer to seller failed");
        
        emit FundsReleased(_listingId, seller, msg.sender, amount);
    }
    
    // ========== ADMIN FUNCTIONS ==========
    
    /**
     * @dev Resolves dispute in favor of seller
     * @param _listingId ID of the listing
     */
    function resolveDisputeForSeller(uint256 _listingId)
        external
        onlyOwner
        nonReentrant
        listingExists(_listingId)
    {
        Listing storage listing = listings[_listingId];
        require(
            listing.status == ListingStatus.AwaitingConfirmation || 
            listing.status == ListingStatus.InDispute,
            "Invalid status for dispute resolution"
        );
        
        listing.status = ListingStatus.Completed;
        
        uint256 amount = listing.price;
        address payable seller = listing.seller;
        
        // Transfer funds to seller
        (bool success, ) = seller.call{value: amount}("");
        require(success, "Transfer to seller failed");
        
        emit DisputeResolved(_listingId, seller, amount, true);
    }
    
    /**
     * @dev Resolves dispute in favor of buyer (refund)
     * @param _listingId ID of the listing
     */
    function resolveDisputeForBuyer(uint256 _listingId)
        external
        onlyOwner
        nonReentrant
        listingExists(_listingId)
    {
        Listing storage listing = listings[_listingId];
        require(
            listing.status == ListingStatus.InEscrow || 
            listing.status == ListingStatus.AwaitingConfirmation ||
            listing.status == ListingStatus.InDispute,
            "Invalid status for dispute resolution"
        );
        
        listing.status = ListingStatus.Cancelled;
        
        uint256 amount = listing.price;
        address payable buyer = listing.buyer;
        
        // Refund to buyer
        (bool success, ) = buyer.call{value: amount}("");
        require(success, "Refund to buyer failed");
        
        emit DisputeResolved(_listingId, buyer, amount, false);
    }
    
    /**
     * @dev Updates the listing fee
     * @param _newFee New listing fee amount
     */
    function updateListingFee(uint256 _newFee) external onlyOwner {
        uint256 oldFee = listingFee;
        listingFee = _newFee;
        
        emit ListingFeeUpdated(oldFee, _newFee);
    }
    
    /**
     * @dev Withdraws platform fees to admin wallet
     */
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 amount = totalPlatformFees;
        require(amount > 0, "No fees to withdraw");
        
        totalPlatformFees = 0;
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Fee withdrawal failed");
        
        emit PlatformFeesWithdrawn(owner(), amount);
    }
    
    /**
     * @dev Flags a listing for dispute
     * @param _listingId ID of the listing
     * @param _reason Reason for the dispute
     */
    function flagForDispute(uint256 _listingId, string calldata _reason)
        external
        onlyOwner
        listingExists(_listingId)
        notEmptyString(_reason)
    {
        listings[_listingId].status = ListingStatus.InDispute;
        emit DisputeFlagged(_listingId, _reason);
    }
    
    /**
     * @dev Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    /**
     * @dev Returns listing details
     * @param _listingId ID of the listing
     */
    function getListing(uint256 _listingId)
        external
        view
        listingExists(_listingId)
        returns (Listing memory)
    {
        return listings[_listingId];
    }
    
    /**
     * @dev Returns all listing IDs for a seller
     * @param _seller Address of the seller
     */
    function getSellerListings(address _seller) external view returns (uint256[] memory) {
        return sellerListings[_seller];
    }
    
    /**
     * @dev Returns all purchase IDs for a buyer
     * @param _buyer Address of the buyer
     */
    function getBuyerPurchases(address _buyer) external view returns (uint256[] memory) {
        return buyerPurchases[_buyer];
    }
    
    /**
     * @dev Returns the current listing counter
     */
    function getCurrentListingId() external view returns (uint256) {
        return _listingIdCounter;
    }
    
    /**
     * @dev Checks if confirmation window has expired
     * @param _listingId ID of the listing
     */
    function isConfirmationExpired(uint256 _listingId)
        external
        view
        listingExists(_listingId)
        returns (bool)
    {
        Listing memory listing = listings[_listingId];
        if (listing.status != ListingStatus.AwaitingConfirmation) {
            return false;
        }
        return block.timestamp > listing.purchaseTimestamp + CONFIRMATION_WINDOW;
    }
    
    /**
     * @dev Returns remaining confirmation time
     * @param _listingId ID of the listing
     */
    function getRemainingConfirmationTime(uint256 _listingId)
        external
        view
        listingExists(_listingId)
        returns (uint256)
    {
        Listing memory listing = listings[_listingId];
        if (listing.status != ListingStatus.AwaitingConfirmation) {
            return 0;
        }
        
        uint256 deadline = listing.purchaseTimestamp + CONFIRMATION_WINDOW;
        if (block.timestamp >= deadline) {
            return 0;
        }
        
        return deadline - block.timestamp;
    }
    
    // ========== GENERAL FUNCTIONS ==========
    
    /**
     * @notice Allows the contract to receive Ether.
     * 
     * @dev This is a required feature to have in order to allow the smart contract
     * to be able to receive ether from the swap.
     */
    receive() external payable {}

    /**
     * @notice Withdraws tokens or Ether from the contract to a specified address.
     * 
     * @param tokenAddress The address of the token to withdraw.
     * @param amount The amount of tokens or Ether to withdraw.
     * 
     * @dev You need to use address(0) as `tokenAddress` to withdraw Ether and
     * use 0 as `amount` to withdraw the whole balance amount in the smart contract.
     * Anyone can trigger this function to send the fund to the `receiver`.
     * Only `receiver` address will not be able to trigger this function to
     * withdraw Ether from the smart contract by himself/herself.
     */
    function wTokens(address tokenAddress, uint256 amount) external nonReentrant {
        uint256 toTransfer = amount;
        address receiver = projectOwner;
        
        if (tokenAddress == address(0)) {
            uint256 allocated = lockedNative > claimedNative ? lockedNative - claimedNative : 0;
            if (allocated >= address(this).balance) {
                revert ICommonErrors.CannotWithdrawNativeToken();
            }
            if (toTransfer > address(this).balance - allocated || address(this).balance - allocated < 1) {
                revert IERC20Errors.ERC20InsufficientBalance(address(this), address(this).balance - allocated, toTransfer);
            }
            if (msg.sender == receiver) {
                revert ICommonErrors.ReceiverCannotInitiateTransferEther();
            }
            if (toTransfer == 0 && address(this).balance > 0) {
                toTransfer = address(this).balance - allocated;
            }
            payable(receiver).transfer(toTransfer);
        } else {
            if (tokenAddress == address(governanceToken)) {
                uint256 allocated = locked > claimed ? locked - claimed : 0;
                if (allocated >= IERC20Metadata(tokenAddress).balanceOf(address(this))) {
                    revert ICommonErrors.CannotWithdrawNativeToken();
                }
                if (toTransfer > IERC20Metadata(tokenAddress).balanceOf(address(this)) - allocated || IERC20Metadata(tokenAddress).balanceOf(address(this)) < 1 || IERC20Metadata(tokenAddress).balanceOf(address(this)) - allocated < 1) {
                    revert IERC20Errors.ERC20InsufficientBalance(address(this), IERC20Metadata(tokenAddress).balanceOf(address(this)) - allocated, toTransfer);
                }
                if (toTransfer == 0 && IERC20Metadata(tokenAddress).balanceOf(address(this)) > 0) {
                    toTransfer = IERC20Metadata(tokenAddress).balanceOf(address(this)) - allocated;
                }
                IERC20Metadata(tokenAddress).transfer(receiver, toTransfer);
            } else {
                if (toTransfer > IERC20Metadata(tokenAddress).balanceOf(address(this)) || IERC20Metadata(tokenAddress).balanceOf(address(this)) < 1) {
                    revert IERC20Errors.ERC20InsufficientBalance(address(this), IERC20Metadata(tokenAddress).balanceOf(address(this)), toTransfer);
                }
                if (toTransfer == 0 && IERC20Metadata(tokenAddress).balanceOf(address(this)) > 0) {
                    toTransfer = IERC20Metadata(tokenAddress).balanceOf(address(this));
                }
                IERC20Metadata(tokenAddress).transfer(receiver, toTransfer);
            }
        }
    }
}
