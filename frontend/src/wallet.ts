// Wallet connection utilities
export interface WalletInfo {
  address: string;
  chainId: string;
  isConnected: boolean;
}

export class WalletManager {
  private static instance: WalletManager;
  private walletInfo: WalletInfo | null = null;
  private listeners: ((wallet: WalletInfo | null) => void)[] = [];

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  // Check if we're in a browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Check if Linera wallet is available
  async isLineraWalletAvailable(): Promise<boolean> {
    if (!this.isBrowser()) return false;
    
    // Check for Linera wallet extension
    return !!(window as any).linera;
  }

  // Connect to Linera wallet
  async connectWallet(): Promise<WalletInfo> {
    if (!this.isBrowser()) {
      throw new Error('Wallet connection not available in server environment');
    }

    try {
      // Check if Linera wallet is available
      if (!(window as any).linera) {
        throw new Error('Linera wallet not found. Please install the Linera wallet extension.');
      }

      // Request wallet connection
      const accounts = await (window as any).linera.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      const chainId = await (window as any).linera.request({
        method: 'eth_chainId',
      });

      this.walletInfo = {
        address,
        chainId,
        isConnected: true,
      };

      // Notify listeners
      this.notifyListeners();

      return this.walletInfo;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnectWallet(): Promise<void> {
    this.walletInfo = null;
    this.notifyListeners();
  }

  // Get current wallet info
  getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.walletInfo?.isConnected || false;
  }

  // Add wallet change listener
  addListener(callback: (wallet: WalletInfo | null) => void): void {
    this.listeners.push(callback);
  }

  // Remove wallet change listener
  removeListener(callback: (wallet: WalletInfo | null) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.walletInfo));
  }

  // Sign a message
  async signMessage(message: string): Promise<string> {
    if (!this.walletInfo?.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await (window as any).linera.request({
        method: 'personal_sign',
        params: [message, this.walletInfo.address],
      });

      return signature;
    } catch (error) {
      console.error('Message signing failed:', error);
      throw error;
    }
  }

  // Send transaction
  async sendTransaction(transaction: any): Promise<string> {
    if (!this.walletInfo?.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const txHash = await (window as any).linera.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      });

      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const walletManager = WalletManager.getInstance();

// Declare global window interface for TypeScript
declare global {
  interface Window {
    linera?: {
      request: (params: any) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
  }
}
