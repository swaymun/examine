import Database from 'better-sqlite3';
import path from 'path';

export interface VerbRow {
    infinitive: string;
    mood: string;
    tense: string;
    verb_english: string;
    form_1s: string;
    form_2s: string;
    form_3s: string;
    form_1p: string;
    form_2p: string;
    form_3p: string;
}
  
export interface TenseRow {
    tense: string;
    tense_english: string;
}

export interface InfinitiveRow {
    infinitive_english: string;
}

export function getAllVerbInfinitives(): string[] {
  const db = new Database(path.join(process.cwd(), 'db/verbs.sqlite3'));
  
  try {
    const verbs = db.prepare('SELECT DISTINCT infinitive FROM verbs ORDER BY infinitive').all() as VerbRow[];
    const infinitives = verbs.map((verb: VerbRow) => verb.infinitive);
    // Shuffle the infinitives array using Fisher-Yates algorithm
    for (let i = infinitives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [infinitives[i], infinitives[j]] = [infinitives[j], infinitives[i]];
    }
    return infinitives;
  } finally {
    db.close();
  }
}

export function getVerbConjugations(infinitive: string) {
  const db = new Database(path.join(process.cwd(), 'db/verbs.sqlite3'));
  
  try {
    // Get all conjugations for the verb
    const conjugations = db.prepare(`
      SELECT 
        infinitive,
        mood,
        tense,
        verb_english,
        form_1s,
        form_2s, 
        form_3s,
        form_1p,
        form_2p,
        form_3p
      FROM verbs 
      WHERE infinitive = ?
    `).all(infinitive) as VerbRow[];

    const tenses = db.prepare('SELECT * FROM tense').all() as TenseRow[];
    const tenses_map = new Map(tenses.map(tense => [tense.tense, tense.tense_english]));

    const definition = db.prepare('SELECT infinitive_english FROM infinitive WHERE infinitive = ?')
      .get(infinitive) as InfinitiveRow;

    if (conjugations.length === 0) {
      throw new Error(`No conjugations found for verb: ${infinitive}`);
    }

    // Transform conjugations into a grouped object by mood and tense
    const groupedConjugations = conjugations.reduce((acc: Record<string, object>, conj) => {
      let mood = '';
      if (conj.mood == 'Indicativo') {
        mood = ''
      } else if (conj.mood == 'Subjuntivo') {
        mood = 'Subjunctive '
      } else if (conj.mood == 'Imperativo Afirmativo') {
        mood = 'Imperative Affirmative '
      } else if (conj.mood == 'Imperativo Negativo') {
        mood = 'Imperative Negative '
      }
      const key = `${mood}${tenses_map.get(conj.tense)}`;
      if (!acc[key]) {
        acc[key] = {
          definition: definition.infinitive_english,
          yo: conj.form_1s,
          tú: conj.form_2s,
          'él/ella/usted': conj.form_3s,
          nosotros: conj.form_1p,
          vosotros: conj.form_2p,
          'ellos/ellas/ustedes': conj.form_3p,
          infinitive: conj.infinitive
        };
      }
      return acc;
    }, {});

    return groupedConjugations;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    db.close();
  }
}