import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import OverviewPage from "./OverviewPage";
import {
  LayoutDashboard,
  FolderGit2,
  Settings,
  Code2,
  LogOut,
  Bot,
  Home
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SettingPage from "@/components/SettingPage";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";

import api from "@/api/api";

import Repositories from "./Repositories";




// =====================================================
// DASHBOARD
// =====================================================

const Dashboard = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();


  // ===================================================
  // ACTIVE PAGE
  // ===================================================

  // Repositories is shown first
  const [activePage, setActivePage] =
    useState("repositories");


  // ===================================================
  // GET LOGGED-IN USER
  // ===================================================

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({

    queryKey: ["me"],

    queryFn: () =>
      api.get("/auth/me"),

    retry: false,

  });


  // ===================================================
  // NAVIGATION
  // ===================================================

  const handlePageChange = (page) => {

    setActivePage(page);

  };


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {

    try {

      await api.post("/auth/logout");

      // Remove user from React Query cache
      queryClient.removeQueries({
        queryKey: ["me"],
      });

      // Go to landing page
      navigate("/", {
        replace: true,
      });

    } catch (error) {

      console.error(
        "❌ Logout failed:",
        error
      );

    }

  };


  // ===================================================
  // RENDER PAGE
  // ===================================================

  const renderActivePage = () => {

    switch (activePage) {

      case "repositories":

        return (
          <Repositories />
        );


      case "overview":

        return (
          <OverviewPage
            onBack={() =>
              setActivePage("overview")
            }
          />
        );



      case "settings":
          return (
          <SettingPage
            onBack={() =>
              setActivePage("settings")
            }
          />
        );

       

      default:

        return (
          <Repositories />
        );

    }

  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <SidebarProvider>

      <div
        className="
          flex
          min-h-screen
          w-full
          bg-background
        "
      >

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <Sidebar
          variant="sidebar"
          collapsible="offcanvas"
        >

          {/* ================================================= */}
          {/* LOGO */}
          {/* ================================================= */}

          <SidebarHeader>

            <div
              className="
                flex
                items-center
                gap-2
                px-2
                py-2
              "
            >

              {/* <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-gradient-to-br
                  from-violet-600
                  to-blue-600
                  text-white
                "
              >

                <Code2 className="h-4 w-4" />

              </div> */}


              <div className="flex flex-col">

                  {/* DevPilot Logo */}
                   <div className="flex items-center gap-2">
                     
                                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
                                    <Bot className="h-4.5 w-4.5" />
                      
                                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                                  </div>
                      
                    
               
                     <span className="text-lg font-bold tracking-tight">
                       DevPilot
                     </span>
                   </div>
               

                <span
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  Chat with your code
                </span>

              </div>

            </div>

          </SidebarHeader>


          <Separator />


          {/* ================================================= */}
          {/* SIDEBAR CONTENT */}
          {/* ================================================= */}

          <SidebarContent>

            {/* ================================================= */}
            {/* WORKSPACE */}
            {/* ================================================= */}

            <SidebarGroup>

              <SidebarGroupLabel
                className="
                  px-3
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                Workspace
              </SidebarGroupLabel>


              <SidebarGroupContent>

                <SidebarMenu className="gap-2">

                  {/* ========================================= */}
                  {/* OVERVIEW */}
                  {/* ========================================= */}

                  <SidebarMenuItem>

                    <SidebarMenuButton
                      className={`
                        h-11
                        px-3
                        text-base
                        font-medium
                        ${
                          activePage === "overview"
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : ""
                        }
                      `}
                      onClick={() =>
                        handlePageChange(
                          "overview"
                        )
                      }
                    >

                      <LayoutDashboard
                        className="
                          h-5
                          w-5
                          shrink-0
                        "
                      />

                      <span>
                        Overview
                      </span>

                    </SidebarMenuButton>

                  </SidebarMenuItem>


                  {/* ========================================= */}
                  {/* REPOSITORIES */}
                  {/* ========================================= */}

                  <SidebarMenuItem>

                    <SidebarMenuButton
                      className={`
                        h-11
                        px-3
                        text-base
                        font-medium
                        ${
                          activePage === "repositories"
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : ""
                        }
                      `}
                      onClick={() =>
                        handlePageChange(
                          "repositories"
                        )
                      }
                    >

                      <FolderGit2
                        className="
                          h-5
                          w-5
                          shrink-0
                        "
                      />

                      <span>
                        Repositories
                      </span>

                    </SidebarMenuButton>

                  </SidebarMenuItem>

                </SidebarMenu>

              </SidebarGroupContent>

            </SidebarGroup>


            {/* ================================================= */}
            {/* ACCOUNT */}
            {/* ================================================= */}

            <SidebarGroup className="mt-4">

              <SidebarGroupLabel
                className="
                  px-3
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                Account
              </SidebarGroupLabel>


              <SidebarGroupContent>

                <SidebarMenu>

                  {/* ========================================= */}
                  {/* SETTINGS */}
                  {/* ========================================= */}

                  <SidebarMenuItem>

                    <SidebarMenuButton
                      className={`
                        h-11
                        px-3
                        text-base
                        font-medium
                        ${
                          activePage === "settings"
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : ""
                        }
                      `}
                      onClick={() =>
                        handlePageChange(
                          "settings"
                        )
                      }
                    >

                      <Settings
                        className="
                          h-5
                          w-5
                          shrink-0
                        "
                      />

                      <span>
                        Settings
                      </span>

                    </SidebarMenuButton>

                  </SidebarMenuItem>

                </SidebarMenu>

              </SidebarGroupContent>

            </SidebarGroup>

          </SidebarContent>


          {/* ================================================= */}
          {/* USER FOOTER */}
          {/* ================================================= */}

          <SidebarFooter>

            {isLoading ? (

              <div
                className="
                  px-2
                  py-2
                  text-sm
                  text-muted-foreground
                "
              >
                Loading...
              </div>

            ) : isError ? (

              <div
                className="
                  px-2
                  py-2
                  text-sm
                  text-destructive
                "
              >
                Unable to load user
              </div>

            ) : (

              <SidebarMenu>

                <SidebarMenuItem>

                  <DropdownMenu>

                    {/* ======================================= */}
                    {/* USER */}
                    {/* ======================================= */}

                    <DropdownMenuTrigger asChild>

                      <SidebarMenuButton
                        size="lg"
                        className="
                          hover:bg-sidebar-accent
                        "
                      >

                        <Avatar className="h-9 w-9">

                          <AvatarImage
                            src={user?.avatarUrl}
                            alt={
                              user?.displayName
                            }
                          />

                          <AvatarFallback>
                            {user?.displayName
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </AvatarFallback>

                        </Avatar>


                        <div
                          className="
                            flex
                            min-w-0
                            flex-1
                            flex-col
                            text-left
                          "
                        >

                          <span
                            className="
                              truncate
                              text-sm
                              font-medium
                            "
                          >
                            {user?.displayName}
                          </span>

                          <span
                            className="
                              truncate
                              text-xs
                              text-muted-foreground
                            "
                          >
                            @{user?.githubUsername}
                          </span>

                        </div>

                      </SidebarMenuButton>

                    </DropdownMenuTrigger>


                    {/* ======================================= */}
                    {/* DROPDOWN */}
                    {/* ======================================= */}

                    <DropdownMenuContent
                      side="top"
                      align="start"
                      className="
                        w-[--radix-dropdown-menu-trigger-width]
                        min-w-56
                      "
                    >

<DropdownMenuItem
  onClick={() => navigate("/")}
  className="flex items-center gap-2 cursor-pointer"
>
  <Home className="h-4 w-4" />
  <span>Home</span>
</DropdownMenuItem>

                      <DropdownMenuSeparator />


                      <DropdownMenuItem
                        onClick={
                          handleLogout
                        }
                        className="
                          cursor-pointer
                          text-destructive
                          focus:text-destructive
                        "
                      >

                        <LogOut
                          className="
                            mr-2
                            h-4
                            w-4
                          "
                        />

                        Logout

                      </DropdownMenuItem>

                    </DropdownMenuContent>

                  </DropdownMenu>

                </SidebarMenuItem>

              </SidebarMenu>

            )}

          </SidebarFooter>

        </Sidebar>


        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <main
          className="
            flex
            min-w-0
            flex-1
            flex-col
            bg-background
          "
        >

          {/* ================================================= */}
          {/* TOP BAR */}
          {/* ================================================= */}

          <div
            className="
              flex
              h-12
              shrink-0
              items-center
              border-b
              px-4
            "
          >

            <SidebarTrigger />

          </div>


          {/* ================================================= */}
          {/* PAGE CONTENT */}
          {/* ================================================= */}

          <div
            className="
              min-h-0
              flex-1
              overflow-auto
            "
          >

            {renderActivePage()}

          </div>

        </main>

      </div>

    </SidebarProvider>

  );

};


export default Dashboard;