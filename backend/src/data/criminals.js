// Datos estáticos recuperados del dashboard original.
// Se mantienen fuera del controlador para poder sustituirlos por una BD después.
const criminals = [
  {
    id: 1,
    name: "Jack Napier",
    alias: "The Joker",
    crime: "Mass Chaos Homicide",
    description:
      "High unpredictability. Agent of chaos. Do not engage without backup. The Joker is Batman's arch-nemesis and one of Gotham's most dangerous criminals.",
    dangerLevel: "Extreme",
    image:
      "https://i.pinimg.com/1200x/3b/4f/db/3b4fdb1fd4cdb715d2f3d24517cc0e33.jpg",
  },
  {
    id: 2,
    name: "Harvey Dent",
    alias: "Two-Face",
    crime: "Extortion and Organized Crime",
    description:
      "Obsessed with duality. Decisions are governed by a scarred silver dollar. Gotham's former district attorney became a criminal mastermind obsessed with fate and the number two.",
    dangerLevel: "High",
    image:
      "https://i.pinimg.com/736x/df/2a/b0/df2ab0f7da6704b42914ccc9943446ee.jpg",
  },
  {
    id: 3,
    name: "Selina Kyle",
    alias: "Catwoman",
    crime: "Grand Theft",
    description:
      "Expert burglar. Approach with caution. Catwoman is a skilled acrobat and morally ambiguous figure who operates in Gotham City.",
    dangerLevel: "Moderate",
    image:
      "https://i.pinimg.com/736x/b3/e4/cd/b3e4cd1538e4662ad10dbe957d5e8268.jpg",
  },
];

export default criminals;
