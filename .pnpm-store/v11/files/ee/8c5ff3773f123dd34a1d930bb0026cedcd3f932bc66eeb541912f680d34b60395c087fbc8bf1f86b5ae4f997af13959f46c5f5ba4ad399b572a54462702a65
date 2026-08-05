import { ComponentProps, ReactNode } from "react";
//#region src/layouts/glass/slots/sidebar.d.ts
interface SidebarProviderProps {
  /** @default true */
  collapsible?: boolean;
  children: ReactNode;
}
declare function SidebarProvider({ children, collapsible }: SidebarProviderProps): import("react").JSX.Element;
declare function useSidebar(): {
  collapsible: boolean;
  collapsed: boolean;
  setCollapsed: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
interface SidebarDrawerProps {
  contentProps?: ComponentProps<'div'>;
}
declare function SidebarDrawer({ contentProps }: SidebarDrawerProps): import("react").JSX.Element;
type SidebarProps = ComponentProps<'aside'>;
declare function Sidebar({ className, children, ...props }: SidebarProps): import("react").JSX.Element;
//#endregion
export { Sidebar, SidebarDrawer, SidebarDrawerProps, SidebarProps, SidebarProvider, SidebarProviderProps, useSidebar };