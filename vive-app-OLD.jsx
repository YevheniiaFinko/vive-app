import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  bg:     "#EDEAE5",
  bgSage: "#A48CC8",
  dark:   "#1A1025",
  teal:   "#7B5EA7",
  glass:  "rgba(255,255,255,0.65)",
  glassDk:"rgba(255,255,255,0.30)",
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "VIVE ✦",
    beta: "BETA",
    phases: {
      menstrual:  { name:"Menstrual",  emoji:"🌙", tagline:"Time for rest and inner quiet",         desc:"Your body is doing important work. Be gentle with yourself.",          nutrition:"Iron (spinach, lentils), omega-3, dark chocolate 70%+", movement:"Gentle yoga, walking, stretching",            work:"Reflection, planning, avoid major decisions", tip:"Magnesium glycinate + iron today — a must have" },
      follicular: { name:"Follicular", emoji:"🌱", tagline:"Time for new beginnings and fresh ideas", desc:"Estrogen is rising — along with mental clarity and motivation.",       nutrition:"Probiotics, fermented foods, light proteins",            movement:"Cardio, dancing, jogging",                    work:"Brainstorming, new projects, learning",       tip:"Now is the best time for important decisions this month" },
      ovulation:  { name:"Ovulation",  emoji:"✨", tagline:"Peak charisma and social energy",         desc:"You're at your peak! Highest energy and confidence.",                 nutrition:"Antioxidants, leafy greens, fiber",                      movement:"HIIT, strength training, group sports",       work:"Presentations, negotiations, key meetings",  tip:"The ideal moment for any important conversations" },
      luteal:     { name:"Luteal",     emoji:"🍂", tagline:"Time for completion and deep focus",      desc:"Progesterone dominates. The phase of details and completion.",         nutrition:"Magnesium (pumpkin seeds), calcium, complex carbs",      movement:"Pilates, swimming, strength exercises",       work:"Deep work, editing, completing projects",     tip:"Magnesium now reduces PMS symptoms by 40%" },
    },
    goals:       [{id:"energy",label:"⚡ Energy"},{id:"sleep",label:"😴 Sleep"},{id:"stress",label:"🌊 Stress"},{id:"hormones",label:"🌸 Hormones"},{id:"skin",label:"✨ Skin"},{id:"clarity",label:"🧠 Focus"},{id:"longevity",label:"🌿 Longevity"},{id:"weight",label:"⚖️ Weight"}],
    symptoms:    [{id:"headache",label:"Headache"},{id:"bloating",label:"Bloating"},{id:"cramps",label:"Cramps"},{id:"brainfog",label:"Brain fog"},{id:"anxiety",label:"Anxiety"},{id:"fatigue",label:"Fatigue"},{id:"irritability",label:"Irritability"},{id:"nausea",label:"Nausea"}],
    contraception:[{id:"none",label:"No contraception"},{id:"hormonal_pill",label:"Hormonal pill"},{id:"hormonal_iud",label:"Hormonal IUD"},{id:"copper_iud",label:"Copper IUD"},{id:"barrier",label:"Barrier method"},{id:"other",label:"Other"}],
    diet:        [{id:"omni",label:"🍖 Omnivore"},{id:"veg",label:"🥗 Vegetarian"},{id:"vegan",label:"🌱 Vegan"},{id:"keto",label:"🥑 Keto"},{id:"gf",label:"🌾 Gluten-free"}],
    activity:    [{id:"low",label:"🛋️ Sedentary"},{id:"moderate",label:"🚶 Moderate"},{id:"active",label:"🏃 Active"},{id:"athlete",label:"💪 Very active"}],
    supplements: [{id:"magnesium",label:"💊 Magnesium"},{id:"vitd",label:"☀️ Vitamin D3"},{id:"omega3",label:"🐟 Omega-3"},{id:"vitb",label:"🧬 Vitamins B"},{id:"iron",label:"🩸 Iron"},{id:"collagen",label:"✨ Collagen"},{id:"ashwa",label:"🌿 Ashwagandha"},{id:"probiotic",label:"🦠 Probiotics"}],
    welcome: {
      heroTitle:   ["VIVE","5 Symptoms.\nOne Root Cause.","for women 35+"],
      heroSub:     "2 minutes each morning.\nAI connects the dots — and builds a protocol just for you.",
      tags:        ["Cycle Sync","AI Insights","Perimenopause","Longevity"],
      features:    [["🔍","Find the root cause — not just the symptom"],["🌿","Protocol synced with your cycle & hormones"],["💎","Skin, energy and body — one connected picture"],["📊","Track what actually changes how you feel"]],
      startHero:   "Start Free →",
      startBottom: "Start Free →",
    },
    onboarding: {
      stepOf:      (s,t) => `Step ${s} of ${t}`,
      s0Title:     ["Let's","get started"],
      s0Sub:       "Basic info for personalisation",
      nameLabel:   "What's your name?",
      namePlaceholder: "E.g. Oksana",
      birthLabel:  "Year of birth",
      birthPlaceholder: "E.g. 1987",
      agePerimeno: (a) => `🔬 ${a} y.o. — we account for perimenopause`,
      ageOk:       (a) => `🌿 ${a} y.o. — great!`,
      cycleDayLabel:"What cycle day is today?",
      cycleDayPlaceholder: "E.g. 14",
      phase:       "phase",
      next:        "Next →",
      back:        "←",
      s1Title:     ["Your","Goals"],
      s1Sub:       "AI will personalise every recommendation for these",
      contraLabel: "Contraception",
      hormonalNote:"💊 With hormonal contraception there are no natural phases — we track your real state",
      goalsReady:  (n) => `✓ ${n} goal${n!==1?"s":""} selected — ready`,
      letsGo:      "Let's go! →",
      skinTitle:"Skin",        skinSub:"Noticed any of these in the past 3 months?",
      hairTitle:"Hair",        hairSub:"What has changed recently?",
      bodyTitle:"Body & Energy", bodySub:"What have you been experiencing?",
      sleepTitle:"Sleep & Stress",
      sleepQLabel:"Sleep quality",
      wakeLabel:"Wake at 3–4am?",
      stressLabel:"Stress level",
      nutritionTitle:"Nutrition",
      dietLabel:"Eating style", proteinLabel:"Daily protein",
      suppLabel:"Current supplements",
      goalTitle:"Your Priority", goalSub:"What do you most want to change?",
      none:"Nothing to report",
    },
    skinOpts: [{id:"dry",label:"Dryness / flakiness"},{id:"acne",label:"Adult acne / breakouts"},{id:"dull",label:"Dull, uneven tone"},{id:"wrinkles",label:"Fine lines / wrinkles"},{id:"sensitive",label:"Sensitive / reactive"},{id:"oily",label:"Oily T-zone"},{id:"puffiness",label:"Dark circles / puffiness"}],
    hairOpts: [{id:"thinning",label:"Thinning / less volume"},{id:"shedding",label:"Excess shedding"},{id:"dry",label:"Dry or brittle"},{id:"slow",label:"Slow growth"},{id:"oily",label:"Oily scalp"},{id:"texture",label:"Changed texture"}],
    bodyOpts: [{id:"belly",label:"Belly weight gain"},{id:"fatigue",label:"Constant fatigue"},{id:"brainfog",label:"Brain fog"},{id:"recovery",label:"Poor muscle recovery"},{id:"libido",label:"Low libido"},{id:"joints",label:"Joint stiffness / pain"},{id:"bloating",label:"Bloating / digestive issues"}],
    sleepOpts: [{id:"great",label:"Restful — wake refreshed"},{id:"ok",label:"OK but could be better"},{id:"poor",label:"Poor — hard to sleep or stay asleep"}],
    wakeOpts: [{id:"no",label:"No, I sleep through"},{id:"sometimes",label:"Sometimes"},{id:"yes",label:"Yes, often at 3–4am"}],
    proteinOpts: [{id:"low",label:"Low — I rarely think about protein"},{id:"moderate",label:"Moderate — some protein each meal"},{id:"high",label:"Good — I prioritise protein (80g+/day)"}],
    mainGoalOpts: [{id:"skin",label:"✨ Skin"},{id:"hair",label:"💇 Hair"},{id:"body",label:"💪 Body composition"},{id:"energy",label:"⚡ Energy & mood"},{id:"sleep",label:"😴 Sleep"},{id:"hormones",label:"🌸 Hormonal balance"},{id:"all",label:"🎯 All of the above"}],
    checkin: {
      back:        "‹ Back",
      title:       ["How did you","feel today?"],
      energy:      "Energy",
      sleep:       "Sleep",
      stress:      "Stress",
      water:       "Water",
      energyL:     (n) => n<=3?"Low":n<=6?"Moderate":"High",
      sleepL:      (n) => n<=5?"Restless":n<=7?"Okay":`${n}h · Restful`,
      stressL:     (n) => n<=3?"Relaxed":n<=5?"Moderate":"High",
      waterL:      (n) => n===1?"1 Glass":`${n} Glasses`,
      energyV:     (n) => `${Math.round(n*10)}%`,
      sleepV:      (n) => `${n} hours`,
      stressV:     (n) => `${Math.round(n*10)}%`,
      waterV:      (n) => `${n}`,
      clarity:     "Mental Clarity",
      clarityL:    (n) => n<=3?"Foggy":n<=6?"Clear":"Sharp",
      clarityV:    (n) => `${Math.round(n*10)}%`,
      eatTitle:    "Eating Window",
      eatFirst:    "FIRST MEAL",
      eatLast:     "LAST MEAL",
      eatWindow:   (h) => h===0?"—":h<12?`${h}h window`:h===12?`12h ✓`:h>=16?`${h}h 🎉`:`${h}h window`,
      eatNote:     (h) => h>=16?"Excellent! Autophagy activated 🔥":h>=14?"Great fasting window ✓":h>=12?"Good — aim for 14-16h":"Try to close your eating window earlier",
      // ── Longevity Lab ──
      labTitle:    "⚗️ Longevity Lab",
      // HRV
      hrv:         "HRV",
      hrvPlaceholder:"E.g. 52",
      hrvUnit:     "ms",
      hrvL:        (n) => !n?"Not logged":n<30?"Low recovery":n<50?"Moderate":n<70?"Good ✓":"Excellent 🌿",
      hrvInfo:     "HRV = balance of your autonomic nervous system. Higher = stronger recovery & stress resilience.",
      // Cold / Heat
      coldHeatTitle:"Cold & Heat",
      coldLabel:   "Cold shower",
      heatLabel:   "Sauna / Bath",
      minSuffix:   "min",
      coldHeatNote:"Cold boosts norepinephrine & metabolic rate. Sauna mimics cardio — shown to extend lifespan by 40% (Laukkanen, 2018).",
      // Social Connection
      social:      "Social Connection",
      socialL:     (n) => n<=2?"Isolated":n<=4?"Low":n<=6?"Present":"Connected",
      socialV:     (n) => `${Math.round(n*10)}%`,
      socialInfo:  "Strong social bonds reduce all-cause mortality by 45% — more powerful than quitting smoking (Harvard Study of Adult Development, 85 years).",
      // Inflammation
      inflam:      "Inflammation Sense",
      inflammL:    (n) => n<=3?"Clear":n<=5?"Mild":n<=7?"Notable":"High",
      inflammV:    (n) => `${Math.round(n*10)}%`,
      inflammNote: (n) => n<=3?"Body feels light and clean ✓":n<=5?"Mild signals — hydrate, eat anti-inflammatory":n<=7?"Notable — reduce sugar, alcohol & processed food":"High — prioritise rest, fasting, consider a doctor",
      inflammInfo: "Chronic low-grade inflammation is the silent driver of aging. Tracking catches patterns before they become problems.",
      // Menopause Radar (40+)
      menoTitle:   "Menopause Radar",
      menoSub:     "Perimenopause symptom tracker",
      menoItems:   [{id:"hotflash",label:"Hot flashes"},{id:"nightsweat",label:"Night sweats"},{id:"moodswing",label:"Mood swings"},{id:"joint",label:"Joint pain"},{id:"brainfog",label:"Brain fog"},{id:"palpitation",label:"Palpitations"},{id:"dryskin",label:"Dry skin"},{id:"libido",label:"Low libido"}],
      menoNote:    "Tracking perimenopause symptoms reveals hormonal patterns and helps time lifestyle, nutrition & supplement interventions.",
      notesLabel:  "Notes (optional)",
      notesPlaceholder: "How did you feel? Any unusual symptoms...",
      weatherLabel:"Weather today",
      weatherSun:  "Sunny",
      weatherCloud:"Cloudy",
      weatherRain: "Rain / Stormy",
      done:        "Done",
    },
    insight: {
      morningTitle: "Morning",
      daytimeTitle: "Daytime",
      eveningTitle: "Evening",
      aiTitle:     "AI Wellness Insights",
      sciChip:     (p) => `${p} · Science-backed`,
      todaysTip:   "Today's tip",
      dashBtn:     "Go to Dashboard →",
    },
    dashboard: {
      settingsIcon:"⚙️",
      moodPills:   [{emoji:"😊",label:"Great"},{emoji:"😐",label:"Okay"},{emoji:"😔",label:"Low"}],
      scoreLabel:  "WELLNESS SCORE",
      checkinNote: (n) => n>0?`Today's Check-in · ${n}h ago`:"Today's Check-in · Not done",
      insightCard: ["How your cycle affects","energy today"],
      energySleep: "Energy & Sleep",
      sevenDay:    "7-day pattern",
      weekly:      "Weekly",
      currentPhase:"Current Phase",
      streakTitle: "Longevity Streak",
      streakDays:  (n) => n===1?"1 day":`${n} days`,
      streakSub:   "consecutive days",
      streakEmpty: "Start your streak today",
      habitSleep:  "Sleep 7h+",
      habitWater:  "Water 6+",
      habitClarity:"Clarity tracked",
      habitEating: "Eating window",
      streakMsg:   (n) => n===0?"Complete today's check-in to start":n<3?"Great start! Keep going 💪":n<7?"You're building a habit 🌱":n<14?"One week strong! 🔥":"Longevity in progress 🌿",
      habitHrv:    "HRV logged",
      habitSocial: "Social ✓",
      habitCold:   "Cold/Heat",
      bioTitle:    "Today's Biomarkers",
      bioHrv:      "HRV",
      bioSocial:   "Social",
      bioInflam:   "Inflammation",
      inflammAvg:  (n) => `${n}/10`,
      inflammTrend:(n) => n<=3?"Body calm 🌿":n<=5?"Mild signals":"Watch it ⚠️",
      menoTitle:   "Menopause Radar",
      menoWeek:    "last 7 days",
      menoNoData:  "Start tracking to see your radar",
    },
    greet: {
      morning:   "Good morning",
      afternoon: "Good afternoon",
      evening:   "Good evening",
    },
    insightText: {
      strong:      (n) => `${n}, you're having a strong day`,
      okay:        (n) => `${n}, there's room for a good day`,
      low:         (n) => `${n}, your body is asking for attention today`,
      perimeno:    (e) => `At this age progesterone declines earlier than estrogen. ${e<=5?"Low energy right now may be hormonal — that's normal.":"Your energy is good — support it with magnesium and quality sleep."} Adaptogens (ashwagandha, rhodiola) are especially helpful.`,
      hormonal:    "With hormonal contraception there are no natural cycle phases — but we track your wellbeing and adapt advice to your actual state.",
      water:       (w) => `${w} glasses — too little. Dehydration at 2% reduces cognitive function by 20%. Put a glass in front of you right now.`,
      noMove:      (p) => `Even 20 min of walking reduces cortisol and boosts dopamine. ${p==="luteal"?"In the luteal phase moderate movement is better than intense.":"Your phase supports: "}`,
      supplements: (s) => `For hormonal balance regularity matters. ${s} work best every day.`,
      sleepH:      (h) => `${h}h — not enough. Magnesium glycinate 300mg 30 min before bed. Goal: 7-9h.`,
      sleepQ:      "Sleep quality was reduced. Avoid screens an hour before bed.",
      stress:      "Inhale 4 → hold 4 → exhale 4 → hold 4. Repeat 4 times. Reduces cortisol in 3 minutes — proven by neuroscience.",
      tags: {
        age40:       "Age 40+", hormones:"Hormonal shifts", contraception:"Contraception", hydration:"Hydration", movement:"Movement", symptoms:"Symptoms", supplements:"Supplements", sleep:"Sleep", stress:"Stress",
      },
      titles: {
        hormones:    "Hormonal Shifts",
        contraption: "Hormonal Contraception",
        water:       "Not Enough Water",
        noMove:      "No Movement Yet Today",
        supplements: "You Haven't Taken Your Supplements",
        sleep:       "Sleep Affected Your State",
        stress:      "Cortisol Needs Attention",
      },
    },
    healthhub: {
      title:          "Health Hub",
      subtitle:       "Personalised for your body",
      tabLabs:        "Labs",
      tabGadgets:     "Gadgets",
      tabSupps:       "Supps",
      loading:        "Analysing your profile...",
      labsNote:       "Priority tests based on your age, goals and cycle phase. ★ = recommended first.",
      labsDisclaimer: "Educational information only — not medical advice. Discuss tests with your doctor.",
      tier1:          "Essential (start here)",
      tier2:          "Advanced protocol",
    },
  },

  uk: {
    appName: "VIVE ✦",
    beta: "БЕТА",
    phases: {
      menstrual:  { name:"Менструальна", emoji:"🌙", tagline:"Час відновлення і внутрішньої тиші",     desc:"Твоє тіло зараз виконує велику роботу. Будь ніжною до себе.",             nutrition:"Залізо (шпинат, сочевиця), омега-3, чорний шоколад 70%+", movement:"Ніжна йога, ходьба, розтяжка",              work:"Рефлексія, планування, уникай великих рішень", tip:"Магній гліцинат + залізо сьогодні — must have" },
      follicular: { name:"Фолікулярна",  emoji:"🌱", tagline:"Час нових починань і свіжих ідей",       desc:"Естроген зростає — разом з ним ясність думки та мотивація.",               nutrition:"Пробіотики, ферментовані продукти, легкі білки",              movement:"Кардіо, танці, пробіжка",                    work:"Мозковий штурм, нові проекти, навчання",       tip:"Зараз — найкращий час для важливих рішень місяця" },
      ovulation:  { name:"Овуляція",     emoji:"✨", tagline:"Пік харизми і соціальної енергії",        desc:"Ти зараз на піку! Найвища енергія і впевненість.",                         nutrition:"Антиоксиданти, листові зелені, клітковина",                   movement:"HIIT, силові тренування, груповий спорт",    work:"Презентації, переговори, важливі зустрічі",    tip:"Ідеальний момент для будь-яких важливих розмов" },
      luteal:     { name:"Лютеальна",    emoji:"🍂", tagline:"Час завершення і глибокого фокусу",       desc:"Прогестерон домінує. Фаза деталей і завершення.",                          nutrition:"Магній (гарбузове насіння), кальцій, складні вуглеводи",     movement:"Пілатес, плавання, силові вправи",           work:"Deep work, редагування, завершення проектів",  tip:"Магній зараз знижує ПМС симптоми на 40%" },
    },
    goals:       [{id:"energy",label:"⚡ Енергія"},{id:"sleep",label:"😴 Сон"},{id:"stress",label:"🌊 Стрес"},{id:"hormones",label:"🌸 Гормони"},{id:"skin",label:"✨ Шкіра"},{id:"clarity",label:"🧠 Фокус"},{id:"longevity",label:"🌿 Довголіття"},{id:"weight",label:"⚖️ Вага"}],
    symptoms:    [{id:"headache",label:"Головний біль"},{id:"bloating",label:"Здуття"},{id:"cramps",label:"Спазми"},{id:"brainfog",label:"Туман в голові"},{id:"anxiety",label:"Тривожність"},{id:"fatigue",label:"Втома"},{id:"irritability",label:"Дратівливість"},{id:"nausea",label:"Нудота"}],
    contraception:[{id:"none",label:"Без контрацепції"},{id:"hormonal_pill",label:"Гормональні таблетки"},{id:"hormonal_iud",label:"Гормональна спіраль"},{id:"copper_iud",label:"Мідна спіраль"},{id:"barrier",label:"Бар'єрний метод"},{id:"other",label:"Інше"}],
    diet:        [{id:"omni",label:"🍖 Всеїдна"},{id:"veg",label:"🥗 Вегетаріанка"},{id:"vegan",label:"🌱 Веганка"},{id:"keto",label:"🥑 Кето"},{id:"gf",label:"🌾 Без глютену"}],
    activity:    [{id:"low",label:"🛋️ Малорухливий"},{id:"moderate",label:"🚶 Помірна активність"},{id:"active",label:"🏃 Активна"},{id:"athlete",label:"💪 Дуже активна"}],
    supplements: [{id:"magnesium",label:"💊 Магній"},{id:"vitd",label:"☀️ Вітамін D3"},{id:"omega3",label:"🐟 Омега-3"},{id:"vitb",label:"🧬 Вітаміни B"},{id:"iron",label:"🩸 Залізо"},{id:"collagen",label:"✨ Колаген"},{id:"ashwa",label:"🌿 Ашваганда"},{id:"probiotic",label:"🦠 Пробіотики"}],
    welcome: {
      heroTitle:   ["VIVE","5 симптомів.\nОдна причина.","для жінок 35+"],
      heroSub:     "2 хвилини вранці.\nAI знаходить зв'язок — і будує протокол саме для тебе.",
      tags:        ["Цикл-синк","AI-інсайти","Перименопауза","Довголіття"],
      features:    [["🔍","Знаходимо причину — не тільки симптом"],["🌿","Протокол синхронізований з циклом і гормонами"],["💎","Шкіра, енергія і тіло — в одній картині"],["📊","Відстежуй що справді змінює твій стан"]],
      startHero:   "Почати безкоштовно →",
      startBottom: "Почати безкоштовно →",
    },
    onboarding: {
      stepOf:      (s,t) => `Крок ${s} з ${t}`,
      s0Title:     ["Давай","познайомимось"],
      s0Sub:       "Базова інформація для персоналізації",
      nameLabel:   "Як тебе звати?",
      namePlaceholder: "Наприклад: Євгенія",
      birthLabel:  "Рік народження",
      birthPlaceholder: "Наприклад: 1987",
      agePerimeno: (a) => `🔬 ${a} р. — враховуємо особливості перименопаузи`,
      ageOk:       (a) => `🌿 ${a} р. — чудово!`,
      cycleDayLabel:"Який день циклу сьогодні?",
      cycleDayPlaceholder: "Наприклад: 14",
      phase:       "фаза",
      next:        "Далі →",
      back:        "←",
      s1Title:     ["Твої","Цілі"],
      s1Sub:       "AI персоналізує кожну рекомендацію під них",
      contraLabel: "Контрацепція",
      hormonalNote:"💊 При гормональній контрацепції природних фаз немає — відстежуємо реальний стан",
      goalsReady:  (n) => {
        const word = n===1?"ціль":n<5?"цілі":"цілей"
        return `✓ Обрано ${n} ${word} — готово`
      },
      letsGo:      "Починаємо! →",
      skinTitle:"Шкіра",        skinSub:"Помічала щось із цього за останні 3 місяці?",
      hairTitle:"Волосся",      hairSub:"Що змінилось останнім часом?",
      bodyTitle:"Тіло і енергія", bodySub:"Що ти відчувала?",
      sleepTitle:"Сон і стрес",
      sleepQLabel:"Якість сну",
      wakeLabel:"Прокидаєшся о 3–4 ночі?",
      stressLabel:"Рівень стресу",
      nutritionTitle:"Харчування",
      dietLabel:"Стиль харчування", proteinLabel:"Щоденний білок",
      suppLabel:"Добавки",
      goalTitle:"Твій пріоритет", goalSub:"Що найбільше хочеш змінити?",
      none:"Нічого з цього",
    },
    skinOpts: [{id:"dry",label:"Сухість / лущення"},{id:"acne",label:"Доросле акне / висипання"},{id:"dull",label:"Тьмяна, нерівна текстура"},{id:"wrinkles",label:"Дрібні зморшки"},{id:"sensitive",label:"Чутлива / реактивна"},{id:"oily",label:"Жирна Т-зона"},{id:"puffiness",label:"Темні кола / набряки"}],
    hairOpts: [{id:"thinning",label:"Стоншення / менше об'єму"},{id:"shedding",label:"Надмірне випадіння"},{id:"dry",label:"Сухе або ламке"},{id:"slow",label:"Повільний ріст"},{id:"oily",label:"Жирна шкіра голови"},{id:"texture",label:"Змінена текстура"}],
    bodyOpts: [{id:"belly",label:"Жир на животі / талії"},{id:"fatigue",label:"Постійна втома"},{id:"brainfog",label:"Туман в голові"},{id:"recovery",label:"Поганий відновлення м'язів"},{id:"libido",label:"Знижене лібідо"},{id:"joints",label:"Скутість / біль у суглобах"},{id:"bloating",label:"Здуття / проблеми з кишківником"}],
    sleepOpts: [{id:"great",label:"Відновлюючий — прокидаюсь бадьорою"},{id:"ok",label:"Нормально, але могло б бути краще"},{id:"poor",label:"Погано — важко заснути або прокидаюсь"}],
    wakeOpts: [{id:"no",label:"Ні, сплю до ранку"},{id:"sometimes",label:"Іноді"},{id:"yes",label:"Так, часто о 3–4 ночі"}],
    proteinOpts: [{id:"low",label:"Мало — рідко думаю про білок"},{id:"moderate",label:"Помірно — є білок у кожному прийомі"},{id:"high",label:"Добре — пріоритизую білок (80г+/день)"}],
    mainGoalOpts: [{id:"skin",label:"✨ Шкіра"},{id:"hair",label:"💇 Волосся"},{id:"body",label:"💪 Склад тіла"},{id:"energy",label:"⚡ Енергія і настрій"},{id:"sleep",label:"😴 Сон"},{id:"hormones",label:"🌸 Гормональний баланс"},{id:"all",label:"🎯 Все вищезазначене"}],
    checkin: {
      back:        "‹ Назад",
      title:       ["Як ти почувалась","сьогодні?"],
      energy:      "Енергія",
      sleep:       "Сон",
      stress:      "Стрес",
      water:       "Вода",
      energyL:     (n) => n<=3?"Низько":n<=6?"Помірно":"Добре",
      sleepL:      (n) => n<=5?"Погано":n<=7?"Нормально":`${n}г · Добре`,
      stressL:     (n) => n<=3?"Розслаблено":n<=5?"Помірно":"Напружено",
      waterL:      (n) => n===1?"1 склянка":`${n} склянок`,
      energyV:     (n) => `${Math.round(n*10)}%`,
      sleepV:      (n) => `${n} год`,
      stressV:     (n) => `${Math.round(n*10)}%`,
      waterV:      (n) => `${n}`,
      clarity:     "Ясність розуму",
      clarityL:    (n) => n<=3?"Туманно":n<=6?"Ясно":"Гостро",
      clarityV:    (n) => `${Math.round(n*10)}%`,
      eatTitle:    "Вікно харчування",
      eatFirst:    "ПЕРШИЙ ПРИЙОМ",
      eatLast:     "ОСТАННІЙ ПРИЙОМ",
      eatWindow:   (h) => h===0?"—":h<12?`${h}г вікно`:h===12?`12г ✓`:h>=16?`${h}г 🎉`:`${h}г вікно`,
      eatNote:     (h) => h>=16?"Чудово! Аутофагія активована 🔥":h>=14?"Відмінне вікно голодування ✓":h>=12?"Добре — цілься на 14-16г":"Спробуй закрити вікно харчування раніше",
      // ── Longevity Lab ──
      labTitle:    "⚗️ Longevity Lab",
      // HRV
      hrv:         "HРВ",
      hrvPlaceholder:"Наприклад: 52",
      hrvUnit:     "мс",
      hrvL:        (n) => !n?"Не зафіксовано":n<30?"Низьке відновлення":n<50?"Помірне":n<70?"Добре ✓":"Відмінне 🌿",
      hrvInfo:     "ВСР = баланс вегетативної нервової системи. Вище = краще відновлення та стресостійкість.",
      // Cold / Heat
      coldHeatTitle:"Холод і Тепло",
      coldLabel:   "Холодний душ",
      heatLabel:   "Сауна / Ванна",
      minSuffix:   "хв",
      coldHeatNote:"Холод підвищує норепінефрин та метаболізм. Сауна імітує кардіо — подовжує тривалість життя на 40% (Laukkanen, 2018).",
      // Social
      social:      "Соціальний зв'язок",
      socialL:     (n) => n<=2?"Ізольовано":n<=4?"Низький":n<=6?"Присутній":"Сильний",
      socialV:     (n) => `${Math.round(n*10)}%`,
      socialInfo:  "Сильні соціальні зв'язки знижують смертність на 45% — ефективніше за відмову від куріння (Гарвардське дослідження, 85 років).",
      // Inflammation
      inflam:      "Відчуття запалення",
      inflammL:    (n) => n<=3?"Чисто":n<=5?"М'яко":n<=7?"Помітно":"Сильно",
      inflammV:    (n) => `${Math.round(n*10)}%`,
      inflammNote: (n) => n<=3?"Тіло легке і чисте ✓":n<=5?"М'які сигнали — вода, протизапальне харчування":n<=7?"Помітно — менше цукру, алкоголю":"Сильно — відпочинок, інтервальне голодування, лікар",
      inflammInfo: "Хронічне запалення низького ступеня — тихий двигун старіння. Відстеження допоможе знайти патерни завчасно.",
      // Menopause Radar (40+)
      menoTitle:   "Радар менопаузи",
      menoSub:     "Трекер симптомів перименопаузи",
      menoItems:   [{id:"hotflash",label:"Припливи"},{id:"nightsweat",label:"Нічна пітливість"},{id:"moodswing",label:"Перепади настрою"},{id:"joint",label:"Біль у суглобах"},{id:"brainfog",label:"Туман у голові"},{id:"palpitation",label:"Серцебиття"},{id:"dryskin",label:"Суха шкіра"},{id:"libido",label:"Знижене лібідо"}],
      menoNote:    "Трекінг симптомів перименопаузи виявляє гормональні патерни та допомагає підібрати харчування, спосіб життя та добавки.",
      notesLabel:  "Нотатки (необов'язково)",
      notesPlaceholder: "Як ти почувалась? Незвичні симптоми...",
      weatherLabel:"Погода сьогодні",
      weatherSun:  "Сонячно",
      weatherCloud:"Хмарно",
      weatherRain: "Дощ / Буря",
      done:        "Готово",
    },
    insight: {
      morningTitle: "Ранок",
      daytimeTitle: "День",
      eveningTitle: "Вечір",
      aiTitle:     "AI Wellness Інсайти",
      sciChip:     (p) => `${p} · Науково обґрунтовано`,
      todaysTip:   "Порада дня",
      dashBtn:     "Перейти до дашборду →",
    },
    dashboard: {
      settingsIcon:"⚙️",
      moodPills:   [{emoji:"😊",label:"Добре"},{emoji:"😐",label:"Нейтрально"},{emoji:"😔",label:"Погано"}],
      scoreLabel:  "WELLNESS SCORE",
      checkinNote: (n) => n>0?`Сьогоднішній check-in · ${n}г тому`:"Сьогоднішній check-in · Не зроблено",
      insightCard: ["Як твій цикл впливає","на енергію сьогодні"],
      energySleep: "Енергія та Сон",
      sevenDay:    "Динаміка 7 днів",
      weekly:      "Тиждень",
      currentPhase:"Поточна фаза",
      streakTitle: "Longevity Streak",
      streakDays:  (n) => n===1?"1 день":n<5?`${n} дні`:`${n} днів`,
      streakSub:   "поспіль",
      streakEmpty: "Почни свій стрік сьогодні",
      habitSleep:  "Сон 7г+",
      habitWater:  "Вода 6+",
      habitClarity:"Ясність відстежено",
      habitEating: "Вікно харчування",
      streakMsg:   (n) => n===0?"Зроби сьогоднішній check-in":n<3?"Гарний початок! Продовжуй 💪":n<7?"Ти формуєш звичку 🌱":n<14?"Тиждень — це сила! 🔥":"Довголіття в процесі 🌿",
      habitHrv:    "ВСР записано",
      habitSocial: "Зв'язок ✓",
      habitCold:   "Холод/Тепло",
      bioTitle:    "Біомаркери дня",
      bioHrv:      "ВСР",
      bioSocial:   "Соціальне",
      bioInflam:   "Запалення",
      inflammAvg:  (n) => `${n}/10`,
      inflammTrend:(n) => n<=3?"Тіло чисте 🌿":n<=5?"М'які сигнали":"Стеж за цим ⚠️",
      menoTitle:   "Радар менопаузи",
      menoWeek:    "останні 7 днів",
      menoNoData:  "Почни відстежувати щоб побачити радар",
    },
    greet: {
      morning:   "Доброго ранку",
      afternoon: "Доброго дня",
      evening:   "Доброго вечора",
    },
    insightText: {
      strong:      (n) => `${n}, сьогодні у тебе сильний день`,
      okay:        (n) => `${n}, є простір для хорошого дня`,
      low:         (n) => `${n}, твоє тіло просить уваги сьогодні`,
      perimeno:    (e) => `У цьому віці прогестерон знижується раніше естрогену. ${e<=5?"Низька енергія зараз може бути гормональною — це нормально.":"Твоя енергія сьогодні добра — підтримуй магнієм і якісним сном."} Адаптогени (ашваганда, родіола) особливо корисні.`,
      hormonal:    "При гормональній контрацепції природних фаз циклу немає — але ми відстежуємо самопочуття і адаптуємо поради під твій реальний стан.",
      water:       (w) => `${w} склянок — замало. Зневоднення на 2% знижує когнітивні функції на 20%. Постав склянку перед собою прямо зараз.`,
      noMove:      (p) => `Навіть 20 хв прогулянки знижує кортизол і підвищує дофамін. ${p==="luteal"?"В лютеальній фазі помірний рух краще інтенсивного.":"Твоя фаза підтримує: "}`,
      supplements: (s) => `Для гормонального балансу регулярність важлива. ${s} найкраще працюють щодня.`,
      sleepH:      (h) => `${h} год — недостатньо. Магній гліцинат 300мг за 30 хв до сну. Ціль: 7-9 год.`,
      sleepQ:      "Якість сну знижена. Уникай екранів за годину до сну.",
      stress:      "Вдих 4 → затримка 4 → видих 4 → затримка 4. Повтори 4 рази. Знижує кортизол за 3 хвилини — доведено нейронаукою.",
      tags: {
        age40:       "Вік 40+", hormones:"Гормони", contraception:"Контрацепція", hydration:"Гідрація", movement:"Рух", symptoms:"Симптоми", supplements:"Добавки", sleep:"Сон", stress:"Стрес",
      },
      titles: {
        hormones:    "Гормональні зміни",
        contraption: "Гормональна контрацепція",
        water:       "Недостатньо води",
        noMove:      "Сьогодні ще без руху",
        supplements: "Ти не прийняла добавки",
        sleep:       "Сон вплинув на стан",
        stress:      "Кортизол потребує уваги",
      },
    },
    healthhub: {
      title:          "Health Hub",
      subtitle:       "Персоналізовано під твоє тіло",
      tabLabs:        "Аналізи",
      tabGadgets:     "Гаджети",
      tabSupps:       "Добавки",
      loading:        "Аналізую твій профіль...",
      labsNote:       "Пріоритетні аналізи на основі твого віку, цілей та фази циклу. ★ = здати першими.",
      labsDisclaimer: "Освітня інформація, не медична порада. Обговори аналізи з лікарем.",
      tier1:          "Базові (почати звідси)",
      tier2:          "Розширений протокол",
    },
  },
}

// ─── ROOT CAUSE DATA ─────────────────────────────────────────────────────────
const CAUSE_DATA = {
  en: {
    cortisol:     { icon:"⚡", title:"Elevated Cortisol", subtitle:"Chronic stress affecting your whole body", body:"Elevated cortisol suppresses progesterone, triggers hair shedding, promotes belly fat, and disrupts sleep. Your symptoms across skin, hair, and energy may share one source.", protocol:["🍳 Eat within 1h of waking — blood sugar stability lowers cortisol spikes","💊 Magnesium glycinate 300mg before bed — reduces cortisol, improves sleep","🏋️ Swap HIIT for strength training 2x this week — HIIT raises cortisol further right now"] },
    estrogen:     { icon:"🌸", title:"Estrogen Fluctuation", subtitle:"Hormonal shift affecting skin, hair & brain", body:"Estrogen stimulates collagen by 76%, regulates hair follicle cycles, and protects neurotransmitters. When it fluctuates you notice it in skin, hair texture, sleep quality, and mental clarity.", protocol:["🥦 Cruciferous vegetables (broccoli, cauliflower) daily — support estrogen metabolism","💊 Vitamin D3 2000 IU + Omega-3 daily — support hormonal balance and skin integrity","😴 Sleep before midnight — estrogen-related brain restoration happens in early sleep cycles"] },
    protein:      { icon:"💪", title:"Protein & Iron Deficiency", subtitle:"The silent driver of hair, energy & muscle loss", body:"Most women eat 40–60g protein daily. Hair follicles, skin repair, muscles, and immunity all compete for what's available. Low ferritin is the #1 overlooked cause of hair shedding.", protocol:["🍳 Add 25–30g protein at breakfast — eggs, Greek yogurt, or protein powder","🥩 Target 1.6g protein per kg bodyweight daily (most women get 0.6g)","💊 Ask your doctor to test ferritin specifically — not just general iron levels"] },
    pcos:         { icon:"🔬", title:"PCOS Pattern", subtitle:"1 in 4 women have PCOS — 70% don't know", body:"Hormonal acne, hair thinning, and belly weight gain together are a classic PCOS pattern. PCOS affects insulin, cortisol, androgens, and metabolism simultaneously — not just reproduction.", protocol:["🍳 Prioritise protein + reduce refined carbs — improves insulin sensitivity","🏋️ Strength training 3x/week — most effective intervention for PCOS symptoms","🩸 Ask your doctor: testosterone, DHEA-S, fasting insulin, AMH"] },
    inflammation: { icon:"🔥", title:"Low-grade Inflammation", subtitle:"Silent driver of skin, energy & gut issues", body:"Chronic low-grade inflammation — from food, stress, or gut imbalance — damages the skin barrier, impairs energy production, and drives a cycle of symptoms: reactive skin, bloating, fatigue.", protocol:["🐟 Omega-3 2g/day from fish oil — anti-inflammatory, supports skin barrier","🥗 Fermented foods (kimchi, kefir, yogurt) 3x/week — gut microbiome drives inflammation","❌ Identify your triggers — alcohol, gluten, or dairy often drive reactive skin and bloating"] },
  },
  uk: {
    cortisol:     { icon:"⚡", title:"Підвищений кортизол", subtitle:"Хронічний стрес впливає на весь організм", body:"Підвищений кортизол пригнічує прогестерон, провокує випадіння волосся, накопичення жиру на животі та порушує сон. Твої симптоми зі шкірою, волоссям і енергією можуть мати одне джерело.", protocol:["🍳 Їж протягом 1г після пробудження — стабілізація цукру знижує стрибки кортизолу","💊 Магній гліцинат 300мг перед сном — знижує кортизол, покращує сон","🏋️ Заміни HIIT на силові тренування 2 рази цього тижня — HIIT зараз підвищує кортизол"] },
    estrogen:     { icon:"🌸", title:"Флуктуація естрогену", subtitle:"Гормональний зсув впливає на шкіру, волосся і мозок", body:"Естроген стимулює синтез колагену на 76%, регулює цикли фолікулів і захищає нейротрансмітери. Коли він коливається — помічаєш у шкірі, текстурі волосся, якості сну і чіткості думок.", protocol:["🥦 Хрестоцвіті (броколі, цвітна капуста) щодня — підтримують метаболізм естрогену","💊 Вітамін D3 2000 МО + Омега-3 щодня — гормональний баланс і цілісність шкіри","😴 Сон до опівночі — відновлення мозку відбувається в ранніх циклах сну"] },
    protein:      { icon:"💪", title:"Дефіцит білку і заліза", subtitle:"Прихований двигун втрати волосся, енергії і м'язів", body:"Більшість жінок їдять 40–60г білку на день. Фолікули, шкіра, м'язи і імунітет конкурують за те, що є. Низький феритин — причина №1 випадіння волосся, яку часто пропускають в аналізах.", protocol:["🍳 Додай 25–30г білку на сніданок — яйця, грецький йогурт або протеїн","🥩 Ціль: 1.6г білку на кг ваги на день (більшість жінок отримують 0.6г)","💊 Попроси лікаря перевірити феритин окремо — не просто загальне залізо"] },
    pcos:         { icon:"🔬", title:"Патерн СПКЯ", subtitle:"Кожна 4-та жінка має СПКЯ — 70% не знають", body:"Гормональне акне, стоншення волосся і жир на животі разом — класичний патерн СПКЯ. СПКЯ впливає на інсулін, кортизол, андрогени і метаболізм одночасно — не лише на репродукцію.", protocol:["🍳 Пріоритизуй білок, знижуй рафіновані вуглеводи — покращує чутливість до інсуліну","🏋️ Силові тренування 3 рази/тиждень — найефективніша інтервенція для СПКЯ","🩸 Попроси лікаря: тестостерон, ДГЕА-С, інсулін натщесерце, АМГ"] },
    inflammation: { icon:"🔥", title:"Хронічне запалення", subtitle:"Прихований двигун проблем зі шкірою, енергією і кишківником", body:"Хронічне запалення — від їжі, стресу або дисбалансу мікробіому — пошкоджує шкірний бар'єр, порушує виробництво енергії і підживлює симптоми: реактивна шкіра, здуття, втома.", protocol:["🐟 Омега-3 2г/день — протизапальна дія, підтримує шкірний бар'єр","🥗 Ферментовані продукти (кімчі, кефір, йогурт) 3 рази/тиждень — мікробіом контролює запалення","❌ Визнач тригери — алкоголь, глютен або молочне часто провокують реактивну шкіру і здуття"] },
  },
}

function getRootCauses(profile) {
  const skin = profile.skinSymptoms || [], hair = profile.hairSymptoms || [], body = profile.bodySymptoms || []
  const age  = profile.birthYear ? calcAge(profile.birthYear) : 35
  const s = { cortisol:0, estrogen:0, protein:0, pcos:0, inflammation:0 }

  // Cortisol/stress
  if ((profile.stressLevel||5) >= 7) s.cortisol += 2
  if ((profile.stressLevel||5) >= 5) s.cortisol += 1
  if (profile.wakeNight === "yes") s.cortisol += 2
  if (profile.wakeNight === "sometimes") s.cortisol += 1
  if (body.includes("belly")) s.cortisol += 1
  if (body.includes("brainfog")) s.cortisol += 1
  if (body.includes("fatigue")) s.cortisol += 1
  if (skin.includes("acne")) s.cortisol += 1
  if (hair.includes("shedding")) s.cortisol += 1

  // Estrogen
  if (age >= 38) s.estrogen += 2
  if (age >= 35) s.estrogen += 1
  if (skin.includes("dry")) s.estrogen += 1
  if (skin.includes("wrinkles")) s.estrogen += 1
  if (hair.includes("thinning")) s.estrogen += 2
  if (body.includes("libido")) s.estrogen += 1
  if (body.includes("joints")) s.estrogen += 1
  if (profile.sleepQuality === "poor") s.estrogen += 1

  // Protein/Iron
  if (profile.proteinIntake === "low") s.protein += 3
  if (profile.proteinIntake === "moderate") s.protein += 1
  if (hair.includes("shedding")) s.protein += 1
  if (hair.includes("dry")) s.protein += 1
  if (body.includes("fatigue")) s.protein += 1
  if (body.includes("recovery")) s.protein += 1

  // PCOS
  if (age <= 40) {
    if (skin.includes("acne")) s.pcos += 2
    if (hair.includes("thinning")) s.pcos += 1
    if (body.includes("belly")) s.pcos += 1
  }

  // Inflammation
  if (skin.includes("sensitive")) s.inflammation += 1
  if (skin.includes("acne")) s.inflammation += 1
  if (body.includes("bloating")) s.inflammation += 2
  if (body.includes("brainfog")) s.inflammation += 1

  return Object.entries(s)
    .map(([key, score]) => ({ key, score }))
    .sort((a,b) => b.score - a.score)
    .filter(c => c.score > 0)
    .slice(0, 3)
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getPhase(day, cycleLength=28) {
  const d=parseInt(day); const cl=parseInt(cycleLength)||28
  if (d>=1&&d<=5) return "menstrual"
  if (d/cl<0.5)   return "follicular"
  if (d/cl>=0.5&&d/cl<=0.58) return "ovulation"
  return "luteal"
}
function calcAge(y) { return new Date().getFullYear()-parseInt(y) }
function localDateStr(d=new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function getCurrentCycleDay(profile) {
  if (!profile) return 14
  const cl = parseInt(profile.cycleLength) || 28
  if (profile.cycleStartDate) {
    const start = new Date(profile.cycleStartDate); start.setHours(0,0,0,0)
    const today = new Date(); today.setHours(0,0,0,0)
    const diff  = Math.floor((today - start) / 86400000)
    return (diff % cl) + 1
  }
  return parseInt(profile.cycleDay) || 14
}

function getGreeting(t) {
  const h = new Date().getHours()
  if (h<12) return t.greet.morning
  if (h<18) return t.greet.afternoon
  return t.greet.evening
}

// Returns fasting window in hours (24 - eating duration)
function calcEatWindow(start, end) {
  if (!start || !end) return 0
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  const eatMins = (eh * 60 + em) - (sh * 60 + sm)
  if (eatMins <= 0) return 0
  return Math.round((24 - eatMins / 60) * 10) / 10
}

function calcStreak(history) {
  if (!history || history.length === 0) return 0
  let streak = 0
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i]
    const ok = (h.sleepHours||0) >= 7 && (h.water||0) >= 6 && h.clarity > 0
    if (ok) streak++
    else break
  }
  return streak
}

function generateInsight(checkIn, profile, t) {
  const { energy, sleepHours, mood=3, stress, water, cold=false, heat=false, weather="normal", notes="", cycleDay } = checkIn
  const { cycleLength=28, goals=[], contraception="none", birthYear, activityLevel="moderate", supplements:userSupps=[] } = profile
  const age        = birthYear ? calcAge(birthYear) : 35
  const isPerimeno = age >= 40
  const hormonal   = contraception==="hormonal_pill" || contraception==="hormonal_iud"
  const phaseKey   = getPhase(cycleDay, cycleLength)
  const phase      = t.phases[phaseKey]
  const sleep      = Math.min(10, Math.round((sleepHours||7) * 1.1))
  const score      = Math.round((energy + mood*2 + (10-stress) + sleep) / 5 * 10) / 10

  const isUk = t.appName === "VIVE ✦" && t.greet.morning === "Доброго ранку"

  const greeting = score >= 7.5
    ? (isUk ? `${profile.name}, сьогодні у тебе сильний день` : `${profile.name}, you're having a strong day`)
    : score >= 5.5
    ? (isUk ? `${profile.name}, є простір для хорошого дня` : `${profile.name}, there's room for a good day`)
    : (isUk ? `${profile.name}, твоє тіло просить уваги сьогодні` : `${profile.name}, your body is asking for attention today`)

  const keyInsight = !hormonal
    ? (isUk
        ? `${phase.emoji} ${phase.name} — ${phase.tagline}`
        : `${phase.emoji} ${phase.name} — ${phase.tagline}`)
    : (isUk ? "💊 Ти використовуєш гормональну контрацепцію — відстежуємо твій реальний стан" : "💊 Hormonal contraception — we track your real state")

  // ── MORNING recommendations ──
  const morning = []

  // Hydration start
  morning.push({
    icon: "💧",
    action: isUk ? "Склянка води натщесерце" : "Drink water before anything else",
    why: isUk ? "Після 7-8 годин сну тіло зневоднене. Вода запускає метаболізм." : "After 7-8h sleep your body is dehydrated. Water kickstarts metabolism.",
    tag: isUk ? "Гідрація" : "Hydration",
    category: "hydration"
  })

  // Sleep-based morning rec
  if (sleepHours < 6) {
    morning.push({
      icon: "😴",
      action: isUk ? `${sleepHours}г сну — відновись сьогодні` : `${sleepHours}h sleep — recover today`,
      why: isUk ? "Магній гліцинат 300мг за 30 хв до сну. Уникай кофеїну після 14:00." : "Magnesium glycinate 300mg before bed. Avoid caffeine after 2pm.",
      tag: isUk ? "Сон" : "Sleep",
      category: "sleep"
    })
  } else {
    morning.push({
      icon: "☀️",
      action: isUk ? "Світло в очі протягом 10 хв після підйому" : "Get sunlight within 10min of waking",
      why: isUk ? "Кортизол + серотонін налаштовують добовий ритм. Впливає на якість наступного сну." : "Morning cortisol + serotonin set your circadian rhythm. Improves tonight's sleep.",
      tag: isUk ? "Ритм" : "Circadian",
      category: "circadian"
    })
  }

  // Phase-based morning
  if (!hormonal) {
    morning.push({
      icon: phase.emoji,
      action: isUk ? `Фаза ${phase.name}: ${phase.movement}` : `${phase.name} phase: ${phase.movement}`,
      why: phase.tip,
      tag: phase.name,
      category: "cycle"
    })
  }

  // Perimenopause morning
  if (isPerimeno) {
    morning.push({
      icon: "🔬",
      action: isUk ? "Адаптогени вранці (ашваганда або родіола)" : "Adaptogens in the morning (ashwagandha or rhodiola)",
      why: isUk ? "Вік 40+: прогестерон знижується. Адаптогени підтримують кортизол і стресостійкість." : "Age 40+: progesterone declines. Adaptogens buffer cortisol and stress resilience.",
      tag: isUk ? "Вік 40+" : "Age 40+",
      category: "hormones"
    })
  }

  // ── DAYTIME recommendations ──
  const daytime = []

  // Energy-based
  if (energy <= 4) {
    daytime.push({
      icon: "⚡",
      action: isUk ? "20-хвилинна прогулянка на свіжому повітрі" : "20-minute outdoor walk",
      why: isUk ? "Низька енергія + рух = дофамін без кофеїну. Зовнішнє світло знижує кортизол." : "Low energy + movement = dopamine without caffeine. Natural light lowers cortisol.",
      tag: isUk ? "Енергія" : "Energy",
      category: "energy"
    })
  } else {
    daytime.push({
      icon: "🏃",
      action: isUk ? `Рух дня: ${phase.movement}` : `Today's movement: ${phase.movement}`,
      why: isUk ? "Твоя фаза циклу підтримує цей тип активності." : "Your cycle phase supports this type of activity.",
      tag: isUk ? "Рух" : "Movement",
      category: "movement"
    })
  }

  // Stress-based
  if (stress >= 6) {
    daytime.push({
      icon: "🌬️",
      action: isUk ? "Дихання 4-4-4-4 (box breathing)" : "Box breathing 4-4-4-4",
      why: isUk ? "Вдих 4с → затримка 4с → видих 4с → затримка 4с. Знижує кортизол за 3 хв — доведено нейронаукою." : "Inhale 4s → hold 4s → exhale 4s → hold 4s. Lowers cortisol in 3 min — proven by neuroscience.",
      tag: isUk ? "Стрес" : "Stress",
      category: "stress"
    })
  }

  // Water daytime
  if (water < 6) {
    daytime.push({
      icon: "💧",
      action: isUk ? `Тобі потрібно більше води (зараз ${water} склянок)` : `Drink more water (currently ${water} glasses)`,
      why: isUk ? "Зневоднення на 2% знижує когнітивні функції на 20%. Постав склянку перед собою." : "2% dehydration drops cognitive performance by 20%. Put a glass in front of you now.",
      tag: isUk ? "Гідрація" : "Hydration",
      category: "hydration"
    })
  }

  // Nutrition
  daytime.push({
    icon: "🥗",
    action: isUk ? `Харчування: ${phase.nutrition}` : `Nutrition focus: ${phase.nutrition}`,
    why: isUk ? "Харчування по фазі циклу підсилює гормональний баланс." : "Cycle-synced nutrition amplifies hormonal balance.",
    tag: isUk ? "Харчування" : "Nutrition",
    category: "nutrition"
  })

  // Cold therapy daytime bonus
  if (cold) {
    daytime.push({
      icon: "🧊",
      action: isUk ? "✓ Холодний душ зроблено — чудово!" : "✓ Cold shower done — excellent!",
      why: isUk ? "Холод підвищує норепінефрин на 300% і метаболічну активність. Є у тебе сьогодні ✓" : "Cold boosts norepinephrine by 300% and metabolic rate. You did this today ✓",
      tag: isUk ? "Довголіття" : "Longevity",
      category: "longevity"
    })
  }

  // Weather sensitivity
  if (weather === "rainy") {
    daytime.push({
      icon: "🌧️",
      action: isUk ? "Похмура погода — підтримай серотонін" : "Stormy weather — support your serotonin",
      why: isUk
        ? "Зниження атмосферного тиску може провокувати головний біль, втому та зниження настрою. Магній, вітамін D і коротка прогулянка вранці допоможуть."
        : "Low barometric pressure can trigger headaches, fatigue and low mood. Magnesium, vitamin D and a short morning walk will help.",
      tag: isUk ? "Погода" : "Weather",
      category: "weather"
    })
  } else if (weather === "cloudy") {
    daytime.push({
      icon: "⛅",
      action: isUk ? "Хмарно — не пропусти світлотерапію" : "Cloudy day — don't skip light exposure",
      why: isUk
        ? "Навіть хмарний день дає в 10–50 разів більше світла ніж приміщення. Вийди на 10–15 хв — це підтримає кортизол і серотонін."
        : "Even overcast light is 10–50x brighter than indoors. 10–15 min outside supports cortisol and serotonin.",
      tag: isUk ? "Погода" : "Weather",
      category: "weather"
    })
  }

  // ── EVENING recommendations ──
  const evening = []

  // Eating window
  evening.push({
    icon: "🍽️",
    action: isUk ? "Закрий вікно харчування до 20:00" : "Close your eating window by 8pm",
    why: isUk ? "Інтервальне голодування 14-16г активує аутофагію та покращує чутливість до інсуліну." : "14-16h fasting window activates autophagy and improves insulin sensitivity.",
    tag: isUk ? "Голодування" : "Fasting",
    category: "fasting"
  })

  // Magnesium
  evening.push({
    icon: "💊",
    action: isUk ? "Магній гліцинат 300мг за 30-60 хв до сну" : "Magnesium glycinate 300mg 30-60 min before bed",
    why: isUk ? "Магній активує ГАМК-рецептори, знижує кортизол і покращує якість сну на 37%." : "Magnesium activates GABA receptors, lowers cortisol, improves sleep quality by 37%.",
    tag: isUk ? "Сон" : "Sleep",
    category: "sleep"
  })

  // Screen-free time
  evening.push({
    icon: "🌙",
    action: isUk ? "Без екранів за 1 годину до сну" : "Screen-free 1 hour before bed",
    why: isUk ? "Синє світло блокує мелатонін на 2-3 години. Книга або медитація натомість." : "Blue light blocks melatonin for 2-3h. Read a book or meditate instead.",
    tag: isUk ? "Сон" : "Sleep",
    category: "sleep"
  })

  // Sauna/heat evening
  if (heat) {
    evening.push({
      icon: "🔥",
      action: isUk ? "✓ Сауна/ванна — відмінно для відновлення!" : "✓ Sauna/bath done — great for recovery!",
      why: isUk ? "Сауна 3-4 рази/тиждень знижує ризик ССЗ на 50% і подовжує тривалість життя (Laukkanen, 2018)." : "Sauna 3-4x/week reduces cardiovascular risk by 50% and extends lifespan (Laukkanen, 2018).",
      tag: isUk ? "Довголіття" : "Longevity",
      category: "longevity"
    })
  }

  // Stress recovery evening
  if (stress >= 6) {
    evening.push({
      icon: "📖",
      action: isUk ? "Рефлексія: 3 речі, за які вдячна сьогодні" : "Reflection: 3 things you're grateful for today",
      why: isUk ? "Практика вдячності знижує кортизол і покращує якість сну. 5 хвилин достатньо." : "Gratitude practice lowers cortisol and improves sleep quality. 5 minutes is enough.",
      tag: isUk ? "Стрес" : "Stress",
      category: "stress"
    })
  }

  return {
    greeting,
    score,
    phase,
    phaseKey,
    keyInsight,
    notes,
    morning: morning.slice(0, 4),
    daytime: daytime.slice(0, 4),
    evening: evening.slice(0, 4),
  }
}

// ─── LANG TOGGLE BUTTON ───────────────────────────────────────────────────────
function LangToggle({ lang, onToggle, dark=false }) {
  return (
    <button onClick={onToggle} style={{ display:"flex", alignItems:"center", gap:0, borderRadius:100, overflow:"hidden", border:`1.5px solid ${dark?"rgba(255,255,255,0.28)":"rgba(26,16,37,0.18)"}`, background:dark?"rgba(255,255,255,0.10)":"transparent", backdropFilter:dark?"blur(8px)":"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>
      {["en","uk"].map(l=>(
        <span key={l} style={{ padding:"5px 10px", fontSize:11, fontWeight:700, letterSpacing:"0.3px", background:lang===l?(dark?"rgba(255,255,255,0.25)":C.dark):"transparent", color:lang===l?"#fff":(dark?"rgba(255,255,255,0.50)":C.teal), transition:"all .2s", textTransform:"uppercase" }}>
          {l==="en"?"EN":"УК"}
        </span>
      ))}
    </button>
  )
}

// ─── GLOBAL WRAP ──────────────────────────────────────────────────────────────
function Wrap({ children, bg }) {
  return (
    <div style={{ fontFamily:"'Helvetica Neue',system-ui,-apple-system,sans-serif", minHeight:"100vh", background:bg||C.bg, display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ width:"100%", maxWidth:430, minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative" }}>
        {children}
      </div>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        button:hover{opacity:.88} button:active{transform:scale(.97)}
        input[type=range]{-webkit-appearance:none;appearance:none;height:5px;border-radius:3px;outline:none;width:100%;cursor:pointer}
        input[type=range].lime-slider{background:rgba(255,255,255,0.20)}
        input[type=range].lime-slider::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:#fff;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.20);border:none;transition:transform .15s}
        input[type=range].lime-slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:#fff;border:none}
        input[type=range].sage-slider{background:rgba(123,94,167,0.15)}
        input[type=range].sage-slider::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:${C.dark};cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.18);transition:transform .15s}
        input[type=text],input[type=number],input[type=time]{background:rgba(255,255,255,0.65);border:1.5px solid rgba(180,150,210,0.35);border-radius:14px;padding:13px 16px;font-size:15px;font-family:inherit;color:${C.dark};outline:none;width:100%}
        input[type=text]:focus,input[type=number]:focus,input[type=time]:focus{border-color:${C.teal};background:#fff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .fade-up{animation:fadeUp 0.38s ease both}
      `}</style>
    </div>
  )
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function DarkCard({ children, style={} }) {
  return <div style={{ background:"rgba(38,50,36,0.78)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderRadius:26, padding:"20px 18px", border:"1px solid rgba(255,255,255,0.13)", boxShadow:"0 8px 32px rgba(0,0,0,0.14)", ...style }}>{children}</div>
}
function GlassCard({ children, style={} }) {
  return <div style={{ background:"rgba(255,255,255,0.68)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:26, padding:"20px 20px", border:"1px solid rgba(255,255,255,0.85)", boxShadow:"0 8px 32px rgba(0,0,0,0.07)", ...style }}>{children}</div>
}
function DarkGlassCard({ children, style={} }) {
  return <div style={{ background:"rgba(255,255,255,0.58)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:22, padding:"16px 18px", border:"1px solid rgba(255,255,255,0.80)", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", ...style }}>{children}</div>
}
function SageCard({ children, style={} }) {
  return <div style={{ background:"rgba(255,255,255,0.65)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:22, padding:"18px 20px", border:"1px solid rgba(255,255,255,0.85)", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", ...style }}>{children}</div>
}
function Tag({ label, dark }) {
  return <span style={{ display:"inline-block", padding:"5px 12px", borderRadius:100, fontSize:11, fontWeight:600, background:dark?"rgba(255,255,255,0.20)":"rgba(26,16,37,0.07)", color:dark?"rgba(255,255,255,0.90)":C.teal, border:dark?"1px solid rgba(255,255,255,0.35)":"1px solid rgba(123,94,167,0.18)", backdropFilter:dark?"blur(8px)":"none" }}>{label}</span>
}
function ProgDots({ total, cur }) {
  return (
    <div style={{ display:"flex", gap:6, padding:"10px 22px" }}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{ height:4, borderRadius:2, background:i===cur?C.dark:i<cur?"rgba(26,16,37,0.35)":"rgba(26,16,37,0.12)", transition:"all 0.3s", flex:i===cur?2.5:1 }} />
      ))}
    </div>
  )
}
function BtnDark({ label, onClick, disabled }) {
  return <button onClick={disabled?undefined:onClick} style={{ width:"100%", padding:"17px 24px", borderRadius:100, border:"none", background:disabled?"rgba(26,16,37,0.18)":C.dark, color:disabled?"rgba(26,16,37,0.35)":"#fff", fontSize:15, fontWeight:700, cursor:disabled?"not-allowed":"pointer", letterSpacing:"-0.2px", transition:"all .2s", fontFamily:"inherit" }}>{label}</button>
}
function BtnGhost({ label, onClick }) {
  return <button onClick={onClick} style={{ width:"100%", padding:"15px 24px", borderRadius:100, border:"1.5px solid rgba(26,16,37,0.2)", background:"transparent", color:C.teal, fontSize:15, fontWeight:600, cursor:"pointer", transition:"all .2s", fontFamily:"inherit" }}>{label}</button>
}
function BtnLime({ label, onClick }) {
  return <button onClick={onClick} style={{ width:"100%", padding:"17px 24px", borderRadius:100, border:"none", background:C.dark, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", transition:"all .2s", fontFamily:"inherit" }}>{label}</button>
}
function BtnDone({ label, onClick }) {
  return <button onClick={onClick} style={{ width:"100%", padding:"16px 24px", borderRadius:100, border:"1.5px solid rgba(255,255,255,0.65)", background:"rgba(255,255,255,0.22)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer", transition:"all .2s", fontFamily:"inherit" }}>{label}</button>
}
function Chip({ label, selected, onToggle, dark }) {
  return dark
    ? <button onClick={onToggle} style={{ padding:"9px 14px", borderRadius:100, border:`1.5px solid ${selected?"rgba(255,255,255,0.60)":"rgba(255,255,255,0.18)"}`, background:selected?"rgba(255,255,255,0.22)":"transparent", color:selected?"#fff":"rgba(255,255,255,0.55)", fontSize:13, fontWeight:600, cursor:"pointer", margin:"3px", fontFamily:"inherit", transition:"all .15s", backdropFilter:selected?"blur(8px)":"none" }}>{label}</button>
    : <button onClick={onToggle} style={{ padding:"9px 14px", borderRadius:100, border:`1.5px solid ${selected?C.dark:"rgba(26,16,37,0.18)"}`, background:selected?C.dark:"transparent", color:selected?"#fff":C.teal, fontSize:13, fontWeight:600, cursor:"pointer", margin:"3px", fontFamily:"inherit", transition:"all .15s" }}>{label}</button>
}

// ─── SLIDER CARD ──────────────────────────────────────────────────────────────
function SliderCard({ icon, label, value, onChange, min, max, displayValue, leftLabel, rightLabel }) {
  const pct = ((value-min)/(max-min))*100
  const trackBg = `linear-gradient(to right, rgba(255,255,255,0.90) ${pct}%, rgba(255,255,255,0.25) ${pct}%)`
  return (
    <DarkGlassCard style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:17 }}>{icon}</span>
          <span style={{ fontSize:15, fontWeight:600, color:C.dark }}>{label}</span>
        </div>
        <span style={{ fontSize:13, fontWeight:700, color:C.teal }}>{displayValue}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e=>onChange(parseInt(e.target.value))} className="lime-slider" style={{ width:"100%", background:trackBg }} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.32)" }}>{leftLabel}</span>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.32)" }}>{rightLabel}</span>
      </div>
    </DarkGlassCard>
  )
}

// ─── SCREEN 1: WELCOME ────────────────────────────────────────────────────────
function Welcome({ onStart, lang, onLangToggle, t }) {
  const w = t.welcome
  return (
    <Wrap>
      {/* ── Photo section — рівномірний градієнт, текст зліва ── */}
      <div style={{ position:"relative", flexShrink:0, overflow:"hidden" }}>
        <img src="/hero.png" alt="" style={{ width:"100%", display:"block", objectFit:"cover", objectPosition:"center top" }} />
        {/* рівномірний однорідний overlay на все фото */}
        <div style={{ position:"absolute", inset:0, background:"rgba(18,10,28,0.50)" }} />
        {/* весь контент — абсолютний шар поверх фото */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"52px 24px 32px" }}>
          {/* верх: лого зліва, мова + бета справа */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>{t.appName}</div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <LangToggle lang={lang} onToggle={onLangToggle} dark />
              <Tag label={t.beta} dark />
            </div>
          </div>
          {/* низ: тільки заголовок + кнопка справа */}
          <div style={{ marginLeft:"auto", maxWidth:"65%", textAlign:"right" }}>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:32, fontWeight:900, color:"#fff", lineHeight:1.15, letterSpacing:"-0.8px", whiteSpace:"pre-line" }}>{w.heroTitle[1]}</div>
              <div style={{ fontSize:18, fontWeight:400, color:"rgba(255,255,255,0.70)", letterSpacing:"-0.3px", marginTop:4 }}>{w.heroTitle[2]}</div>
            </div>
            <BtnDone label={w.startHero} onClick={onStart} />
          </div>
        </div>
      </div>

      {/* ── Feature cards знизу ── */}
      <div style={{ padding:"20px 20px 40px", flex:1, display:"flex", flexDirection:"column", gap:8, background:C.bg }}>
        {w.features.map(([ic,tx],i)=>{
          const isText = ic.length > 2
          return (
            <GlassCard key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px" }}>
              <div style={{ width:32, height:32, borderRadius:10, background:"rgba(123,94,167,0.10)", border:"1px solid rgba(123,94,167,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:isText?8:15, fontWeight:isText?800:400, color:C.teal, letterSpacing:isText?"-0.3px":"normal", lineHeight:1.1, textAlign:"center" }}>{ic}</div>
              <span style={{ fontSize:14, fontWeight:500, color:C.dark, lineHeight:1.4 }}>{tx}</span>
            </GlassCard>
          )
        })}
        <div style={{ marginTop:4 }}><BtnDark label={w.startBottom} onClick={onStart} /></div>
      </div>
    </Wrap>
  )
}

// ─── SCREEN 2: ONBOARDING ─────────────────────────────────────────────────────
function Onboarding({ onDone, lang, onLangToggle, t }) {
  const TOTAL = 7
  const [step, setStep] = useState(0)
  const [d, setD] = useState({
    name:"", birthYear:"", cycleDay:"14", contraception:"none",
    skinSymptoms:[], hairSymptoms:[], bodySymptoms:[],
    sleepQuality:"", wakeNight:"", stressLevel:5,
    dietType:"omni", proteinIntake:"", supplements:[], goals:[], mainGoal:""
  })
  const set       = (k,v) => setD(p=>({...p,[k]:v}))
  const toggleArr = (k,id) => set(k, d[k].includes(id)?d[k].filter(x=>x!==id):[...d[k],id])
  const pick      = (k,id) => set(k, d[k]===id?"":id)

  const phaseKey = getPhase(parseInt(d.cycleDay)||14, 28)
  const phase    = t.phases[phaseKey]
  const age      = d.birthYear&&parseInt(d.birthYear)>1960 ? calcAge(d.birthYear) : null
  const hormonal = d.contraception==="hormonal_pill"||d.contraception==="hormonal_iud"
  const o        = t.onboarding
  const canNext  = [
    d.name.trim().length>0 && d.cycleDay,
    true, true, true,
    !!(d.sleepQuality && d.wakeNight),
    !!d.proteinIntake,
    !!d.mainGoal,
  ]
  const infoStyle  = { padding:"10px 14px", borderRadius:14, background:"rgba(192,249,136,0.12)", border:"1px solid rgba(192,249,136,0.3)", marginTop:10, fontSize:13, color:"#2a4a2a", lineHeight:1.5 }
  const labelStyle = { fontSize:11, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8, display:"block" }
  const stepTitle  = (title, sub) => (
    <div style={{ marginBottom:22 }}>
      <div style={{ fontSize:30, fontWeight:900, color:C.dark, letterSpacing:"-0.5px", lineHeight:1.2, marginBottom:6 }}>{title}</div>
      {sub && <div style={{ fontSize:14, color:C.teal }}>{sub}</div>}
    </div>
  )
  const navRow = (canProceed, onNext, isLast=false) => (
    <div style={{ display:"flex", gap:10, marginBottom:28 }}>
      {step>0 && <div style={{ flex:0.35 }}><BtnGhost label={o.back} onClick={()=>setStep(s=>s-1)} /></div>}
      <div style={{ flex:1 }}>
        {isLast
          ? <BtnLime label={o.letsGo} onClick={()=>canProceed&&onNext()} />
          : <BtnDark label={o.next} onClick={()=>canProceed&&setStep(s=>s+1)} disabled={!canProceed} />
        }
      </div>
    </div>
  )

  return (
    <Wrap>
      <div style={{ padding:"52px 22px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:20, fontWeight:900, color:C.dark }}>{t.appName}</div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <LangToggle lang={lang} onToggle={onLangToggle} />
          <div style={{ fontSize:12, fontWeight:600, color:C.teal, background:"rgba(123,94,167,0.1)", padding:"6px 13px", borderRadius:100 }}>{o.stepOf(step+1,TOTAL)}</div>
        </div>
      </div>
      <ProgDots total={TOTAL} cur={step} />

      <div style={{ padding:"0 20px", flex:1, overflowY:"auto" }}>

        {/* ── Step 0: Basic info ── */}
        {step===0 && (
          <div className="fade-up">
            {stepTitle(o.s0Title[0]+" "+o.s0Title[1], o.s0Sub)}
            <SageCard style={{ marginBottom:12 }}>
              <label style={labelStyle}>{o.nameLabel}</label>
              <input type="text" placeholder={o.namePlaceholder} value={d.name} onChange={e=>set("name",e.target.value)} />
            </SageCard>
            <SageCard style={{ marginBottom:12 }}>
              <label style={labelStyle}>{o.birthLabel}</label>
              <input type="number" placeholder={o.birthPlaceholder} min="1960" max="2005" value={d.birthYear} onChange={e=>set("birthYear",e.target.value)} />
              {age && <div style={infoStyle}>{age>=40?o.agePerimeno(age):o.ageOk(age)}</div>}
            </SageCard>
            <SageCard style={{ marginBottom:20 }}>
              <label style={labelStyle}>{o.cycleDayLabel}</label>
              <input type="number" min="1" max="35" placeholder={o.cycleDayPlaceholder} value={d.cycleDay} onChange={e=>set("cycleDay",e.target.value)} />
              {d.cycleDay && (
                <div style={{ ...infoStyle, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{phase.emoji}</span>
                  <div><div style={{ fontWeight:700 }}>{phase.name}</div><div style={{ fontSize:12, color:C.teal }}>{phase.tagline}</div></div>
                </div>
              )}
            </SageCard>
            {navRow(canNext[0])}
          </div>
        )}

        {/* ── Step 1: Skin ── */}
        {step===1 && (
          <div className="fade-up">
            {stepTitle(o.skinTitle, o.skinSub)}
            <SageCard style={{ marginBottom:20 }}>
              <div style={{ display:"flex", flexWrap:"wrap" }}>
                {t.skinOpts.map(s=>(
                  <Chip key={s.id} label={s.label} selected={d.skinSymptoms.includes(s.id)} onToggle={()=>toggleArr("skinSymptoms",s.id)} />
                ))}
              </div>
              {d.skinSymptoms.length===0 && <div style={{ ...infoStyle, marginTop:14, fontSize:12, opacity:0.7 }}>{o.none}</div>}
            </SageCard>
            {navRow(canNext[1])}
          </div>
        )}

        {/* ── Step 2: Hair ── */}
        {step===2 && (
          <div className="fade-up">
            {stepTitle(o.hairTitle, o.hairSub)}
            <SageCard style={{ marginBottom:20 }}>
              <div style={{ display:"flex", flexWrap:"wrap" }}>
                {t.hairOpts.map(h=>(
                  <Chip key={h.id} label={h.label} selected={d.hairSymptoms.includes(h.id)} onToggle={()=>toggleArr("hairSymptoms",h.id)} />
                ))}
              </div>
              {d.hairSymptoms.length===0 && <div style={{ ...infoStyle, marginTop:14, fontSize:12, opacity:0.7 }}>{o.none}</div>}
            </SageCard>
            {navRow(canNext[2])}
          </div>
        )}

        {/* ── Step 3: Body & Energy ── */}
        {step===3 && (
          <div className="fade-up">
            {stepTitle(o.bodyTitle, o.bodySub)}
            <SageCard style={{ marginBottom:20 }}>
              <div style={{ display:"flex", flexWrap:"wrap" }}>
                {t.bodyOpts.map(b=>(
                  <Chip key={b.id} label={b.label} selected={d.bodySymptoms.includes(b.id)} onToggle={()=>toggleArr("bodySymptoms",b.id)} />
                ))}
              </div>
              {d.bodySymptoms.length===0 && <div style={{ ...infoStyle, marginTop:14, fontSize:12, opacity:0.7 }}>{o.none}</div>}
            </SageCard>
            {navRow(canNext[3])}
          </div>
        )}

        {/* ── Step 4: Sleep & Stress ── */}
        {step===4 && (
          <div className="fade-up">
            {stepTitle(o.sleepTitle)}
            <SageCard style={{ marginBottom:12 }}>
              <label style={labelStyle}>{o.sleepQLabel}</label>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {t.sleepOpts.map(s=>(
                  <Chip key={s.id} label={(d.sleepQuality===s.id?"✓ ":"")+s.label} selected={d.sleepQuality===s.id} onToggle={()=>pick("sleepQuality",s.id)} />
                ))}
              </div>
            </SageCard>
            <SageCard style={{ marginBottom:12 }}>
              <label style={labelStyle}>{o.wakeLabel}</label>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {t.wakeOpts.map(w=>(
                  <Chip key={w.id} label={(d.wakeNight===w.id?"✓ ":"")+w.label} selected={d.wakeNight===w.id} onToggle={()=>pick("wakeNight",w.id)} />
                ))}
              </div>
            </SageCard>
            <SageCard style={{ marginBottom:20 }}>
              <label style={labelStyle}>{o.stressLabel}: {d.stressLevel}/10</label>
              <input type="range" min="1" max="10" value={d.stressLevel} onChange={e=>set("stressLevel",parseInt(e.target.value))} className="sage-slider" style={{ width:"100%" }} />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:C.teal }}>
                <span>{lang==="uk"?"Спокій":"Calm"}</span><span>{lang==="uk"?"Дуже напружено":"Very stressed"}</span>
              </div>
            </SageCard>
            {navRow(canNext[4])}
          </div>
        )}

        {/* ── Step 5: Nutrition ── */}
        {step===5 && (
          <div className="fade-up">
            {stepTitle(o.nutritionTitle, o.nutritionSub)}
            <SageCard style={{ marginBottom:12 }}>
              <label style={labelStyle}>{o.dietLabel}</label>
              <div style={{ display:"flex", flexWrap:"wrap" }}>
                {t.diet.map(dd=>(
                  <Chip key={dd.id} label={dd.label} selected={d.dietType===dd.id} onToggle={()=>set("dietType",dd.id)} />
                ))}
              </div>
            </SageCard>
            <SageCard style={{ marginBottom:12 }}>
              <label style={labelStyle}>{o.proteinLabel}</label>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {t.proteinOpts.map(p=>(
                  <Chip key={p.id} label={(d.proteinIntake===p.id?"✓ ":"")+p.label} selected={d.proteinIntake===p.id} onToggle={()=>pick("proteinIntake",p.id)} />
                ))}
              </div>
            </SageCard>
            <SageCard style={{ marginBottom:20 }}>
              <label style={labelStyle}>{o.suppLabel}</label>
              <div style={{ display:"flex", flexWrap:"wrap" }}>
                {t.supplements.map(s=>(
                  <Chip key={s.id} label={s.label} selected={d.supplements.includes(s.id)} onToggle={()=>toggleArr("supplements",s.id)} />
                ))}
              </div>
            </SageCard>
            {navRow(canNext[5])}
          </div>
        )}

        {/* ── Step 6: Priority + Contraception ── */}
        {step===6 && (
          <div className="fade-up">
            {stepTitle(o.goalTitle, o.goalSub)}
            <SageCard style={{ marginBottom:12 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {t.mainGoalOpts.map(g=>(
                  <Chip key={g.id} label={(d.mainGoal===g.id?"✓ ":"")+g.label} selected={d.mainGoal===g.id} onToggle={()=>pick("mainGoal",g.id)} />
                ))}
              </div>
            </SageCard>
            <SageCard style={{ marginBottom:20 }}>
              <label style={labelStyle}>{o.contraLabel}</label>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {t.contraception.map(c=>(
                  <Chip key={c.id} label={(d.contraception===c.id?"✓ ":"")+c.label} selected={d.contraception===c.id} onToggle={()=>set("contraception",c.id)} />
                ))}
              </div>
              {hormonal && <div style={infoStyle}>{o.hormonalNote}</div>}
            </SageCard>
            {navRow(canNext[6], ()=>onDone(d), true)}
          </div>
        )}

      </div>
    </Wrap>
  )
}

// ─── LIGHT SLIDER CARD (for light check-in) ──────────────────────────────────
function LightSliderCard({ icon, label, value, onChange, min, max, displayValue, leftLabel, rightLabel }) {
  const pct = ((value-min)/(max-min))*100
  const trackBg = `linear-gradient(to right, ${C.dark} ${pct}%, rgba(123,94,167,0.18) ${pct}%)`
  return (
    <div style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:22, padding:"16px 18px", border:"1px solid rgba(255,255,255,0.75)", marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:17 }}>{icon}</span>
          <span style={{ fontSize:15, fontWeight:600, color:C.dark }}>{label}</span>
        </div>
        <span style={{ fontSize:13, fontWeight:700, color:C.teal }}>{displayValue}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e=>onChange(parseInt(e.target.value))} className="sage-slider" style={{ width:"100%", background:trackBg }} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
        <span style={{ fontSize:11, color:C.teal }}>{leftLabel}</span>
        <span style={{ fontSize:11, color:C.teal }}>{rightLabel}</span>
      </div>
    </div>
  )
}

// ─── SCREEN 3: CHECK-IN (light) ───────────────────────────────────────────────
function CheckIn({ profile, onDone, onBack, lang, onLangToggle, t }) {
  const [v, setV] = useState({ energy:7, sleepHours:8, stress:3, water:4, clarity:7, weather:"normal", notes:"", symptoms:[], sunlight:null, alcohol:null, lateCaffeine:null })
  const set = (k,val) => setV(p=>({...p,[k]:val}))
  const ci = t.checkin

  const handleDone = () => {
    onDone({
      energy:v.energy, sleep:Math.min(10,Math.round(v.sleepHours*1.1)),
      sleepHours:v.sleepHours, mood:3, stress:v.stress, water:v.water,
      moved:false, moveType:"", symptoms:v.symptoms, supplementsTaken:false,
      sunlight:v.sunlight, alcohol:v.alcohol, lateCaffeine:v.lateCaffeine,
      cycleDay:getCurrentCycleDay(profile),
      clarity:v.clarity,
      weather:v.weather,
      notes:v.notes,
    })
  }

  return (
    <Wrap>
      {/* Soft nature bg overlay — light filter */}
      <div style={{ position:"absolute", inset:0, background:`url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80') center/cover`, filter:"blur(4px) brightness(1.15) saturate(0.7)", zIndex:0 }} />
      <div style={{ position:"absolute", inset:0, background:"rgba(237,234,229,0.72)", zIndex:0 }} />

      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"0 20px 32px" }}>

        {/* Header */}
        <div style={{ paddingTop:52, paddingBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:C.teal, fontSize:15, fontWeight:500, cursor:"pointer", padding:"6px 0", fontFamily:"inherit" }}>
            {ci.back}
          </button>
          <LangToggle lang={lang} onToggle={onLangToggle} />
        </div>

        {/* Title */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:28, fontWeight:900, color:C.dark, lineHeight:1.2, letterSpacing:"-0.5px" }}>
            {ci.title[0]}<br/>{ci.title[1]}
          </div>
        </div>

        {/* Sliders */}
        <div style={{ flex:1 }}>
          <LightSliderCard icon="⚡" label={ci.energy}  value={v.energy}     onChange={val=>set("energy",val)}     min={1} max={10} displayValue={ci.energyV(v.energy)}      leftLabel={ci.energyL(v.energy)}      rightLabel={ci.energyL(v.energy)} />
          <LightSliderCard icon="🌙" label={ci.sleep}   value={v.sleepHours} onChange={val=>set("sleepHours",val)} min={4} max={10} displayValue={ci.sleepV(v.sleepHours)}   leftLabel={`${v.sleepHours}${lang==="uk"?"г":"h"}`} rightLabel={ci.sleepL(v.sleepHours)} />
          <LightSliderCard icon="☁️" label={ci.stress}  value={v.stress}     onChange={val=>set("stress",val)}     min={1} max={10} displayValue={ci.stressV(v.stress)}      leftLabel={ci.stressL(v.stress)}      rightLabel={ci.stressL(v.stress)} />
          <LightSliderCard icon="💧" label={ci.water}   value={v.water}      onChange={val=>set("water",val)}      min={0} max={10} displayValue={ci.waterV(v.water)}        leftLabel={ci.waterL(v.water)}        rightLabel={ci.waterL(v.water)} />
          <LightSliderCard icon="🧠" label={ci.clarity} value={v.clarity}    onChange={val=>set("clarity",val)}    min={1} max={10} displayValue={ci.clarityV(v.clarity)}    leftLabel={ci.clarityL(v.clarity)}    rightLabel={ci.clarityL(v.clarity)} />

          {/* Weather */}
          <div style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:22, padding:"16px 18px", border:"1px solid rgba(255,255,255,0.75)", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:17 }}>🌤️</span>
              <span style={{ fontSize:15, fontWeight:600, color:C.dark }}>{ci.weatherLabel}</span>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {[
                { key:"normal", emoji:"☀️", label:ci.weatherSun },
                { key:"cloudy", emoji:"⛅", label:ci.weatherCloud },
                { key:"rainy",  emoji:"🌧️", label:ci.weatherRain },
              ].map(opt => (
                <button key={opt.key} onClick={() => set("weather", opt.key)} style={{
                  flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                  padding:"10px 6px", borderRadius:16,
                  border:`1.5px solid ${v.weather===opt.key ? C.teal : "rgba(180,150,210,0.25)"}`,
                  background: v.weather===opt.key ? "rgba(123,94,167,0.1)" : "rgba(255,255,255,0.4)",
                  cursor:"pointer", transition:"all .15s", fontFamily:"inherit"
                }}>
                  <span style={{ fontSize:20 }}>{opt.emoji}</span>
                  <span style={{ fontSize:11, fontWeight:600, color: v.weather===opt.key ? C.teal : C.dark }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Symptoms grid (NEW-A) ── */}
          <div style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:22, padding:"16px 18px", border:"1px solid rgba(255,255,255,0.75)", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:17 }}>🩺</span>
              <span style={{ fontSize:15, fontWeight:600, color:C.dark }}>{lang==="uk"?"Симптоми сьогодні":"Symptoms today"}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:7 }}>
              {[
                { id:"fatigue",    emoji:"😴", en:"Fatigue",   uk:"Втома" },
                { id:"hotflash",   emoji:"🔥", en:"Hot flash", uk:"Приплив" },
                { id:"brainfog",   emoji:"🌫️", en:"Brain fog", uk:"Туман" },
                { id:"anxiety",    emoji:"😰", en:"Anxiety",   uk:"Тривога" },
                { id:"joints",     emoji:"🦴", en:"Joints",    uk:"Суглоби" },
                { id:"bloating",   emoji:"🎈", en:"Bloating",  uk:"Здуття" },
                { id:"headache",   emoji:"🤕", en:"Headache",  uk:"Голова" },
                { id:"moodswings", emoji:"🌊", en:"Mood",      uk:"Настрій" },
                { id:"insomnia",   emoji:"💤", en:"Insomnia",  uk:"Безсоння" },
                { id:"heart",      emoji:"💓", en:"Heart",     uk:"Серце" },
              ].map(s => {
                const active = v.symptoms.includes(s.id)
                return (
                  <button key={s.id} onClick={() => set("symptoms", active ? v.symptoms.filter(x=>x!==s.id) : [...v.symptoms, s.id])} style={{
                    display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                    padding:"9px 4px", borderRadius:14,
                    border:`1.5px solid ${active ? C.teal : "rgba(180,150,210,0.25)"}`,
                    background: active ? "rgba(123,94,167,0.13)" : "rgba(255,255,255,0.4)",
                    cursor:"pointer", transition:"all .15s", fontFamily:"inherit"
                  }}>
                    <span style={{ fontSize:18 }}>{s.emoji}</span>
                    <span style={{ fontSize:9.5, fontWeight:600, color: active ? C.teal : C.dark, lineHeight:1.1, textAlign:"center" }}>
                      {lang==="uk" ? s.uk : s.en}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Quick adds (NEW-A) ── */}
          <div style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:22, padding:"14px 18px", border:"1px solid rgba(255,255,255,0.75)", marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:12 }}>
              {lang==="uk" ? "⚡ Швидкі позначки" : "⚡ Quick adds"}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { key:"sunlight",     emoji:"☀️", en:"Got sunlight today?",  uk:"Сонячне світло сьогодні?" },
                { key:"alcohol",      emoji:"🍷", en:"Alcohol today?",        uk:"Алкоголь сьогодні?" },
                { key:"lateCaffeine", emoji:"☕", en:"Caffeine after 2pm?",   uk:"Кофеїн після 14:00?" },
              ].map(q => (
                <div key={q.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16 }}>{q.emoji}</span>
                    <span style={{ fontSize:13, color:C.dark }}>{lang==="uk" ? q.uk : q.en}</span>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    {[{val:true,label:lang==="uk"?"Так":"Yes"},{val:false,label:lang==="uk"?"Ні":"No"}].map(btn => (
                      <button key={String(btn.val)} onClick={() => set(q.key, btn.val)} style={{
                        padding:"5px 14px", borderRadius:100, fontSize:12, fontWeight:600,
                        border:`1.5px solid ${v[q.key]===btn.val ? C.teal : "rgba(180,150,210,0.28)"}`,
                        background: v[q.key]===btn.val ? "rgba(123,94,167,0.13)" : "rgba(255,255,255,0.5)",
                        color: v[q.key]===btn.val ? C.teal : C.dark,
                        cursor:"pointer", fontFamily:"inherit", transition:"all .15s"
                      }}>{btn.label}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:22, padding:"16px 18px", border:"1px solid rgba(255,255,255,0.75)", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:17 }}>📝</span>
              <span style={{ fontSize:15, fontWeight:600, color:C.dark }}>{ci.notesLabel}</span>
            </div>
            <textarea
              placeholder={ci.notesPlaceholder}
              value={v.notes}
              onChange={e=>set("notes",e.target.value)}
              rows={3}
              style={{ width:"100%", padding:"12px 14px", borderRadius:14, border:"1.5px solid rgba(180,150,210,0.35)", background:"rgba(255,255,255,0.65)", fontSize:14, fontFamily:"inherit", color:C.dark, resize:"none", outline:"none", lineHeight:1.55 }}
            />
          </div>
        </div>

        <div style={{ marginTop:12 }}>
          <BtnDark label={ci.done} onClick={handleDone} />
        </div>
      </div>
    </Wrap>
  )
}

// ─── INSIGHT RECS BLOCK ──────────────────────────────────────────────────────
function TimeBlock({ emoji, title, recs, delay=0 }) {
  return (
    <div className="fade-up" style={{ animationDelay:`${delay}s`, marginBottom:16 }}>
      {/* Section header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <span style={{ fontSize:18 }}>{emoji}</span>
        <span style={{ fontSize:13, fontWeight:800, color:C.dark, textTransform:"uppercase", letterSpacing:"0.7px" }}>{title}</span>
        <div style={{ flex:1, height:1, background:"rgba(26,16,37,0.12)", marginLeft:4 }} />
      </div>
      {/* Rec cards — compact, no explanation text */}
      {recs.map((rec, i) => (
        <div key={i} style={{ background:"rgba(255,255,255,0.55)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:18, padding:"12px 14px", border:"1px solid rgba(255,255,255,0.72)", marginBottom:7, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:20, lineHeight:1, flexShrink:0 }}>{rec.icon}</span>
          <span style={{ flex:1, fontSize:14, fontWeight:600, color:C.dark, lineHeight:1.3 }}>{rec.action}</span>
          <span style={{ flexShrink:0, fontSize:10, fontWeight:700, color:C.teal, background:"rgba(123,94,167,0.1)", border:"1px solid rgba(123,94,167,0.18)", borderRadius:100, padding:"3px 9px", whiteSpace:"nowrap" }}>{rec.tag}</span>
        </div>
      ))}
    </div>
  )
}

// ─── HORMONE CHART (NEW-B) ────────────────────────────────────────────────────
const ESTRO_NORMAL = [
  [0.00,12],[0.07,12],[0.18,22],[0.30,52],[0.38,88],[0.46,92],
  [0.52,72],[0.60,50],[0.70,45],[0.82,28],[0.92,16],[1.00,12]
]
const PROG_NORMAL = [
  [0.00,7],[0.40,7],[0.50,10],[0.58,35],[0.68,68],[0.75,62],
  [0.85,32],[0.93,12],[1.00,7]
]
const ESTRO_PERIMENO = [
  [0.00,14],[0.07,18],[0.18,24],[0.30,44],[0.38,58],[0.46,62],
  [0.52,50],[0.60,55],[0.70,38],[0.82,26],[0.92,18],[1.00,14]
]
const PROG_PERIMENO = [
  [0.00,7],[0.40,7],[0.50,9],[0.58,20],[0.68,36],[0.75,30],
  [0.85,18],[0.93,10],[1.00,7]
]

function HormoneChart({ cycleDay, cycleLength, isPerimeno, phaseKey, lang }) {
  const uk = lang === "uk"
  const cl = parseInt(cycleLength) || 28
  const W = 300, H = 110
  const pad = { l:8, r:8, t:16, b:22 }
  const cW = W - pad.l - pad.r
  const cH = H - pad.t - pad.b
  const xOf = (frac) => pad.l + frac * cW
  const yOf = (pct)  => pad.t + cH - (pct / 100) * cH
  const toPath = (pts) => pts
    .map(([fx, fy], i) => `${i===0?"M":"L"} ${xOf(fx).toFixed(1)},${yOf(fy).toFixed(1)}`)
    .join(" ")
  const eData  = isPerimeno ? ESTRO_PERIMENO : ESTRO_NORMAL
  const pData  = isPerimeno ? PROG_PERIMENO  : PROG_NORMAL
  const nowX   = xOf(Math.min((cycleDay / cl), 1))
  const PHASE_TEXTS = {
    menstrual:  { uk:"Гормони на мінімумі — тіло відновлюється 🌙",    en:"Hormones at baseline — your body is restoring 🌙" },
    follicular: { uk:"Естроген зростає — ясність і мотивація 🌱",       en:"Estrogen rising — clarity and motivation returning 🌱" },
    ovulation:  { uk:"Пік естрогену — твій найсильніший день ✨",        en:"Estrogen peak — your strongest day this month ✨" },
    luteal:     { uk:"Прогестерон домінує — тяга до спокою і тепла 🍂", en:"Progesterone dominant — craving calm and warmth 🍂" },
  }
  const note = (PHASE_TEXTS[phaseKey] || PHASE_TEXTS.follicular)[uk ? "uk" : "en"]
  return (
    <div className="fade-up" style={{ animationDelay:"0.1s", background:"rgba(255,255,255,0.65)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:20, padding:"14px 16px", border:"1px solid rgba(255,255,255,0.85)", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", marginBottom:18 }}>
      <div style={{ fontSize:11, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:8 }}>
        {uk ? `🔬 ГОРМОНИ · ДЕНЬ ${cycleDay}` : `🔬 HORMONES · DAY ${cycleDay}`}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
        {[30,60].map(v => (
          <line key={v} x1={pad.l} y1={yOf(v)} x2={W-pad.r} y2={yOf(v)} stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
        ))}
        <path d={toPath(eData)} fill="none" stroke="#C0756B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={toPath(pData)} fill="none" stroke="#6B8EAD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={nowX} y1={pad.t-4} x2={nowX} y2={H-pad.b+2} stroke={C.teal} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.9" />
        <circle cx={nowX} cy={pad.t-4} r="3.5" fill={C.teal} />
        <text x={nowX} y={H-5} textAnchor="middle" fontSize="8" fill={C.teal} fontWeight="700" fontFamily="'Helvetica Neue',system-ui">
          {uk ? "ти тут" : "you"}
        </text>
      </svg>
      <div style={{ display:"flex", gap:14, marginTop:6, alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:18, height:2.5, background:"#C0756B", borderRadius:2 }} />
          <span style={{ fontSize:11, color:C.dark }}>{uk?"Естроген":"Estrogen"}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:18, height:2.5, background:"#6B8EAD", borderRadius:2 }} />
          <span style={{ fontSize:11, color:C.dark }}>{uk?"Прогестерон":"Progesterone"}</span>
        </div>
        {isPerimeno && <span style={{ fontSize:10, color:C.teal, marginLeft:"auto" }}>≈ {uk?"перименопауза":"perimenopause"}</span>}
      </div>
      <div style={{ marginTop:10, padding:"8px 10px", background:"rgba(123,94,167,0.08)", borderRadius:12 }}>
        <span style={{ fontSize:12, color:C.dark, lineHeight:1.5 }}>
          {note}
          {isPerimeno && (uk ? " У перименопаузі піки нижчі і нерегулярні." : " In perimenopause, peaks are lower and irregular.")}
        </span>
      </div>
    </div>
  )
}

// ─── SCREEN 4: AI INSIGHTS ────────────────────────────────────────────────────
function Insight({ checkIn, profile, onDone, lang, onLangToggle, t }) {
  const ins      = generateInsight(checkIn, profile, t)
  const ins_t    = t.insight
  const phaseKey   = getPhase(checkIn.cycleDay || 14, profile.cycleLength || 28)
  const isPerimeno = profile.birthYear ? calcAge(profile.birthYear) >= 40 : false
  const hormonal   = profile.contraception === "hormonal_pill" || profile.contraception === "hormonal_iud"

  return (
    <div style={{ fontFamily:"'Helvetica Neue',system-ui,-apple-system,sans-serif", minHeight:"100vh", background:C.bg, display:"flex", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:430, minHeight:"100vh", position:"relative", display:"flex", flexDirection:"column" }}>

        {/* Top background image strip */}
        <div style={{ position:"relative", height:200, overflow:"hidden", flexShrink:0 }}>
          <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.78) saturate(0.8)" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(26,16,37,0.1) 0%, rgba(237,234,229,1) 100%)" }} />
          {/* Lang toggle on top */}
          <div style={{ position:"absolute", top:18, right:18 }}>
            <LangToggle lang={lang} onToggle={onLangToggle} />
          </div>
          {/* Score badge */}
          <div style={{ position:"absolute", bottom:20, left:20, display:"flex", alignItems:"flex-end", gap:8 }}>
            <span style={{ fontSize:52, fontWeight:200, color:C.dark, letterSpacing:"-2px", lineHeight:1 }}>{ins.score}</span>
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:9, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.8px" }}>WELLNESS SCORE</div>
              <div style={{ width:7, height:7, borderRadius:"50%", background:C.teal, marginTop:2 }} />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex:1, overflowY:"auto", padding:"0 20px 36px" }}>

          {/* Greeting + phase chip */}
          <div className="fade-up" style={{ marginBottom:18 }}>
            <div style={{ fontSize:22, fontWeight:800, color:C.dark, lineHeight:1.3, letterSpacing:"-0.5px", marginBottom:10 }}>{ins.greeting}</div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:100, background:"rgba(50,25,75,0.82)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.15)" }}>
              <span style={{ fontSize:13 }}>{ins.phase.emoji}</span>
              <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.90)" }}>{ins.phase.name} · {ins_t.sciChip(ins.phase.name).split("·")[1]?.trim()}</span>
            </div>
          </div>

          {/* Key insight */}
          <div className="fade-up" style={{ animationDelay:"0.07s", background:"rgba(255,255,255,0.65)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:20, padding:"14px 16px", border:"1px solid rgba(255,255,255,0.85)", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", marginBottom:18 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.dark, lineHeight:1.55 }}>{ins.keyInsight}</div>
          </div>


          {/* User notes card (if any) */}
          {ins.notes && ins.notes.trim() && (
            <div className="fade-up" style={{ animationDelay:"0.12s", background:"rgba(255,255,255,0.60)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:20, padding:"14px 16px", border:"1px solid rgba(255,255,255,0.75)", marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:6 }}>📝 {lang==="uk"?"Твої нотатки":"Your notes"}</div>
              <div style={{ fontSize:13, color:C.dark, lineHeight:1.6, fontStyle:"italic" }}>{ins.notes}</div>
            </div>
          )}

          {/* 3 Time blocks */}
          {/* ── TODAY card — single unified ── */}
          {(() => {
            const uk = lang === "uk"
            const allRecs = [...ins.morning, ...ins.daytime, ...ins.evening]
            // Keep phase-specific first, then pick unique categories up to 5
            const seen = new Set()
            const top = allRecs.filter(r => { if (seen.has(r.category)) return false; seen.add(r.category); return true }).slice(0, 5)
            return (
              <div className="fade-up" style={{ animationDelay:"0.15s", background:"rgba(255,255,255,0.60)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderRadius:22, padding:"18px 18px 12px", border:"1px solid rgba(255,255,255,0.80)", marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.teal, textTransform:"uppercase", letterSpacing:"1px", marginBottom:14 }}>
                  🌿 {uk ? "СЬОГОДНІ" : "TODAY"} · {uk ? `ДЕНЬ ${checkIn.cycleDay}` : `DAY ${checkIn.cycleDay}`}
                </div>
                {top.map((rec, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:10, marginBottom: i < top.length-1 ? 10 : 0, borderBottom: i < top.length-1 ? "1px solid rgba(26,16,37,0.07)" : "none" }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>{rec.icon}</span>
                    <span style={{ flex:1, fontSize:14, fontWeight:600, color:C.dark, lineHeight:1.3 }}>{rec.action}</span>
                    <span style={{ fontSize:10, fontWeight:700, color:C.teal, background:"rgba(123,94,167,0.09)", borderRadius:100, padding:"3px 9px", whiteSpace:"nowrap" }}>{rec.tag}</span>
                  </div>
                ))}
              </div>
            )
          })()}

          {/* ── TOMORROW card ── */}
          {(() => {
            const cl = parseInt(profile.cycleLength) || 28
            const tomorrowCD = (checkIn.cycleDay % cl) + 1
            const tomorrowPhase = getPhase(tomorrowCD, cl)
            const tp = t.phases[tomorrowPhase]
            const uk = lang === "uk"
            const hint = {
              menstrual:  uk ? "Час сповільнитись. Легкий рух, тепло, відпочинок." : "Time to slow down. Gentle movement, warmth, rest.",
              follicular: uk ? "Енергія починає зростати. Хороший час для нових ідей." : "Energy starts rising. Good time for fresh starts.",
              ovulation:  uk ? "Пік сили і ясності. Плануй важливі справи і зустрічі." : "Peak strength and clarity. Schedule important tasks.",
              luteal:     uk ? "Знизь темп. Підтримай нервову систему і сон." : "Slow down. Support your nervous system and sleep.",
            }
            return (
              <div className="fade-up" style={{ animationDelay:"0.22s", background:"linear-gradient(135deg, rgba(26,16,37,0.90), rgba(123,94,167,0.92))", borderRadius:22, padding:"18px", marginBottom:8, border:"1px solid rgba(255,255,255,0.10)" }}>
                <div style={{ fontSize:10, fontWeight:800, color:"rgba(220,195,255,0.85)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:10 }}>
                  🔮 {uk ? "ЗАВТРА" : "TOMORROW"} · {uk ? `ДЕНЬ ${tomorrowCD}` : `DAY ${tomorrowCD}`}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <span style={{ fontSize:24 }}>{tp.emoji}</span>
                  <span style={{ fontSize:17, fontWeight:700, color:"#fff" }}>{tp.name}</span>
                </div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.68)", lineHeight:1.55 }}>{hint[tomorrowPhase]}</div>
              </div>
            )
          })()}

          {/* ── BEAUTY ROUTINE card ── */}
          {(() => {
            const br = generateBeautyRoutine(profile, lang)
            const uk = lang === "uk"
            const phaseKey2 = getPhase(checkIn.cycleDay||14, profile.cycleLength||28)
            const phaseEmoji2 = { menstrual:"🌙", follicular:"🌱", ovulation:"✨", luteal:"🍂" }[phaseKey2]
            const activePhase2 = phaseKey2==="follicular"||phaseKey2==="ovulation"
            return (
              <div className="fade-up" style={{ animationDelay:"0.28s", background:"rgba(255,255,255,0.60)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderRadius:22, padding:"18px 18px 14px", border:"1px solid rgba(255,255,255,0.80)", marginTop:8, marginBottom:8 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.teal, textTransform:"uppercase", letterSpacing:"1px", marginBottom:4 }}>
                  ✨ {uk?"БЬЮТІ РУТИНА СЬОГОДНІ":"BEAUTY ROUTINE TODAY"}
                </div>
                <div style={{ fontSize:12, color:C.teal, marginBottom:14, opacity:0.8 }}>
                  {phaseEmoji2} {uk?(activePhase2?"Активна фаза — можна використовувати активи":"Пасивна фаза — м'які засоби, без кислот"):(activePhase2?"Active phase — actives are safe today":"Passive phase — gentle only, no acids")}
                </div>
                <div style={{ fontSize:11, fontWeight:700, color:C.dark, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:8 }}>🌅 {uk?"Ранок":"Morning"}</div>
                {br.morning.map((s,i) => (
                  <div key={i} style={{ marginBottom:10 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.dark }}>{s.step}</div>
                    <div style={{ fontSize:13, color:C.dark, opacity:0.85 }}>{s.product}</div>
                    <div style={{ fontSize:11, color:C.teal, marginTop:2 }}>{s.why}</div>
                  </div>
                ))}
                <div style={{ height:1, background:"rgba(123,94,167,0.12)", margin:"10px 0" }} />
                <div style={{ fontSize:11, fontWeight:700, color:C.dark, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:8 }}>🌙 {uk?"Вечір":"Evening"}</div>
                {br.evening.map((s,i) => (
                  <div key={i} style={{ marginBottom:10 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.dark }}>{s.step}</div>
                    <div style={{ fontSize:13, color:C.dark, opacity:0.85 }}>{s.product}</div>
                    <div style={{ fontSize:11, color:C.teal, marginTop:2 }}>{s.why}</div>
                  </div>
                ))}
                {br.skip.length>0 && (<>
                  <div style={{ height:1, background:"rgba(123,94,167,0.12)", margin:"10px 0" }} />
                  <div style={{ fontSize:11, fontWeight:700, color:C.dark, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:8 }}>{uk?"Уникай сьогодні":"Skip today"}</div>
                  {br.skip.map((s,i)=><div key={i} style={{ fontSize:12, color:"#7a4040", marginBottom:4 }}>{s}</div>)}
                </>)}
              </div>
            )
          })()}

          <div style={{ marginTop:8 }}>
            <BtnDark label={ins_t.dashBtn} onClick={onDone} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── BEAUTY ROUTINE GENERATOR ────────────────────────────────────────────────
function generateBeautyRoutine(profile, lang) {
  const skin  = profile.skinSymptoms || []
  const age   = profile.birthYear ? calcAge(profile.birthYear) : 35
  const phase = getPhase(parseInt(profile.cycleDay)||14, parseInt(profile.cycleLength)||28)
  const uk    = lang === "uk"
  const activePhase = phase === "follicular" || phase === "ovulation"

  let morning = [], evening = [], skip = []

  if (skin.includes("acne")) {
    morning = [
      { step:uk?"1. Очищення":"1. Cleanse", product:uk?"Гелевий засіб із саліциловою кислотою 0.5–1%":"Gel cleanser with salicylic acid 0.5–1%", why:uk?"Саліцилова очищає пори зсередини":"Salicylic acid clears pores from within" },
      { step:uk?"2. Сироватка":"2. Serum", product:uk?"Ніацинамід 10% + Цинк":"Niacinamide 10% + Zinc", why:uk?"Регулює себум, звужує пори, заспокоює":"Regulates sebum, minimises pores, calms" },
      { step:uk?"3. Захист":"3. Protect", product:uk?"Легкий SPF 30–50 без олій":"Lightweight oil-free SPF 30–50", why:uk?"Без SPF ніацинамід дає зворотній ефект":"Without SPF niacinamide can backfire" },
    ]
    evening = [
      { step:uk?"1. Подвійне очищення":"1. Double cleanse", product:uk?"Міцелярна вода → гелевий засіб":"Micellar water → gel cleanser", why:uk?"Повністю прибирає SPF і забруднення":"Fully removes SPF and pollution" },
      { step:uk?"2. Актив":"2. Active", product: activePhase?(uk?"BHA сироватка (Cosrx, Paula's Choice)":"BHA serum (Cosrx, Paula's Choice)"):(uk?"Ніацинамід — без кислот у цю фазу":"Niacinamide only — no acids this phase"), why: activePhase?(uk?"Фаза дозволяє кислоти":"Phase allows acids"):(uk?"Шкіра чутливіша — зберігаємо бар'єр":"Skin is more sensitive — protect barrier") },
      { step:uk?"3. Зволоження":"3. Moisturise", product:uk?"Легкий крем з ніацинамідом або алое":"Light cream with niacinamide or aloe", why:uk?"Відновлює бар'єр без закупорки пор":"Restores barrier without clogging" },
    ]
    skip = [uk?"❌ Скраби — роздратують запалену шкіру":"❌ Physical scrubs — irritate inflamed skin", uk?"❌ Спиртові тоніки — руйнують бар'єр":"❌ Alcohol toners — destroy the barrier", uk?"❌ Кокосова олія — комедогенна":"❌ Coconut oil — highly comedogenic"]
  } else if (skin.includes("dry") || skin.includes("wrinkles")) {
    morning = [
      { step:uk?"1. Очищення":"1. Cleanse", product:uk?"Кремовий або молочний засіб без SLS":"Cream or milk cleanser without SLS", why:uk?"SLS руйнує ліпідний бар'єр — головну причину сухості":"SLS destroys the lipid barrier — main cause of dryness" },
      { step:uk?"2. Сироватка":"2. Serum", product:uk?"Гіалуронова кислота 1–2% (на вологу шкіру)":"Hyaluronic acid 1–2% (on damp skin)", why:uk?"На вологу шкіру утримує воду в 10 разів краще":"On damp skin holds 10× more moisture" },
      { step:uk?"3. Захист":"3. Protect", product:uk?"Зволожувальний SPF 30–50 з церамідами":"Moisturising SPF 30–50 with ceramides", why:uk?"Церамід и + SPF = захист і відновлення бар'єру":"Ceramides + SPF = protection and barrier repair" },
    ]
    evening = [
      { step:uk?"1. Очищення":"1. Cleanse", product:uk?"Бальзам або олія для очищення":"Cleansing balm or oil", why:uk?"Не знімає власні ліпіди — тільки бруд":"Doesn't strip your own lipids" },
      { step:uk?"2. Актив":"2. Active", product: activePhase?(age>=35?(uk?"Ретинол 0.025–0.05%":"Retinol 0.025–0.05%"):(uk?"Пептиди":"Peptides")):(uk?"Пептиди — без ретинолу в цю фазу":"Peptides — no retinol this phase"), why: activePhase?(uk?"Ретинол стимулює колаген. Починай з низьких концентрацій":"Retinol stimulates collagen. Start low"):(uk?"Пептиди стимулюють колаген без подразнення":"Peptides stimulate collagen without irritation") },
      { step:uk?"3. Живлення":"3. Nourish", product:uk?"Щільний крем з церамідами або сквалановою олією":"Rich ceramide cream or squalane oil", why:uk?"Ніч — час відновлення бар'єру":"Night is barrier repair time" },
    ]
    skip = [uk?"❌ Пінки та гелі з SLS — пересушують":"❌ SLS foaming cleansers — over-dry", uk?"❌ Кислоти щодня — руйнують бар'єр":"❌ Daily acids — destroy the barrier", uk?"❌ Ретинол у лютеальній/менструальній фазах":"❌ Retinol during luteal/menstrual phase"]
  } else if (skin.includes("sensitive")) {
    morning = [
      { step:uk?"1. Очищення":"1. Cleanse", product:uk?"Міцелярна вода (без полоскання)":"Micellar water (no-rinse)", why:uk?"Мінімум контакту і тертя — правило №1 для чутливої шкіри":"Minimum contact and friction — rule #1 for sensitive skin" },
      { step:uk?"2. Зволоження":"2. Moisturise", product:uk?"Крем з церамідами та пантенолом (CeraVe, La Roche-Posay)":"Ceramide + panthenol cream (CeraVe, La Roche-Posay)", why:uk?"Церам іди — природний захист шкіри":"Ceramides are your skin's natural defense" },
      { step:uk?"3. Захист":"3. Protect", product:uk?"Мінеральний SPF 30+ (без хімічних фільтрів)":"Mineral SPF 30+ (no chemical filters)", why:uk?"Хімічні фільтри часто провокують реакції":"Chemical filters often trigger reactions" },
    ]
    evening = [
      { step:uk?"1. Очищення":"1. Cleanse", product:uk?"Міцелярна вода або молочко":"Micellar water or cleansing milk", why:uk?"Ніякого тертя і агресивних речовин":"No friction, no harsh surfactants" },
      { step:uk?"2. Відновлення":"2. Restore", product:uk?"Сироватка з центеллою або ніацинамідом 5%":"Centella or niacinamide 5% serum (max)", why:uk?"Центелла заспокоює і відновлює бар'єр":"Centella calms and restores barrier" },
      { step:uk?"3. Захист бар'єру":"3. Protect barrier", product:uk?"Щільний крем з церамідами на ніч":"Rich overnight ceramide cream", why:uk?"Ніч — єдиний час повного відновлення":"Night is the only full repair window" },
    ]
    skip = [uk?"❌ Кислоти (AHA, BHA) — реакція гарантована":"❌ AHA/BHA acids — reaction guaranteed", uk?"❌ Ефірні олії — дуже часті алергени":"❌ Essential oils — very frequent allergen", uk?"❌ Продукти з ароматизаторами":"❌ Fragranced products"]
  } else {
    morning = [
      { step:uk?"1. Очищення":"1. Cleanse", product:uk?"М'який гель без SLS":"Gentle gel cleanser without SLS", why:uk?"М'яке очищення зберігає мікробіом шкіри":"Gentle cleansing preserves skin microbiome" },
      { step:uk?"2. Сироватка":"2. Serum", product:uk?"Вітамін C 10–15% (L-аскорбінова кислота)":"Vitamin C 10–15% (L-ascorbic acid)", why:uk?"Антиоксидант вранці нейтралізує UV-пошкодження і стимулює колаген":"Morning antioxidant neutralises UV damage and stimulates collagen" },
      { step:uk?"3. Захист":"3. Protect", product:uk?"SPF 30–50 щодня (навіть вдома)":"SPF 30–50 daily (even indoors)", why:uk?"SPF — єдиний доведений засіб проти фотостаріння":"SPF is the only proven anti-photoageing intervention" },
    ]
    evening = [
      { step:uk?"1. Очищення":"1. Cleanse", product:uk?"Той самий засіб або бальзам":"Same cleanser or cleansing balm", why:uk?"Подвійне очищення — тільки якщо є макіяж":"Double cleanse only if wearing makeup" },
      { step:uk?"2. Актив":"2. Active", product: activePhase?(uk?"Ретинол 0.05% або AHA 5–10%":"Retinol 0.05% or AHA 5–10%"):(uk?"Пептиди або ніацинамід — без кислот у цю фазу":"Peptides or niacinamide — no acids this phase"), why: activePhase?(uk?"Фолікулярна/овуляція — шкіра найстійкіша до активів":"Follicular/ovulation — skin is most resilient to actives"):(uk?"Лютеальна/менструальна — шкіра чутливіша":"Luteal/menstrual — skin is more sensitive") },
      { step:uk?"3. Зволоження":"3. Moisturise", product:uk?"Крем з пептидами або гіалуроновою кислотою":"Peptide or hyaluronic acid moisturiser", why:uk?"Відновлює бар'єр і підтримує пружність":"Restores barrier and supports elasticity" },
    ]
    skip = [uk?"❌ Більше 3–4 кроків — більше ≠ краще":"❌ More than 3–4 steps — more ≠ better", uk?"❌ Шарування кислот різних типів — порушує pH":"❌ Layering multiple acid types — disrupts pH"]
  }

  return { morning, evening, skip }
}

// ─── HEALTH HUB: fallback data generator ─────────────────────────────────────
function generateHubData(profile, lang) {
  const age    = profile.birthYear ? calcAge(profile.birthYear) : 35
  const contra = profile.contraception || "none"
  const uk     = lang === "uk"
  const phase  = getPhase(parseInt(profile.cycleDay)||14, parseInt(profile.cycleLength)||28)
  const skin   = profile.skinSymptoms  || []
  const hair   = profile.hairSymptoms  || []
  const body   = profile.bodySymptoms  || []
  const stress = profile.stressLevel   || 5
  const wake   = profile.wakeNight     || "no"
  const protein= profile.proteinIntake || "moderate"
  const mainGoal = profile.mainGoal    || ""
  const phaseLabel = { menstrual:uk?"менструальній":"menstrual", follicular:uk?"фолікулярній":"follicular", ovulation:uk?"овуляції":"ovulation", luteal:uk?"лютеальній":"luteal" }

  // ── LABS ──
  const labs = []
  labs.push({ priority: hair.includes("shedding")||body.includes("fatigue")?1:1, name:uk?"Феритин + залізо":"Ferritin + Iron",
    why: hair.includes("shedding")
      ? (uk?"Ти відмітила випадіння волосся. Феритин — причина №1 випадіння, яку найчастіше пропускають. Здати першим.":"You noted hair shedding. Ferritin is the #1 missed cause of hair loss. Test this first.")
      : (uk?"Навіть субклінічна анемія дає втому і туман у голові. Базовий аналіз для кожної жінки 35+.":"Even subclinical iron deficiency causes fatigue and brain fog. A baseline test for every woman 35+.") })
  labs.push({ priority:1, name:uk?"Вітамін D3":"Vitamin D3",
    why:uk?"70% людей мають дефіцит. Впливає на імунітет, гормони, якість сну та настрій.":"70% of people are deficient. Affects immunity, hormones, sleep quality and mood." })
  labs.push({ priority: age>=38||body.includes("fatigue")||body.includes("brainfog")?1:2, name:uk?"Free T3/T4 + TSH":"Free T3/T4 + TSH",
    why:uk?"Щитовидна залоза регулює метаболізм, вагу та енергію. Після 35 ризик субклінічного гіпотиреозу зростає.":"Thyroid regulates metabolism, weight and energy. Subclinical hypothyroidism risk rises after 35." })
  labs.push({ priority: skin.includes("acne")||hair.includes("thinning")||age>=38?1:2, name:uk?"Естрадіол + прогестерон (Д3 циклу)":"Estradiol + Progesterone (Day 3)",
    why: skin.includes("acne")&&hair.includes("thinning")
      ? (uk?"Акне + стоншення волосся вказують на дисбаланс андрогенів. Гормональний профіль покаже картину.":"Acne + hair thinning signal androgen imbalance. Hormone panel will show the picture.")
      : (uk?"Базовий гормональний профіль. Показує де ти в гормональному балансі і чи наближається перименопауза.":"Baseline hormone profile. Shows where you are in hormonal balance and whether perimenopause is approaching.") })
  labs.push({ priority: stress>=7||wake==="yes"?1:2, name:uk?"Кортизол (ранковий)":"Cortisol (morning)",
    why: wake==="yes"
      ? (uk?"Ти прокидаєшся о 3–4 ночі — класичний кортизол-спайк. Ранковий аналіз покаже реальне навантаження на наднирники.":"You wake at 3–4am — classic cortisol spike. Morning test reveals real adrenal load.")
      : (uk?"Хронічний стрес виснажує наднирники. Ранковий кортизол покаже реальне навантаження на нервову систему.":"Chronic stress depletes adrenals. Morning cortisol reveals the real load on your nervous system.") })
  if (age>=40) labs.push({ priority:1, name:uk?"АМГ (антимюллерів гормон)":"AMH (Anti-Müllerian Hormone)",
    why:uk?"Показує оваріальний резерв. Важливо для розуміння де ти в гормональному переході.":"Shows ovarian reserve. Important for understanding where you are in hormonal transition." })
  if (skin.includes("acne")&&(hair.includes("thinning")||body.includes("belly"))) labs.push({ priority:1, name:uk?"Тестостерон + ДГЕА-С":"Testosterone + DHEA-S",
    why:uk?"Акне + волосся + живіт — можливий дисбаланс андрогенів або СПКЯ. Здати поряд з гормональним профілем.":"Acne + hair + belly — possible androgen imbalance or PCOS. Test alongside hormone panel." })
  labs.push({ priority: skin.includes("dry")||skin.includes("sensitive")?1:2, name:uk?"Омега-3 індекс":"Omega-3 Index",
    why: skin.includes("dry")?(uk?"Суха шкіра часто пов'язана з дефіцитом Омега-3. Індекс покаже точний рівень.":"Dry skin is often linked to Omega-3 deficiency. The index shows your exact level."):(uk?"Більшість людей мають субоптимальний рівень. Впливає на запалення, мозок, серце та шкіру.":"Most people have suboptimal levels. Affects inflammation, brain, heart and skin.") })
  labs.sort((a,b)=>a.priority-b.priority)

  // ── GADGETS ──
  const gadgets = []
  gadgets.push({ name:"Oura Ring Gen 4", price:"~$350",
    why_for_you: uk
      ? `Температурний трекінг підтвердить ${contra==="none"?"твої фази циклу":"зміни самопочуття"} даними. HRV вранці покаже рівень відновлення.${wake==="yes"?" Особливо корисно при нічних прокиданнях — побачиш патерн.":""}`
      : `Temperature tracking confirms ${contra==="none"?"your cycle phases":"wellbeing changes"} with data. Morning HRV shows your recovery level.${wake==="yes"?" Especially useful for night waking — you'll see the pattern.":""}` })
  if (skin.includes("dry")||skin.includes("wrinkles")||skin.includes("dull")||mainGoal==="skin") gadgets.push({
    name: uk?"LED-маска (Currentbody / Omnilux)":"LED Face Mask (Currentbody / Omnilux)", price:"~$300–400",
    why_for_you: uk
      ? `${skin.includes("wrinkles")?"Червоне світло стимулює колаген і зменшує зморшки. ":""}${skin.includes("acne")?"Синє світло знищує бактерії акне. ":""}3–5 сесій/тиждень протягом 8–12 тижнів дають видимий результат.`
      : `${skin.includes("wrinkles")?"Red light stimulates collagen and reduces wrinkles. ":""}${skin.includes("acne")?"Blue light kills acne bacteria. ":""}3–5 sessions/week for 8–12 weeks gives visible results.` })
  if (hair.includes("thinning")||hair.includes("shedding")||mainGoal==="hair") gadgets.push({
    name: uk?"Шолом/гребінь для росту волосся (iRestore)":"Hair Growth Laser Helmet (iRestore / Capillus)", price:"~$200–800",
    why_for_you: uk?"Фотобіостимуляція підтверджена клінічними дослідженнями для відновлення щільності волосся. 3 сесії на тиждень.":"Photobiomodulation has clinical evidence for restoring hair density. 3 sessions per week." })
  if (body.includes("fatigue")||body.includes("belly")||protein==="low") gadgets.push({
    name: uk?"Монітор глюкози (Libre/Dexcom)":"Continuous Glucose Monitor (Libre/Dexcom)", price:uk?"~$80/міс":"~$80/mo",
    why_for_you: uk?"2 тижні носіння покажуть як їжа, сон та стрес впливають на твою енергію і тягу до солодкого.":"2 weeks shows how food, sleep and stress affect your energy and sugar cravings." })
  gadgets.push({ name:uk?"Лампа червоного/інфрачервоного світла":"Red/NIR Light Panel", price:"~$200–600",
    why_for_you: uk?`Стимулює мітохондрії, зменшує запалення та покращує якість шкіри. Особливо корисно в ${phaseLabel[phase]} фазі.`:`Stimulates mitochondria, reduces inflammation and improves skin. Especially effective in the ${phaseLabel[phase]} phase.` })

  // ── SUPPLEMENTS ──
  const tier1 = []
  tier1.push({ name:uk?"Магній гліцинат":"Magnesium Glycinate", dose:"300–400 мг", timing:uk?"за 30 хв до сну":"30 min before sleep",
    why: wake==="yes"?(uk?"Ти прокидаєшся вночі — магній знижує кортизол-спайк що це викликає. Пріоритет №1.":"You wake at night — magnesium reduces the cortisol spike that causes it. Priority #1."):(uk?`Покращує сон, знижує кортизол та ПМС. У ${phaseLabel[phase]} фазі особливо важливий.`:`Improves sleep, lowers cortisol and PMS. Especially important in the ${phaseLabel[phase]} phase.`) })
  tier1.push({ name:uk?"Вітамін D3 + K2":"Vitamin D3 + K2", dose:uk?"2000–5000 МО D3 + 100 мкг K2":"2000–5000 IU D3 + 100mcg K2", timing:uk?"зранку з жирною їжею":"morning with fat",
    why:uk?"Критично для гормонів, імунітету та настрою. K2 направляє кальцій у кістки.":"Critical for hormones, immunity and mood. K2 directs calcium to bones, not arteries." })
  tier1.push({ name:uk?"Омега-3 (EPA + DHA)":"Omega-3 (EPA + DHA)", dose:uk?"2–3 г на день":"2–3g daily", timing:uk?"з їжею":"with food",
    why: skin.includes("dry")||skin.includes("sensitive")?(uk?"Омега-3 відновлює шкірний бар'єр зсередини. При сухій/чутливій шкірі — пріоритет.":"Omega-3 rebuilds the skin barrier from within. Priority for dry/sensitive skin."):(uk?"Протизапальний ефект, підтримка мозку та серцево-судинної системи.":"Anti-inflammatory, brain and cardiovascular support.") })
  if (hair.includes("shedding")||body.includes("fatigue")) tier1.push({ name:uk?"Залізо бісгліцинат":"Iron Bisglycinate", dose:"18–25 мг", timing:uk?"натщесерце або з вітаміном C":"fasted or with Vitamin C",
    why:uk?"Бісгліцинат краще засвоюється і не дратує шлунок. Критично при випадінні волосся.":"Bisglycinate absorbs better and doesn't irritate. Critical for hair shedding." })
  if (skin.includes("dry")||skin.includes("wrinkles")||age>=38||mainGoal==="skin") tier1.push({ name:uk?"Колаген морський (тип I/III)":"Marine Collagen (Type I/III)", dose:uk?"10 г на день":"10g daily", timing:uk?"вранці з вітаміном C":"morning with Vitamin C",
    why:skin.includes("wrinkles")?(uk?"Стимулює синтез власного колагену. Після 35 він падає на 1% щороку.":"Stimulates your own collagen synthesis. Drops 1% per year after 35."):(uk?"Підтримує пружність шкіри та суглоби.":"Supports skin elasticity and joints.") })
  if (["hormonal_pill","hormonal_iud"].includes(contra)) tier1.push({ name:uk?"Вітамін B6 + Фолат (P5P)":"Vitamin B6 + Folate (P5P)", dose:uk?"25–50 мг B6 + 400 мкг фолату":"25–50mg B6 + 400mcg folate", timing:uk?"вранці з їжею":"morning with food",
    why:uk?"Підтримує метаболізм естрогену та нейромедіатори. Особливо важливо при гормональній контрацепції.":"Supports estrogen metabolism and neurotransmitters. Especially important with hormonal contraception." })
  if (protein==="low") tier1.push({ name:uk?"Протеїн (сироватковий або рослинний)":"Protein Powder (whey or plant-based)", dose:uk?"25–30 г на прийом":"25–30g per serving", timing:uk?"вранці або після тренування":"morning or post-workout",
    why:uk?"Ти вказала низьке споживання білку. Волосся, шкіра, м'язи і гормони — все залежить від білку.":"You noted low protein intake. Hair, skin, muscles and hormones all depend on protein." })

  const tier2 = []
  tier2.push({ name:uk?"Ашваганда (KSM-66)":"Ashwagandha (KSM-66)", dose:"300–600 мг", timing:uk?"ввечері":"evening",
    why: stress>=7?(uk?"Рівень стресу 7+/10. Ашваганда знижує кортизол на 23% за 8 тижнів (клінічні дані).":"Stress level 7+/10. Ashwagandha reduces cortisol by 23% over 8 weeks (clinical data)."):(uk?"Знижує кортизол і підтримує наднирники. Особливо у стресові дні.":"Lowers cortisol and supports adrenal function.") })
  tier2.push({ name:uk?"Коензим Q10 (убіхінол)":"Coenzyme Q10 (Ubiquinol)", dose:"100–200 мг", timing:uk?"з жирною їжею":"with fatty food",
    why:uk?"Підтримує мітохондрії — джерело клітинної енергії. Після 35 рівень Q10 природно знижується.":"Supports mitochondria — the source of cellular energy. Levels naturally decline after 35." })
  tier2.push({ name:"NMN / NR", dose:"250–500 мг", timing:uk?"вранці натще":"morning fasted",
    why:uk?"Підвищує NAD+ — ключовий кофактор довголіття та клітинного відновлення.":"Raises NAD+ — a key longevity and cellular repair cofactor." })

  return { labs, gadgets, supplements: { tier1, tier2 } }
}

// ─── SCREEN 6: HEALTH HUB ────────────────────────────────────────────────────
function HealthHub({ profile, lang, onBack, t }) {
  const [tab,     setTab]     = useState("labs")
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  const profileSig = JSON.stringify([
    (profile.goals||[]).slice().sort(),
    profile.contraception,
    profile.birthYear,
  ])

  useEffect(() => {
    const cached = lsGet("vive_healthhub", null)
    if (cached && cached.sig === profileSig) {
      setData(cached.data); setLoading(false); return
    }
    fetch("/.netlify/functions/healthhub", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        age:          profile.birthYear ? calcAge(profile.birthYear) : 35,
        cyclePhase:   getPhase(parseInt(profile.cycleDay)||14, parseInt(profile.cycleLength)||28),
        goals:        profile.goals || [],
        contraception:profile.contraception || "none",
        lang,
      })
    })
    .then(r => { if (!r.ok) throw new Error(); return r.json() })
    .then(d => { lsSet("vive_healthhub", { data:d, sig:profileSig }); setData(d) })
    .catch(() => {
      const fb = generateHubData(profile, lang)
      lsSet("vive_healthhub", { data:fb, sig:profileSig }); setData(fb)
    })
    .finally(() => setLoading(false))
  }, [])

  const hh   = t.healthhub
  const TABS = [
    { id:"labs",        label:hh.tabLabs,    icon:"🔬" },
    { id:"gadgets",     label:hh.tabGadgets, icon:"📱" },
    { id:"supplements", label:hh.tabSupps,   icon:"💊" },
  ]

  return (
    <Wrap>
      <div style={{ padding:"52px 20px 0", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={onBack} style={{ width:40, height:40, borderRadius:13, background:"rgba(26,16,37,0.07)", border:"none", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:C.dark, letterSpacing:"-0.5px" }}>{hh.title}</div>
            <div style={{ fontSize:12, color:C.teal }}>{hh.subtitle}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:20, background:"rgba(26,16,37,0.06)", borderRadius:16, padding:4 }}>
          {TABS.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              style={{ flex:1, padding:"9px 4px", borderRadius:13, border:"none", background:tab===tb.id?C.dark:"transparent", color:tab===tb.id?"#fff":C.teal, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:16 }}>{tb.icon}</span>
              {tb.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:"center", padding:"60px 0", color:C.teal }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🧬</div>
            <div style={{ fontSize:14 }}>{hh.loading}</div>
          </div>
        )}

        {/* LABS */}
        {!loading && data && tab==="labs" && (
          <div>
            <div style={{ fontSize:12, color:C.teal, marginBottom:14, lineHeight:1.5 }}>{hh.labsNote}</div>
            {data.labs.map((lab, i) => (
              <GlassCard key={i} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:lab.priority===1?C.dark:"rgba(26,16,37,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:13, color:lab.priority===1?"#fff":C.teal }}>{lab.priority===1?"★":"☆"}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:4 }}>{lab.name}</div>
                    <div style={{ fontSize:12, color:C.teal, lineHeight:1.5 }}>{lab.why}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
            <div style={{ fontSize:11, color:"rgba(123,94,167,0.55)", textAlign:"center", padding:"12px 0 24px", lineHeight:1.5 }}>{hh.labsDisclaimer}</div>
          </div>
        )}

        {/* GADGETS */}
        {!loading && data && tab==="gadgets" && (
          <div>
            {data.gadgets.map((g, i) => (
              <GlassCard key={i} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:C.dark, flex:1 }}>{g.name}</div>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:100, background:"rgba(26,16,37,0.08)", color:C.teal, whiteSpace:"nowrap", marginLeft:8 }}>{g.price}</span>
                </div>
                <div style={{ fontSize:12, color:C.teal, lineHeight:1.5 }}>{g.why_for_you}</div>
              </GlassCard>
            ))}
            <div style={{ height:24 }} />
          </div>
        )}

        {/* SUPPLEMENTS */}
        {!loading && data && tab==="supplements" && (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#fff", background:"rgba(50,25,75,0.82)", backdropFilter:"blur(12px)", display:"inline-flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:100, marginBottom:12, border:"1px solid rgba(255,255,255,0.15)" }}>
              ★ {hh.tier1}
            </div>
            {data.supplements.tier1.map((s, i) => (
              <GlassCard key={i} style={{ marginBottom:10, borderLeft:`3px solid ${C.teal}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.dark }}>{s.name}</div>
                  <span style={{ fontSize:10, color:C.teal, textAlign:"right", maxWidth:110, lineHeight:1.3 }}>{s.timing}</span>
                </div>
                <div style={{ fontSize:11, color:C.teal, marginBottom:5, fontWeight:600 }}>{s.dose}</div>
                <div style={{ fontSize:12, color:C.teal, lineHeight:1.5 }}>{s.why}</div>
              </GlassCard>
            ))}

            <div style={{ fontSize:11, fontWeight:700, color:C.teal, background:"rgba(123,94,167,0.12)", display:"inline-flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:100, margin:"16px 0 12px" }}>
              ☆ {hh.tier2}
            </div>
            {data.supplements.tier2.map((s, i) => (
              <GlassCard key={i} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.dark }}>{s.name}</div>
                  <span style={{ fontSize:10, color:C.teal, textAlign:"right", maxWidth:110, lineHeight:1.3 }}>{s.timing}</span>
                </div>
                <div style={{ fontSize:11, color:C.teal, marginBottom:5, fontWeight:600 }}>{s.dose}</div>
                <div style={{ fontSize:12, color:C.teal, lineHeight:1.5 }}>{s.why}</div>
              </GlassCard>
            ))}
            <div style={{ height:24 }} />
          </div>
        )}

      </div>
    </Wrap>
  )
}

// ─── SCREEN 5: DASHBOARD ──────────────────────────────────────────────────────
function ActivityRing({ pct, color, emoji, label, val }) {
  const size=72, stroke=7, r=(size-stroke)/2, circ=2*Math.PI*r
  const dash=circ*Math.min(pct,1), gap=circ-dash
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`} strokeLinecap="round"/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:18, lineHeight:1 }}>{emoji}</span>
          <span style={{ fontSize:10, fontWeight:700, color:"#fff", marginTop:2 }}>{val}</span>
        </div>
      </div>
      <span style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.55)" }}>{label}</span>
    </div>
  )
}

function getDayPhrase(cycleDay, phaseKey, lang) {
  const uk = lang === "uk"
  const p = {
    menstrual:  uk ? `День ${cycleDay} — час відпочити. Слухай тіло, уникай надмірного навантаження.` : `Day ${cycleDay} — time to rest. Listen to your body.`,
    follicular: uk ? `День ${cycleDay} — енергія зростає. Ідеальний час для нових ідей і планів.`    : `Day ${cycleDay} — energy is rising. Perfect for new ideas.`,
    ovulation:  uk ? `День ${cycleDay} — пік сили та ясності. Плануй найважливіше на сьогодні.`      : `Day ${cycleDay} — peak strength. Schedule your most important tasks.`,
    luteal:     uk ? `День ${cycleDay} — час для глибокого фокусу. Уникай зайвого шуму.`              : `Day ${cycleDay} — time for deep focus. Minimize distractions.`,
  }
  return p[phaseKey]
}

function generateDailyTasks(profile, phaseKey, lang) {
  const uk = lang === "uk"
  const sport = {
    menstrual:  { uk:"Ніжна йога або ходьба 20 хв",     en:"Gentle yoga or walking 20 min" },
    follicular: { uk:"Кардіо або танці 30 хв",           en:"Cardio or dancing 30 min" },
    ovulation:  { uk:"HIIT або силові тренування 30 хв", en:"HIIT or strength training 30 min" },
    luteal:     { uk:"Пілатес або силові вправи 25 хв",  en:"Pilates or strength exercises 25 min" },
  }
  const nutrition = {
    low:      { uk:"25–30г білку на сніданок — пріоритет", en:"25–30g protein at breakfast — priority" },
    moderate: { uk:"Білок у кожному прийомі їжі",          en:"Protein at every meal" },
    high:     { uk:"Підтримуй норму 1.6г/кг ваги",         en:"Maintain 1.6g/kg target" },
  }
  const suppDetail = (profile.supplements||[]).length > 0
    ? (profile.supplements||[]).slice(0,2).map(s=>s).join(", ")
    : (uk?"Магній + D3":"Magnesium + D3")
  return [
    { id:"morning_beauty", icon:"🌅", title:uk?"Ранкова рутина":"Morning routine", detail:uk?"Очищення → сироватка → SPF":"Cleanse → serum → SPF", done:false },
    { id:"sport", icon:"🏋️", title:uk?"Рух":"Movement", detail:sport[phaseKey][uk?"uk":"en"], done:false },
    { id:"supplements", icon:"💊", title:uk?"Добавки":"Supplements", detail:suppDetail, done:false },
    { id:"nutrition", icon:"🥗", title:uk?"Харчування":"Nutrition", detail:nutrition[profile.proteinIntake||"moderate"][uk?"uk":"en"], done:false },
    { id:"evening_beauty", icon:"🌙", title:uk?"Вечірня рутина":"Evening routine", detail:uk?"Очищення → актив → зволоження":"Cleanse → active → moisturise", done:false },
  ]
}

function getDefaultProtocol(lang) {
  const uk = lang === "uk"
  return [
    { id:"cosm",  icon:"💆", name:uk?"Косметолог":"Cosmetologist",    frequencyDays:28,  lastDone:null },
    { id:"led",   icon:"💡", name:uk?"LED-маска":"LED mask",           frequencyDays:2,   lastDone:null },
    { id:"labs",  icon:"🩸", name:uk?"Аналізи":"Lab tests",            frequencyDays:180, lastDone:null },
  ]
}

function Dashboard({ history, profile, onCheckIn, onHealthHub, onCalendar, onReset, lang, onLangToggle, t }) {
  const today    = localDateStr()
  const cycleDay = getCurrentCycleDay(profile)
  const phaseKey = getPhase(cycleDay, parseInt(profile.cycleLength)||28)
  const phase    = t.phases[phaseKey]
  const streak   = calcStreak(history)
  const uk       = lang === "uk"

  const [tasks, setTasks] = useState(() => {
    const saved = lsGet(`vive_tasks_${today}`, null)
    return saved || generateDailyTasks(profile, phaseKey, lang)
  })
  const [editMode,    setEditMode]    = useState(false)
  const [editingId,   setEditingId]   = useState(null)
  const [editVal,     setEditVal]     = useState("")
  const [protocol,    setProtocol]    = useState(() => lsGet("vive_protocol", getDefaultProtocol(lang)))
  const [addingItem,  setAddingItem]  = useState(false)
  const [newItem,     setNewItem]     = useState({ name:"", icon:"📌", frequencyDays:7 })
  const [mood,        setMood]        = useState(() => lsGet(`vive_mood_${today}`, null))

  useEffect(() => { lsSet(`vive_tasks_${today}`, tasks) }, [tasks])
  useEffect(() => { lsSet("vive_protocol", protocol) }, [protocol])
  useEffect(() => { if (mood) lsSet(`vive_mood_${today}`, mood) }, [mood])

  const doneCount  = tasks.filter(tk => tk.done).length
  const streakPct  = Math.min(streak / 21, 1)
  const chartData  = history.slice(-7).map((h,i) => ({ d:`${i+1}`, e:h.energy, s:h.sleep }))

  const toggleTask = (id) => setTasks(ts => ts.map(tk => tk.id===id ? {...tk, done:!tk.done} : tk))
  const updateTask = (id, title) => setTasks(ts => ts.map(tk => tk.id===id ? {...tk, customTitle:title} : tk))

  const getRitualStatus = (item) => {
    if (!item.lastDone) return { label:uk?"Ще не робила":"Not done yet", urgent:true }
    const days = Math.round((new Date(today) - new Date(item.lastDone)) / 86400000)
    const rem  = item.frequencyDays - days
    if (rem <= 0)                         return { label:uk?"Час!":"Time!",               urgent:true }
    if (rem <= item.frequencyDays * 0.25) return { label:uk?`За ${rem} дн.`:`In ${rem}d`, urgent:false, soon:true }
    return { label:uk?`За ${rem} дн.`:`In ${rem}d`, urgent:false }
  }
  const markRitual = (id) => setProtocol(ps => ps.map(p => p.id===id ? {...p, lastDone:today} : p))

  const card = { background:"rgba(255,255,255,0.65)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:22, padding:"16px 18px", marginBottom:14, border:"1px solid rgba(255,255,255,0.80)" }

  return (
    <Wrap>
      <div style={{ padding:"52px 20px 110px", overflowY:"auto" }}>

        {/* ── HEADER ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:14, color:C.teal, marginBottom:2 }}>{getGreeting(t)},</div>
            <div style={{ fontSize:26, fontWeight:900, color:C.dark, letterSpacing:"-0.5px" }}>{profile.name}</div>
            <div onClick={onCalendar} style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:7, padding:"5px 12px", borderRadius:100, background:"rgba(26,16,37,0.07)", cursor:"pointer" }}>
              <span>{phase.emoji}</span>
              <span style={{ fontSize:12, fontWeight:600, color:C.teal }}>{phase.name} · {uk?"День":"Day"} {cycleDay}</span>
              <span style={{ fontSize:10, color:C.teal, opacity:0.6 }}>📅</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <LangToggle lang={lang} onToggle={onLangToggle} />
            <button onClick={onReset} style={{ width:38, height:38, borderRadius:12, background:"rgba(26,16,37,0.07)", border:"none", fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>⚙️</button>
          </div>
        </div>

        {/* ── STREAK ── */}
        <div style={{ background:"linear-gradient(135deg, #1C221C, #2d3d2d)", borderRadius:24, padding:"22px 20px 18px", marginBottom:14, textAlign:"center" }}>
          <div style={{ fontSize:52, lineHeight:1, marginBottom:2 }}>🔥</div>
          <div style={{ fontSize:44, fontWeight:900, color:"#fff", letterSpacing:"-2px", lineHeight:1 }}>{streak}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:14 }}>
            {uk ? (streak===1?"день поспіль":"днів поспіль") : (streak===1?"day streak":"day streak")}
          </div>
          <div style={{ background:"rgba(255,255,255,0.10)", borderRadius:100, height:8, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:100, background:"linear-gradient(90deg,#C0F988,#4A6452)", width:`${streakPct*100}%`, transition:"width 0.6s ease" }} />
          </div>
          <div style={{ fontSize:11, color:"rgba(192,249,136,0.55)", marginTop:7 }}>
            {Math.round(streakPct*100)}% {uk?"до 21 дня":"to 21 days"}
          </div>
        </div>

        {/* ── TODAY'S TASKS ── */}
        <div style={card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:800, color:C.dark, textTransform:"uppercase", letterSpacing:"0.8px" }}>
                {uk?"СЬОГОДНІ":"TODAY"} · {doneCount}/{tasks.length}
              </div>
              <div style={{ fontSize:11, color:C.teal, marginTop:3, lineHeight:1.4 }}>{phase.tagline}</div>
            </div>
            <button onClick={()=>{ setEditMode(e=>!e); setEditingId(null) }}
              style={{ background:editMode?"rgba(26,16,37,0.08)":"none", border:"1px solid rgba(123,94,167,0.2)", borderRadius:10, padding:"5px 11px", fontSize:12, color:C.teal, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
              {editMode ? (uk?"Готово ✓":"Done ✓") : "✏️"}
            </button>
          </div>

          {tasks.map((task, i) => (
            <div key={task.id} style={{ display:"flex", alignItems:"flex-start", gap:12, paddingBottom: i<tasks.length-1?12:0, marginBottom: i<tasks.length-1?12:0, borderBottom: i<tasks.length-1?"1px solid rgba(123,94,167,0.08)":"none" }}>
              <button onClick={()=>toggleTask(task.id)}
                style={{ width:26, height:26, borderRadius:8, border:`2px solid ${task.done?C.teal:"rgba(123,94,167,0.28)"}`, background:task.done?C.teal:"transparent", flexShrink:0, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", marginTop:1, transition:"all 0.15s" }}>
                {task.done && <span style={{ color:"#fff", fontSize:13, fontWeight:900 }}>✓</span>}
              </button>
              <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{task.icon}</span>
              <div style={{ flex:1, opacity:task.done?0.45:1, transition:"opacity 0.2s" }}>
                {editMode && editingId===task.id ? (
                  <input autoFocus value={editVal}
                    onChange={e=>setEditVal(e.target.value)}
                    onBlur={()=>{ updateTask(task.id, editVal||task.title); setEditingId(null) }}
                    onKeyDown={e=>{ if(e.key==="Enter"){ updateTask(task.id, editVal||task.title); setEditingId(null) }}}
                    style={{ width:"100%", border:"none", borderBottom:`1px solid ${C.teal}`, background:"transparent", fontSize:14, fontWeight:700, color:C.dark, outline:"none", fontFamily:"inherit", padding:"2px 0" }} />
                ) : (
                  <div onClick={()=>{ if(editMode){ setEditingId(task.id); setEditVal(task.customTitle||task.title) }}}
                    style={{ fontSize:14, fontWeight:700, color:C.dark, cursor:editMode?"text":"default", textDecoration:task.done?"line-through":"none" }}>
                    {task.customTitle||task.title}
                  </div>
                )}
                <div style={{ fontSize:12, color:C.teal, marginTop:2, lineHeight:1.4 }}>{task.detail}</div>
              </div>
            </div>
          ))}

          {/* Mood tap */}
          {doneCount > 0 && !mood && (
            <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(123,94,167,0.1)" }}>
              <div style={{ fontSize:11, color:C.teal, marginBottom:8 }}>{uk?"Як почуваєшся?":"How do you feel?"}</div>
              <div style={{ display:"flex", gap:8 }}>
                {[[" 😴",uk?"Втомлена":"Tired"],["😐",uk?"Нормально":"Okay"],["😊",uk?"Добре":"Great"]].map(([emoji,label])=>(
                  <button key={emoji} onClick={()=>setMood(emoji)}
                    style={{ flex:1, padding:"8px 4px", borderRadius:14, border:"1px solid rgba(123,94,167,0.18)", background:"rgba(123,94,167,0.05)", cursor:"pointer", textAlign:"center", fontFamily:"inherit" }}>
                    <div style={{ fontSize:24 }}>{emoji}</div>
                    <div style={{ fontSize:10, color:C.teal, marginTop:2 }}>{label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {mood && doneCount > 0 && (
            <div style={{ marginTop:14, display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:14, background:"rgba(123,94,167,0.07)" }}>
              <span style={{ fontSize:22 }}>{mood}</span>
              <span style={{ fontSize:13, color:C.teal }}>{uk?"Настрій відмічено":"Mood logged"}</span>
            </div>
          )}
        </div>

        {/* ── МІЙ ПРОТОКОЛ ── */}
        <div style={card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:800, color:C.dark, textTransform:"uppercase", letterSpacing:"0.8px" }}>
              {uk?"МІЙ ПРОТОКОЛ":"MY PROTOCOL"}
            </div>
            <button onClick={()=>setAddingItem(a=>!a)}
              style={{ fontSize:11, fontWeight:700, color:C.teal, background:"none", border:"1px solid rgba(123,94,167,0.25)", borderRadius:10, padding:"4px 10px", cursor:"pointer", fontFamily:"inherit" }}>
              {addingItem ? "✕" : `+ ${uk?"Додати":"Add"}`}
            </button>
          </div>

          {protocol.map((item, i) => {
            const st = getRitualStatus(item)
            return (
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, paddingBottom: i<protocol.length-1?12:0, marginBottom: i<protocol.length-1?12:0, borderBottom: i<protocol.length-1?"1px solid rgba(123,94,167,0.08)":"none" }}>
                <span style={{ fontSize:24 }}>{item.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{item.name}</div>
                  <div style={{ fontSize:11, color:C.teal }}>{uk?`Кожні ${item.frequencyDays} дн.`:`Every ${item.frequencyDays}d`}</div>
                </div>
                <div style={{ textAlign:"right", minWidth:70 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:st.urgent?"#b94040":st.soon?"#b87333":C.teal }}>{st.label}</div>
                  {st.urgent && (
                    <button onClick={()=>markRitual(item.id)}
                      style={{ marginTop:4, fontSize:10, fontWeight:700, color:"#fff", background:C.teal, border:"none", borderRadius:8, padding:"3px 9px", cursor:"pointer", fontFamily:"inherit" }}>
                      {uk?"Зроблено":"Done"}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {addingItem && (
            <div style={{ marginTop:12, padding:"14px", background:"rgba(123,94,167,0.06)", borderRadius:16 }}>
              <input placeholder={uk?"Назва (Масаж, Аналізи...)":"Name (Massage, Lab tests...)"}
                value={newItem.name} onChange={e=>setNewItem(n=>({...n,name:e.target.value}))}
                style={{ width:"100%", border:"none", borderBottom:"1px solid rgba(123,94,167,0.28)", background:"transparent", fontSize:13, padding:"4px 0", marginBottom:12, outline:"none", fontFamily:"inherit", color:C.dark }} />
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <span style={{ fontSize:12, color:C.teal, whiteSpace:"nowrap" }}>{uk?"Кожні":"Every"}</span>
                <input type="number" min="1" max="365" value={newItem.frequencyDays}
                  onChange={e=>setNewItem(n=>({...n,frequencyDays:parseInt(e.target.value)||7}))}
                  style={{ width:48, border:"none", borderBottom:"1px solid rgba(123,94,167,0.28)", background:"transparent", fontSize:13, textAlign:"center", outline:"none", fontFamily:"inherit", color:C.dark }} />
                <span style={{ fontSize:12, color:C.teal }}>{uk?"днів":"days"}</span>
                <div style={{ display:"flex", gap:4, marginLeft:"auto" }}>
                  {["💆","🏃","🩸","💊","🧘","📅","🔬","✨","🥗","💉"].map(e=>(
                    <button key={e} onClick={()=>setNewItem(n=>({...n,icon:e}))}
                      style={{ fontSize:15, background:newItem.icon===e?"rgba(123,94,167,0.15)":"none", border:`1px solid ${newItem.icon===e?C.teal:"transparent"}`, borderRadius:8, padding:3, cursor:"pointer" }}>{e}</button>
                  ))}
                </div>
              </div>
              <button onClick={()=>{
                if (!newItem.name.trim()) return
                setProtocol(ps=>[...ps,{...newItem,id:`custom_${Date.now()}`,lastDone:null}])
                setNewItem({name:"",icon:"📌",frequencyDays:7}); setAddingItem(false)
              }} style={{ width:"100%", padding:"9px", borderRadius:13, border:"none", background:C.dark, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                {uk?"Додати до протоколу":"Add to protocol"}
              </button>
            </div>
          )}
        </div>

        {/* ── MINI CHART ── */}
        {chartData.length >= 3 && (
          <div style={{ ...card, padding:"14px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:10 }}>
              {uk?"Динаміка тижня":"Weekly trend"}
            </div>
            <ResponsiveContainer width="100%" height={75}>
              <LineChart data={chartData} margin={{top:2,right:4,bottom:0,left:-30}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(123,94,167,0.08)" />
                <XAxis dataKey="d" tick={{fontSize:9,fill:C.teal}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,10]} tick={{fontSize:9,fill:C.teal}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:12,border:"none",fontSize:11,background:C.dark,color:"#fff"}}/>
                <Line type="monotone" dataKey="e" stroke={C.dark} strokeWidth={2} dot={{r:2}} name={uk?"Енергія":"Energy"}/>
                <Line type="monotone" dataKey="s" stroke="rgba(180,150,210,0.65)" strokeWidth={1.5} dot={{r:2}} name={uk?"Сон":"Sleep"}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:`linear-gradient(transparent, ${C.bg} 35%)`, padding:"12px 20px 28px" }}>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCheckIn}
            style={{ flex:1, height:52, borderRadius:16, border:"none", background:C.dark, fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 18px rgba(26,16,37,0.22)" }}>
            ➕ {uk?"Детальний check-in":"Detailed check-in"}
          </button>
          <button onClick={onCalendar}  style={{ width:52, height:52, borderRadius:16, border:"none", background:"rgba(26,16,37,0.07)", fontSize:20, cursor:"pointer" }}>📅</button>
          <button onClick={onHealthHub} style={{ width:52, height:52, borderRadius:16, border:"none", background:"rgba(26,16,37,0.07)", fontSize:20, cursor:"pointer" }}>🧬</button>
        </div>
      </div>
    </Wrap>
  )
}

// ─── CYCLE CALENDAR ───────────────────────────────────────────────────────────
function CycleCalendar({ profile, history, lang, onBack, onUpdateCycleDay, t }) {
  const today = new Date()
  today.setHours(0,0,0,0)
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [editMode, setEditMode] = useState(false)
  const [editVal,  setEditVal]  = useState("")

  const cycleDay    = getCurrentCycleDay(profile)
  const cycleLength = parseInt(profile?.cycleLength) || 28

  // Anchor: today = cycleDay N → cycle started N-1 days ago
  const cycleStart = new Date(today)
  cycleStart.setDate(today.getDate() - cycleDay + 1)

  // Map "YYYY-MM-DD" → check-in for dots
  const historyMap = {}
  history.forEach(h => { if (h.date) historyMap[h.date] = h })

  const uk = lang === "uk"
  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const monthLabel = viewDate.toLocaleDateString(uk ? "uk-UA" : "en-US", { month:"long", year:"numeric" })

  // Build grid days (Mon-first)
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  let dow = firstDay.getDay(); if (dow === 0) dow = 7
  const days = []
  for (let i = dow - 1; i > 0; i--)  days.push({ date: new Date(year, month, 1 - i),       cur: false })
  for (let d = 1; d <= lastDay.getDate(); d++) days.push({ date: new Date(year, month, d),  cur: true  })
  while (days.length % 7 !== 0) {
    days.push({ date: new Date(year, month + 1, days.length - lastDay.getDate() - (dow - 1) + 1), cur: false })
  }

  const getCycleDay = (date) => {
    const diff = Math.round((date - cycleStart) / 86400000)
    return ((diff % cycleLength) + cycleLength) % cycleLength + 1
  }

  const PHASE_STYLE = {
    menstrual:  { bg:"rgba(214,93,93,0.20)",   border:"rgba(214,93,93,0.45)",   dot:"#D65D5D" },
    follicular: { bg:"rgba(192,249,136,0.28)",  border:"rgba(150,200,80,0.40)",  dot:"#7CB84A" },
    ovulation:  { bg:"rgba(123,94,167,0.28)",    border:"rgba(123,94,167,0.45)",   dot:"#4A6452" },
    luteal:     { bg:"rgba(137,166,143,0.28)",  border:"rgba(137,166,143,0.50)", dot:"#89A68F" },
  }
  const PHASE_NAMES = {
    menstrual:  uk ? "Менструація" : "Menstrual",
    follicular: uk ? "Фолікулярна" : "Follicular",
    ovulation:  uk ? "Овуляція"    : "Ovulation",
    luteal:     uk ? "Лютеїнова"   : "Luteal",
  }
  const PHASE_EMOJI = { menstrual:"🌸", follicular:"🌱", ovulation:"✨", luteal:"🌙" }
  const DOW_LABELS  = uk
    ? ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]
    : ["Mo","Tu","We","Th","Fr","Sa","Su"]

  const todayStr    = localDateStr(today)
  const todayPhase  = getPhase(cycleDay, cycleLength)

  return (
    <Wrap>
      <div style={{ position:"absolute", inset:0, background:C.bg, zIndex:0 }} />
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"52px 20px 32px", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:C.teal, fontSize:15, fontWeight:500, cursor:"pointer", fontFamily:"inherit", padding:0 }}>
            ← {uk ? "Назад" : "Back"}
          </button>
          <div style={{ fontSize:17, fontWeight:800, color:C.dark }}>{uk ? "Цикл" : "Cycle"}</div>
          <div style={{ width:60 }} />
        </div>

        {/* Today pill + edit */}
        {!editMode ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:100, background:PHASE_STYLE[todayPhase].bg, border:`1.5px solid ${PHASE_STYLE[todayPhase].border}`, flex:1 }}>
              <span style={{ fontSize:18 }}>{PHASE_EMOJI[todayPhase]}</span>
              <div>
                <span style={{ fontSize:13, fontWeight:700, color:C.dark }}>{uk ? `День ${cycleDay} · ` : `Day ${cycleDay} · `}</span>
                <span style={{ fontSize:13, fontWeight:500, color:C.teal }}>{PHASE_NAMES[todayPhase]}</span>
              </div>
            </div>
            <button onClick={() => { setEditVal(String(cycleDay)); setEditMode(true) }}
              style={{ width:42, height:42, borderRadius:14, background:"rgba(123,94,167,0.12)", border:`1.5px solid rgba(123,94,167,0.25)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1, cursor:"pointer", flexShrink:0 }}>
              <span style={{ fontSize:16, lineHeight:1 }}>✏️</span>
              <span style={{ fontSize:8, fontWeight:700, color:C.teal }}>{uk?"Ред.":"Edit"}</span>
            </button>
          </div>
        ) : (
          <div style={{ background:"rgba(255,255,255,0.70)", backdropFilter:"blur(16px)", borderRadius:22, padding:"20px", border:"1px solid rgba(255,255,255,0.85)", marginBottom:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.dark, marginBottom:14, textAlign:"center" }}>
              {uk ? "Який сьогодні день циклу?" : "What cycle day is today?"}
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:16 }}>
              <button onClick={() => setEditVal(v => String(Math.max(1, parseInt(v||1)-1)))}
                style={{ width:44, height:44, borderRadius:14, background:"rgba(26,16,37,0.07)", border:"none", fontSize:22, cursor:"pointer" }}>−</button>
              <span style={{ fontSize:48, fontWeight:200, color:C.dark, letterSpacing:"-2px", minWidth:60, textAlign:"center" }}>{editVal}</span>
              <button onClick={() => setEditVal(v => String(Math.min(35, parseInt(v||1)+1)))}
                style={{ width:44, height:44, borderRadius:14, background:"rgba(26,16,37,0.07)", border:"none", fontSize:22, cursor:"pointer" }}>+</button>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setEditMode(false)}
                style={{ flex:1, padding:"12px", borderRadius:14, background:"transparent", border:`1.5px solid rgba(26,16,37,0.15)`, fontSize:14, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit" }}>
                {uk ? "Скасувати" : "Cancel"}
              </button>
              <button onClick={() => {
                const cd = parseInt(editVal)
                if (cd >= 1 && cd <= 35) {
                  const t0 = new Date(); t0.setHours(0,0,0,0)
                  const s = new Date(t0); s.setDate(t0.getDate() - cd + 1)
                  onUpdateCycleDay(localDateStr(s))
                }
                setEditMode(false)
              }} style={{ flex:2, padding:"12px", borderRadius:14, background:C.dark, border:"none", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", fontFamily:"inherit" }}>
                {uk ? "Зберегти" : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Month nav */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth()-1, 1))}
            style={{ width:36, height:36, borderRadius:"50%", background:"rgba(26,16,37,0.07)", border:"none", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.dark }}>‹</button>
          <div style={{ fontSize:15, fontWeight:700, color:C.dark, textTransform:"capitalize" }}>{monthLabel}</div>
          <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth()+1, 1))}
            style={{ width:36, height:36, borderRadius:"50%", background:"rgba(26,16,37,0.07)", border:"none", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.dark }}>›</button>
        </div>

        {/* Weekday headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
          {DOW_LABELS.map(d => (
            <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:600, color:C.teal, padding:"3px 0" }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ background:"rgba(255,255,255,0.50)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderRadius:22, padding:8, border:"1px solid rgba(255,255,255,0.72)", marginBottom:20 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {days.map(({ date, cur }, i) => {
              const dateStr  = localDateStr(date)
              const isFuture = date > today
              const isToday  = dateStr === todayStr
              const cd       = getCycleDay(date)
              const pk       = getPhase(cd, cycleLength)
              const ps       = PHASE_STYLE[pk]
              const hasDot   = !!historyMap[dateStr]

              return (
                <div key={i} style={{
                  aspectRatio:"1",
                  borderRadius:9,
                  background: cur ? (isFuture ? ps.bg.replace(/[\d.]+\)$/, "0.10)") : ps.bg) : "transparent",
                  border: isToday ? `2px solid ${C.dark}` : "2px solid transparent",
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  opacity: cur ? 1 : 0.2,
                  position:"relative",
                }}>
                  <span style={{ fontSize:12, fontWeight: isToday ? 800 : 400, color: cur ? C.dark : "rgba(26,16,37,0.4)", lineHeight:1 }}>
                    {date.getDate()}
                  </span>
                  {hasDot && (
                    <div style={{ width:4, height:4, borderRadius:"50%", background:ps.dot, marginTop:2 }} />
                  )}
                  {!hasDot && <div style={{ width:4, height:4, marginTop:2 }} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Phase legend */}
        <div style={{ fontSize:12, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:10 }}>
          {uk ? "Фази циклу" : "Cycle phases"}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
          {(["menstrual","follicular","ovulation","luteal"]).map(pk => {
            const ps = PHASE_STYLE[pk]
            const startDay = pk==="menstrual"?1 : pk==="follicular"?6 : pk==="ovulation"?Math.round(cycleLength*0.5) : Math.round(cycleLength*0.58)+1
            const endDay   = pk==="menstrual"?5 : pk==="follicular"?Math.round(cycleLength*0.5)-1 : pk==="ovulation"?Math.round(cycleLength*0.58) : cycleLength
            return (
              <div key={pk} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", borderRadius:14, background:ps.bg, border:`1px solid ${ps.border}` }}>
                <span style={{ fontSize:18 }}>{PHASE_EMOJI[pk]}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:C.dark }}>{PHASE_NAMES[pk]}</div>
                  <div style={{ fontSize:10, color:C.teal }}>Д{startDay}–{endDay}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dot legend */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:12, background:"rgba(26,16,37,0.05)", marginBottom:24 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:C.teal }} />
          <span style={{ fontSize:12, color:C.teal }}>{uk ? "Крапка — зроблено check-in цього дня" : "Dot — check-in logged this day"}</span>
        </div>


      </div>
    </Wrap>
  )
}

// ─── SCREEN: BODY REPORT ─────────────────────────────────────────────────────
function BodyReport({ profile, onNext, lang }) {
  const causes  = getRootCauses(profile)
  const cd      = CAUSE_DATA[lang] || CAUSE_DATA.en
  const isUk    = lang === "uk"
  const name    = profile.name || ""
  const cnt     = causes.length || 1

  const txt = isUk
    ? { title:`${name}, твій звіт готовий`, sub:`Знайдено ${cnt} кореневих причин${cnt===1?"у":cnt<5?"и":""}`, cta:"Мій персональний протокол →", week:"Протокол цього тижня" }
    : { title:`${name}, your report is ready`, sub:`We found ${cnt} root cause${cnt!==1?"s":""} in your profile`, cta:"See My Personalised Protocol →", week:"This week's protocol" }

  const card = { background:"rgba(255,255,255,0.65)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:22, padding:"18px 20px", marginBottom:14, border:"1px solid rgba(255,255,255,0.75)" }

  return (
    <Wrap>
      <div style={{ padding:"52px 22px 24px", overflowY:"auto" }}>
        <div style={{ fontSize:26, fontWeight:900, color:C.dark, marginBottom:6 }}>{txt.title}</div>
        <div style={{ fontSize:14, color:C.teal, marginBottom:24 }}>{txt.sub}</div>

        {causes.map((c,i) => {
          const data = cd[c.key]
          if (!data) return null
          return (
            <div key={c.key} style={card}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:26 }}>{data.icon}</span>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.dark }}>{i+1}. {data.title}</div>
                  <div style={{ fontSize:12, color:C.teal }}>{data.subtitle}</div>
                </div>
              </div>
              <div style={{ fontSize:13.5, color:C.dark, lineHeight:1.65, marginBottom:14, opacity:0.85 }}>{data.body}</div>
              <div style={{ fontSize:11, fontWeight:700, color:C.teal, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:8 }}>{txt.week}</div>
              {data.protocol.map((p,pi) => (
                <div key={pi} style={{ fontSize:13, color:C.dark, padding:"8px 12px", background:"rgba(123,94,167,0.08)", borderRadius:12, marginBottom:6, lineHeight:1.5 }}>{p}</div>
              ))}
            </div>
          )
        })}

        <BtnDark label={txt.cta} onClick={onNext} />
        <div style={{ height:28 }} />
      </div>
    </Wrap>
  )
}

// ─── SCREEN: PAYWALL ─────────────────────────────────────────────────────────
function Paywall({ onUnlock, lang }) {
  const isUk = lang === "uk"
  const txt = isUk ? {
    title:"Твій персональний протокол",
    sub:"Повний план дій для твого тіла",
    items:["Root Cause Report — 3 кореневі причини твоїх симптомів","Персональний протокол: що робити цього тижня","Щоденний check-in + streak трекер","Beauty-рутина під твій гормональний профіль","Щотижневий AI-інсайт на email"],
    badge:"ПОПУЛЯРНЕ",
    p1:"$19/місяць", cta1:"Розпочати — $19/міс",
    p2:"$29 одноразово", cta2:"Повний звіт — $29",
    beta:"Продовжити безкоштовно (бета-тест)",
  } : {
    title:"Your Personalised Protocol",
    sub:"A complete action plan for your body",
    items:["Root Cause Report — 3 root causes of your symptoms","Personalised protocol: what to do this week","Daily check-in + streak tracker","Beauty routine for your hormonal profile","Weekly AI insight email"],
    badge:"POPULAR",
    p1:"$19/month", cta1:"Start — $19/month",
    p2:"$29 one-time", cta2:"Full Report — $29",
    beta:"Continue for free (beta test)",
  }

  const card = { backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", borderRadius:22, padding:"20px", border:"1px solid rgba(255,255,255,0.75)" }

  return (
    <Wrap>
      <div style={{ padding:"52px 22px 24px", overflowY:"auto" }}>
        <div style={{ fontSize:26, fontWeight:900, color:C.dark, marginBottom:6 }}>{txt.title}</div>
        <div style={{ fontSize:14, color:C.teal, marginBottom:24 }}>{txt.sub}</div>

        <div style={{ ...card, background:"rgba(255,255,255,0.65)", marginBottom:20 }}>
          {txt.items.map((item,i) => (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"8px 0", borderBottom:i<txt.items.length-1?"1px solid rgba(123,94,167,0.12)":"none" }}>
              <span style={{ color:C.teal, fontWeight:700, marginTop:1 }}>✓</span>
              <span style={{ fontSize:14, color:C.dark }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ ...card, background:"rgba(123,94,167,0.08)", border:"2px solid "+C.teal, marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:"1px", marginBottom:6 }}>{txt.badge}</div>
          <div style={{ fontSize:28, fontWeight:900, color:C.dark, marginBottom:14 }}>{txt.p1}</div>
          <BtnDark label={txt.cta1} onClick={()=>{}} />
        </div>

        <div style={{ ...card, background:"rgba(255,255,255,0.65)", marginBottom:24 }}>
          <div style={{ fontSize:28, fontWeight:900, color:C.dark, marginBottom:14 }}>{txt.p2}</div>
          <BtnGhost label={txt.cta2} onClick={()=>{}} />
        </div>

        <div style={{ textAlign:"center" }}>
          <button onClick={onUnlock} style={{ background:"none", border:"none", color:C.teal, fontSize:13, textDecoration:"underline", cursor:"pointer", padding:4 }}>
            {txt.beta}
          </button>
        </div>
        <div style={{ height:28 }} />
      </div>
    </Wrap>
  )
}

// ─── HELPERS: localStorage (safe, never throws) ───────────────────────────────
function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch(e) { return fallback }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch(e) {}
}
function lsClear() {
  try { ["vive_profile","vive_history","vive_lang"].forEach(k => localStorage.removeItem(k)) }
  catch(e) {}
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ViveApp() {
  // ── Ініціалізація зі збережених даних ──
  const [screen,      setScreen]  = useState(() => lsGet("vive_profile", null) ? "dashboard" : "welcome")
  const [profile,     setProfile] = useState(() => lsGet("vive_profile", null))
  const [history,     setHistory] = useState(() => lsGet("vive_history", []))
  const [lastCheckIn, setLastCI]  = useState(null)
  const [lang,        setLang]    = useState(() => lsGet("vive_lang", "en"))

  // ── Автозбереження при кожній зміні ──
  useEffect(() => { if (profile) lsSet("vive_profile", profile) }, [profile])
  useEffect(() => { lsSet("vive_history", history) }, [history])
  useEffect(() => { lsSet("vive_lang", lang) }, [lang])

  const t            = T[lang]
  const onLangToggle = () => setLang(l => l==="en"?"uk":"en")
  const sharedProps  = { lang, onLangToggle, t }

  // ── Навігація ──
  const goCheckin    = () => setScreen("checkin")
  const goInsight    = () => lastCheckIn && setScreen("insight")
  const goDashboard  = () => setScreen("dashboard")
  const goHealthHub  = () => setScreen("healthhub")
  const goCalendar   = () => setScreen("calendar")
  const updateCycleDay = (cycleStartDate) => {
    setProfile(p => { const np = {...p, cycleStartDate}; lsSet("vive_profile", np); return np })
  }
  const goReset     = () => {
    if (window.confirm(lang==="uk"
      ? "Видалити всі дані і почати заново?"
      : "Delete all data and start over?")) {
      lsClear()
      setProfile(null); setHistory([]); setLastCI(null)
      setScreen("welcome")
    }
  }

  if (screen==="welcome")
    return <Welcome {...sharedProps} onStart={()=>setScreen("onboarding")} />

  if (screen==="onboarding")
    return <Onboarding {...sharedProps} onDone={p=>{
      const t0 = new Date(); t0.setHours(0,0,0,0)
      const cd = parseInt(p.cycleDay) || 14
      const start = new Date(t0); start.setDate(t0.getDate() - cd + 1)
      const np = { ...p, cycleStartDate: start.toISOString().split("T")[0] }
      setProfile(np); lsSet("vive_profile", np); setScreen("body_report")
    }} />

  if (screen==="body_report" && profile)
    return <BodyReport profile={profile} lang={lang} onNext={()=>setScreen("paywall")} />

  if (screen==="paywall")
    return <Paywall lang={lang} onUnlock={()=>setScreen("checkin")} />

  if (screen==="checkin" && profile)
    return <CheckIn {...sharedProps}
      profile={profile}
      onBack={goDashboard}
      onDone={d=>{ const entry={...d, date:localDateStr()}; setLastCI(entry); setHistory(h=>{ const next=[...h,entry]; lsSet("vive_history",next); return next }); setScreen("insight") }}
    />

  if (screen==="calendar" && profile)
    return <CycleCalendar {...sharedProps} profile={profile} history={history} onBack={goDashboard} onUpdateCycleDay={updateCycleDay} />

  if (screen==="healthhub" && profile)
    return <HealthHub
      profile={profile}
      lang={lang}
      onBack={goDashboard}
      t={t}
    />

  if (screen==="insight" && lastCheckIn)
    return <Insight {...sharedProps}
      checkIn={lastCheckIn}
      profile={profile}
      onDone={goDashboard}
    />

  if (screen==="dashboard")
    return <Dashboard {...sharedProps}
      history={history}
      profile={profile}
      onCheckIn={goCheckin}
      onInsight={goInsight}
      onHealthHub={goHealthHub}
      onCalendar={goCalendar}
      onUpdateCycleDay={updateCycleDay}
      onReset={goReset}
    />

  return <Welcome {...sharedProps} onStart={()=>setScreen("onboarding")} />
}
