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

interface IP2PLPMarketplace {
    enum ListingStatus {
        Available,
        InEscrow,
        AwaitingConfirmation,
        Completed,
        Cancelled,
        InDispute
    }
    
    struct Listing {
        uint256 id;
        address payable seller;
        address payable buyer;
        uint256 price;
        address tokenAddress;
        address lpAddress;
        string lockUrl;
        string transferProofHash;
        string contactMethod;
        ListingStatus status;
        uint256 purchaseTimestamp;
        uint256 createdAt;
    }   

    function getCurrentListingId() external view returns (uint256);
    function getListing(uint256 listingId) external view returns (Listing memory);
    function getSellerListings(address seller) external view returns (uint256[] memory);
    function getBuyerPurchases(address buyer) external view returns (uint256[] memory);
    function isConfirmationExpired(uint256 listingId) external view returns (bool);
    function getRemainingConfirmationTime(uint256 listingId) external view returns (uint256);
    function listingFee() external view returns (uint256);
    function totalPlatformFees() external view returns (uint256);
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
contract P2PLPMarketplace is ReentrancyGuard, Ownable, Pausable, IP2PLPMarketplace {
    
    // DATA
    
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

    mapping(uint256 => Listing) public _listings;
    mapping(address => uint256[]) public sellerListings;
    mapping(address => uint256[]) public buyerPurchases;
    
    // MODIFIERS
    
    modifier onlySeller(uint256 _listingId) {
        require(_listings[_listingId].seller == msg.sender, "Not the seller");
        _;
    }
    
    modifier onlyBuyer(uint256 _listingId) {
        require(_listings[_listingId].buyer == msg.sender, "Not the buyer");
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
        
        _listings[newListingId] = Listing({
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
        require(_listings[_listingId].status == ListingStatus.Available, "Listing not available");
        
        uint256 oldPrice = _listings[_listingId].price;
        _listings[_listingId].price = _newPrice;
        
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
        require(_listings[_listingId].status == ListingStatus.Available, "Listing not available");
        
        _listings[_listingId].status = ListingStatus.Cancelled;
        
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
        require(_listings[_listingId].status == ListingStatus.InEscrow, "Listing not in escrow");
        
        _listings[_listingId].transferProofHash = _txHash;
        _listings[_listingId].status = ListingStatus.AwaitingConfirmation;
        _listings[_listingId].purchaseTimestamp = block.timestamp;
        
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
        Listing storage listing = _listings[_listingId];
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
        Listing storage listing = _listings[_listingId];
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
        Listing storage listing = _listings[_listingId];
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
        Listing storage listing = _listings[_listingId];
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
        _listings[_listingId].status = ListingStatus.InDispute;
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
        return _listings[_listingId];
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
        Listing memory listing = _listings[_listingId];
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
        Listing memory listing = _listings[_listingId];
        if (listing.status != ListingStatus.AwaitingConfirmation) {
            return 0;
        }
        
        uint256 deadline = listing.purchaseTimestamp + CONFIRMATION_WINDOW;
        if (block.timestamp >= deadline) {
            return 0;
        }
        
        return deadline - block.timestamp;
    }

    // ========== OVERRIDE FUNCTIONS ==========
    
    /**
     * @notice Overrides the {transferOwnership} function to update project owner.
     * 
     * @param newOwner The address of the new owner.
     * 
     * @dev Should throw if the `newOwner` is set to the current owner address or address(0xdead).
     * This overrides function is just an extended version of the original {transferOwnership}
     * function. See {Ownable-transferOwnership} for more information.
     */
    function transferOwnership(address newOwner) public override onlyOwner {
        if (newOwner == owner()) {
            revert ICommonErrors.CannotUseCurrentAddress(newOwner);
        }
        if (newOwner == address(0xdead)) {
            revert ICommonErrors.InvalidAddress(newOwner);
        }
        projectOwner = newOwner;
        super.transferOwnership(newOwner);
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

/**
 * @title P2P LP Marketplace Reader
 * @dev A reader contract to efficiently fetch marketplace data for frontend applications
 */
contract P2PLPMarketplaceReader is ReentrancyGuard, Ownable {
    
    // DATA

    // Enhanced listing struct with additional computed fields
    struct EnhancedListing {
        uint256 id;
        address seller;
        address buyer;
        uint256 price;
        address tokenAddress;
        address lpAddress;
        string lockUrl;
        string transferProofHash;
        string contactMethod;
        IP2PLPMarketplace.ListingStatus status;
        uint256 purchaseTimestamp;
        uint256 createdAt;
        bool isConfirmationExpired;
        uint256 remainingConfirmationTime;
        uint256 daysSinceCreated;
        uint256 hoursSincePurchase;
    }
    
    // Filter parameters for querying listings
    struct ListingFilter {
        IP2PLPMarketplace.ListingStatus[] statusFilter;  // Empty array means no filter
        address seller;                                  // address(0) means no filter
        address buyer;                                   // address(0) means no filter
        address tokenAddress;                            // address(0) means no filter
        address lpAddress;                              // address(0) means no filter
        uint256 minPrice;                               // 0 means no minimum
        uint256 maxPrice;                               // 0 means no maximum
        uint256 createdAfter;                           // 0 means no filter
        uint256 createdBefore;                          // 0 means no filter
    }
    
    // Pagination parameters
    struct PaginationParams {
        uint256 offset;
        uint256 limit;
        bool sortByNewest;  // true = newest first, false = oldest first
    }
    
    // Summary statistics
    struct MarketplaceSummary {
        uint256 totalListings;
        uint256 availableListings;
        uint256 completedListings;
        uint256 cancelledListings;
        uint256 inEscrowListings;
        uint256 awaitingConfirmationListings;
        uint256 inDisputeListings;
        uint256 totalVolume;
        uint256 averagePrice;
        uint256 listingFee;
        uint256 totalPlatformFees;
    }
    
    IP2PLPMarketplace public immutable marketplace;

    address public projectOwner;
    
    // CONSTRUCTOR

    constructor(
        address projectOwnerAdr,
        address marketplaceAdr
    ) Ownable(projectOwnerAdr) {
        if (marketplaceAdr == address(0)) {
            revert ICommonErrors.InvalidAddress(marketplaceAdr);
        }
        if (projectOwnerAdr == address(0) || projectOwnerAdr == address(0xdead)) {
            revert ICommonErrors.InvalidAddress(projectOwnerAdr);
        }
        projectOwner = projectOwnerAdr;
        marketplace = IP2PLPMarketplace(marketplaceAdr);
    }
    
    // ========== BULK DATA RETRIEVAL ==========
    
    /**
     * @dev Gets all listings with enhanced data
     * @return Array of all enhanced listings
     */
    function getAllListings() external view returns (EnhancedListing[] memory) {
        uint256 totalListings = marketplace.getCurrentListingId();
        return getListingsRange(1, totalListings);
    }
    
    /**
     * @dev Gets listings in a specified range
     * @param startId Starting listing ID (inclusive)
     * @param endId Ending listing ID (inclusive)
     * @return Array of enhanced listings in the specified range
     */
    function getListingsRange(uint256 startId, uint256 endId) 
        public 
        view 
        returns (EnhancedListing[] memory) 
    {
        require(startId > 0, "Start ID must be greater than 0");
        require(endId >= startId, "End ID must be >= start ID");
        
        uint256 totalListings = marketplace.getCurrentListingId();
        if (endId > totalListings) {
            endId = totalListings;
        }
        
        uint256 length = endId - startId + 1;
        EnhancedListing[] memory listings = new EnhancedListing[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 listingId = startId + i;
            listings[i] = getEnhancedListing(listingId);
        }
        
        return listings;
    }
    
    /**
     * @dev Gets listings with pagination and optional filtering
     * @param filter Filter parameters
     * @param pagination Pagination parameters
     * @return Array of filtered and paginated enhanced listings
     * @return Total count of listings matching the filter (before pagination)
     */
    function getFilteredListings(
        ListingFilter calldata filter,
        PaginationParams calldata pagination
    ) 
        external 
        view 
        returns (EnhancedListing[] memory, uint256) 
    {
        uint256 totalListings = marketplace.getCurrentListingId();
        uint256[] memory matchingIds = new uint256[](totalListings);
        uint256 matchCount = 0;
        
        // Collect all matching listing IDs
        for (uint256 i = 1; i <= totalListings; i++) {
            if (_matchesFilter(i, filter)) {
                matchingIds[matchCount] = i;
                matchCount++;
            }
        }
        
        // Apply sorting
        if (pagination.sortByNewest) {
            _sortIdsDescending(matchingIds, matchCount);
        } else {
            _sortIdsAscending(matchingIds, matchCount);
        }
        
        // Apply pagination
        uint256 start = pagination.offset;
        uint256 end = start + pagination.limit;
        if (end > matchCount) {
            end = matchCount;
        }
        
        uint256 resultLength = (start < matchCount) ? (end - start) : 0;
        EnhancedListing[] memory results = new EnhancedListing[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            results[i] = getEnhancedListing(matchingIds[start + i]);
        }
        
        return (results, matchCount);
    }
    
    // ========== SINGLE LISTING QUERIES ==========
    
    /**
     * @dev Gets enhanced listing data for a specific listing ID
     * @param listingId The listing ID to query
     * @return Enhanced listing data
     */
    function getEnhancedListing(uint256 listingId) public view returns (EnhancedListing memory) {
        IP2PLPMarketplace.Listing memory listings = marketplace.getListing(listingId);
                
        // Calculate additional fields
        bool isExpired = false;
        uint256 remainingTime = 0;
        
        if (listings.status == IP2PLPMarketplace.ListingStatus.AwaitingConfirmation) {
            isExpired = marketplace.isConfirmationExpired(listingId);
            remainingTime = marketplace.getRemainingConfirmationTime(listingId);
        }
        
        uint256 daysSinceCreated = listings.createdAt > 0 ? (block.timestamp - listings.createdAt) / 1 days : 0;
        uint256 hoursSincePurchase = listings.purchaseTimestamp > 0 ? (block.timestamp - listings.purchaseTimestamp) / 1 hours : 0;
        
        return EnhancedListing({
            id: listings.id,
            seller: listings.seller,
            buyer: listings.buyer,
            price: listings.price,
            tokenAddress: listings.tokenAddress,
            lpAddress: listings.lpAddress,
            lockUrl: listings.lockUrl,
            transferProofHash: listings.transferProofHash,
            contactMethod: listings.contactMethod,
            status: listings.status,
            purchaseTimestamp: listings.purchaseTimestamp,
            createdAt: listings.createdAt,
            isConfirmationExpired: isExpired,
            remainingConfirmationTime: remainingTime,
            daysSinceCreated: daysSinceCreated,
            hoursSincePurchase: hoursSincePurchase
        });
    }
    
    // ========== USER-SPECIFIC QUERIES ==========
    
    /**
     * @dev Gets all listings for a specific seller with enhanced data
     * @param seller Address of the seller
     * @return Array of enhanced listings
     */
    function getSellerListingsEnhanced(address seller) external view returns (EnhancedListing[] memory) {
        uint256[] memory sellerIds = marketplace.getSellerListings(seller);
        EnhancedListing[] memory listings = new EnhancedListing[](sellerIds.length);
        
        for (uint256 i = 0; i < sellerIds.length; i++) {
            listings[i] = getEnhancedListing(sellerIds[i]);
        }
        
        return listings;
    }
    
    /**
     * @dev Gets all purchases for a specific buyer with enhanced data
     * @param buyer Address of the buyer
     * @return Array of enhanced listings
     */
    function getBuyerPurchasesEnhanced(address buyer) external view returns (EnhancedListing[] memory) {
        uint256[] memory buyerIds = marketplace.getBuyerPurchases(buyer);
        EnhancedListing[] memory listings = new EnhancedListing[](buyerIds.length);
        
        for (uint256 i = 0; i < buyerIds.length; i++) {
            listings[i] = getEnhancedListing(buyerIds[i]);
        }
        
        return listings;
    }
    
    // ========== STATISTICS AND SUMMARY ==========
    
    /**
     * @dev Gets marketplace summary statistics
     * @return MarketplaceSummary struct with key metrics
     */
    function getMarketplaceSummary() external view returns (MarketplaceSummary memory) {
        uint256 totalListings = marketplace.getCurrentListingId();
        uint256[] memory statusCounts = new uint256[](6);
        uint256 totalVolume = 0;
        uint256 priceSum = 0;
        uint256 priceCount = 0;
        
        for (uint256 i = 1; i <= totalListings; i++) {
            IP2PLPMarketplace.Listing memory listings = marketplace.getListing(i);
            
            // Count by status
            statusCounts[uint256(listings.status)]++;
            
            // Calculate volume (completed transactions)
            if (listings.status == IP2PLPMarketplace.ListingStatus.Completed) {
                totalVolume += listings.price;
            }
            
            // Calculate average price (exclude zero prices)
            if (listings.price > 0) {
                priceSum += listings.price;
                priceCount++;
            }
        }
        
        uint256 averagePrice = priceCount > 0 ? priceSum / priceCount : 0;
        
        return MarketplaceSummary({
            totalListings: totalListings,
            availableListings: statusCounts[0],
            completedListings: statusCounts[3],
            cancelledListings: statusCounts[4],
            inEscrowListings: statusCounts[1],
            awaitingConfirmationListings: statusCounts[2],
            inDisputeListings: statusCounts[5],
            totalVolume: totalVolume,
            averagePrice: averagePrice,
            listingFee: marketplace.listingFee(),
            totalPlatformFees: marketplace.totalPlatformFees()
        });
    }
    
    /**
     * @dev Gets listings by status
     * @param status The status to filter by
     * @return Array of listing IDs with the specified status
     */
    function getListingsByStatus(IP2PLPMarketplace.ListingStatus status) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256 totalListings = marketplace.getCurrentListingId();
        uint256[] memory tempIds = new uint256[](totalListings);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= totalListings; i++) {
            IP2PLPMarketplace.Listing memory listings = marketplace.getListing(i);
            if (listings.status == status) {
                tempIds[count] = i;
                count++;
            }
        }
        
        // Create properly sized array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tempIds[i];
        }
        
        return result;
    }
    
    /**
     * @dev Gets listings by token address
     * @param tokenAddress The token address to filter by
     * @return Array of listing IDs for the specified token
     */
    function getListingsByToken(address tokenAddress) external view returns (uint256[] memory) {
        uint256 totalListings = marketplace.getCurrentListingId();
        uint256[] memory tempIds = new uint256[](totalListings);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= totalListings; i++) {
            IP2PLPMarketplace.Listing memory listings = marketplace.getListing(i);
            if (listings.tokenAddress == tokenAddress) {
                tempIds[count] = i;
                count++;
            }
        }
        
        // Create properly sized array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tempIds[i];
        }
        
        return result;
    }
    
    /**
     * @dev Gets the most recent listings
     * @param limit Maximum number of listings to return
     * @return Array of the most recent enhanced listings
     */
    function getRecentListings(uint256 limit) external view returns (EnhancedListing[] memory) {
        uint256 totalListings = marketplace.getCurrentListingId();
        uint256 startId = totalListings > limit ? totalListings - limit + 1 : 1;
        
        uint256 resultCount = totalListings >= startId ? totalListings - startId + 1 : 0;
        EnhancedListing[] memory result = new EnhancedListing[](resultCount);
        
        // Fill in reverse order (newest first)
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = getEnhancedListing(totalListings - i);
        }
        
        return result;
    }
    
    // ========== INTERNAL HELPER FUNCTIONS ==========
    
    /**
     * @dev Checks if a listing matches the given filter criteria
     * @param listingId The listing ID to check
     * @param filter The filter criteria
     * @return Whether the listing matches the filter
     */
    function _matchesFilter(uint256 listingId, ListingFilter calldata filter) internal view returns (bool) {
        IP2PLPMarketplace.Listing memory listings = marketplace.getListing(listingId);

        // Status filter
        if (filter.statusFilter.length > 0) {
            bool statusMatch = false;
            for (uint256 i = 0; i < filter.statusFilter.length; i++) {
                if (listings.status == filter.statusFilter[i]) {
                    statusMatch = true;
                    break;
                }
            }
            if (!statusMatch) return false;
        }
        
        // Address filters
        if (filter.seller != address(0) && listings.seller != filter.seller) return false;
        if (filter.buyer != address(0) && listings.buyer != filter.buyer) return false;
        if (filter.tokenAddress != address(0) && listings.tokenAddress != filter.tokenAddress) return false;
        if (filter.lpAddress != address(0) && listings.lpAddress != filter.lpAddress) return false;
        
        // Price filters
        if (filter.minPrice > 0 && listings.price < filter.minPrice) return false;
        if (filter.maxPrice > 0 && listings.price > filter.maxPrice) return false;
        
        // Time filters
        if (filter.createdAfter > 0 && listings.createdAt < filter.createdAfter) return false;
        if (filter.createdBefore > 0 && listings.createdAt > filter.createdBefore) return false;
        
        return true;
    }
    
    /**
     * @dev Sorts listing IDs in ascending order
     * @param ids Array of listing IDs to sort
     * @param length Number of valid elements in the array
     */
    function _sortIdsAscending(uint256[] memory ids, uint256 length) internal pure {
        for (uint256 i = 0; i < length - 1; i++) {
            for (uint256 j = 0; j < length - i - 1; j++) {
                if (ids[j] > ids[j + 1]) {
                    (ids[j], ids[j + 1]) = (ids[j + 1], ids[j]);
                }
            }
        }
    }
    
    /**
     * @dev Sorts listing IDs in descending order
     * @param ids Array of listing IDs to sort
     * @param length Number of valid elements in the array
     */
    function _sortIdsDescending(uint256[] memory ids, uint256 length) internal pure {
        for (uint256 i = 0; i < length - 1; i++) {
            for (uint256 j = 0; j < length - i - 1; j++) {
                if (ids[j] < ids[j + 1]) {
                    (ids[j], ids[j + 1]) = (ids[j + 1], ids[j]);
                }
            }
        }
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
            if (toTransfer > address(this).balance || address(this).balance < 1) {
                revert IERC20Errors.ERC20InsufficientBalance(address(this), address(this).balance, toTransfer);
            }
            if (msg.sender == receiver) {
                revert ICommonErrors.ReceiverCannotInitiateTransferEther();
            }
            if (toTransfer == 0 && address(this).balance > 0) {
                toTransfer = address(this).balance;
            }
            payable(receiver).transfer(toTransfer);
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
