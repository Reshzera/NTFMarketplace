// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NTFMarket is ReentrancyGuard {
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
    }

    address payable immutable owner;
    uint private _itemIds = 0;
    uint public _itemSoldIds;
    uint public listingPrice = 0.025 ether;
    mapping(uint => MarketItem) public marketItems; // itemId => MarketItem

    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        uint price
    );

    constructor() {
        owner = payable(msg.sender);
    }

    function createMarketItem(
        address nftContract,
        uint tokenId,
        uint price
    ) external payable nonReentrant {
        require(
            msg.value == listingPrice,
            "Price must be equal to listingPrice"
        );
        _itemIds++;
        marketItems[_itemIds] = MarketItem(
            _itemIds,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            _itemIds,
            nftContract,
            tokenId,
            msg.sender,
            price
        );
    }

    function createMarketSale(
        address nftContract,
        uint itemId
    ) external payable nonReentrant {
        require(marketItems[itemId].itemId != 0, "Item not found");
        require(marketItems[itemId].sold == false, "Item is already sold");
        require(
            msg.value == marketItems[itemId].price,
            "Price must be equal to item price"
        );

        marketItems[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(
            address(this),
            msg.sender,
            marketItems[itemId].tokenId
        );

        _itemSoldIds++;
        marketItems[itemId].sold = true;
        marketItems[itemId].owner = payable(msg.sender);
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() external view returns (MarketItem[] memory) {
        uint toalItemCount = _itemIds;
        uint unsoldItemCount = _itemIds - _itemSoldIds;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        uint currentIndex = 0;

        for (uint i = 1; i <= toalItemCount; ++i) {
            if (marketItems[i].owner == address(0) && !marketItems[i].sold) {
                items[currentIndex] = marketItems[i];
                ++currentIndex;
            }
        }
        return items;
    }

    function fetchMyNTFs() external view returns (MarketItem[] memory) {
        uint toalItemCount = _itemIds;
        uint itemCount = 0;

        for (uint i = 1; i <= _itemIds; ++i) {
            if (marketItems[i].owner == msg.sender) {
                ++itemCount;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        uint currentIndex = 0;

        for (uint i = 1; i <= toalItemCount; ++i) {
            if (marketItems[i].owner == msg.sender) {
                items[currentIndex] = marketItems[i];
                ++currentIndex;
            }
        }

        return items;
    }

    function fetchItemsCreated() external view returns (MarketItem[] memory) {
        uint toalItemCount = _itemIds;
        uint itemCount = 0;

        for (uint i = 1; i <= toalItemCount; ++i) {
            if (marketItems[i].seller == msg.sender) {
                ++itemCount;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        uint currentIndex = 0;

        for (uint i = 1; i <= toalItemCount; ++i) {
            if (marketItems[i].seller == msg.sender) {
                items[currentIndex] = marketItems[i];
                ++currentIndex;
            }
        }
        return items;
    }
}
