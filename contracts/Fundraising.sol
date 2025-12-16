// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Fundraising
 * @dev Smart contract for decentralized fundraising on Polygon
 * Focused on nursing homes (panti jompo) fundraising
 */
contract Fundraising {
    // Struct to represent a fundraiser
    struct Fundraiser {
        uint256 id;
        address owner;
        string name;
        string location;
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        bool isActive;
        uint256 createdAt;
        address recipient; // Wallet address that will receive funds
    }

    // Struct to represent a donation
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        uint256 fundraiserId;
    }

    // State variables
    uint256 private nextFundraiserId;
    address public owner;
    mapping(uint256 => Fundraiser) public fundraisers;
    mapping(uint256 => Donation[]) public donations; // fundraiserId => donations
    mapping(uint256 => mapping(address => uint256)) public donorContributions; // fundraiserId => donor => total contributed

    // Events
    event FundraiserCreated(
        uint256 indexed fundraiserId,
        address indexed owner,
        string name,
        uint256 targetAmount,
        address recipient
    );

    event DonationMade(
        uint256 indexed fundraiserId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    event FundsWithdrawn(
        uint256 indexed fundraiserId,
        address indexed recipient,
        uint256 amount
    );

    event FundraiserStatusChanged(uint256 indexed fundraiserId, bool isActive);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this");
        _;
    }

    modifier validFundraiser(uint256 _fundraiserId) {
        require(
            fundraisers[_fundraiserId].id != 0,
            "Fundraiser does not exist"
        );
        _;
    }

    modifier onlyFundraiserOwner(uint256 _fundraiserId) {
        require(
            fundraisers[_fundraiserId].owner == msg.sender,
            "Only fundraiser owner can call this"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        nextFundraiserId = 1;
    }

    /**
     * @dev Create a new fundraiser
     * @param _name Name of the nursing home
     * @param _location Location of the nursing home
     * @param _description Description of the fundraiser
     * @param _targetAmount Target amount in wei (MATIC) or smallest unit
     * @param _recipient Address that will receive the funds
     */
    function createFundraiser(
        string memory _name,
        string memory _location,
        string memory _description,
        uint256 _targetAmount,
        address _recipient
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_recipient != address(0), "Recipient address cannot be zero");

        uint256 fundraiserId = nextFundraiserId;
        nextFundraiserId++;

        fundraisers[fundraiserId] = Fundraiser({
            id: fundraiserId,
            owner: msg.sender,
            name: _name,
            location: _location,
            description: _description,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            isActive: true,
            createdAt: block.timestamp,
            recipient: _recipient
        });

        emit FundraiserCreated(
            fundraiserId,
            msg.sender,
            _name,
            _targetAmount,
            _recipient
        );

        return fundraiserId;
    }

    /**
     * @dev Make a donation to a fundraiser
     * @param _fundraiserId ID of the fundraiser
     * @notice Automatically transfers funds to recipient when target is reached
     */
    function donate(uint256 _fundraiserId) external payable validFundraiser(_fundraiserId) {
        Fundraiser storage fundraiser = fundraisers[_fundraiserId];
        require(fundraiser.isActive, "Fundraiser is not active");
        require(msg.value > 0, "Donation amount must be greater than 0");

        fundraiser.raisedAmount += msg.value;
        donorContributions[_fundraiserId][msg.sender] += msg.value;

        donations[_fundraiserId].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            fundraiserId: _fundraiserId
        }));

        emit DonationMade(_fundraiserId, msg.sender, msg.value, block.timestamp);

        // Auto-transfer to recipient if target is reached
        if (fundraiser.raisedAmount >= fundraiser.targetAmount) {
            uint256 amountToTransfer = fundraiser.raisedAmount;
            address recipient = fundraiser.recipient;
            
            // Reset raised amount to prevent reentrancy
            fundraiser.raisedAmount = 0;
            
            // Transfer funds to recipient
            (bool success, ) = payable(recipient).call{value: amountToTransfer}("");
            require(success, "Auto-transfer failed");
            
            emit FundsWithdrawn(_fundraiserId, recipient, amountToTransfer);
        }
    }

    /**
     * @dev Withdraw funds from a fundraiser (only owner can withdraw)
     * @param _fundraiserId ID of the fundraiser
     */
    function withdrawFunds(uint256 _fundraiserId)
        external
        validFundraiser(_fundraiserId)
        onlyFundraiserOwner(_fundraiserId)
    {
        Fundraiser storage fundraiser = fundraisers[_fundraiserId];
        require(fundraiser.raisedAmount > 0, "No funds to withdraw");
        require(fundraiser.isActive, "Fundraiser is not active");

        uint256 amount = fundraiser.raisedAmount;
        address recipient = fundraiser.recipient;

        // Reset raised amount to prevent reentrancy
        fundraiser.raisedAmount = 0;

        // Transfer funds
        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_fundraiserId, recipient, amount);
    }

    /**
     * @dev Toggle fundraiser active status
     * @param _fundraiserId ID of the fundraiser
     */
    function toggleFundraiserStatus(uint256 _fundraiserId)
        external
        validFundraiser(_fundraiserId)
        onlyFundraiserOwner(_fundraiserId)
    {
        fundraisers[_fundraiserId].isActive = !fundraisers[_fundraiserId].isActive;
        emit FundraiserStatusChanged(_fundraiserId, fundraisers[_fundraiserId].isActive);
    }

    /**
     * @dev Get fundraiser details
     * @param _fundraiserId ID of the fundraiser
     */
    function getFundraiser(uint256 _fundraiserId)
        external
        view
        validFundraiser(_fundraiserId)
        returns (Fundraiser memory)
    {
        return fundraisers[_fundraiserId];
    }

    /**
     * @dev Get donation count for a fundraiser
     * @param _fundraiserId ID of the fundraiser
     */
    function getDonationCount(uint256 _fundraiserId)
        external
        view
        validFundraiser(_fundraiserId)
        returns (uint256)
    {
        return donations[_fundraiserId].length;
    }

    /**
     * @dev Get donations for a fundraiser (with pagination)
     * @param _fundraiserId ID of the fundraiser
     * @param _offset Starting index
     * @param _limit Number of donations to return
     */
    function getDonations(
        uint256 _fundraiserId,
        uint256 _offset,
        uint256 _limit
    )
        external
        view
        validFundraiser(_fundraiserId)
        returns (Donation[] memory)
    {
        Donation[] memory allDonations = donations[_fundraiserId];
        uint256 total = allDonations.length;

        if (_offset >= total) {
            return new Donation[](0);
        }

        uint256 end = _offset + _limit;
        if (end > total) {
            end = total;
        }

        uint256 resultLength = end - _offset;
        Donation[] memory result = new Donation[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = allDonations[_offset + i];
        }

        return result;
    }

    /**
     * @dev Get total contribution of a donor to a fundraiser
     * @param _fundraiserId ID of the fundraiser
     * @param _donor Address of the donor
     */
    function getDonorContribution(uint256 _fundraiserId, address _donor)
        external
        view
        validFundraiser(_fundraiserId)
        returns (uint256)
    {
        return donorContributions[_fundraiserId][_donor];
    }

    /**
     * @dev Get the next fundraiser ID (for frontend to know how many exist)
     */
    function getNextFundraiserId() external view returns (uint256) {
        return nextFundraiserId;
    }

    /**
     * @dev Get multiple fundraisers by IDs
     * @param _ids Array of fundraiser IDs
     */
    function getFundraisers(uint256[] memory _ids)
        external
        view
        returns (Fundraiser[] memory)
    {
        Fundraiser[] memory result = new Fundraiser[](_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            if (fundraisers[_ids[i]].id != 0) {
                result[i] = fundraisers[_ids[i]];
            }
        }
        return result;
    }

    // Fallback function to receive MATIC
    receive() external payable {
        revert("Please use donate() function with fundraiser ID");
    }
}
