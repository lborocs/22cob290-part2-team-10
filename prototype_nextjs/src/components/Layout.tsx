import { useState } from 'react';
import dynamic from 'next/dynamic';
import Stack from '@mui/material/Stack';

import NavigationBar from '~/components/layout/NavigationBar';
import Sidebar from '~/components/layout/Sidebar';

const DynamicProjectsList = dynamic(
  () => import('~/components/layout/sidebar/ProjectsList')
);

// gives flexibility to have more shared sidebars (not just projects)
export enum SidebarType {
  NONE,
  CUSTOM,
  PROJECTS,
}

type BaseSidebar = {
  type: SidebarType;
  content?: React.ReactNode;
};

interface CustomSidebar extends BaseSidebar {
  type: SidebarType.CUSTOM;
  content: React.ReactNode;
}

interface DefaultSidebar extends BaseSidebar {
  type: Exclude<SidebarType, SidebarType.CUSTOM>;
  content?: undefined;
}

type Sidebar = CustomSidebar | DefaultSidebar;

export type PageLayout = {
  sidebar: Sidebar;
};

export interface LayoutProps extends PageLayout {
  children: React.ReactNode;
}

/**
 * Pages can use `flexGrow: 1` to take up the rest of the available space
 */
export default function Layout({ sidebar, children }: LayoutProps) {
  const noSidebar = sidebar.type === SidebarType.NONE;
  const [showSidebar, setShowSidebar] = useState(!noSidebar);

  const toggleSidebar = () => setShowSidebar((show) => !show);

  const getSidebarContent = (): React.ReactNode => {
    switch (sidebar.type) {
      case SidebarType.CUSTOM:
        return sidebar.content;

      case SidebarType.PROJECTS:
        return <DynamicProjectsList />;

      default:
        return (
          <>
            <strong>Invalid sidebar type</strong>
            {sidebar.content}
          </>
        );
    }
  };

  return (
    <Stack direction="row">
      {!noSidebar && (
        <Sidebar show={showSidebar} content={getSidebarContent()} />
      )}

      <Stack
        width="100%"
        paddingX={{ xs: 1.75, md: 2, lg: 2.5 }}
        paddingTop={1.5}
        paddingBottom={1}
        gap={3}
        sx={{
          ...(!noSidebar && {
            // needs to be synced with ~/styles/layout/Sidebar.module.css
            marginLeft: showSidebar ? '250px' : 0,
            '@media (max-width: 768px)': {
              marginLeft: showSidebar ? 0 : '250px',
            },
            transition: 'margin-left 0.3s',
          }),
        }}
      >
        <NavigationBar noSidebar={noSidebar} toggleSidebar={toggleSidebar} />
        {children}
      </Stack>
    </Stack>
  );
}
