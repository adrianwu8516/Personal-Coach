var inputIdeaString = '[Working] OOXX111\n[Leisure] XXOO111\n[Learning] SSXX111\n[Working] SSSS111\n[Learning] WWWW111';
var inputIdeaString2 = `[Leisure] Plan Tibat Trip
[Leisure] Bass Slap
[Leisure] Bass Gunjo
[Working] UserResearch
[Learning] Find Online Master Program
[Learning] Release MSFT add-in
[Learning] Expand Scientifically Feature`

var testString = `Learning Goal:
1. SSS
2. XX OO

Working Goal:
1. XDXXX
2. XX OO
12. SSS

Leisure Goal:
1. ZZ PP
2. OOO`;

var testCombinedJSON = {
  "Learning Goal": [
    "Build an add-on and publish",
    "Check David's Code using ChatGPT",
    "Finish how to Defi",
    "Build a basic version personal coach using GAS and ChatGPT",
    "Make a donation",
    "Try AgentGPT and Linked to system service",
    "SSXX",
    "WWWW"
  ],
  "Working Goal": [
    "Excel Research",
    "Competition reports research",
    "OOXX",
    "SSSS"
  ],
  "Leisure Goal": [
    "OOXX"
  ]
}

var testJson = { 
  'Learning Goal': [ 'SSS', 'XX OO' ],
  'Working Goal': [ 'XDXXX', 'XX OO', 'SSS' ],
  'Leisure Goal': [ 'ZZ PP', 'OOO' ] 
}
