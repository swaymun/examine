'use client';

import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider 
      theme={{
        ...theme,
        primaryColor: 'blue',
        primaryShade: { light: 6, dark: 8 }
      }}
      defaultColorScheme="dark"
    >
      {children}
    </MantineProvider>
  );
} 