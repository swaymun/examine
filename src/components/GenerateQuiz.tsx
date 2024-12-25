'use client'

import { useState } from 'react';
import { Combobox, Button, LoadingOverlay, Container, TextInput, Paper, Group, Checkbox, Grid } from '@mantine/core';
import { IconArrowsShuffle } from '@tabler/icons-react';
import { ConjugationData, ConjugationTables } from './ConjugationTables';

interface GenerateQuizProps {
  verbs: string[];
}

const TENSE_GROUPS = {
  basic: 'Basic tenses (Present, Past, Future)',
  perfect: 'Perfect tenses (Present Perfect, etc.)',
  subjunctive: 'Subjunctive tenses',
  imperative: 'Imperative (Commands)'
} as const;

export function GenerateQuiz({ verbs }: GenerateQuizProps) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [conjugations, setConjugations] = useState<Record<string, ConjugationData> | null>(null);
  const [enabledTenseGroups, setEnabledTenseGroups] = useState({
    basic: true,
    perfect: false,
    subjunctive: false,
    imperative: false
  });

  const handleGenerateQuiz = async () => {
    if (!value) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/verbs/conjugations?verb=${encodeURIComponent(value)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conjugations');
      }
      const data = await response.json();
      setConjugations(data.conjugations);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShuffle = () => {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    setValue(randomVerb);
  };

  const handleTenseGroupChange = (group: string, enabled: boolean) => {
    setEnabledTenseGroups(prev => ({
      ...prev,
      [group]: enabled
    }));
  };

  return (
    <div className="space-y-8">
      <Container size="sm">
        <div className="space-y-4">
          <Paper shadow="sm" p="md">
            <div className="space-y-4">
              <Group justify="space-between" wrap="nowrap">
                <div className="relative flex-grow">
                  <LoadingOverlay visible={loading} />
                  <Combobox>
                    <Combobox.Target>
                      <TextInput
                        placeholder="Type a verb..."
                        value={value}
                        onChange={(event) => setValue(event.currentTarget.value)}
                        size="md"
                      />
                    </Combobox.Target>

                    <Combobox.Dropdown>
                      <Combobox.Options>
                        {verbs
                          .filter(item => 
                            item.toLowerCase().includes(value.toLowerCase().trim())
                          )
                          .map((item) => (
                            <Combobox.Option value={item} key={item}>
                              {item}
                            </Combobox.Option>
                          ))}
                      </Combobox.Options>
                    </Combobox.Dropdown>
                  </Combobox>
                </div>
                <Button 
                  variant="light"
                  onClick={handleShuffle}
                  style={{ flexShrink: 0 }}
                  size="md"
                >
                  <IconArrowsShuffle size={16} />
                </Button>
              </Group>

              <div className="space-y-4">&nbsp;</div>

              <Grid>
                {Object.entries(TENSE_GROUPS).map(([group, label]) => (
                  <Grid.Col key={group} span={{ base: 12, sm: 6 }}>
                    <Checkbox
                      label={label}
                      checked={enabledTenseGroups[group as keyof typeof enabledTenseGroups]}
                      onChange={(event) => handleTenseGroupChange(
                        group,
                        event.currentTarget.checked
                      )}
                      size="md"
                    />
                  </Grid.Col>
                ))}
              </Grid>

              <div className="space-y-4">&nbsp;</div>

              <Button 
                size="lg"
                fullWidth 
                onClick={handleGenerateQuiz}
                disabled={!value}
              >
                Generate Quiz
              </Button>
            </div>
          </Paper>
        </div>
      </Container>

      {conjugations && (
        <ConjugationTables 
          conjugations={conjugations} 
          enabledTenseGroups={enabledTenseGroups}
          onTenseGroupChange={handleTenseGroupChange}
        />
      )}
    </div>
  );
} 