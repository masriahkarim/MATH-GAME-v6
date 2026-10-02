import { AgeGroup, Question, BossQuestion } from '../types/game';

// Utility helper for random integer between min and max inclusive
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility to shuffle an array
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate 3 plausible unique distractors for numeric answers
function generateNumericDistractors(correct: number, step: number = 1): number[] {
  const set = new Set<number>();
  const deltas = [-step, step, -2 * step, 2 * step, -3 * step, 3 * step, 10, -10, 5, -5];
  const shuffledDeltas = shuffle(deltas);

  for (const delta of shuffledDeltas) {
    const cand = correct + delta;
    if (cand >= 0 && cand !== correct) {
      set.add(cand);
    }
    if (set.size >= 3) break;
  }

  // Backup fallback if not enough
  let extra = 1;
  while (set.size < 3) {
    const cand = Math.max(0, correct + (extra % 2 === 0 ? extra : -extra));
    if (cand !== correct) set.add(cand);
    extra++;
  }

  return Array.from(set).slice(0, 3);
}

// Generate age 7-8 question
function generateAge7to8(difficulty: 1 | 2 | 3): Question {
  const types = ['add', 'sub', 'mul_easy', 'compare', 'money', 'time_shape'];
  const type = types[randInt(0, types.length - 1)];
  const qId = 'q78_' + Math.random().toString(36).substring(2, 9);

  if (type === 'add') {
    let a: number, b: number;
    if (difficulty === 1) {
      a = randInt(2, 9);
      b = randInt(1, 9);
    } else if (difficulty === 2) {
      a = randInt(10, 18);
      b = randInt(3, 9);
    } else {
      a = randInt(15, 25);
      b = randInt(8, 15);
    }
    const ans = a + b;
    const distractors = generateNumericDistractors(ans, 1);
    const options = shuffle([ans, ...distractors]);
    const correctIndex = options.indexOf(ans);

    return {
      id: qId,
      prompt: `${a} + ${b} = ?`,
      options,
      correctIndex,
      correctAnswer: ans,
      explanation: `${a} ditambah ${b} bersamaan ${ans}.`,
      visualEmoji: '🍎',
      category: 'Tambah Asas',
      difficulty,
    };
  }

  if (type === 'sub') {
    let a: number, b: number;
    if (difficulty === 1) {
      a = randInt(5, 12);
      b = randInt(1, a - 1);
    } else if (difficulty === 2) {
      a = randInt(12, 20);
      b = randInt(3, a - 2);
    } else {
      a = randInt(20, 35);
      b = randInt(6, a - 5);
    }
    const ans = a - b;
    const distractors = generateNumericDistractors(ans, 1);
    const options = shuffle([ans, ...distractors]);
    const correctIndex = options.indexOf(ans);

    return {
      id: qId,
      prompt: `${a} - ${b} = ?`,
      options,
      correctIndex,
      correctAnswer: ans,
      explanation: `${a} tolak ${b} bersamaan ${ans}.`,
      visualEmoji: '⭐',
      category: 'Tolak Asas',
      difficulty,
    };
  }

  if (type === 'mul_easy') {
    // Sifir 2, 5, atau 10
    const sifirList = [2, 5, 10];
    const b = sifirList[randInt(0, sifirList.length - 1)];
    const a = randInt(2, difficulty === 1 ? 5 : 9);
    const ans = a * b;
    const distractors = generateNumericDistractors(ans, b);
    const options = shuffle([ans, ...distractors]);
    const correctIndex = options.indexOf(ans);

    return {
      id: qId,
      prompt: `${a} × ${b} = ?`,
      options,
      correctIndex,
      correctAnswer: ans,
      explanation: `${a} kali ${b} adalah ${ans}.`,
      visualEmoji: '🚀',
      category: 'Sifir Asas',
      difficulty,
    };
  }

  if (type === 'compare') {
    const base = randInt(15, 60);
    const correct = base + 1;
    const prompt = `Nombor selepas ${base} ialah ?`;
    const distractors = [base - 1, base + 2, base + 10];
    const options = shuffle([correct, ...distractors]);
    const correctIndex = options.indexOf(correct);

    return {
      id: qId,
      prompt,
      options,
      correctIndex,
      correctAnswer: correct,
      explanation: `Selepas ${base} ialah ${correct}.`,
      visualEmoji: '🔢',
      category: 'Nombor & Urutan',
      difficulty,
    };
  }

  if (type === 'money') {
    const val1 = [1, 2, 5, 10][randInt(0, 3)];
    const val2 = [1, 2, 5, 5][randInt(0, 3)];
    const ans = val1 + val2;
    const distractors = generateNumericDistractors(ans, 1);
    const options = shuffle([`RM ${ans}`, `RM ${distractors[0]}`, `RM ${distractors[1]}`, `RM ${distractors[2]}`]);
    const correctIndex = options.indexOf(`RM ${ans}`);

    return {
      id: qId,
      prompt: `RM ${val1} + RM ${val2} = ?`,
      options,
      correctIndex,
      correctAnswer: `RM ${ans}`,
      explanation: `RM ${val1} tambah RM ${val2} ialah RM ${ans}.`,
      visualEmoji: '💵',
      category: 'Wang Ringgit',
      difficulty,
    };
  }

  // time or shape
  const isShape = Math.random() > 0.5;
  if (isShape) {
    const shapes = [
      { name: 'Segi tiga', sides: 3 },
      { name: 'Segi empat', sides: 4 },
      { name: 'Bulatan', sides: 0 },
      { name: 'Bintang 5 bucu', sides: 5 },
    ];
    const s = shapes[randInt(0, shapes.length - 1)];
    const options = shuffle([s.sides, (s.sides + 1) % 6, (s.sides + 2) % 6, (s.sides + 3) % 6]);
    // ensure unique
    const unique = Array.from(new Set(options));
    while (unique.length < 4) {
      unique.push(unique.length + 2);
    }
    const finalOpts = shuffle(unique.slice(0, 4));

    return {
      id: qId,
      prompt: `${s.name} mempunyai berapa sisi/bucu?`,
      options: finalOpts,
      correctIndex: finalOpts.indexOf(s.sides),
      correctAnswer: s.sides,
      explanation: `${s.name} mempunyai ${s.sides} sisi.`,
      visualEmoji: '🔺',
      category: 'Bentuk Asas',
      difficulty,
    };
  } else {
    const hour = randInt(1, 12);
    const prompt = `Jarum pendek di ${hour}, jarum panjang di 12. Pukul berapa?`;
    const ans = `Pukul ${hour}:00`;
    const alt1 = `Pukul ${(hour % 12) + 1}:00`;
    const alt2 = `Pukul ${hour > 1 ? hour - 1 : 12}:00`;
    const alt3 = `Pukul ${hour}:30`;
    const options = shuffle([ans, alt1, alt2, alt3]);

    return {
      id: qId,
      prompt,
      options,
      correctIndex: options.indexOf(ans),
      correctAnswer: ans,
      explanation: `Jarum pendek menunjukkan jam, maka ia Pukul ${hour}:00!`,
      visualEmoji: '⏰',
      category: 'Masa & Waktu',
      difficulty,
    };
  }
}

// Generate age 9-10 question
function generateAge9to10(difficulty: 1 | 2 | 3): Question {
  const types = ['add_sub_large', 'mul_div', 'mixed_ops', 'fractions_easy', 'money_decimals', 'perimeter'];
  const type = types[randInt(0, types.length - 1)];
  const qId = 'q910_' + Math.random().toString(36).substring(2, 9);

  if (type === 'mul_div') {
    const isDiv = Math.random() > 0.45;
    if (isDiv) {
      const divisor = randInt(3, 9);
      const quotient = randInt(3, 10);
      const dividend = divisor * quotient;
      const distractors = generateNumericDistractors(quotient, 1);
      const options = shuffle([quotient, ...distractors]);

      return {
        id: qId,
        prompt: `${dividend} ÷ ${divisor} = ?`,
        options,
        correctIndex: options.indexOf(quotient),
        correctAnswer: quotient,
        explanation: `${dividend} dibahagi ${divisor} bersamaan ${quotient}.`,
        visualEmoji: '⚡',
        category: 'Bahagi',
        difficulty,
      };
    } else {
      const a = randInt(4, 9);
      const b = randInt(4, 12);
      const ans = a * b;
      const distractors = generateNumericDistractors(ans, a);
      const options = shuffle([ans, ...distractors]);

      return {
        id: qId,
        prompt: `${a} × ${b} = ?`,
        options,
        correctIndex: options.indexOf(ans),
        correctAnswer: ans,
        explanation: `${a} darab ${b} bersamaan ${ans}.`,
        visualEmoji: '🎯',
        category: 'Darab',
        difficulty,
      };
    }
  }

  if (type === 'mixed_ops') {
    const a = randInt(5, 20);
    const b = randInt(2, 6);
    const c = randInt(2, 5);
    const ans = a + b * c;
    const wrongOrder = (a + b) * c;
    const distractors = generateNumericDistractors(ans, 2).filter(d => d !== wrongOrder);
    const options = shuffle([ans, wrongOrder, ...distractors.slice(0, 2)]);

    return {
      id: qId,
      prompt: `${a} + ${b} × ${c} = ?`,
      options,
      correctIndex: options.indexOf(ans),
      correctAnswer: ans,
      explanation: `Darab didahulukan: ${b} × ${c} = ${b * c}, kemudian ${a} + ${b * c} = ${ans}!`,
      visualEmoji: '🧠',
      category: 'Operasi Bergabung',
      difficulty,
    };
  }

  if (type === 'fractions_easy') {
    const denom = [2, 4, 5, 10][randInt(0, 3)];
    const factor = randInt(3, 8);
    const total = denom * factor;
    const ans = factor;
    const prompt = `1/${denom} daripada ${total} ialah ?`;
    const distractors = generateNumericDistractors(ans, 1);
    const options = shuffle([ans, ...distractors]);

    return {
      id: qId,
      prompt,
      options,
      correctIndex: options.indexOf(ans),
      correctAnswer: ans,
      explanation: `${total} ÷ ${denom} = ${ans}. Maka 1/${denom} daripada ${total} ialah ${ans}.`,
      visualEmoji: '🍰',
      category: 'Pecahan Asas',
      difficulty,
    };
  }

  if (type === 'perimeter') {
    const side = randInt(4, 12);
    const ans = side * 4;
    const distractors = [side * 2, side * side, ans + 4, ans - 4];
    const uniqueDistractors = distractors.filter(d => d !== ans && d > 0).slice(0, 3);
    const options = shuffle([ans, ...uniqueDistractors]);

    return {
      id: qId,
      prompt: `Perimeter segi empat sama dengan sisi ${side} cm = ?`,
      options: options.map(o => `${o} cm`),
      correctIndex: options.map(o => `${o} cm`).indexOf(`${ans} cm`),
      correctAnswer: `${ans} cm`,
      explanation: `Perimeter = 4 × ${side} cm = ${ans} cm!`,
      visualEmoji: '📐',
      category: 'Ukuran Perimeter',
      difficulty,
    };
  }

  // add_sub_large
  const a = randInt(120, 450);
  const b = randInt(50, 200);
  const ans = a + b;
  const distractors = generateNumericDistractors(ans, 10);
  const options = shuffle([ans, ...distractors]);

  return {
    id: qId,
    prompt: `${a} + ${b} = ?`,
    options,
    correctIndex: options.indexOf(ans),
    correctAnswer: ans,
    explanation: `${a} + ${b} = ${ans}.`,
    visualEmoji: '🌟',
    category: 'Tambah Nombor Besar',
    difficulty,
  };
}

// Generate age 11-12 question
function generateAge11to12(difficulty: 1 | 2 | 3): Question {
  const types = ['percentage', 'ratio', 'area_geometry', 'brackets_ops', 'decimals', 'word_problem'];
  const type = types[randInt(0, types.length - 1)];
  const qId = 'q1112_' + Math.random().toString(36).substring(2, 9);

  if (type === 'percentage') {
    const pctList = [10, 20, 25, 50];
    const pct = pctList[randInt(0, pctList.length - 1)];
    const baseList = pct === 25 ? [40, 60, 80, 120, 160] : [50, 80, 100, 150, 200];
    const base = baseList[randInt(0, baseList.length - 1)];
    const ans = Math.round((pct / 100) * base);
    const distractors = generateNumericDistractors(ans, pct === 10 ? 5 : 10);
    const options = shuffle([ans, ...distractors]);

    return {
      id: qId,
      prompt: `${pct}% daripada ${base} ialah ?`,
      options,
      correctIndex: options.indexOf(ans),
      correctAnswer: ans,
      explanation: `(${pct} ÷ 100) × ${base} = ${ans}!`,
      visualEmoji: '📊',
      category: 'Peratusan',
      difficulty,
    };
  }

  if (type === 'ratio') {
    const r1 = randInt(1, 3);
    const r2 = randInt(2, 5);
    const mult = randInt(3, 7);
    const val1 = r1 * mult;
    const ans = r2 * mult;
    const prompt = `Nisbah A : B ialah ${r1} : ${r2}. Jika A = ${val1}, maka B = ?`;
    const distractors = generateNumericDistractors(ans, r2);
    const options = shuffle([ans, ...distractors]);

    return {
      id: qId,
      prompt,
      options,
      correctIndex: options.indexOf(ans),
      correctAnswer: ans,
      explanation: `A didarab ${mult} (${r1} × ${mult} = ${val1}). Maka B = ${r2} × ${mult} = ${ans}!`,
      visualEmoji: '⚖️',
      category: 'Nisbah & Kadaran',
      difficulty,
    };
  }

  if (type === 'area_geometry') {
    const p = randInt(5, 12);
    const l = randInt(3, 8);
    const ans = p * l;
    const distractors = generateNumericDistractors(ans, 6);
    const options = shuffle([`${ans} cm²`, `${distractors[0]} cm²`, `${distractors[1]} cm²`, `${distractors[2]} cm²`]);

    return {
      id: qId,
      prompt: `Luas segi empat tepat (panjang ${p} cm, lebar ${l} cm) = ?`,
      options,
      correctIndex: options.indexOf(`${ans} cm²`),
      correctAnswer: `${ans} cm²`,
      explanation: `Luas = Panjang × Lebar = ${p} × ${l} = ${ans} cm²!`,
      visualEmoji: '📐',
      category: 'Luas Geometri',
      difficulty,
    };
  }

  if (type === 'brackets_ops') {
    const a = randInt(40, 80);
    const b = randInt(10, 30);
    const c = [2, 4, 5, 10][randInt(0, 3)];
    const sum = a + b;
    // ensure divisible
    const adjustedSum = Math.round(sum / c) * c;
    const finalA = adjustedSum - b;
    const ans = adjustedSum / c;
    const distractors = generateNumericDistractors(ans, 2);
    const options = shuffle([ans, ...distractors]);

    return {
      id: qId,
      prompt: `(${finalA} + ${b}) ÷ ${c} = ?`,
      options,
      correctIndex: options.indexOf(ans),
      correctAnswer: ans,
      explanation: `Selesaikan dalam kurungan dahulu: ${finalA} + ${b} = ${adjustedSum}, kemudian bahagi ${c} = ${ans}!`,
      visualEmoji: '⚡',
      category: 'Operasi Kurungan',
      difficulty,
    };
  }

  if (type === 'decimals') {
    const a = [1.5, 2.5, 3.5, 4.5][randInt(0, 3)];
    const b = [2, 4, 6][randInt(0, 2)];
    const ans = +(a * b).toFixed(1);
    const distractors = [ans + 1, ans - 1, +(ans + 2.5).toFixed(1)];
    const options = shuffle([ans, ...distractors]);

    return {
      id: qId,
      prompt: `${a} × ${b} = ?`,
      options,
      correctIndex: options.indexOf(ans),
      correctAnswer: ans,
      explanation: `${a} darab ${b} bersamaan ${ans}!`,
      visualEmoji: '🎯',
      category: 'Perpuluhan',
      difficulty,
    };
  }

  // word_problem
  const speed = [50, 60, 70, 80][randInt(0, 3)];
  const hours = randInt(2, 4);
  const ans = speed * hours;
  const distractors = generateNumericDistractors(ans, speed);
  const options = shuffle([`${ans} km`, `${distractors[0]} km`, `${distractors[1]} km`, `${distractors[2]} km`]);

  return {
    id: qId,
    prompt: `Sebuah bas bergerak ${speed} km dalam 1 jam. Berapakah jarak perjalanan selepas ${hours} jam?`,
    options,
    correctIndex: options.indexOf(`${ans} km`),
    correctAnswer: `${ans} km`,
    explanation: `Jarak = Laju × Masa = ${speed} × ${hours} = ${ans} km!`,
    visualEmoji: '🚌',
    category: 'Masalah Berayat',
    difficulty,
  };
}

/**
 * Main Question Generator with Adaptive Difficulty and Special Moments
 */
export function generateQuestion(
  ageGroup: AgeGroup,
  difficultyTier: 1 | 2 | 3,
  questionNumber: number = 1
): Question {
  let q: Question;
  switch (ageGroup) {
    case '7-8':
      q = generateAge7to8(difficultyTier);
      break;
    case '9-10':
      q = generateAge9to10(difficultyTier);
      break;
    case '11-12':
      q = generateAge11to12(difficultyTier);
      break;
    default:
      q = generateAge7to8(difficultyTier);
  }

  // Provide gentle kid-friendly hint based on category
  if (!q.hint) {
    if (q.category.includes('Tambah')) {
      q.hint = 'Tip: Cuba kira menggunakan jari atau tambah kumpulan nombor sepuluh dulu!';
    } else if (q.category.includes('Tolak')) {
      q.hint = 'Tip: Kira mengundur ke belakang dari nombor yang lebih besar!';
    } else if (q.category.includes('Sifir') || q.category.includes('Darab')) {
      q.hint = 'Tip: Ingat ritma sifir atau tambah nombor yang sama beberapa kali!';
    } else if (q.category.includes('Bahagi')) {
      q.hint = 'Tip: Fikirkan sifir darabnya — nombor berapa didarab pembahagi untuk dapat nilai itu?';
    } else if (q.category.includes('Pecahan')) {
      q.hint = 'Tip: Pecahan bermaksud bahagikan jumlah asal kepada bilangan bahagian yang sama rata!';
    } else if (q.category.includes('Peratusan')) {
      q.hint = 'Tip: 50% ialah separuh, 25% ialah suku, dan 10% ialah bahagi 10!';
    } else if (q.category.includes('Perimeter')) {
      q.hint = 'Tip: Perimeter ialah jumlah ukur keliling semua sisi luar!';
    } else {
      q.hint = 'Tip: Fikir dengan tenang, kamu pasti boleh mencarinya!';
    }
  }

  // Inject Special Moments surprise every 4-6 questions (fun arcade rhythm!)
  if (questionNumber > 0 && questionNumber % 5 === 0) {
    q.specialMoment = 'bonus_2x';
  } else if (questionNumber > 0 && questionNumber % 7 === 0) {
    q.specialMoment = 'star_bonus';
  } else if (questionNumber > 0 && questionNumber % 11 === 0) {
    q.specialMoment = 'speed_rush';
  } else {
    q.specialMoment = 'none';
  }

  return q;
}

/**
 * Boss Question Generator for Final Dragon Encounter
 */
export function generateBossQuestion(ageGroup: AgeGroup, stage: number): BossQuestion {
  const qId = 'boss_' + stage + '_' + Math.random().toString(36).substring(2, 8);

  if (ageGroup === '7-8') {
    if (stage === 1) {
      const ruby = randInt(8, 14);
      const sapphire = randInt(5, 10);
      const total = ruby + sapphire;
      const distractors = generateNumericDistractors(total, 1);
      const options = shuffle([total, ...distractors]);

      return {
        id: qId,
        storyText: '🐲 Perisai Api Pertama Naga!',
        prompt: `Naga mempunyai ${ruby} permata merah dan ${sapphire} permata biru di sarangnya. Berapakah jumlah permata naga?`,
        options,
        correctIndex: options.indexOf(total),
        correctAnswer: total,
        explanation: `${ruby} + ${sapphire} = ${total} permata!`,
        visualEmoji: '💎',
        category: 'Boss Stage 1',
        difficulty: 2,
        hpDamage: 34,
      };
    } else if (stage === 2) {
      const apples = randInt(15, 25);
      const eaten = randInt(4, 9);
      const rem = apples - eaten;
      const distractors = generateNumericDistractors(rem, 1);
      const options = shuffle([rem, ...distractors]);

      return {
        id: qId,
        storyText: '🐲 Perisai Petir Naga Bergetar!',
        prompt: `Naga memetik ${apples} buah epal emas. Dia makan ${eaten} biji kerana lapar. Berapakah baki epal emas naga?`,
        options,
        correctIndex: options.indexOf(rem),
        correctAnswer: rem,
        explanation: `${apples} - ${eaten} = ${rem} buah epal emas!`,
        visualEmoji: '🍏',
        category: 'Boss Stage 2',
        difficulty: 2,
        hpDamage: 33,
      };
    } else {
      const claws = 5;
      const paws = 4;
      const total = claws * paws;
      const distractors = generateNumericDistractors(total, 4);
      const options = shuffle([total, ...distractors]);

      return {
        id: qId,
        storyText: '🐲 Serangan Terakhir Mahkota Naga!',
        prompt: `Naga mempunyai 4 kaki. Setiap kaki ada 5 kuku tajam bersinar. Berapakah jumlah semua kuku naga?`,
        options,
        correctIndex: options.indexOf(total),
        correctAnswer: total,
        explanation: `4 kaki × 5 kuku = ${total} kuku ajaib!`,
        visualEmoji: '👑',
        category: 'Boss Final Stage',
        difficulty: 3,
        hpDamage: 33,
      };
    }
  } else if (ageGroup === '9-10') {
    if (stage === 1) {
      const initial = randInt(35, 55);
      const given = randInt(12, 18);
      const received = randInt(15, 25);
      const ans = initial - given + received;
      const distractors = generateNumericDistractors(ans, 2);
      const options = shuffle([ans, ...distractors]);

      return {
        id: qId,
        storyText: '🐲 Perisai Emas Math Dragon!',
        prompt: `Seekor naga mempunyai ${initial} syiling emas. Dia memberikan ${given} syiling kepada kawannya, kemudian mendapat ${received} syiling lagi. Berapa syiling naga sekarang?`,
        options,
        correctIndex: options.indexOf(ans),
        correctAnswer: ans,
        explanation: `${initial} - ${given} = ${initial - given}, kemudian + ${received} = ${ans} syiling!`,
        visualEmoji: '🪙',
        category: 'Boss Stage 1',
        difficulty: 2,
        hpDamage: 34,
      };
    } else if (stage === 2) {
      const chests = randInt(6, 9);
      const gemsPerChest = randInt(7, 9);
      const ans = chests * gemsPerChest;
      const distractors = generateNumericDistractors(ans, chests);
      const options = shuffle([ans, ...distractors]);

      return {
        id: qId,
        storyText: '🐲 Nafas Api Ajaib Naga!',
        prompt: `Naga menyimpan khazanah dalam ${chests} peti rahsia. Setiap peti ada ${gemsPerChest} permata sihir. Berapakah jumlah kesemua permata itu?`,
        options,
        correctIndex: options.indexOf(ans),
        correctAnswer: ans,
        explanation: `${chests} × ${gemsPerChest} = ${ans} permata!`,
        visualEmoji: '💎',
        category: 'Boss Stage 2',
        difficulty: 3,
        hpDamage: 33,
      };
    } else {
      const totalCandies = 72;
      const friends = 8;
      const ans = totalCandies / friends;
      const distractors = generateNumericDistractors(ans, 1);
      const options = shuffle([ans, ...distractors]);

      return {
        id: qId,
        storyText: '🐲 Serangan Mahkota Terakhir Math Dragon!',
        prompt: `Naga ingin berkongsi ${totalCandies} gula-gula pelangi secara sama rata kepada ${friends} ekor anak naga. Berapa biji setiap anak naga dapat?`,
        options,
        correctIndex: options.indexOf(ans),
        correctAnswer: ans,
        explanation: `${totalCandies} ÷ ${friends} = ${ans} biji gula-gula!`,
        visualEmoji: '🍭',
        category: 'Boss Final Stage',
        difficulty: 3,
        hpDamage: 33,
      };
    }
  } else {
    // 11-12 years
    if (stage === 1) {
      const base = 120;
      const pct = 25;
      const ans = (base * pct) / 100;
      const distractors = generateNumericDistractors(ans, 5);
      const options = shuffle([ans, ...distractors]);

      return {
        id: qId,
        storyText: '🐲 Perisai Kristal Math Dragon Perkasa!',
        prompt: `Naga mempunyai kuasa tenaga 120 MegaWatt. Selepas berehat, dia menyerap 25% lagi kuasa tambahan. Berapakah kuasa tambahan yang diserap?`,
        options: options.map(o => `${o} MW`),
        correctIndex: options.map(o => `${o} MW`).indexOf(`${ans} MW`),
        correctAnswer: `${ans} MW`,
        explanation: `25% daripada 120 = (25 ÷ 100) × 120 = ${ans} MW!`,
        visualEmoji: '⚡',
        category: 'Boss Stage 1',
        difficulty: 2,
        hpDamage: 34,
      };
    } else if (stage === 2) {
      const r1 = 3;
      const r2 = 4;
      const dragons = 15;
      // ratio 3:4, if 15 dragons, unicorns = (15 / 3) * 4 = 20
      const ans = (dragons / r1) * r2;
      const distractors = generateNumericDistractors(ans, 2);
      const options = shuffle([ans, ...distractors]);

      return {
        id: qId,
        storyText: '🐲 Gelombang Cahaya Naga Berkilau!',
        prompt: `Nisbah bilangan naga kepada unikorn di Lembah Mistik ialah 3 : 4. Jika terdapat ${dragons} ekor naga, berapakah bilangan unikorn?`,
        options,
        correctIndex: options.indexOf(ans),
        correctAnswer: ans,
        explanation: `Faktor pendarab = ${dragons} ÷ 3 = 5. Maka unikorn = 4 × 5 = ${ans}!`,
        visualEmoji: '🦄',
        category: 'Boss Stage 2',
        difficulty: 3,
        hpDamage: 33,
      };
    } else {
      const panjang = 15;
      const lebar = 8;
      const perimeter = 2 * (panjang + lebar);
      const distractors = generateNumericDistractors(perimeter, 4);
      const options = shuffle([`${perimeter} m`, `${distractors[0]} m`, `${distractors[1]} m`, `${distractors[2]} m`]);

      return {
        id: qId,
        storyText: '🐲 Langkah Terakhir! Kalahkan Naga Jadi Hero!',
        prompt: `Kandang istana Math Dragon berbentuk segi empat tepat dengan panjang ${panjang} meter dan lebar ${lebar} meter. Berapakah perimeter pagar kandang itu?`,
        options,
        correctIndex: options.indexOf(`${perimeter} m`),
        correctAnswer: `${perimeter} m`,
        explanation: `Perimeter = 2 × (${panjang} + ${lebar}) = 2 × ${panjang + lebar} = ${perimeter} meter!`,
        visualEmoji: '🏰',
        category: 'Boss Final Stage',
        difficulty: 3,
        hpDamage: 33,
      };
    }
  }
}
