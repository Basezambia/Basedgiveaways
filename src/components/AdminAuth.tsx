'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignMessage, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { minikitConfig } from '../../minikit.config';

interface AdminUser {
  id: string;
  username: string;
  role: string;
  walletAddress: string;
}

interface AdminAuthProps {
  onLoginAction: (user: AdminUser, token: string) => void;
}

export default function AdminAuth({ onLoginAction }: AdminAuthProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const { address, isConnected } = useAccount();
  const { signMessage } = useSignMessage();
  const { connect } = useConnect();

  const ALLOWED_ADMIN_ADDRESS = minikitConfig.baseBuilder.allowedAddresses[0];

  useEffect(() => {
    if (isConnected && address) {
      // Check if connected wallet is the admin wallet
      if (address.toLowerCase() !== ALLOWED_ADMIN_ADDRESS.toLowerCase()) {
        setError('This wallet is not authorized for admin access. Please connect with the authorized admin wallet.');
      } else {
        setError('');
        setAuthMessage(`Connected as admin: ${address.slice(0, 6)}...${address.slice(-4)}`);
      }
    }
  }, [address, isConnected, ALLOWED_ADMIN_ADDRESS]);

  const handleWalletConnect = async () => {
    try {
      setError('');
      connect({ connector: injected() });
    } catch (error) {
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const handleAdminLogin = async () => {
    if (!address || !isConnected) {
      setError('Please connect your wallet first.');
      return;
    }

    if (address.toLowerCase() !== ALLOWED_ADMIN_ADDRESS.toLowerCase()) {
      setError('Unauthorized wallet address. Only the admin wallet can access this panel.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const message = `Admin authentication for Base Giveaway\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      
      const signature = await signMessage({ message });

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message
        })
      });

      const data = await response.json();

      if (response.ok) {
        onLoginAction(data.user, data.token);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (error: any) {
      if (error.message?.includes('User rejected')) {
        setError('Signature rejected. Please sign the message to authenticate.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect your authorized wallet to access the admin panel
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {/* Wallet Connection Status */}
          <div className="text-center">
            {isConnected && address ? (
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Wallet Connected
                </div>
                {authMessage && (
                  <p className="text-sm text-gray-600">{authMessage}</p>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Wallet Not Connected
              </div>
            )}
          </div>

          {/* Admin Wallet Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-blue-400">ℹ️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin Wallet Required
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Only the authorized admin wallet can access this panel:</p>
                  <p className="font-mono text-xs mt-1 break-all">
                    {ALLOWED_ADMIN_ADDRESS}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {!isConnected ? (
              <button
                onClick={handleWalletConnect}
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </div>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            ) : (
              <button
                onClick={handleAdminLogin}
                disabled={loading || address?.toLowerCase() !== ALLOWED_ADMIN_ADDRESS.toLowerCase()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Sign Message & Login'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}