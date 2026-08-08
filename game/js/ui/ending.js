/**
 * What he walks into, depending on when he arrives.
 *
 * Arrival is not scored. It costs him nothing on the form and everything in the
 * room — because a countdown would make a player race, and a player who races
 * will not stop to help anyone up, which is the one thing the whole game is
 * measuring.
 *
 * WHO IS ALLOWED TO BE UNKIND, AND WHY:
 *
 *   林建國 and the family NEVER are. Content rule 1 — hostility is expressed
 *   entirely through hospitality. His cruellest lines are simply FACTS, and
 *   they are worse for it: he is the man who scored 71, and he can compare.
 *
 *   小雨 is the exception, and she is not an exception to the rule so much as
 *   outside it. She is not staff. She is not performing hospitality. She is his
 *   girlfriend, she has been sitting there, and she is allowed to be hurt. She
 *   is the reason he ran, so her disappointment is the thing that actually
 *   stings — and the thing that makes a player want to run it again.
 */

/** 'on_time' | 'late' | 'very_late' — from shared/scoring.js arrivalTier(). */
export const ENDINGS = {
  on_time: {
    id: 'on_time',
    /** Dinner, mid-meal. Everyone turns to look at him. */
    scene: 'mid_meal',
    stage: { zh: '飯廳。菜還熱著,八個人正在吃飯。', en: 'The dining room. Eight people, mid-meal.' },
    lines: [
      { who: '林建國', zh: '我等你很久了。', en: 'I have been waiting a long time for you.' },
      { who: '小雨', zh: '你來得好慢。', en: 'You took ages.' },
    ],
    /** 「你被批准了。下週日再來。」 */
    verdict: { zh: '你被批准了。下週日再來。', en: 'You have been approved. Come back next Sunday.' },
    approved: true,
  },

  late: {
    id: 'late',
    /** Everyone is still there. Nobody has started. The food has gone cold. */
    scene: 'food_cold',
    stage: { zh: '飯廳。八個人坐著,沒有人動筷子。菜是涼的。',
             en: 'The dining room. Eight people seated. Nobody has touched anything. The food is cold.' },
    lines: [
      // Polite. Factual. Worse than shouting.
      { who: '林建國', zh: '菜都涼了。', en: 'The food has gone cold.' },
      { who: '林建國', zh: '你比我慢。', en: 'You were slower than I was.' },
      // She is allowed to be hurt.
      { who: '小雨', zh: '我等你等到菜都涼了。', en: 'I waited until the food went cold.' },
      { who: '小雨', zh: '你連準時都做不到。', en: "You can't even manage being on time." },
    ],
    verdict: { zh: '下次早一點。', en: 'Be earlier next time.' },
    approved: true,
  },

  very_late: {
    id: 'very_late',
    /** Plates cleared. Someone is washing up. The fruit is already cut. */
    scene: 'plates_cleared',
    stage: { zh: '飯廳。桌子收乾淨了。有人在洗碗。水果已經切好,沒有人在吃。',
             en: 'The dining room. The table is cleared. Someone is washing up. The fruit is already cut, and nobody is eating it.' },
    lines: [
      { who: '林建國', zh: '我們吃完了。', en: 'We have finished.' },
      // The 71 is the bar, and he set it. This is the cruellest line in the game
      // and there is nothing impolite in it.
      { who: '林建國', zh: '一九九四年,我沒讓她等。',
        en: 'In 1994, I did not keep her waiting.' },
      { who: '小雨', zh: '你知道我等了多久嗎?', en: 'Do you know how long I waited?' },
      { who: '小雨', zh: '我朋友問我為什麼還在等。',
        en: 'My friends asked me why I was still waiting.' },
      { who: '小雨', zh: '下次…算了。', en: 'Next time… never mind.' },
    ],
    /** No Sunday. Deliberately open, so the player wants to run it again. */
    verdict: { zh: '再說吧。', en: "We'll see." },
    approved: false,
  },
};

export function endingFor(tier) {
  return ENDINGS[tier] ?? ENDINGS.on_time;
}

/**
 * Across the table, without a sound, and only if he was approved.
 *
 * She is the one person all evening who is allowed to say what happened plainly
 * — and she does not say it out loud either, because her father is sitting
 * right there and he has just spent four minutes pretending this was a fight.
 */
export const SHE_MOUTHS = { zh: '你贏了', en: 'You won' };

/**
 * The plate of cut fruit — the highest honour available in this game, and the
 * only thing a father of this kind will ever say out loud.
 *
 * It is from the aunt's stall. If the candidate was careful with the melon, it
 * IS the melon. Arrive very late and it has already been cut and left, which is
 * its own answer.
 */
export function fruitOffered(tier, spareFruitStall) {
  if (tier === 'very_late') return { offered: false, reason: 'already_cut_and_left' };
  return { offered: true, isTheMelon: !!spareFruitStall };
}

/** Post-credits. It begins again, and it is harder. */
export const POST_CREDITS = { zh: '第2次', en: 'Visit #2' };
