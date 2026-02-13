import { useModal } from '@/components/ui/modal';
import { Route } from '@/constants';
import { WalletDetailsModal } from '@/features/auth/components/modals/wallet-details-modal';
import { authStore } from '@/stores/auth.store';
import { useProjectsStore } from '@/stores/projects.store';
import { useStudioUIStore } from '@/stores/studio-ui.store';
import { useUIStore } from '@/stores/ui.store';
import { usePrivy as useWallet } from '@privy-io/react-auth';
import {
  Download,
  Eye,
  Layers,
  LogOut,
  MessageSquare,
  Network,
  Settings,
  Wallet as WalletIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const StudioHeader = () => {
  const router = useRouter();

  // Stores
  const { currentSession, currentProject } = useProjectsStore();
  const { isMobile } = useUIStore();
  const {
    showMobileSidebar,
    showMobileSettings,
    showChat,
    showSettings,
    toggleMobileSidebar,
    toggleChat,
    toggleSettings,
    setStudioState,
  } = useStudioUIStore();

  const {
    login: connectWallet,
    logout: disconnectWallet,
    authenticated,
    user: walletUser,
    ready,
  } = useWallet();

  const [presentWalletDetails] = useModal(WalletDetailsModal);

  const walletAddress = walletUser?.wallet?.address;
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  const handleOpenWalletModal = () => {
    if (!walletAddress) return;
    presentWalletDetails({
      address: walletAddress,
      onDisconnect: disconnectWallet,
    });
  };

  const exportCount = currentSession
    ? currentSession.pages.filter((p) => p.markedForExport).length
    : (currentProject?.pages || []).filter((p) => p.markedForExport).length;

  const handleLogout = () => {
    authStore.clear();
    authStore.setError(null);
    toast.success('Signed out successfully');
    router.push(Route.LOGIN);
  };

  return (
    <header className="h-14 sm:h-16 border-b border-zinc-800/50 bg-zinc-950/95 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 lg:px-8 shrink-0 shadow-lg shadow-black/20 sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 min-w-0 flex-1">
        <Link
          href={Route.HOME}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-lg border border-zinc-800/50 bg-white/5 flex items-center justify-center ring-1 ring-zinc-700/30">
            <Image
              src="/logo.png"
              alt="Manga Studio logo"
              fill
              className="object-contain p-1"
              sizes="(max-width: 640px) 32px, 40px"
            />
          </div>
          <h1 className="text-sm sm:text-base lg:text-xl font-manga text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] hidden sm:block">
            MANGA STUDIO
          </h1>
        </Link>
        {currentSession && (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-zinc-900/60 rounded-lg border border-zinc-800/60 backdrop-blur-sm shadow-sm ring-1 ring-zinc-700/20 shrink-0 min-w-0">
            <Layers
              size={12}
              className="sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0"
            />
            <span
              className="text-[10px] sm:text-xs font-semibold text-zinc-200 truncate"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {currentSession.name}
            </span>
            <span className="text-[9px] sm:text-[10px] text-zinc-500 font-medium shrink-0">
              ({currentSession.pages.length})
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
        {isMobile && (
          <>
            <button
              onClick={() => {
                toggleMobileSidebar();
                setStudioState({ showMobileSettings: false });
              }}
              className="p-2.5 rounded-lg hover:bg-zinc-800/60 active:bg-zinc-800 transition-all active:scale-95 touch-manipulation"
              title="Sessions"
            >
              <Layers size={20} className="text-zinc-300" />
            </button>
            <button
              onClick={() => {
                setStudioState({
                  showMobileSettings: !showMobileSettings,
                  showMobileSidebar: false,
                });
              }}
              className="p-2.5 rounded-lg hover:bg-zinc-800/60 active:bg-zinc-800 transition-all active:scale-95 touch-manipulation"
              title="Generate"
            >
              <Settings size={20} className="text-zinc-300" />
            </button>
          </>
        )}
        <button
          onClick={toggleChat}
          className="p-2 sm:p-2.5 rounded-lg hover:bg-zinc-800/60 active:bg-zinc-800 transition-all relative group touch-manipulation"
          title="Chat History"
        >
          <MessageSquare
            size={18}
            className="sm:w-5 sm:h-5 text-zinc-300 group-hover:text-amber-400 transition-colors"
          />
          {currentSession &&
            currentSession.chatHistory &&
            currentSession.chatHistory.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-linear-to-br from-amber-400 to-amber-600 rounded-full text-[9px] flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/30 ring-2 ring-zinc-900">
                {currentSession.chatHistory.length}
              </span>
            )}
        </button>
        {!isMobile && (
          <button
            onClick={toggleSettings}
            className="p-2 rounded-lg hover:bg-zinc-800/60 transition-all group"
            title="Settings"
          >
            <Settings
              size={20}
              className="text-zinc-400 group-hover:text-amber-400 transition-colors"
            />
          </button>
        )}
        <div className="h-6 sm:h-8 w-px bg-zinc-800/50 mx-1 sm:mx-2" />

        {/* Web3 Wallet Integration */}
        <div className="flex items-center">
          {ready && authenticated ? (
            <div className="flex items-center gap-2 group">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 leading-none mb-1">
                  <Network size={10} />
                  POLKADOT HUB TESTNET
                </span>
                <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                  {shortAddress}
                </span>
              </div>
              <button
                onClick={handleOpenWalletModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700/50 hover:border-amber-500/50 rounded-lg transition-all shadow-sm ring-1 ring-zinc-700/20"
                title="Wallet Details"
              >
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-[10px]">
                  {shortAddress.slice(0, 2).toUpperCase()}
                </div>
                <WalletIcon
                  size={14}
                  className="text-zinc-400 group-hover:text-amber-400 transition-colors"
                />
              </button>
            </div>
          ) : (
            <button
              onClick={() => connectWallet()}
              disabled={!ready}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-900 border border-amber-500/30 hover:border-amber-500 text-amber-400 hover:text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <WalletIcon size={14} className="group-hover:animate-bounce" />
              <span className="hidden sm:inline">CONNECT WALLET</span>
              <span className="sm:hidden">WALLET</span>
            </button>
          )}
        </div>

        <div className="h-6 sm:h-8 w-px bg-zinc-800/50" />
        <button
          onClick={() => router.push(Route.STUDIO_PREVIEW)}
          className="px-2.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 bg-linear-to-b from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black rounded-lg font-bold text-[10px] sm:text-xs lg:text-sm flex items-center gap-1 sm:gap-1.5 lg:gap-2 transition-all shadow-[0_3px_0_0_rgb(180,83,9)] hover:shadow-[0_3px_0_0_rgb(180,83,9)] active:shadow-[0_1px_0_0_rgb(180,83,9)] active:translate-y-0.5 hover:scale-105 touch-manipulation"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <Eye size={12} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
          <span className="hidden sm:inline">PREVIEW</span>
          <span className="sm:hidden font-bold">({exportCount})</span>
          {exportCount > 0 && (
            <span className="hidden sm:inline text-[10px] lg:text-xs ml-0.5">
              ({exportCount})
            </span>
          )}
        </button>
        <button
          onClick={() => router.push(`${Route.STUDIO_PREVIEW}?autoDownload=1`)}
          className="hidden sm:flex px-3 lg:px-4 py-1.5 bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg text-xs lg:text-sm font-semibold items-center gap-1.5 hover:bg-zinc-800 hover:border-zinc-500 transition-all"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <Download size={14} className="lg:w-4 lg:h-4" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={handleLogout}
          className="p-2 sm:p-2.5 rounded-lg hover:bg-zinc-800/60 active:bg-zinc-800 transition-all group touch-manipulation"
          title="Sign Out"
        >
          <LogOut
            size={18}
            className="sm:w-5 sm:h-5 text-zinc-300 group-hover:text-red-400 transition-colors"
          />
        </button>
      </div>
    </header>
  );
};
