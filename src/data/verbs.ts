export const verbsData = [
  {
    id: 1,
    infinitive: "be",
    past: "was/were",
    participle: "been",
    meaning_es: "ser/estar",
    meaning_fr: "être",
    meaning_de: "sein",
    meaning_it: "essere",
    meaning_pt: "ser/estar"
  },
  {
    id: 2,
    infinitive: "have",
    past: "had",
    participle: "had",
    meaning_es: "tener/haber",
    meaning_fr: "avoir",
    meaning_de: "haben",
    meaning_it: "avere",
    meaning_pt: "ter/haver"
  },
  {
    id: 3,
    infinitive: "do",
    past: "did",
    participle: "done",
    meaning_es: "hacer",
    meaning_fr: "faire",
    meaning_de: "machen",
    meaning_it: "fare",
    meaning_pt: "fazer"
  },
  {
    id: 4,
    infinitive: "say",
    past: "said",
    participle: "said",
    meaning_es: "decir",
    meaning_fr: "dire",
    meaning_de: "sagen",
    meaning_it: "dire",
    meaning_pt: "dizer"
  },
  {
    id: 5,
    infinitive: "go",
    past: "went",
    participle: "gone",
    meaning_es: "ir",
    meaning_fr: "aller",
    meaning_de: "gehen",
    meaning_it: "andare",
    meaning_pt: "ir"
  },
  {
    id: 6,
    infinitive: "get",
    past: "got",
    participle: "got/gotten",
    meaning_es: "conseguir/obtener",
    meaning_fr: "obtenir",
    meaning_de: "bekommen",
    meaning_it: "ottenere",
    meaning_pt: "conseguir/obter"
  },
  {
    id: 7,
    infinitive: "make",
    past: "made",
    participle: "made",
    meaning_es: "hacer",
    meaning_fr: "faire",
    meaning_de: "machen",
    meaning_it: "fare",
    meaning_pt: "fazer"
  },
  {
    id: 8,
    infinitive: "know",
    past: "knew",
    participle: "known",
    meaning_es: "saber/conocer",
    meaning_fr: "savoir/connaître",
    meaning_de: "wissen/kennen",
    meaning_it: "sapere/conoscere",
    meaning_pt: "saber/conhecer"
  },
  {
    id: 9,
    infinitive: "think",
    past: "thought",
    participle: "thought",
    meaning_es: "pensar",
    meaning_fr: "penser",
    meaning_de: "denken",
    meaning_it: "pensare",
    meaning_pt: "pensar"
  },
  {
    id: 10,
    infinitive: "take",
    past: "took",
    participle: "taken",
    meaning_es: "tomar",
    meaning_fr: "prendre",
    meaning_de: "nehmen",
    meaning_it: "prendere",
    meaning_pt: "tomar"
  }
];

export const getAllVerbs = () => verbsData;
export const getVerbById = (id: number) => verbsData.find(v => v.id === id);
export const getRandomVerbs = (count: number) => {
  const shuffled = [...verbsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};