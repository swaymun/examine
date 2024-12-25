'use client'

import { useState, useMemo, useEffect } from 'react';
import { Table, TextInput, Paper, Button, Progress, Text, Group, Tooltip } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

// Define tense groups
const TENSE_GROUPS = {
  basic: [
    'Present',
    'Preterite',
    'Imperfect',
    'Future',
    'Conditional'
  ],
  perfect: [
    'Present Perfect',
    'Past Perfect',
    'Future Perfect',
    'Conditional Perfect'
  ],
  subjunctive: [
    'Subjunctive Present',
    'Subjunctive Imperfect',
    'Subjunctive Present Perfect',
    'Subjunctive Past Perfect',
    'Subjunctive Future',
    'Subjunctive Future Perfect'
  ],
  imperative: [
    'Imperative Affirmative Present',
    'Imperative Negative Present'
  ]
} as const;

type TenseGroup = keyof typeof TENSE_GROUPS;

interface ConjugationData {
  definition: string;
  yo: string;
  tú: string;
  'él/ella/usted': string;
  nosotros: string;
  vosotros: string;
  'ellos/ellas/ustedes': string;
  infinitive: string;
}

interface ConjugationTablesProps {
  conjugations: Record<string, ConjugationData>;
  enabledTenseGroups: Record<TenseGroup, boolean>;
  onTenseGroupChange?: (group: TenseGroup, enabled: boolean) => void;
}

const PRONOUNS = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'vosotros', 'ellos/ellas/ustedes'] as const;
const PRONOUNS_MOBILE = {
  'yo': 'yo',
  'tú': 'tú',
  'él/ella/usted': 'él',
  'nosotros': 'nosotros',
  'vosotros': 'vosotros',
  'ellos/ellas/ustedes': 'ellos'
} as const;

// Define the order of tenses
const TENSE_ORDER = [
  'Present',
  'Preterite',
  'Imperfect',
  'Future',
  'Conditional',
  'Present Perfect',
  'Past Perfect',
  'Future Perfect',
  'Conditional Perfect',
  'Subjunctive Present',
  'Subjunctive Imperfect',
  'Subjunctive Present Perfect',
  'Subjunctive Past Perfect',
  'Subjunctive Future',
  'Subjunctive Future Perfect',
  'Imperative Affirmative Present',
  'Imperative Negative Present',
] as const;

const TENSE_EXAMPLES = {
  'Present': 'I buy bread (habitual or current action)',
  'Preterite': 'I bought bread yesterday (completed past action)',
  'Imperfect': 'I used to buy bread when I was young (ongoing past action)',
  'Future': 'I will buy bread tomorrow (future action)',
  'Conditional': 'I would buy bread if I had money (hypothetical action)',
  'Present Perfect': 'I have bought bread today (past action with present relevance)',
  'Past Perfect': 'I had bought bread before the store closed (past action before another past action)',
  'Future Perfect': 'I will have bought bread by noon (future action completed before another future time)',
  'Conditional Perfect': 'I would have bought bread if I had known (hypothetical past action)',
  'Subjunctive Present': 'I hope that you buy bread (uncertain/desired present action)',
  'Subjunctive Imperfect': 'I wished that you bought bread (uncertain/desired past action)',
  'Subjunctive Present Perfect': 'I hope that you have bought bread (uncertain/desired completed action)',
  'Subjunctive Past Perfect': 'I wished that you had bought bread (uncertain/desired action before past)',
  'Subjunctive Future': 'If you should buy bread... (hypothetical future action)',
  'Subjunctive Future Perfect': 'If you should have bought bread... (hypothetical completed future action)',
  'Imperative Affirmative Present': 'Buy bread! (present imperative)',
  'Imperative Negative Present': 'Don\'t buy bread! (present imperative negative)',
} as const;


// Add regular conjugation patterns
const REGULAR_PATTERNS = {
  'ar': {
    'Present': {
      'yo': 'compro',
      'tú': 'compras',
      'él/ella/usted': 'compra',
      'nosotros': 'compramos',
      'vosotros': 'compráis',
      'ellos/ellas/ustedes': 'compran'
    },
    'Preterite': {
      'yo': 'compré',
      'tú': 'compraste',
      'él/ella/usted': 'compró',
      'nosotros': 'compramos',
      'vosotros': 'comprasteis',
      'ellos/ellas/ustedes': 'compraron'
    },
    'Imperfect': {
      'yo': 'compraba',
      'tú': 'comprabas',
      'él/ella/usted': 'compraba',
      'nosotros': 'comprábamos',
      'vosotros': 'comprabais',
      'ellos/ellas/ustedes': 'compraban'
    },
    'Future': {
      'yo': 'compraré',
      'tú': 'comprarás',
      'él/ella/usted': 'comprará',
      'nosotros': 'comprarémos',
      'vosotros': 'compraréis',
      'ellos/ellas/ustedes': 'comprarán'
    },
    'Conditional': {
      'yo': 'compraría',
      'tú': 'comprarías',
      'él/ella/usted': 'compraría',
      'nosotros': 'compraríamos',
      'vosotros': 'compraríais',
      'ellos/ellas/ustedes': 'comprarían'
    },
    'Present Perfect': {
      'yo': 'he comprado',
      'tú': 'has comprado',
      'él/ella/usted': 'ha comprado',
      'nosotros': 'hemos comprado',
      'vosotros': 'habéis comprado',
      'ellos/ellas/ustedes': 'han comprado'
    },
    'Past Perfect': {
      'yo': 'había comprado',
      'tú': 'habías comprado',
      'él/ella/usted': 'había comprado',
      'nosotros': 'habíamos comprado',
      'vosotros': 'habíais comprado',
      'ellos/ellas/ustedes': 'habían comprado'
    },
    'Future Perfect': {
      'yo': 'habré comprado',
      'tú': 'habrás comprado',
      'él/ella/usted': 'habrá comprado',
      'nosotros': 'habremos comprado',
      'vosotros': 'habréis comprado',
      'ellos/ellas/ustedes': 'habrán comprado'
    },
    'Conditional Perfect': {
      'yo': 'habría comprado',
      'tú': 'habrías comprado',
      'él/ella/usted': 'habría comprado',
      'nosotros': 'habríamos comprado',
      'vosotros': 'habríais comprado',
      'ellos/ellas/ustedes': 'habrían comprado'
    },
    'Subjunctive Present': {
      'yo': 'compre',
      'tú': 'compras',
      'él/ella/usted': 'compre',
      'nosotros': 'compramos',
      'vosotros': 'compráis',
      'ellos/ellas/ustedes': 'compran'
    },
    'Subjunctive Imperfect': {
      'yo': 'compre',
      'tú': 'compras',
      'él/ella/usted': 'compre',
      'nosotros': 'compráramos',
      'vosotros': 'comprarais',
      'ellos/ellas/ustedes': 'compraran'
    },
    'Subjunctive Present Perfect': {
      'yo': 'haya comprado',
      'tú': 'hayas comprado',
      'él/ella/usted': 'haya comprado',
      'nosotros': 'hayamos comprado',
      'vosotros': 'hayáis comprado',
      'ellos/ellas/ustedes': 'hayan comprado'
    },
    'Subjunctive Past Perfect': {
      'yo': 'hubiera comprado',
      'tú': 'hubieras comprado',
      'él/ella/usted': 'hubiera comprado',
      'nosotros': 'hubiéramos comprado',
      'vosotros': 'hubierais comprado',
      'ellos/ellas/ustedes': 'hubieran comprado'
    },
    'Subjunctive Future': {
      'yo': 'compre',
      'tú': 'compras',
      'él/ella/usted': 'compre',
      'nosotros': 'compramos',
      'vosotros': 'compráis',
      'ellos/ellas/ustedes': 'compran'
    },
    'Subjunctive Future Perfect': {
      'yo': 'hubiere comprado',
      'tú': 'hubieres comprado',
      'él/ella/usted': 'hubiere comprado',
      'nosotros': 'hubiéremos comprado',
      'vosotros': 'hubiereis comprado',
      'ellos/ellas/ustedes': 'hubieren comprado'
    },
    'Imperative Affirmative Present': {
      'tú': 'compra',
      'él/ella/usted': 'compra',
      'vosotros': 'compra',
      'ellos/ellas/ustedes': 'compra'
    },
    'Imperative Negative Present': {
      'tú': 'no compres',
      'él/ella/usted': 'no compres',
      'vosotros': 'no compres',
      'ellos/ellas/ustedes': 'no compres'
    }
  },
  'er': {
    'Present': {
      'yo': 'comer',
      'tú': 'comes',
      'él/ella/usted': 'come',
      'nosotros': 'comemos',
      'vosotros': 'coméis',
      'ellos/ellas/ustedes': 'comen'
    },
    'Preterite': {
      'yo': 'comí',
      'tú': 'comiste',
      'él/ella/usted': 'comió',
      'nosotros': 'comimos',
      'vosotros': 'comisteis',
      'ellos/ellas/ustedes': 'comieron'
    },
    'Imperfect': {
      'yo': 'comía',
      'tú': 'comías',
      'él/ella/usted': 'comía',
      'nosotros': 'comíamos',
      'vosotros': 'comíais',
      'ellos/ellas/ustedes': 'comían'
    },
    'Future': {
      'yo': 'comeré',
      'tú': 'comerás',
      'él/ella/usted': 'comerá',
      'nosotros': 'comermos',
      'vosotros': 'comeréis',
      'ellos/ellas/ustedes': 'comerán'
    },
    'Conditional': {
      'yo': 'comería',
      'tú': 'comerías',
      'él/ella/usted': 'comería',
      'nosotros': 'comeríamos',
      'vosotros': 'comeríais',
      'ellos/ellas/ustedes': 'comerían'
    },
    'Present Perfect': {
      'yo': 'he comido',
      'tú': 'has comido',
      'él/ella/usted': 'ha comido',
      'nosotros': 'hemos comido',
      'vosotros': 'habéis comido',
      'ellos/ellas/ustedes': 'han comido'
    },
    'Past Perfect': {
      'yo': 'había comido',
      'tú': 'habías comido',
      'él/ella/usted': 'había comido',
      'nosotros': 'habíamos comido',
      'vosotros': 'habíais comido',
      'ellos/ellas/ustedes': 'habían comido'
    },
    'Future Perfect': {
      'yo': 'habré comido',
      'tú': 'habrás comido',
      'él/ella/usted': 'habrá comido',
      'nosotros': 'habremos comido',
      'vosotros': 'habréis comido',
      'ellos/ellas/ustedes': 'habrán comido'
    },
    'Conditional Perfect': {
      'yo': 'habría ido',
      'tú': 'habrías ido',
      'él/ella/usted': 'habría ido',
      'nosotros': 'habríamos ido',
      'vosotros': 'habríais ido',
      'ellos/ellas/ustedes': 'habrían ido'
    },
    'Subjunctive Present': {
      'yo': 'coma',
      'tú': 'comas',
      'él/ella/usted': 'coma',
      'nosotros': 'comamos',
      'vosotros': 'comáis',
      'ellos/ellas/ustedes': 'coman'
    },
    'Subjunctive Imperfect': {
      'yo': 'comería',
      'tú': 'comerías',
      'él/ella/usted': 'comería',
      'nosotros': 'comeríamos',
      'vosotros': 'comeríais',
      'ellos/ellas/ustedes': 'comerían'
    },
    'Subjunctive Present Perfect': {
      'yo': 'haya comido',
      'tú': 'hayas comido',
      'él/ella/usted': 'haya comido',
      'nosotros': 'hayamos comido',
      'vosotros': 'hayáis comido',
      'ellos/ellas/ustedes': 'hayan comido'
    },
    'Subjunctive Past Perfect': {
      'yo': 'hubiera comido',
      'tú': 'hubieras comido',
      'él/ella/usted': 'hubiera comido',
      'nosotros': 'hubiéramos comido',
      'vosotros': 'hubierais comido',
      'ellos/ellas/ustedes': 'hubieran comido'
    },
    'Subjunctive Future': {
      'yo': 'comiere',
      'tú': 'comieres',
      'él/ella/usted': 'comiere',
      'nosotros': 'comiéremos',
      'vosotros': 'comiereis',
      'ellos/ellas/ustedes': 'comieren'
    },
    'Subjunctive Future Perfect': {
      'yo': 'hubiere comido',
      'tú': 'hubieres comido',
      'él/ella/usted': 'hubiere comido',
      'nosotros': 'hubiéremos comido',
      'vosotros': 'hubiereis comido',
      'ellos/ellas/ustedes': 'hubieren comido'
    },
    'Imperative Affirmative Present': {
      'tú': 'come',
      'él/ella/usted': 'come',
      'vosotros': 'come',
      'ellos/ellas/ustedes': 'come'
    },
    'Imperative Negative Present': {
      'tú': 'no comes',
      'él/ella/usted': 'no comes',
      'vosotros': 'no comes',
      'ellos/ellas/ustedes': 'no comes'
    }
  },
  'ir': {
    'Present': {
      'yo': 'vivo',
      'tú': 'vives',
      'él/ella/usted': 'vive',
      'nosotros': 'vivimos',
      'vosotros': 'vís',
      'ellos/ellas/ustedes': 'viven'
    },
    'Preterite': {
      'yo': 'viví',
      'tú': 'viviste',
      'él/ella/usted': 'vivió',
      'nosotros': 'vivimos',
      'vosotros': 'vivisteis',
      'ellos/ellas/ustedes': 'vivieron'
    },
    'Imperfect': {
      'yo': 'vivía',
      'tú': 'vivías',
      'él/ella/usted': 'vivía',
      'nosotros': 'vivíamos',
      'vosotros': 'vivíais',
      'ellos/ellas/ustedes': 'vivían'
    },
    'Future': {
      'yo': 'viviré',
      'tú': 'vivirás',
      'él/ella/usted': 'vivirá',
      'nosotros': 'viviremos',
      'vosotros': 'viviréis',
      'ellos/ellas/ustedes': 'vivirán'
    },
    'Conditional': {
      'yo': 'viviría',
      'tú': 'vivirías',
      'él/ella/usted': 'viviría',
      'nosotros': 'viviríamos',
      'vosotros': 'viviríais',
      'ellos/ellas/ustedes': 'vivirían'
    },
    'Present Perfect': {
      'yo': 'he vivido',
      'tú': 'has vivido',
      'él/ella/usted': 'ha vivido',
      'nosotros': 'hemos vivido',
      'vosotros': 'habéis vivido',
      'ellos/ellas/ustedes': 'han vivido'
    },
    'Past Perfect': {
      'yo': 'había vivido',
      'tú': 'habías vivido',
      'él/ella/usted': 'había vivido',
      'nosotros': 'habíamos vivido',
      'vosotros': 'habíais vivido',
      'ellos/ellas/ustedes': 'habían vivido'
    },
    'Future Perfect': {
      'yo': 'habré vivido',
      'tú': 'habrás vivido',
      'él/ella/usted': 'habrá vivido',
      'nosotros': 'habremos vivido',
      'vosotros': 'habréis vivido',
      'ellos/ellas/ustedes': 'habrán vivido'
    },
    'Conditional Perfect': {
      'yo': 'habría vivido',
      'tú': 'habrías vivido',
      'él/ella/usted': 'habría vivido',
      'nosotros': 'habríamos vivido',
      'vosotros': 'habríais vivido',
      'ellos/ellas/ustedes': 'habrían vivido'
    },
    'Subjunctive Present': {
      'yo': 'viva',
      'tú': 'vivas',
      'él/ella/usted': 'viva',
      'nosotros': 'vivamos',
      'vosotros': 'váis',
      'ellos/ellas/ustedes': 'viven'
    },
    'Subjunctive Imperfect': {
      'yo': 'viviera',
      'tú': 'vivieras',
      'él/ella/usted': 'viviera',
      'nosotros': 'viviéramos',
      'vosotros': 'vivierais',
      'ellos/ellas/ustedes': 'vivieran'
    },
    'Subjunctive Present Perfect': {
      'yo': 'haya vivido',
      'tú': 'hayas vivido',
      'él/ella/usted': 'haya vivido',
      'nosotros': 'hayamos vivido',
      'vosotros': 'hayáis vivido',
      'ellos/ellas/ustedes': 'hayan vivido'
    },
    'Subjunctive Past Perfect': {
      'yo': 'hubiera vivido',
      'tú': 'hubieras vivido',
      'él/ella/usted': 'hubiera vivido',
      'nosotros': 'hubiéramos vivido',
      'vosotros': 'hubierais vivido',
      'ellos/ellas/ustedes': 'hubieran vivido'
    },
    'Subjunctive Future': {
      'yo': 'viviere',
      'tú': 'vivieres',
      'él/ella/usted': 'viviere',
      'nosotros': 'viviéremos',
      'vosotros': 'viviereis',
      'ellos/ellas/ustedes': 'vivieren'
    },
    'Subjunctive Future Perfect': {
      'yo': 'hubiere vivido',
      'tú': 'hubieres vivido',
      'él/ella/usted': 'hubiere vivido',
      'nosotros': 'hubiéremos vivido',
      'vosotros': 'hubiereis vivido',
      'ellos/ellas/ustedes': 'hubieren vivido'
    },
    'Imperative Affirmative Present': {
      'tú': 'vive',
      'él/ella/usted': 'vive',
      'vosotros': 'vive',
      'ellos/ellas/ustedes': 'vive'
    },
    'Imperative Negative Present': {
      'tú': 'no vives',
      'él/ella/usted': 'no vives',
      'vosotros': 'no vives',
      'ellos/ellas/ustedes': 'no vives'
    }
  }
} as const;

const EXAMPLE_VERBS = {
  'ar': 'comprar',
  'er': 'comer',
  'ir': 'vivir'
} as const;

export function ConjugationTables({ conjugations, enabledTenseGroups }: ConjugationTablesProps) {
  const isMobile = useIsMobile();
  const TENSES_PER_TABLE = isMobile ? 1 : 3;

  const [userAnswers, setUserAnswers] = useState<Record<string, Record<string, string>>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [collapsedTenses, setCollapsedTenses] = useState<Set<string>>(new Set());

  // Get ordered tenses
  const orderedTenses = useMemo(() => {
    const availableTenses = Object.keys(conjugations);
    
    // First filter by available tenses, then by enabled tense groups
    return TENSE_ORDER
      .filter(tense => availableTenses.includes(tense))
      .filter(tense => {
        // Check if this tense belongs to any enabled group
        return Object.entries(TENSE_GROUPS)
          .some(([group, tenses]) => {
            const isEnabled = enabledTenseGroups[group as TenseGroup];
            return isEnabled && (tenses as readonly string[]).includes(tense);
          });
      });
  }, [conjugations, enabledTenseGroups]);

  // Calculate max width based on longest conjugation across all tenses
  const columnWidth = useMemo(() => {
    let maxLength = 0;
    
    orderedTenses.forEach(tense => {
      PRONOUNS.forEach(pronoun => {
        const conjugation = conjugations[tense][pronoun];
        if (conjugation && conjugation.length > maxLength) {
          maxLength = conjugation.length;
        }
      });
    });

    // Add some padding and convert to pixels (assuming average char width)
    return Math.max(maxLength * 10 + 32, 120); // minimum width of 120px
  }, [conjugations, orderedTenses]);

  // Split tenses into groups for tables
  const tables = useMemo(() => {
    const result = [];
    for (let i = 0; i < orderedTenses.length; i += TENSES_PER_TABLE) {
      result.push(orderedTenses.slice(i, i + TENSES_PER_TABLE));
    }
    return result;
  }, [orderedTenses, TENSES_PER_TABLE]);

  // Calculate accuracy
  const accuracy = useMemo(() => {
    let correct = 0;
    let total = 0;

    orderedTenses.forEach(tense => {
      PRONOUNS.forEach(pronoun => {
        const correctAnswer = conjugations[tense][pronoun];
        // Only count cells that have a correct answer
        if (correctAnswer) {
          total++;
          const userAnswer = userAnswers[tense]?.[pronoun]?.trim().toLowerCase();
          if (userAnswer === correctAnswer.toLowerCase()) {
            correct++;
          }
        }
      });
    });

    return {
      correct,
      total,
      percentage: total > 0 ? (correct / total) * 100 : 0
    };
  }, [conjugations, userAnswers, orderedTenses]);

  const handleInputChange = (tense: string, pronoun: string, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [tense]: {
        ...prev[tense],
        [pronoun]: value
      }
    }));
  };

  const toggleAnswers = () => {
    if (showAnswers) {
      // Clear answers
      setUserAnswers({});
    } else {
      // Show correct answers
      const answers: Record<string, Record<string, string>> = {};
      orderedTenses.forEach(tense => {
        answers[tense] = {};
        PRONOUNS.forEach(pronoun => {
          if (conjugations[tense][pronoun]) {
            answers[tense][pronoun] = conjugations[tense][pronoun];
          }
        });
      });
      setUserAnswers(answers);
    }
    setShowAnswers(!showAnswers);
  };

  // Calculate tabIndex for each input
  const getTabIndex = (tableIndex: number, tenseIndex: number, pronounIndex: number): number => {
    const tensesBeforeTable = tableIndex * TENSES_PER_TABLE;
    const baseIndex = (tensesBeforeTable + tenseIndex) * PRONOUNS.length;
    return baseIndex + pronounIndex + 1; // +1 because tabIndex starts at 1
  };

  return (
    <div className="space-y-8">
      <Paper shadow="sm" p="md">
        <Group justify="space-between" align="center">
          <div className="space-y-2">
            <Text size="sm" fw={500}>{isMobile ? '' : 'Progress: '}{accuracy.correct} / {accuracy.total} correct</Text>
            <Progress 
              value={accuracy.percentage}
              size="lg"
              color={accuracy.percentage === 100 ? 'green' : 'blue'} 
              style={{ width: '100%' }}
            />
          </div>
          <Text size="sm">{conjugations[orderedTenses[0]]?.definition}</Text>
          <Button
            onClick={toggleAnswers}
            variant="light" 
            leftSection={isMobile ?  '' : (showAnswers ? <IconEyeOff size={16} /> : <IconEye size={16} />)}
          >
            {isMobile ?  (showAnswers ? <IconEyeOff size={16} /> : <IconEye size={16} />) : (showAnswers ? 'Hide Answers' : 'Show Answers')}
          </Button>
        </Group>
      </Paper>

      <div className="space-y-8">
        {tables.map((tableTenses, tableIndex) => (
          <Paper key={tableIndex} shadow="sm" p="md" className="overflow-x-auto">
            <Table 
              striped 
              withTableBorder 
              withColumnBorders 
              horizontalSpacing="lg"
              verticalSpacing="md"
            >
              <Table.Thead>
                <Table.Tr>
                  {!isMobile && <Table.Th>Pronoun</Table.Th>}
                  {tableTenses.map((tense) => (
                    <Table.Th 
                      key={tense} 
                      className={`text-center ${isMobile ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                      style={{ width: `${columnWidth}px` }}
                      onClick={() => {
                        if (isMobile) {
                          setCollapsedTenses(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(tense)) {
                              newSet.delete(tense);
                            } else {
                              newSet.add(tense);
                            }
                            return newSet;
                          });
                        }
                      }}
                    >
                      <Tooltip 
                        label={
                          <div className="p-2">
                            <Text fw={500} mb="xs">{tense}</Text>
                            {(() => {
                              const currentVerb = conjugations[orderedTenses[0]]?.infinitive;
                              if (!currentVerb) return null;

                              const without_se_at_end = currentVerb.endsWith('se') ? currentVerb.slice(0, -2) : currentVerb;

                              const ending = without_se_at_end.endsWith('ar') ? 'ar' : 
                                           without_se_at_end.endsWith('er') ? 'er' : 
                                           without_se_at_end.endsWith('ir') ? 'ir' : null;
                              
                              if (!ending) return null;

                              const patterns = REGULAR_PATTERNS[ending];
                              const pattern = patterns[tense as keyof typeof patterns];
                              const exampleVerb = EXAMPLE_VERBS[ending];
                              
                              return pattern ? (
                                <div>
                                  <Text size="sm" c="dimmed" mb="xs">Example usage: {TENSE_EXAMPLES[tense as keyof typeof TENSE_EXAMPLES]}</Text>
                                  <Text size="sm" c="dimmed" mb="xs">Regular -{ending} pattern (e.g., {exampleVerb})</Text>
                                  <Table
                                    withTableBorder
                                    withColumnBorders
                                    highlightOnHover
                                  >
                                    <Table.Thead>
                                      <Table.Tr>
                                        <Table.Th>Pronoun</Table.Th>
                                        <Table.Th>Conjugation</Table.Th>
                                      </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                      {Object.entries(pattern).map(([pronoun, example]) => (
                                        <Table.Tr key={pronoun}>
                                          <Table.Td>
                                            <Text size="sm" fw={500}>{pronoun}</Text>
                                          </Table.Td>
                                          <Table.Td>
                                            <Text size="sm">{example}</Text>
                                          </Table.Td>
                                        </Table.Tr>
                                      ))}
                                    </Table.Tbody>
                                  </Table>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        }
                        position="top"
                        withArrow
                        openDelay={200}
                        events={{ hover: true, focus: true, touch: true }}
                        multiline
                        w={400}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex justify-between items-center">
                            {tense}
                            {isMobile && (
                              <span className="text-gray-500 text-sm">
                                {collapsedTenses.has(tense) ? ' ▼' : ' ▲'}
                              </span>
                            )}
                          </div>
                        </div>
                      </Tooltip>
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {PRONOUNS.map((pronoun) => (
                  <Table.Tr 
                    key={pronoun}
                    style={{ 
                      display: isMobile && tableTenses.every(tense => collapsedTenses.has(tense)) ? 'none' : 'table-row'
                    }}
                  >
                    {!isMobile && <Table.Td className="font-medium">{pronoun}</Table.Td>}
                    {tableTenses.map((tense, tenseIndex) => (
                      <Table.Td 
                        key={`${pronoun}-${tense}`}
                        style={{
                          display: isMobile && collapsedTenses.has(tense) ? 'none' : 'table-cell'
                        }}
                      >
                        {conjugations[tense][pronoun] ? (
                          <TextInput
                            size="sm"
                            value={userAnswers[tense]?.[pronoun] || ''}
                            onChange={(e) => handleInputChange(tense, pronoun, e.target.value)}
                            error={
                              userAnswers[tense]?.[pronoun] && 
                              userAnswers[tense][pronoun].trim().toLowerCase() !== 
                              conjugations[tense][pronoun].toLowerCase()
                            }
                            placeholder={isMobile ? `${PRONOUNS_MOBILE[pronoun]}` : ""}
                            tabIndex={getTabIndex(tableIndex, tenseIndex, PRONOUNS.indexOf(pronoun))}
                            styles={{
                              input: {
                                width: `${columnWidth}px`
                              }
                            }}
                          />
                        ) : (
                          <Text size="sm" c="dimmed" ta="center">—</Text>
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        ))}
      </div>

      <Paper shadow="sm" p="md">
        <Group justify="space-between" align="center">
          <div className="space-y-2">
            <Text size="sm" fw={500}>{isMobile ? '' : 'Progress: '}{accuracy.correct} / {accuracy.total} correct</Text>
            <Progress 
              value={accuracy.percentage} 
              size="lg" 
              color={accuracy.percentage === 100 ? 'green' : 'blue'}
              style={{ width: '100%' }}
            />
          </div>
        </Group>
      </Paper>
    </div>
  );
} 