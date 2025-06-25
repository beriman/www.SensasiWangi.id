import { useNavigate } from "react-router-dom";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SearchBar } from "./search-bar";
import { LanguageToggle } from "./language-toggle";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu, ChevronDown, Bell } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    signOut();
    setShowLogoutConfirm(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const currentUser = useQuery(
    api.users.getUserByToken,
    user ? { tokenIdentifier: user.id } : "skip",
  );

  const notifications = useQuery(
    api.notifications.getNotifications,
    currentUser ? { userId: currentUser._id } : "skip",
  );

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  useEffect(() => {
    if (user) {
      createOrUpdateUser({});
    }
  }, [user, createOrUpdateUser]);

  return (
    <nav className="sticky top-0 w-full neumorphic-card border-0 z-50 mx-4 mt-4 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-base font-medium text-[#1D1D1F]">
              SensasiWangi.id
            </span>
          </Link>

          {/* Desktop Menu - Horizontal */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
            <Link
              to="/forum"
              className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4z"
                />
              </svg>
              Forum
            </Link>
            <Link
              to="/marketplace"
              className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
                />
              </svg>
              Marketplace
            </Link>
            <Link
              to="/kursus"
              className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Kursus
            </Link>
            <Link
              to="/database"
              className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                />
              </svg>
              Database
            </Link>
            <Button
              onClick={handleDashboard}
              className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Dashboard
            </Button>
            <Link
              to="/login"
              className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                />
              </svg>
              Login
            </Link>
          </div>

          {/* Mobile Menu - Dropdown */}
          <div className="md:hidden flex-1 flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="neumorphic-button-sm inline-flex items-center px-4 py-2 text-sm font-medium text-[#1D1D1F] bg-transparent transition-all duration-200 border-0 shadow-none hover:scale-105 active:scale-95">
                  <Menu className="w-4 h-4 mr-2" />
                  Menu
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="neumorphic-card border-0 shadow-none min-w-[200px]"
                align="center"
              >
                <DropdownMenuLabel className="text-[#1D1D1F] font-semibold">
                  Navigasi
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#E5E5E7]" />
                <DropdownMenuItem asChild>
                  <Link
                    to="/forum"
                    className="flex items-center px-2 py-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4z"
                      />
                    </svg>
                    Forum
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/marketplace"
                    className="flex items-center px-2 py-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
                      />
                    </svg>
                    Marketplace
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/kursus"
                    className="flex items-center px-2 py-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Kursus
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/database"
                    className="flex items-center px-2 py-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>
                    Database
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDashboard}>
                  <div className="flex items-center px-2 py-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Dashboard
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/login"
                    className="flex items-center px-2 py-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                      />
                    </svg>
                    Login
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoaded ? (
            <div className="flex items-center gap-4">
              <SearchBar />
              <LanguageToggle />
              <Authenticated>
                {/* Notification Bell */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="neumorphic-button-sm border-0 shadow-none bg-transparent relative"
                  >
                    <Bell className="w-5 h-5 text-[#1D1D1F]" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full animate-pulse"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <Button onClick={() => setShowLogoutConfirm(true)}>
                    Logout
                  </Button>
                </div>
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="neumorphic-button-sm border-0 shadow-none bg-transparent"
                      >
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="pt-10 flex flex-col space-y-4 neumorphic-bg"
                    >
                      <Link
                        to="/forum"
                        className="neumorphic-button-sm w-full text-left"
                      >
                        Forum
                      </Link>
                      <Link
                        to="/marketplace"
                        className="neumorphic-button-sm w-full text-left"
                      >
                        Marketplace
                      </Link>
                      <Link
                        to="/kursus"
                        className="neumorphic-button-sm w-full text-left"
                      >
                        Kursus
                      </Link>
                      <Link
                        to="/database"
                        className="neumorphic-button-sm w-full text-left"
                      >
                        Database
                      </Link>
                      <Button
                        onClick={handleDashboard}
                        className="neumorphic-button-sm w-full text-left"
                      >
                        Dashboard
                      </Button>
                      <Button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="neumorphic-button-sm w-full text-left"
                      >
                        Logout
                      </Button>
                    </SheetContent>
                  </Sheet>
                </div>
              </Authenticated>
              <Unauthenticated>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </Unauthenticated>
            </div>
          ) : (
            <></>
          )}

          {/* Logout Confirmation Dialog */}
          <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Logout</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin logout?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Batal
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
