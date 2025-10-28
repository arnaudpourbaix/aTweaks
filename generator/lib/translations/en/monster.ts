export default {
  ankheg: {
    name: "Ankheg",
    weapon: "Mandibles",
    digestiveEnzyme: {
      name: "Digestive Enzymes",
      description:
        "The ankheg can secret acidic digestive enzymes to cause an additional 1d4 points of damage per round for 4 rounds.",
    },
    enzymeStream: {
      name: "Stream of acidic enzymes",
      description: `The ankheg can squirt a stream of acidic enzymes once every six hours to a distance of 30 feet.
A victim struck by the stream of acidic enzymes suffers 8d4 points of damage (half damage if the victim rolls a successful saving throw vs. poison).
It uses this attack technique only when desperate.`,
    },
  },
  spider: {
    webTangle: {
      name: "Web Tangle",
      standardDesc: `The spider can shoot web strands up to 5 feet to bind a foe.
Characters in contact with the webs must make a saving throw vs. paralyzation or be immobilized by the web for 3 rounds.`,
      wraithDesc: `These creatures create webs that glow with an eerie dim green light. Anyope touching a web will sustain 1d4 points of damage from the numbing cold of the strands.
Characters in contact with the webs must also make a saving throw vs. paralyzation or be immobilized by the web for 4 rounds, sustaining cold damage for each round in the web.`,
    },
  },
};
