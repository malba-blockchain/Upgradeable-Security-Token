// Sources flattened with hardhat v2.22.9 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)

pragma solidity ^0.8.1;

/**
 * @dev Collection of functions related to the address type
 */
library AddressUpgradeable {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}


// File @openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)

pragma solidity ^0.8.2;

/**
 * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
 * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
 * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
 * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
 *
 * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
 * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
 * case an upgrade adds a module that needs to be initialized.
 *
 * For example:
 *
 * [.hljs-theme-light.nopadding]
 * ```solidity
 * contract MyToken is ERC20Upgradeable {
 *     function initialize() initializer public {
 *         __ERC20_init("MyToken", "MTK");
 *     }
 * }
 *
 * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
 *     function initializeV2() reinitializer(2) public {
 *         __ERC20Permit_init("MyToken");
 *     }
 * }
 * ```
 *
 * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
 * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
 *
 * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
 * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
 *
 * [CAUTION]
 * ====
 * Avoid leaving a contract uninitialized.
 *
 * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
 * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
 * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
 *
 * [.hljs-theme-light.nopadding]
 * ```
 * /// @custom:oz-upgrades-unsafe-allow constructor
 * constructor() {
 *     _disableInitializers();
 * }
 * ```
 * ====
 */
abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint8 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
     * constructor.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        bool isTopLevelCall = !_initializing;
        require(
            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
            "Initializable: contract is already initialized"
        );
        _initialized = 1;
        if (isTopLevelCall) {
            _initializing = true;
        }
        _;
        if (isTopLevelCall) {
            _initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: setting the version to 255 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint8 version) {
        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
        _initialized = version;
        _initializing = true;
        _;
        _initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized != type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint8) {
        return _initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _initializing;
    }
}


// File @openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

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
abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}


// File @openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (access/Ownable.sol)

pragma solidity ^0.8.0;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    function __Ownable_init() internal onlyInitializing {
        __Ownable_init_unchained();
    }

    function __Ownable_init_unchained() internal onlyInitializing {
        _transferOwnership(_msgSender());
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
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
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
        require(newOwner != address(0), "Ownable: new owner is the zero address");
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

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}


// File @openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

pragma solidity ^0.8.0;


/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract PausableUpgradeable is Initializable, ContextUpgradeable {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    function __Pausable_init() internal onlyInitializing {
        __Pausable_init_unchained();
    }

    function __Pausable_init_unchained() internal onlyInitializing {
        _paused = false;
    }

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
        require(!paused(), "Pausable: paused");
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        require(paused(), "Pausable: not paused");
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

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}


// File @openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

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
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuardUpgradeable is Initializable {
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
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    function __ReentrancyGuard_init() internal onlyInitializing {
        __ReentrancyGuard_init_unchained();
    }

    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
        _status = _NOT_ENTERED;
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
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}


// File @openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20Upgradeable {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}


// File @openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20MetadataUpgradeable is IERC20Upgradeable {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}


// File @openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;




/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * The default value of {decimals} is 18. To change this, you should override
 * this function so it returns a different value.
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable, IERC20MetadataUpgradeable {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    function __ERC20_init(string memory name_, string memory symbol_) internal onlyInitializing {
        __ERC20_init_unchained(name_, symbol_);
    }

    function __ERC20_init_unchained(string memory name_, string memory symbol_) internal onlyInitializing {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `amount`.
     */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            _balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * has been transferred to `to`.
     * - when `from` is zero, `amount` tokens have been minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[45] private __gap;
}


// File @openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol@v4.9.3

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/extensions/ERC20Pausable.sol)

pragma solidity ^0.8.0;



/**
 * @dev ERC20 token with pausable token transfers, minting and burning.
 *
 * Useful for scenarios such as preventing trades until the end of an evaluation
 * period, or having an emergency switch for freezing all token transfers in the
 * event of a large bug.
 *
 * IMPORTANT: This contract does not include public pause and unpause functions. In
 * addition to inheriting this contract, you must define both functions, invoking the
 * {Pausable-_pause} and {Pausable-_unpause} internal functions, with appropriate
 * access control, e.g. using {AccessControl} or {Ownable}. Not doing so will
 * make the contract unpausable.
 */
abstract contract ERC20PausableUpgradeable is Initializable, ERC20Upgradeable, PausableUpgradeable {
    function __ERC20Pausable_init() internal onlyInitializing {
        __Pausable_init_unchained();
    }

    function __ERC20Pausable_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {ERC20-_beforeTokenTransfer}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "ERC20Pausable: token transfer while paused");
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}


// File @openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/IERC20Permit.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 *
 * ==== Security Considerations
 *
 * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
 * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
 * considered as an intention to spend the allowance in any specific way. The second is that because permits have
 * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
 * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
 * generally recommended is:
 *
 * ```solidity
 * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
 *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
 *     doThing(..., value);
 * }
 *
 * function doThing(..., uint256 value) public {
 *     token.safeTransferFrom(msg.sender, address(this), value);
 *     ...
 * }
 * ```
 *
 * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
 * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
 * {SafeERC20-safeTransferFrom}).
 *
 * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
 * contracts should have entry points that don't rely on permit.
 */
interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     *
     * CAUTION: See Security Considerations above.
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}


// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File @openzeppelin/contracts/utils/Address.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Address.sol)

pragma solidity ^0.8.20;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev The ETH balance of the account is not enough to perform the operation.
     */
    error AddressInsufficientBalance(address account);

    /**
     * @dev There's no code at `target` (it is not a contract).
     */
    error AddressEmptyCode(address target);

    /**
     * @dev A call to an address target failed. The target may have reverted.
     */
    error FailedInnerCall();

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason or custom error, it is bubbled
     * up by this function (like regular Solidity function calls). However, if
     * the call reverted with no returned reason, this function reverts with a
     * {FailedInnerCall} error.
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
     * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
     * unsuccessful call.
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) internal view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            // only check if target is a contract if the call was successful and the return data is empty
            // otherwise we already know that it was a contract
            if (returndata.length == 0 && target.code.length == 0) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
     * revert reason or with a default {FailedInnerCall} error.
     */
    function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            return returndata;
        }
    }

    /**
     * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
     */
    function _revert(bytes memory returndata) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}


// File @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.20;



/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using Address for address;

    /**
     * @dev An operation with an ERC20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeCall(token.approve, (spender, value));

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeCall(token.approve, (spender, 0)));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data);
        if (returndata.length != 0 && !abi.decode(returndata, (bool))) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return success && (returndata.length == 0 || abi.decode(returndata, (bool))) && address(token).code.length > 0;
    }
}


// File @chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol@v1.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.0;

// solhint-disable-next-line interface-starts-with-i
interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(
    uint80 _roundId
  ) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

  function latestRoundData()
    external
    view
    returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}


// File contracts/HYAXUpgradeable.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity 0.8.20;
/**
 * @dev Implementation based on the ERC-20 standard and whitepaper requirements.
 * Developer: Carlos Alba
 */

/**
 * @title HYAX token over the Mumbai Network
 * @dev ERC20Pausable token with additional functionality.
 */
contract HYAXUpgradeable is ERC20PausableUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {

    using SafeERC20 for IERC20;

    ////////////////// SMART CONTRACT EVENTS //////////////////
    /**
     * @dev Emitted when new HYAX tokens are issued.
     */
    event TokenIssuance(address indexed sender, uint256 amount);

    /**
     * @dev Emitted when an investment is made using Matic.
     */
    event InvestFromMatic(address indexed sender, uint256 maticAmount, uint256 totalInvestmentInUsd, uint256 hyaxAmount);

    /**
     * @dev Emitted when an investment is made using a crypto token.
     */
    event InvestFromCryptoToken(TokenType indexed tokenType, address indexed sender, uint256 tokenAmount, uint256 totalInvestmentInUsd, uint256 hyaxAmount);

    /**
     * @dev Emitted when the HYAX price is updated.
     */
    event UpdatedHyaxPrice(uint256 _newHyaxPrice);

    /**
     * @dev Emitted when the minimum investment allowed in USD is updated.
     */
    event UpdatedMinimumInvestmentAllowedInUSD(uint256 _newMinimumInvestmentAllowedInUSD);

    /**
     * @dev Emitted when the maximum investment allowed in USD is updated.
     */
    event UpdatedMaximumInvestmentAllowedInUSD(uint256 _newMaximumInvestmentAllowedInUSD);

    /**
     * @dev Emitted when the whitelist address is updated.
     */
    event UpdatedWhiteListerAddress(address _newWhiteListerAddress);

    /**
     * @dev Emitted when the treasury address is updated.
     */
    event UpdatedTreasuryAddress(address _newTreasuryAddress);

    /**
     * @dev Emitted when an investor is added to the whitelist.
     */
    event InvestorAddedToWhiteList(address indexed sender, address indexed _investorAddress);

    /**
     * @dev Emitted when the whitelist status of an investor is updated.
     */
    event WhitelistStatusUpdated(address sender, address _investorAddress, bool _isWhiteListed);

    /**
     * @dev Emitted when the blacklist status of an investor is updated.
     */
    event BlacklistStatusUpdated(address sender, address _investorAddress, bool _isBlacklisted);

    /**
     * @dev Emitted when the qualified investor status of an investor is updated.
     */
    event QualifiedInvestorStatusUpdated(address sender, address _QualifiedInvestorAddress, bool _isQualifiedInvestor);
    
    /**
     * @dev Emitted when the Matic price feed address is updated.
     */
    event UpdatedMaticPriceFeedAddress(address _newMaticPriceFeedAddress);

    /**
     * @dev Emitted when the USDC token address is updated.
     */
    event UpdatedUsdcTokenAddress(address _newUsdcTokenAddress);

    /**
     * @dev Emitted when the USDC price feed address is updated.
     */
    event UpdatedUsdcPriceFeedAddress(address _newUsdcPriceFeedAddress);

    /**
     * @dev Emitted when the USDT token address is updated.
     */
    event UpdatedUsdtTokenAddress(address _newUsdtTokenAddress);

    /**
     * @dev Emitted when the USDT price feed address is updated.
     */
    event UpdatedUsdtPriceFeedAddress(address _newUsdtPriceFeedAddress);

    /**
     * @dev Emitted when the WBTC token address is updated.
     */
    event UpdatedWbtcTokenAddress(address _newWbtcTokenAddress);

    /**
     * @dev Emitted when the WBTC price feed address is updated.
     */
    event UpdatedWbtcPriceFeedAddress(address _newWbtcPriceFeedAddress);

    /**
     * @dev Emitted when the WETH token address is updated.
     */
    event UpdatedWethTokenAddress(address _newWethTokenAddress);

    /**
     * @dev Emitted when the WETH price feed address is updated.
     */
    event UpdatedWethPriceFeedAddress(address _newWethPriceFeedAddress);

    /**
     * @dev Emitted when MATIC is received by the smart contract.
     */
    event MaticReceived(address indexed sender, uint256 amount);
    
    ////////////////// SMART CONTRACT VARIABLES //////////////////

    /**
     * @dev Represents the current value of a HYAX token.
     */
    uint256 public hyaxPrice;

    /**
     * @dev Represents the minimum investment in USD required to buy HYAX.
     */
    uint256 public minimumInvestmentAllowedInUSD;

    /**
     * @dev Represents the maximum investment in USD that a non-qualified investor can make to buy HYAX.
     */
    uint256 public maximumInvestmentAllowedInUSD;

    /**
     * @dev Address of the whitelister who adds investor addresses to the whitelist after KYC.
     */
    address public whiteListerAddress;

    /**
     * @dev Address of the treasury that receives the investments made in the HYAX smart contract.
     */
    address public treasuryAddress;

    /**
     * @dev Mapping to store the data of the investors
     */
    struct InvestorData {
        bool isWhiteListed; // Whited investors approved after KYC.
        bool isBlacklisted; // Blacklisted investors.
        bool isQualifiedInvestor; //Track qualified investors.
        uint256 totalHyaxBoughtByInvestor; //Track the total amount of HYAX bought by each investor.
        uint256 totalUsdDepositedByInvestor; //Track the total amount of USD an investor has deposited to buy the HYAX token.
    }
    
    // Mapping to store investor data, indexed by their address 
    mapping(address => InvestorData) public investorData;

    // Enum defining the supported token types
    enum TokenType { MATIC, USDC, USDT, WBTC, WETH }

    //////////MATIC VARIABLES//////////

    /**
     * @dev There is no implementation of MATIC token address because it's the native token of the Polygon Blockchain.
     */

    /**
     * @dev Address of MATIC token price feed (Oracle) in the blockchain.
     */
    address public maticPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedMatic;

    /////////////USDC VARIABLES//////////

    /**
     * @dev Address of USDC token in the blockchain.
     */
    address public usdcTokenAddress;

    /**
     * @dev Address of USDC token price feed (Oracle) in the blockchain.
     */
    address public usdcPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedUsdc;

    /**
     * @dev Declaration of USDC token interface.
     */
    IERC20 public usdcToken;

    /////////////USDT VARIABLES//////////

    /**
     * @dev Address of USDT token in the blockchain.
     */
    address public usdtTokenAddress;

    /**
     * @dev Address of USDT token price feed (Oracle) in the blockchain.
     */
    address public usdtPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedUsdt;

    /**
     * @dev Declaration of USDT token interface.
     */
    IERC20 public usdtToken;

    /////////////WBTC VARIABLES//////////

    /**
     * @dev Address of WBTC token in the blockchain.
     */
    address public wbtcTokenAddress;

    /**
     * @dev Address of WBTC token price feed (Oracle) in the blockchain.
     */
    address public wbtcPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedWbtc;

    /**
     * @dev Declaration of WBTC token interface.
     */
    IERC20 public wbtcToken;

    /////////////WETH VARIABLES//////////

    /**
     * @dev Address of WETH token in the blockchain.
     */
    address public wethTokenAddress;

    /**
     * @dev Address of WETH token price feed (Oracle) in the blockchain.
     */
    address public wethPriceFeedAddress;

    /**
     * @dev Aggregator that allows asking for the price of crypto tokens.
     */
    AggregatorV3Interface internal dataFeedWeth;

    /**
     * @dev Declaration of WETH token interface.
     */
    IERC20 public wethToken;

    /**
     * @dev Maximum age of price data in seconds.
     */
    uint256 public constant MAX_PRICE_AGE = 1 hours;

    /**
     * @dev Array to store unused space for future upgrades.
     */
    uint256[50] private __gap;

    ////////////////// SMART CONTRACT CONSTRUCTOR /////////////////

    /**
     * @dev Initializer function instead of constructor.
     * This function will initialize the contract's state variables and call initializers for inherited contracts.
     */
    function initialize() public initializer {
        // Initialize inherited contracts
        __ERC20_init("HYAXToken", "HYAX");
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        
        // Minting 500,000,000 HYAX tokens to the contract deployer
        _mint(msg.sender, 500000000 * 10 ** decimals());

        // Setting the HYAX token price to 0.006 USD with 8 decimals 10**8 (600,000)
        hyaxPrice = 600000;
        
        // Setting the minimum investment allowed to buy HYAX to $1 USD
        minimumInvestmentAllowedInUSD = 1 * 10 ** decimals();

        // Setting the maximum investment allowed to buy HYAX to $10,000 USD
        maximumInvestmentAllowedInUSD = 10000 * 10 ** decimals();
    
        // Whitelister address
        whiteListerAddress = 0x01c2f012de19e6436744c3F81f56E9e70C93a8C3;

        // Treasury address
        treasuryAddress = 0x350441F8a82680a785FFA9d3EfEa60BB4cA417f8;

        // Address of MATIC token price feed (Oracle) on the blockchain
        maticPriceFeedAddress = 0x001382149eBa3441043c1c66972b4772963f5D43;

        // Oracle on Amoy network for MATIC/USD: https://amoy.polygonscan.com/address/0x001382149eBa3441043c1c66972b4772963f5D43#readContract
        dataFeedMatic = AggregatorV3Interface(maticPriceFeedAddress);

        // Address of USDC token on the blockchain
        usdcTokenAddress = 0xF68054bFe5D45432ffCA28fFA1F3D685d0456Ddc;

        // Address of USDC token price feed (Oracle) on the blockchain
        usdcPriceFeedAddress = 0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16;

        // Oracle on Amoy network for USDC/USD: https://amoy.polygonscan.com/address/0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16#code
        dataFeedUsdc = AggregatorV3Interface(usdcPriceFeedAddress);

        // Implementation of USDC token interface
        usdcToken = IERC20(usdcTokenAddress);

        // Address of USDT token on the blockchain
        usdtTokenAddress = 0x70e02Fb82B6BC04F64099689B0599e14B44D4fBb;

        // Address of USDT token price feed (Oracle) on the blockchain
        usdtPriceFeedAddress = 0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8;

        // Oracle on Amoy network for USDT/USD: https://amoy.polygonscan.com/address/0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8#readContract
        dataFeedUsdt = AggregatorV3Interface(usdtPriceFeedAddress);

        // Implementation of USDT token interface
        usdtToken = IERC20(usdtTokenAddress);

        // Address of WBTC token on the blockchain
        wbtcTokenAddress = 0x3C8df3C48B3884DA2ff25e17524282d60F9C3b93;

        // Address of WBTC token price feed (Oracle) on the blockchain
        wbtcPriceFeedAddress = 0xe7656e23fE8077D438aEfbec2fAbDf2D8e070C4f;

        // Oracle on Amoy network for WBTC/USD: https://amoy.polygonscan.com/address/0xe7656e23fE8077D438aEfbec2fAbDf2D8e070C4f#code
        dataFeedWbtc = AggregatorV3Interface(wbtcPriceFeedAddress);

        // Implementation of WBTC token interface
        wbtcToken = IERC20(wbtcTokenAddress);

        // Address of WETH token on the blockchain
        wethTokenAddress = 0x524a89ED77d5827320E35E12bCA96830C6b7960A;

        // Address of WETH token price feed (Oracle) on the blockchain
        wethPriceFeedAddress = 0xF0d50568e3A7e8259E16663972b11910F89BD8e7;

        // Oracle on Mumbai network for WETH/USD: https://amoy.polygonscan.com/address/0xF0d50568e3A7e8259E16663972b11910F89BD8e7#code
        dataFeedWeth = AggregatorV3Interface(wethPriceFeedAddress);

        // Implementation of WETH token interface
        wethToken = IERC20(wethTokenAddress);
    }
    
    ////////////////// SMART CONTRACT FUNCTIONS //////////////////

    /**
     * @dev Function to calculate the amount of HYAX tokens to return based on the current price of a currency for an investment.
     * @param _amount The amount of cryptocurrency invested.
     * @param _currentCryptocurrencyPrice The current price of the cryptocurrency in USD.
     * @return totalInvestmentInUsd The total investment in USD.
     * @return totalHyaxTokenToReturn The total amount of HYAX tokens to return.
     */
    function calculateTotalHyaxTokenToReturn(uint256 _amount, uint256 _currentCryptocurrencyPrice) public view returns (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) {
        // Calculate the total investment in USD and divide by 10**8 (decimals in price feeds).
        totalInvestmentInUsd = (_amount * _currentCryptocurrencyPrice) / 10**8;
        
        // Calculate the amount of tokens to return given the current token price and multiply by 10**8 (same as dividing by hyaxPrice).
        totalHyaxTokenToReturn = (totalInvestmentInUsd * 10**8) / hyaxPrice;
        
        // Validate that the amount to invest is equal or greater than the minimum investment established in USD.
        require(totalInvestmentInUsd >= minimumInvestmentAllowedInUSD, "The amount to invest must be greater than the minimum established");

        // Validate that the amount of HYAX tokens to offer to the investor is equal or less than the amount available in the smart contract.
        require(totalHyaxTokenToReturn <= balanceOf(address(this)), "The investment made returns an amount of HYAX greater than the available");

        return (totalInvestmentInUsd, totalHyaxTokenToReturn);
    }
    
    /**
     * @dev Function to add an investor's address to the whitelist.
     * @param _investorAddress The address of the investor to be added to the whitelist.
     */
    function addToWhiteList(address _investorAddress) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to add is not the zero address
        require(_investorAddress != address(0), "Investor address to add to the whitelist cannot be the zero address");
        
        // Ensure that the investor address has not already been added to the whitelist
        require(!investorData[_investorAddress].isWhiteListed, "That investor address has already been added to the whitelist");
        
        // Create a new InvestorData struct
        InvestorData memory newInvestorData;

        newInvestorData.isWhiteListed = true; // Mark the investor as whitelisted
        newInvestorData.isBlacklisted = false; // Initially, the investor is not blacklisted
        newInvestorData.isQualifiedInvestor = false; // Initially, the investor is not a qualified investor
        newInvestorData.totalHyaxBoughtByInvestor = 0; // Initialize the total HYAX bought to zero
        newInvestorData.totalUsdDepositedByInvestor = 0; // Initialize the total USD deposited to zero

        // Add the investor data to the mapping using the investor's address as the key
        investorData[_investorAddress] = newInvestorData;
        
        emit InvestorAddedToWhiteList(msg.sender, _investorAddress);
    }

    /**
     * @dev Function to update the whitelist status of an investor.
     * @param _investorAddress The address of the investor to update the whitelist status.
     * @param _newStatus The new status to set for the investor.
     */
    function updateWhitelistStatus(address _investorAddress, bool _newStatus) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to update is not the zero address
        require(_investorAddress != address(0), "Investor address to update whitelist status cannot be the zero address");

        //Verify that the investor address is currently in a different status
        require(investorData[_investorAddress].isWhiteListed != _newStatus, "Investor address has already been updated to that status");

        //Update the whitelist status
        investorData[_investorAddress].isWhiteListed = _newStatus; 
      
        emit WhitelistStatusUpdated(msg.sender, _investorAddress, _newStatus);
    }

    /**
     * @dev Function to update the blacklist status of an investor.
     * @param _investorAddress The address of the investor to update the blacklist status.
     * @param _newStatus The new status to set for the investor.
     */
    function updateBlacklistStatus(address _investorAddress, bool _newStatus) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to update is not the zero address
        require(_investorAddress != address(0), "Investor address to update blacklist status cannot be the zero address");

        //Verify that the investor address is currently in a different status
        require(investorData[_investorAddress].isBlacklisted != _newStatus, "Investor address has already been updated to that status");

        //Update the whitelist status
        investorData[_investorAddress].isBlacklisted = _newStatus; 
      
        emit BlacklistStatusUpdated(msg.sender, _investorAddress, _newStatus);
    }

    modifier investorWhitelistAndBlacklistCheck {

        // Ensure that the sender's address is on the whitelist
        require(investorData[msg.sender].isWhiteListed, "Investor address has not been added to the whitelist");
        
        // Ensure that the sender's address is not on the blacklist
        require(!investorData[msg.sender].isBlacklisted, "Investor address has been added to the blacklist");

        _;
    }

    modifier onlyOwnerOrWhitelister {
        // Ensure that the sender is the owner or the whitelister address
        require(msg.sender == owner() || msg.sender == whiteListerAddress, "Function reserved only for the whitelister address or the owner");
        _;
    }

    /**
     * @dev Function to update the qualified investor status of an investor.
     * @param _qualifiedInvestorAddress The address of the investor to update the qualified investor status.
     * @param _newStatus The new status to set for the investor.
     */
    function updateQualifiedInvestorStatus(address _qualifiedInvestorAddress, bool _newStatus) external onlyOwnerOrWhitelister {

        // Ensure that the investor address to update is not the zero address
        require(_qualifiedInvestorAddress != address(0), "Investor address to update qualified investor status cannot be the zero address");

        // Ensure that the investor address to update is already in the whitelist of investors
        require(investorData[_qualifiedInvestorAddress].isWhiteListed, "Investor address must be first added to the investor whitelist");
   
        // Ensure that the investor address has not already been updated to that status
        require(investorData[_qualifiedInvestorAddress].isQualifiedInvestor != _newStatus, "That investor address has already been updated to that status");
        
        // Update the qualified investor status
        investorData[_qualifiedInvestorAddress].isQualifiedInvestor = _newStatus;
       
        // Emit the event of qualified investor status updated
        emit QualifiedInvestorStatusUpdated(msg.sender, _qualifiedInvestorAddress, _newStatus);
    }
    
    /**
     * @dev Function to issue HYAX tokens as required.
     * @param _amount The amount of HYAX tokens to issue.
     */
    function tokenIssuance(uint256 _amount) public onlyOwner nonReentrant {
            
        // Ensure that the amount to issue in this execution is at least 1 token
        require(_amount >= 10 ** decimals(), "Amount of HYAX tokens to issue must be at least 1 token");
                
        // Ensure that the amount to issue in this execution is maximum 1000 M tokens
        require(_amount <= 1000000000 * 10 ** decimals(), "Amount of HYAX tokens to issue at a time must be maximum 1000 M");
            
        // Validate the amount to issue doesn't go beyond the established total supply
        require(totalSupply() + _amount <= 10000000000 * 10 ** decimals(), "Amount of HYAX tokens to issue surpases the 10,000 M tokens");

        // Mint the specified amount of tokens to the owner
        _mint(owner(), _amount);

        // Emit the event of token issuance
        emit TokenIssuance(msg.sender, _amount);
    }

    /**
     * @dev Validates and tracks the investment made by an investor in USD.
     * @param _totalInvestmentInUsd The total amount of the investment in USD.
     * @param _investorAddress The address of the investor making the investment.
     */
    function validateAndTrackInvestment(uint256 _totalInvestmentInUsd, address _investorAddress) internal {
        // Atomically update the total USD deposited by the investor first
        uint256 newTotalAmountInvestedInUSD = investorData[_investorAddress].totalUsdDepositedByInvestor + _totalInvestmentInUsd;
        
        // Check if the new total investment exceeds the allowed limit
        if (newTotalAmountInvestedInUSD > maximumInvestmentAllowedInUSD) {
            require(investorData[_investorAddress].isQualifiedInvestor, "To buy that amount of HYAX its required to be a qualified investor");
        }

        // Update the investor's deposited amount
        investorData[_investorAddress].totalUsdDepositedByInvestor = newTotalAmountInvestedInUSD;
    }

    /////////////INVESTING FUNCTIONS//////////

    /**
     * @dev Function allowing an investor on the whitelist to invest using MATIC.
     * @notice The function is payable, and MATIC is automatically transferred to this contract with the payable tag.
     * @return A boolean indicating the success of the investment and HYAX token transfer.
    */
    function investFromMatic() external investorWhitelistAndBlacklistCheck payable nonReentrant returns (bool){

        // Transfer MATIC to this contract. Its automatically done with the payable tag

        // Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = calculateTotalHyaxTokenToReturn(msg.value, this.getCurrentTokenPrice(TokenType.MATIC));

        // Update and validate the investor's data atomically
        validateAndTrackInvestment(totalInvestmentInUsd, msg.sender);

        // Transfer MATIC to the treasury address first, as per requirements
        (bool success, ) = payable(treasuryAddress).call{value: msg.value}("");
        require(success, "There was an error on sending the MATIC investment to the treasury");

        // Transfer HYAX token to the investor wallet
        require(this.transfer(msg.sender, totalHyaxTokenToReturn), "There was an error on sending back the HYAX Token to the investor");

        // Update the total amount of HYAX that an investor has bought
        investorData[msg.sender].totalHyaxBoughtByInvestor += totalHyaxTokenToReturn;

        // Emit the event of successful investment
        emit InvestFromMatic(msg.sender, msg.value, totalInvestmentInUsd, totalHyaxTokenToReturn);

        return true;
    }

    /**
    * @dev Function to allow an investor on the whitelist to invest using a specified cryptocurrency.
    *
    * @param tokenType The type of cryptocurrency to invest with.
    * @param _amount The amount of the cryptocurrency to invest.
    * @return A boolean indicating the success of the investment and HYAX token transfer.
    */
    function investFromCryptoToken(TokenType tokenType, uint256 _amount) external investorWhitelistAndBlacklistCheck nonReentrant returns (bool) {
        // Get the token contract and price function based on the token type
        IERC20 token;
        uint256 currentTokenPrice;

        if (tokenType == TokenType.USDC) {
            token = usdcToken;
            currentTokenPrice = this.getCurrentTokenPrice(tokenType);
        } else if (tokenType == TokenType.USDT) {
            token = usdtToken;
            currentTokenPrice = this.getCurrentTokenPrice(tokenType);
        } else if (tokenType == TokenType.WBTC) {
            token = wbtcToken;
            currentTokenPrice = this.getCurrentTokenPrice(tokenType);
        } else if (tokenType == TokenType.WETH) {
            token = wethToken;
            currentTokenPrice = this.getCurrentTokenPrice(tokenType);
        } else {
            revert("Invalid token type");
        }

        // Calculate total HYAX to return while validating minimum investment and if there are HYAX tokens left to sell
        (uint256 totalInvestmentInUsd, uint256 totalHyaxTokenToReturn) = calculateTotalHyaxTokenToReturn(_amount, currentTokenPrice);

        // Update and validate the investor's data atomically
        validateAndTrackInvestment(totalInvestmentInUsd, msg.sender);

        // Transfer the specified token to this contract 
        require(token.transferFrom(msg.sender, address(this), _amount), "There was an error on receiving the token investment");
        
        // Transfer tokens to the treasury address first, as per requirements
        require(token.transfer(payable(treasuryAddress), _amount), "There was an error on sending the token investment to the treasury");
        
        // Transfer HYAX token to the investor wallet
        require(this.transfer(msg.sender, totalHyaxTokenToReturn), "There was an error on sending back the HYAX Token to the investor");
        
        // Update the total amount of HYAX that an investor has bought
        investorData[msg.sender].totalHyaxBoughtByInvestor += totalHyaxTokenToReturn;

        // Emit the event of successful investment
        emit InvestFromCryptoToken(tokenType, msg.sender, _amount, totalInvestmentInUsd, totalHyaxTokenToReturn);

        return true;
    }

    /////////////VARIABLE UPDATE FUNCTIONS ONLY OWNER//////////

    /**
     * @dev Function to update the price in USD of each HYAX token. Using 8 decimals.
     * @param _newHyaxPrice The new price of each HYAX token in USD.
     */
    function updateHyaxPrice(uint256 _newHyaxPrice) external onlyOwner {

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newHyaxPrice != hyaxPrice, "HYAX price has already been modified to that value");

        // Ensure that new HYAX token price is over a minimum of USD 0.005
        require(_newHyaxPrice >= 500000, "Price of HYAX token must be at least USD 0.005, that is 500000 with 8 decimals");
        
        // Ensure that new HYAX token price is under a maximum of USD 1000 
        require(_newHyaxPrice <= 100000000000, "Price of HYAX token must be at maximum USD 1000, that is 100000000000 with 8 decimals");
        
        // Update the HYAX price
        hyaxPrice = _newHyaxPrice;

        // Emit an event to signal the updated HYAX price
        emit UpdatedHyaxPrice(_newHyaxPrice);
    }

    /**
     * @dev Function to update the minimum investment allowed for an investor to make in USD.
     * @param _newMinimumInvestmentAllowedInUSD The new minimum amount allowed for investment in USD.
     */
    function updateMinimumInvestmentAllowedInUSD(uint256 _newMinimumInvestmentAllowedInUSD) external onlyOwner {
        
        // Ensure the new minimum investment is greater than zero
        require(_newMinimumInvestmentAllowedInUSD > 0, "New minimun amount to invest, must be greater than zero");
        
        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newMinimumInvestmentAllowedInUSD != minimumInvestmentAllowedInUSD, "Minimum investment allowed in USD has already been modified to that value");

        // Ensure the new minimum investment is less or equal than the maximum
        require(_newMinimumInvestmentAllowedInUSD <= maximumInvestmentAllowedInUSD, "New minimun amount to invest, must be less than the maximum investment allowed");

        // Update the minimum investment allowed in USD
        minimumInvestmentAllowedInUSD = _newMinimumInvestmentAllowedInUSD;

        // Emit an event to signal the updated minimum investment allowed in USD
        emit UpdatedMinimumInvestmentAllowedInUSD(_newMinimumInvestmentAllowedInUSD);
    }

    /**
     * @dev Function to update the maximum investment allowed for an investor to make in USD, without being a qualified investor.
     * @param _newMaximumInvestmentAllowedInUSD The new maximum amount allowed for investment in USD.
     */
    function updateMaximumInvestmentAllowedInUSD(uint256 _newMaximumInvestmentAllowedInUSD) external onlyOwner {

        // Ensure the new maximum investment is greater than zero
        require(_newMaximumInvestmentAllowedInUSD > 0, "New maximum amount to invest, must be greater than zero");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newMaximumInvestmentAllowedInUSD != maximumInvestmentAllowedInUSD, "New maximum amount to invest, has already been modified to that value");

        // Ensure the new maximum investment is greater or equal than the minimum
        require(_newMaximumInvestmentAllowedInUSD >= minimumInvestmentAllowedInUSD, "New maximum amount to invest, must be greater than the minimum investment allowed");

        // Update the maximum investment allowed in USD
        maximumInvestmentAllowedInUSD = _newMaximumInvestmentAllowedInUSD;

        // Emit an event to signal the updated maximum investment allowed in USD
        emit UpdatedMaximumInvestmentAllowedInUSD(_newMaximumInvestmentAllowedInUSD);
    }

    /**
     * @dev Function to update the address of the whitelister.
     * @param _newWhiteListerAddress The new address of the whitelister.
     */
    function updateWhiteListerAddress(address _newWhiteListerAddress) external onlyOwner {

        // Ensure the new whitelister address is not the zero address
        require(_newWhiteListerAddress != address(0), "The whitelister address cannot be the zero address");
        
        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newWhiteListerAddress != whiteListerAddress, "whitelister address has already been modified to that value");

        // Update the whitelister address
        whiteListerAddress = _newWhiteListerAddress;

        // Emit an event to signal the updated whitelister address
        emit UpdatedWhiteListerAddress(_newWhiteListerAddress);
    }

    /**
     * @dev Function to update the address of the treasury.
     * @param _newTreasuryAddress The new address of the treasury.
     */
    function updateTreasuryAddress(address _newTreasuryAddress) external onlyOwner {

        // Ensure the new treasury address is not the zero address
        require(_newTreasuryAddress != address(0), "The treasury address cannot be the zero address");

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        require(_newTreasuryAddress != treasuryAddress, "Treasury address has already been modified to that value");

        // Update the treasury address
        treasuryAddress = _newTreasuryAddress;

        // Emit an event to signal the updated treasury address
        emit UpdatedTreasuryAddress(_newTreasuryAddress);
    }

    /**
     * @dev Function to update the address of the crypto token on the blockchain.
     * @param newTokenAddress The new address of the token on the blockchain.
     */
    function updateTokenAddress(TokenType tokenType, address newTokenAddress) external onlyOwner {
        // Ensure the new token address is not the zero address
        require(newTokenAddress != address(0), "The token address cannot be the zero address");

        // Check and update addresses based on token type
        if (tokenType == TokenType.USDC) {
            require(newTokenAddress != usdcTokenAddress, "USDC token address has already been modified to that value");
            usdcTokenAddress = newTokenAddress;
            usdcToken = IERC20(newTokenAddress);
            emit UpdatedUsdcTokenAddress(newTokenAddress);
        } else if (tokenType == TokenType.USDT) {
            require(newTokenAddress != usdtTokenAddress, "USDT token address has already been modified to that value");
            usdtTokenAddress = newTokenAddress;
            usdtToken = IERC20(newTokenAddress);
            emit UpdatedUsdtTokenAddress(newTokenAddress);
        } else if (tokenType == TokenType.WBTC) {
            require(newTokenAddress != wbtcTokenAddress, "WBTC token address has already been modified to that value");
            wbtcTokenAddress = newTokenAddress;
            wbtcToken = IERC20(newTokenAddress);
            emit UpdatedWbtcTokenAddress(newTokenAddress);
        } else if (tokenType == TokenType.WETH) {
            require(newTokenAddress != wethTokenAddress, "WETH token address has already been modified to that value");
            wethTokenAddress = newTokenAddress;
            wethToken = IERC20(newTokenAddress);
            emit UpdatedWethTokenAddress(newTokenAddress);
        } else {
            revert("Invalid token type");
        }
    }

    /*
     * @dev Function to update the address of the oracle that provides the Token price feed.
     * @param newPriceFeedAddress The new address of the Token price feed oracle.
     */
    function updatePriceFeedAddress(TokenType tokenType, address newPriceFeedAddress) external onlyOwner {
        // Ensure the new price feed address is not the zero address
        require(newPriceFeedAddress != address(0), "The price data feed address cannot be the zero address");

        //Temporary data feed to perform the validation of the data feed descriptions
        AggregatorV3Interface tempDataFeed = AggregatorV3Interface(newPriceFeedAddress);
   
        //Store the hash value of the expected TOKEN/USD string
        bytes32 hashOfExpectedDescription;

        //Store the hash value of the current TOKEN/USD string
        bytes32 hashOfCurrentDescription;

        //Ensure that the update transaction is not repeated for the same parameter, just as a good practice
        if (tokenType == TokenType.MATIC) {
            require(newPriceFeedAddress != maticPriceFeedAddress, "MATIC price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('MATIC / USD'));
        } else if (tokenType == TokenType.USDC) {
            require(newPriceFeedAddress != usdcPriceFeedAddress, "USDC price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('USDC / USD'));
        } else if (tokenType == TokenType.USDT) {
            require(newPriceFeedAddress != usdtPriceFeedAddress, "USDT price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('USDT / USD'));
        } else if (tokenType == TokenType.WBTC) {
            require(newPriceFeedAddress != wbtcPriceFeedAddress, "WBTC price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('WBTC / USD'));
        } else if (tokenType == TokenType.WETH) {
            require(newPriceFeedAddress != wethPriceFeedAddress, "WETH price feed address has already been modified to that value");
            hashOfExpectedDescription = keccak256(abi.encodePacked('ETH / USD'));
        } else {
            revert("Invalid token type");
        }

        //Validate the data feed is actually the address of a TOKEN/USD oracle by comparing the hashes of the expected description and temporal description
        try tempDataFeed.description() returns (string memory descriptionValue) {
            hashOfCurrentDescription = keccak256(abi.encodePacked(descriptionValue));
            require(hashOfExpectedDescription == hashOfCurrentDescription, "The new address does not seem to belong to the correct price data feed");
        } catch {
            revert("The new address does not seem to belong to the correct price data feed");
        }

        // Update the price feed address and interface based on the token type
        if (tokenType == TokenType.MATIC) {
            maticPriceFeedAddress = newPriceFeedAddress;
            dataFeedMatic = AggregatorV3Interface(maticPriceFeedAddress);
            emit UpdatedMaticPriceFeedAddress(newPriceFeedAddress);
        } else if (tokenType == TokenType.USDC) {
            usdcPriceFeedAddress = newPriceFeedAddress;
            dataFeedUsdc = AggregatorV3Interface(usdcPriceFeedAddress);
            emit UpdatedUsdcPriceFeedAddress(newPriceFeedAddress);
        } else if (tokenType == TokenType.USDT) {
            usdtPriceFeedAddress = newPriceFeedAddress;
            dataFeedUsdt = AggregatorV3Interface(usdtPriceFeedAddress);
            emit UpdatedUsdtPriceFeedAddress(newPriceFeedAddress);
        } else if (tokenType == TokenType.WBTC) {
            wbtcPriceFeedAddress = newPriceFeedAddress;
            dataFeedWbtc = AggregatorV3Interface(wbtcPriceFeedAddress);
            emit UpdatedWbtcPriceFeedAddress(newPriceFeedAddress);
        } else if (tokenType == TokenType.WETH) {
            wethPriceFeedAddress = newPriceFeedAddress;
            dataFeedWeth = AggregatorV3Interface(wethPriceFeedAddress);
            emit UpdatedWethPriceFeedAddress(newPriceFeedAddress);
        }
    }

    /////////////ORACLE PRICE FEED FUNCTIONS//////////
    /**
     * @dev Function to get the current price of the token in USD.
     * @return The current price of the token in USD with 8 decimals.
     */
    function getCurrentTokenPrice(TokenType tokenType) public view returns (uint256) {

        AggregatorV3Interface dataFeed;

        if (tokenType == TokenType.MATIC) {
            dataFeed = dataFeedMatic;
        } else if (tokenType == TokenType.USDC) {
            dataFeed = dataFeedUsdc;
        } else if (tokenType == TokenType.USDT) {
            dataFeed = dataFeedUsdt;
        } else if (tokenType == TokenType.WBTC) {
            dataFeed = dataFeedWbtc;
        } else if (tokenType == TokenType.WETH) {
            dataFeed = dataFeedWeth;
        } else {
            revert("Invalid token type");
        }

        try dataFeed.latestRoundData() returns (

            uint80 roundID,
            int256 answer,
            uint /*startedAt*/,
            uint timeStamp,
            uint80 answeredInRound
        ) {
            // Check if the oracle response is valid
            require(answer > 0, "Invalid price data from oracle");           // Ensure price is positive
            require(timeStamp > 0 && timeStamp <= block.timestamp, "Stale price data");  // Ensure timestamp is valid
            require(answeredInRound >= roundID, "Incomplete round data");    // Check if round data is complete
            //require(block.timestamp - timeStamp <= MAX_PRICE_AGE, "Price data too old"); // Ensure price data freshness

            return uint256(answer);
        } catch {
            revert("There was an error obtaining the token price from the oracle");
        }
    }

    ////////////////// SMART REQUIRED FUNCTIONS //////////////////

    /**
     * @dev Pauses all functionalities of the contract.
     * Can only be called by the owner.
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpauses all functionalities of the contract.
     * Can only be called by the owner.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     * @param newOwner The address of the new owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {

        //Validate the new owner is not the zero address
        require(newOwner != address(0), "Ownable: new owner is the zero address");

        //Validate the new owner is not the same contract address, otherwise management of the smart contract will be lost
        require(newOwner != address(this), "Ownable: new owner cannot be the same contract address");
        
        _transferOwnership(newOwner);
    }

    /**
     * @dev Receive function to be able to receive MATIC to pay for possible transaction gas in the future.
     */
    receive() external payable nonReentrant onlyOwner {
        //Emit an event to signal the received MATIC
        emit MaticReceived(msg.sender, msg.value);
    }
}
