import { BaseSlots, BaseSlotsProps } from "../shared/client.js";
import { BaseLayoutProps, GetLayoutTabsOptions, LayoutTab, LinkItemType } from "../shared/index.js";
import { SidebarDrawerProps, SidebarProps, SidebarProviderProps, useSidebar } from "./slots/sidebar.js";
import { HeaderProps } from "./slots/header.js";
import { FC } from "react";
import * as PageTree from "fumadocs-core/page-tree";
//#region src/layouts/glass/index.d.ts
interface GlassSlots extends BaseSlots {
  header: FC<HeaderProps>;
  sidebar: {
    main: FC<SidebarProps>;
    provider: FC<SidebarProviderProps>;
    use: typeof useSidebar;
    drawer: FC<SidebarDrawerProps>;
  };
}
interface GlassLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  tabs?: LayoutTab[] | GetLayoutTabsOptions | false;
  aiChat?: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
  };
  slots?: Partial<GlassSlots>;
  sidebar?: Omit<SidebarProviderProps, 'children'>;
}
interface SlotsProps extends BaseSlotsProps<GlassLayoutProps> {
  tabs: LayoutTab[];
  aiChat?: GlassLayoutProps['aiChat'];
}
declare function useGlassLayout(): {
  props: SlotsProps;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: GlassSlots;
};
declare function GlassLayout(props: GlassLayoutProps): import("react").JSX.Element;
//#endregion
export { GlassLayout, GlassLayoutProps, GlassSlots, useGlassLayout };