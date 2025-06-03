const SupplyChain = artifacts.require("SupplyChain");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("SupplyChain", (accounts) => {
    let supplyChain;
    const [owner, manufacturer, thirdParty, deliveryHub, customer] = accounts;
    const productName = "Test Product";
    const productCode = 12345;
    const productPrice = web3.utils.toWei('0.5', 'ether');
    const productCategory = "Electronics";
    const manufacturerName = "Test Manufacturer";
    const manufacturerDetails = "Test Manufacturer Details";
    const manufacturerLongitude = "12.3456";
    const manufacturerLatitude = "78.9012";

    beforeEach(async () => {
        supplyChain = await SupplyChain.new();
    });

    describe("Role Management", () => {
        it("should add manufacturer role", async () => {
            await supplyChain.addManufacturerRole(manufacturer);
            const hasRole = await supplyChain.hasManufacturerRole(manufacturer);
            assert.equal(hasRole, true, "Manufacturer role should be added");
        });

        it("should add third party role", async () => {
            await supplyChain.addThirdPartyRole(thirdParty);
            const hasRole = await supplyChain.hasThirdPartyRole(thirdParty);
            assert.equal(hasRole, true, "Third party role should be added");
        });

        it("should add delivery hub role", async () => {
            await supplyChain.addDeliveryHubRole(deliveryHub);
            const hasRole = await supplyChain.hasDeliveryHubRole(deliveryHub);
            assert.equal(hasRole, true, "Delivery hub role should be added");
        });

        it("should allow any account to add roles", async () => {
            await supplyChain.addManufacturerRole(manufacturer, { from: thirdParty });
            const hasRole = await supplyChain.hasManufacturerRole(manufacturer);
            assert.equal(hasRole, true, "Manufacturer role should be added by any account");
        });
    });

    describe("Product Lifecycle", () => {
        beforeEach(async () => {
            // Setup roles
            await supplyChain.addManufacturerRole(manufacturer);
            await supplyChain.addThirdPartyRole(thirdParty);
            await supplyChain.addDeliveryHubRole(deliveryHub);
            await supplyChain.addCustomerRole(customer);
        });

        it("should manufacture a product", async () => {
            await supplyChain.manufactureProduct(
                manufacturerName,
                manufacturerDetails,
                manufacturerLongitude,
                manufacturerLatitude,
                productName,
                productCode,
                productPrice,
                productCategory,
                { from: manufacturer }
            );

            const result = await supplyChain.fetchProductPart1(1, "product", 0);
            const manuName = result[4];
            const manufacturerAddr = result[3];
            
            assert.equal(manuName, manufacturerName, "Manufacturer name should match");
            assert.equal(manufacturerAddr, manufacturer, "Manufacturer address should match");
        });

        it("should not allow non-manufacturer to manufacture product", async () => {
            await expectRevert(
                supplyChain.manufactureProduct(
                    manufacturerName,
                    manufacturerDetails,
                    manufacturerLongitude,
                    manufacturerLatitude,
                    productName,
                    productCode,
                    productPrice,
                    productCategory,
                    { from: thirdParty }
                ),
                "revert"
            );
        });

        it("should allow third party to purchase product", async () => {
            // First manufacture the product
            await supplyChain.manufactureProduct(
                manufacturerName,
                manufacturerDetails,
                manufacturerLongitude,
                manufacturerLatitude,
                productName,
                productCode,
                productPrice,
                productCategory,
                { from: manufacturer }
            );

            // Then purchase by third party
            await supplyChain.purchaseByThirdParty(1, { from: thirdParty });
            
            const result = await supplyChain.fetchProductPart2(1, "product", 0);
            const state = result[5];
            assert.equal(state.toString(), "1", "Product state should be PurchasedByThirdParty");
        });

        it("should track product history", async () => {
            // Manufacture product
            await supplyChain.manufactureProduct(
                manufacturerName,
                manufacturerDetails,
                manufacturerLongitude,
                manufacturerLatitude,
                productName,
                productCode,
                productPrice,
                productCategory,
                { from: manufacturer }
            );

            // Purchase by third party
            await supplyChain.purchaseByThirdParty(1, { from: thirdParty });

            const result1 = await supplyChain.fetchProductPart1(1, "history", 0);
            const result2 = await supplyChain.fetchProductPart1(1, "history", 1);
            const uid1 = result1[0];
            const uid2 = result2[0];
            assert.equal(uid1.toString(), "1", "First history entry should exist");
            assert.equal(uid2.toString(), "1", "Second history entry should exist");
        });
    });

    describe("Access Control", () => {
        it("should not allow unauthorized state changes", async () => {
            await supplyChain.addManufacturerRole(manufacturer);
            await supplyChain.manufactureProduct(
                manufacturerName,
                manufacturerDetails,
                manufacturerLongitude,
                manufacturerLatitude,
                productName,
                productCode,
                productPrice,
                productCategory,
                { from: manufacturer }
            );

            await expectRevert(
                supplyChain.purchaseByThirdParty(1, { from: customer }),
                "revert"
            );
        });
    });
}); 