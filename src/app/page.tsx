'use client'

import { Title, Text, Group, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { GenerateQuiz } from '@/components/GenerateQuiz';
import { useEffect, useState } from 'react';

export default function Home() {
  const [verbs, setVerbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  useEffect(() => {
    fetch('/api/verbs')
      .then(res => res.json())
      .then(data => {
        setVerbs(data.verbs);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch verbs:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Group justify="center" gap="xl">
          <Title 
            order={1} 
            className="text-4xl sm:text-5xl font-bold"
            ta="center"
          >
            examine!
          </Title>
          <ActionIcon
            variant="outline"
            color={dark ? 'yellow' : 'blue'}
            onClick={() => setColorScheme(dark ? 'light' : 'dark')}
            title="Toggle color scheme"
            size="lg"
          >
            {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
        </Group>
        <Text size="xl" c="dimmed" className="max-w-2xl mx-auto" ta="center">
          Loading verbs...
        </Text>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <Group justify="center" gap="xl">
        <Title 
          order={1} 
          className="text-4xl sm:text-5xl font-bold"
          ta="center"
        >
          examine!
        </Title>
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => setColorScheme(dark ? 'light' : 'dark')}
          title="Toggle color scheme"
          size="lg"
        >
          {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
      </Group>
      <Text size="xl" c="dimmed" className="max-w-2xl mx-auto" ta="center">
        Practice Spanish verb conjugations.
      </Text>
      <GenerateQuiz verbs={verbs} />
    </main>
  );
}
