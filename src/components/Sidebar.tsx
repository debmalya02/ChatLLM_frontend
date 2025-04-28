import {
  Plus,
  MessageSquare,
  Settings,
  Moon,
  Sun,
  Laptop,
  Check,
  Loader2,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { ConversationList } from "./ConversationList";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import supabase from "../supabase";
import { useIsMobile } from "../hooks/use-mobile";
import { useState } from "react";
import { toast } from "sonner";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const {
    user,
    setUser,
    addConversation,
    setCurrentConversation,
    userPreferences,
    updateUserPreferences,
  } = useStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/auth");
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    updateUserPreferences({ theme });
  };

  const handleAddConversation = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const newId = await addConversation();
      if (newId) {
        setCurrentConversation(newId);
        if (isMobile && onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to create new conversation. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const sidebarContent = (
    <ShadcnSidebar variant="floating" className="border-r border-border">
      <SidebarHeader>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              NexusAI
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleAddConversation}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ConversationList onConversationSelect={onClose} />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {userPreferences.theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : userPreferences.theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Laptop className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleThemeChange("light")}
                className="flex justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </div>
                {userPreferences.theme === "light" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleThemeChange("dark")}
                className="flex justify-between"
              >
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </div>
                {userPreferences.theme === "dark" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleThemeChange("system")}
                className="flex justify-between"
              >
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  <span>System</span>
                </div>
                {userPreferences.theme === "system" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <img
                  src={
                    user?.user_metadata?.avatar_url ||
                    "https://github.com/shadcn.png"
                  }
                  alt={user?.email || "User avatar"}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );

  // For mobile, we use Sheet component
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // For desktop, we use the regular sidebar
  return (
    <SidebarProvider>
      <ShadcnSidebar className="border-r">{sidebarContent}</ShadcnSidebar>
    </SidebarProvider>
  );
}
