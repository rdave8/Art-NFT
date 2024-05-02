const { ethers, upgrades } = require('hardhat');

describe('Simulation', function () {
  it('Entire Runthrough', async function () {
    console.log();

    console.log('Generating signers...');
    const [initialOwner, addrA, addrB] = await ethers.getSigners();
    console.log('initialOwner:', initialOwner.address);
    console.log('addrA: ', addrA.address);
    console.log('addrB: ', addrB.address);
    console.log();
    
    console.log('Deploying Utility USDC Contract...');
    const USDCFactory = await ethers.getContractFactory('UtilityUSDC');
    const USDC = await USDCFactory.deploy();
    console.log('USDC Contract: ', await USDC.getAddress());
    console.log();

    console.log('Minting USDC to signers...');
    await USDC.connect(initialOwner).faucet(1000);
    await USDC.connect(addrA).faucet(1000);
    await USDC.connect(addrB).faucet(1000);
    console.log('initialOwner USDC Balance: ', (await USDC.balanceOf(initialOwner.address)).toString());
    console.log('addrA USDC Balance: ', (await USDC.balanceOf(addrA.address)).toString());
    console.log('addrB USDC Balance: ', (await USDC.balanceOf(addrB.address)).toString());
    console.log();

    console.log('Deploying ArtNFTV1 Implementation and Proxy Contract...');
    const ArtNFTV1 = await ethers.getContractFactory('ArtNFTV1');
    let Proxy = await upgrades.deployProxy(ArtNFTV1, [initialOwner.address, await USDC.getAddress()], { kind: 'uups' });
    console.log('ArtNFTV1 Implementation Contract: ', await upgrades.erc1967.getImplementationAddress(await Proxy.getAddress()));
    console.log('Proxy Contract: ', await Proxy.getAddress());
    console.log();

    console.log('initialOwner adding 2 copies of a painting worth 100 USDC each...');
    await Proxy.connect(initialOwner).safeMint('ipfs://QmcFirhjuxSEEPEbiUVQkHktm8DLdqjAiySnVTcRSbH3D9', 2, 50);
    console.log('Copy 1 ID: ', 0);
    console.log('Copy 1 URI: ', await Proxy.tokenURI(0));
    console.log('Copy 2 ID: ', 1);
    console.log('Copy 2 URI: ', await Proxy.tokenURI(1));
    console.log('Proxy Contract Owned NFT Count: ', (await Proxy.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner Owned NFT Count: ', (await Proxy.balanceOf(initialOwner.address)).toString());
    console.log('addrA Owned NFTs Count: ', (await Proxy.balanceOf(addrA.address)).toString());
    console.log('addrB Owned NFTs Count: ', (await Proxy.balanceOf(addrB.address)).toString());
    console.log();

    console.log('addrA buying one of the paintings...');
    await USDC.connect(addrA).approve(await Proxy.getAddress(), 100);
    await Proxy.connect(addrA).purchaseToken(0, 100);
    console.log('Proxy Contract USDC Balance: ', (await USDC.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner USDC Balance: ', (await USDC.balanceOf(initialOwner.address)).toString());
    console.log('addrA USDC Balance: ', (await USDC.balanceOf(addrA.address)).toString());
    console.log('addrB USDC Balance: ', (await USDC.balanceOf(addrB.address)).toString());
    console.log('Proxy Contract Owned NFT Count: ', (await Proxy.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner Owned NFT Count: ', (await Proxy.balanceOf(initialOwner.address)).toString());
    console.log('addrA Owned NFTs Count: ', (await Proxy.balanceOf(addrA.address)).toString());
    console.log('addrB Owned NFTs Count: ', (await Proxy.balanceOf(addrB.address)).toString());
    console.log();

    console.log('addrB buying the other painting...');
    await USDC.connect(addrB).approve(await Proxy.getAddress(), 100);
    await Proxy.connect(addrB).purchaseToken(1, 100);
    console.log('Proxy Contract USDC Balance: ', (await USDC.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner USDC Balance: ', (await USDC.balanceOf(initialOwner.address)).toString());
    console.log('addrA USDC Balance: ', (await USDC.balanceOf(addrA.address)).toString());
    console.log('addrB USDC Balance: ', (await USDC.balanceOf(addrB.address)).toString());
    console.log('Proxy Contract Owned NFT Count: ', (await Proxy.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner Owned NFT Count: ', (await Proxy.balanceOf(initialOwner.address)).toString());
    console.log('addrA Owned NFTs Count: ', (await Proxy.balanceOf(addrA.address)).toString());
    console.log('addrB Owned NFTs Count: ', (await Proxy.balanceOf(addrB.address)).toString());
    console.log();

    console.log('initialOwner withdrawing USDC from Proxy Contract...');
    await Proxy.connect(initialOwner).claimContractUSDC();
    console.log('Proxy Contract USDC Balance: ', (await USDC.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner USDC Balance: ', (await USDC.balanceOf(initialOwner.address)).toString());
    console.log('addrA USDC Balance: ', (await USDC.balanceOf(addrA.address)).toString());
    console.log('addrB USDC Balance: ', (await USDC.balanceOf(addrB.address)).toString());
    console.log();

    console.log('initialOwner upgrading to ArtNFTV2...');
    const ArtNFTV2Factory = await ethers.getContractFactory('ArtNFTV2');
    Proxy = await upgrades.upgradeProxy(await Proxy.getAddress(), ArtNFTV2Factory);
    console.log('ArtNFTV2 Implementation Contract: ', await upgrades.erc1967.getImplementationAddress(await Proxy.getAddress()));
    console.log('Proxy Contract: ', await Proxy.getAddress());
    console.log();

    console.log('initialOwner adding a different painting worth 500 USDC...');
    await Proxy.connect(initialOwner).safeMint('ipfs://QmTGqFfN3Hxh2ccbtWenjeVjDJ17wmVgTyjcbrHFMvouAG', 1, 500);
    console.log('Copy 3 ID: ', 2);
    console.log('Copy 3 URI: ', await Proxy.tokenURI(2));
    console.log('Proxy Contract Owned NFT Count: ', (await Proxy.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner Owned NFT Count: ', (await Proxy.balanceOf(initialOwner.address)).toString());
    console.log('addrA Owned NFTs Count: ', (await Proxy.balanceOf(addrA.address)).toString());
    console.log('addrB Owned NFTs Count: ', (await Proxy.balanceOf(addrB.address)).toString());
    console.log();

    console.log('initialOwner applies 50% discount on the painting...');
    await Proxy.connect(initialOwner).apply50PercentDiscount(2);
    console.log();

    console.log('addrA buying the painting...');
    await USDC.connect(addrA).approve(await Proxy.getAddress(), 250);
    await Proxy.connect(addrA).purchaseToken(2, 250);
    console.log('Proxy Contract USDC Balance: ', (await USDC.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner USDC Balance: ', (await USDC.balanceOf(initialOwner.address)).toString());
    console.log('addrA USDC Balance: ', (await USDC.balanceOf(addrA.address)).toString());
    console.log('addrB USDC Balance: ', (await USDC.balanceOf(addrB.address)).toString());
    console.log('Proxy Contract Owned NFT Count: ', (await Proxy.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner Owned NFT Count: ', (await Proxy.balanceOf(initialOwner.address)).toString());
    console.log('addrA Owned NFTs Count: ', (await Proxy.balanceOf(addrA.address)).toString());
    console.log('addrB Owned NFTs Count: ', (await Proxy.balanceOf(addrB.address)).toString());
    console.log();

    console.log('initialOwner withdrawing USDC from Proxy Contract...');
    await Proxy.connect(initialOwner).claimContractUSDC();
    console.log('Proxy Contract USDC Balance: ', (await USDC.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner USDC Balance: ', (await USDC.balanceOf(initialOwner.address)).toString());
    console.log('addrA USDC Balance: ', (await USDC.balanceOf(addrA.address)).toString());
    console.log('addrB USDC Balance: ', (await USDC.balanceOf(addrB.address)).toString());
    console.log();

    console.log('addrB changing the price of its painting to 650 USDC...');
    await Proxy.connect(addrB).setTokenPrice(1, 650);
    console.log();

    console.log('addrA buying addrB\'s painting...');
    await USDC.connect(addrA).approve(await Proxy.getAddress(), 650);
    await Proxy.connect(addrA).purchaseToken(1, 650);
    console.log('Proxy Contract USDC Balance: ', (await USDC.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner USDC Balance: ', (await USDC.balanceOf(initialOwner.address)).toString());
    console.log('addrA USDC Balance: ', (await USDC.balanceOf(addrA.address)).toString());
    console.log('addrB USDC Balance: ', (await USDC.balanceOf(addrB.address)).toString());
    console.log('Proxy Contract Owned NFT Count: ', (await Proxy.balanceOf(await Proxy.getAddress())).toString());
    console.log('initialOwner Owned NFT Count: ', (await Proxy.balanceOf(initialOwner.address)).toString());
    console.log('addrA Owned NFTs Count: ', (await Proxy.balanceOf(addrA.address)).toString());
    console.log('addrB Owned NFTs Count: ', (await Proxy.balanceOf(addrB.address)).toString());
    console.log();
  });
});