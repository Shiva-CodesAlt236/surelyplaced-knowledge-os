import { MarkdownCopyButton, ViewOptionsPopover } from "../../shared/page-actions.js";
import { TOCProps } from "./slots/toc.js";
import { ComponentProps } from "react";
import { TOCItemType } from "fumadocs-core/toc";
//#region src/layouts/glass/page/index.d.ts
interface DocsPageProps extends ComponentProps<'article'> {
  toc?: TOCItemType[];
  /**
   * Extend the page to fill all available space
   *
   * @defaultValue false
   */
  full?: boolean | undefined;
  tableOfContent?: TOCProps;
}
declare function useDocsPage(): {
  full: boolean;
};
declare function DocsPage({ full, toc, tableOfContent, children }: DocsPageProps): import("react").JSX.Element;
declare function EditOnGitHub(props: ComponentProps<'a'>): import("react").JSX.Element;
/**
 * Add typography styles
 */
declare function DocsBody({ children, className, ...props }: ComponentProps<'div'>): import("react").JSX.Element;
declare function DocsDescription({ children, className, ...props }: ComponentProps<'p'>): import("react").JSX.Element | null;
declare function DocsTitle({ children, className, ...props }: ComponentProps<'h1'>): import("react").JSX.Element;
declare function PageLastUpdate({ date: value, ...props }: Omit<ComponentProps<'p'>, 'children'> & {
  date: Date;
}): import("react").JSX.Element;
//#endregion
export { DocsBody, DocsDescription, DocsPage, DocsPageProps, DocsTitle, EditOnGitHub, MarkdownCopyButton, PageLastUpdate, ViewOptionsPopover, useDocsPage };