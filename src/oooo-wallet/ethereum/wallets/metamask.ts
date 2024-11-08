import { EthereumWallet } from './ethereum'

export class MetamaskWallet extends EthereumWallet {
  async disconnect () {
    void this.provider?.removeAllListeners()
    try {
      /**
       * only metamask support wallet_revokePermissions method
       */
      await this.provider.request({
        method: 'wallet_revokePermissions',
        params: [
          {
            eth_accounts: {}
          }
        ]
      })
    } catch (e) {}
  }
}
