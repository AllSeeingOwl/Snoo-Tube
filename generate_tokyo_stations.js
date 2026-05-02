const fs = require('fs');

const stationsWithLines = [
  { name: "Shibuya", lines: ["Ginza", "Hanzomon", "Fukutoshin"] },
  { name: "Omotesando", lines: ["Ginza", "Chiyoda", "Hanzomon"] },
  { name: "Gaiemmae", lines: ["Ginza"] },
  { name: "Aoyama-itchome", lines: ["Ginza", "Hanzomon", "Oedo"] },
  { name: "Akasaka-mitsuke", lines: ["Ginza", "Marunouchi"] },
  { name: "Tameike-sanno", lines: ["Ginza", "Namboku"] },
  { name: "Toranomon", lines: ["Ginza"] },
  { name: "Shimbashi", lines: ["Ginza", "Asakusa"] },
  { name: "Ginza", lines: ["Ginza", "Marunouchi", "Hibiya"] },
  { name: "Kyobashi", lines: ["Ginza"] },
  { name: "Nihombashi", lines: ["Ginza", "Tozai", "Asakusa"] },
  { name: "Mitsukoshimae", lines: ["Ginza", "Hanzomon"] },
  { name: "Kanda", lines: ["Ginza"] },
  { name: "Suehirocho", lines: ["Ginza"] },
  { name: "Ueno-hirokoji", lines: ["Ginza"] },
  { name: "Ueno", lines: ["Ginza", "Hibiya"] },
  { name: "Inaricho", lines: ["Ginza"] },
  { name: "Tawaramachi", lines: ["Ginza"] },
  { name: "Asakusa", lines: ["Ginza", "Asakusa"] },

  { name: "Ogikubo", lines: ["Marunouchi"] },
  { name: "Minami-asagaya", lines: ["Marunouchi"] },
  { name: "Shin-koenji", lines: ["Marunouchi"] },
  { name: "Higashi-koenji", lines: ["Marunouchi"] },
  { name: "Shin-nakano", lines: ["Marunouchi"] },
  { name: "Nakano-sakaue", lines: ["Marunouchi", "Oedo"] },
  { name: "Nishi-shinjuku", lines: ["Marunouchi"] },
  { name: "Shinjuku", lines: ["Marunouchi", "Shinjuku", "Oedo"] },
  { name: "Shinjuku-sanchome", lines: ["Marunouchi", "Fukutoshin", "Shinjuku"] },
  { name: "Shinjuku-gyoemmae", lines: ["Marunouchi"] },
  { name: "Yotsuya-sanchome", lines: ["Marunouchi"] },
  { name: "Yotsuya", lines: ["Marunouchi", "Namboku"] },
  { name: "Kokkai-gijidomae", lines: ["Marunouchi", "Chiyoda"] },
  { name: "Kasumigaseki", lines: ["Marunouchi", "Hibiya", "Chiyoda"] },
  { name: "Tokyo", lines: ["Marunouchi"] },
  { name: "Otemachi", lines: ["Marunouchi", "Tozai", "Chiyoda", "Hanzomon", "Mita"] },
  { name: "Awajicho", lines: ["Marunouchi"] },
  { name: "Ochanomizu", lines: ["Marunouchi"] },
  { name: "Hongo-sanchome", lines: ["Marunouchi", "Oedo"] },
  { name: "Korakuen", lines: ["Marunouchi", "Namboku"] },
  { name: "Myogadani", lines: ["Marunouchi"] },
  { name: "Shin-otsuka", lines: ["Marunouchi"] },
  { name: "Ikebukuro", lines: ["Marunouchi", "Yurakucho", "Fukutoshin"] },

  { name: "Naka-meguro", lines: ["Hibiya"] },
  { name: "Ebisu", lines: ["Hibiya"] },
  { name: "Hiroo", lines: ["Hibiya"] },
  { name: "Roppongi", lines: ["Hibiya", "Oedo"] },
  { name: "Kamiyacho", lines: ["Hibiya"] },
  { name: "Toranomon-hills", lines: ["Hibiya"] },
  { name: "Hibiya", lines: ["Hibiya", "Chiyoda", "Mita"] },
  { name: "Higashi-ginza", lines: ["Hibiya", "Asakusa"] },
  { name: "Tsukiji", lines: ["Hibiya"] },
  { name: "Hatchobori", lines: ["Hibiya"] },
  { name: "Kayabacho", lines: ["Hibiya", "Tozai"] },
  { name: "Ningyocho", lines: ["Hibiya", "Asakusa"] },
  { name: "Kodemmacho", lines: ["Hibiya"] },
  { name: "Akihabara", lines: ["Hibiya"] },
  { name: "Naka-okachimachi", lines: ["Hibiya"] },
  { name: "Iriya", lines: ["Hibiya"] },
  { name: "Minowa", lines: ["Hibiya"] },
  { name: "Minami-senju", lines: ["Hibiya"] },
  { name: "Kita-senju", lines: ["Hibiya", "Chiyoda"] },

  { name: "Nakano", lines: ["Tozai"] },
  { name: "Ochiai", lines: ["Tozai"] },
  { name: "Takadanobaba", lines: ["Tozai"] },
  { name: "Waseda", lines: ["Tozai"] },
  { name: "Kagurazaka", lines: ["Tozai"] },
  { name: "Iidabashi", lines: ["Tozai", "Yurakucho", "Namboku", "Oedo"] },
  { name: "Kudanshita", lines: ["Tozai", "Hanzomon", "Shinjuku"] },
  { name: "Takebashi", lines: ["Tozai"] },
  { name: "Monzen-nakacho", lines: ["Tozai", "Oedo"] },
  { name: "Kiba", lines: ["Tozai"] },
  { name: "Toyocho", lines: ["Tozai"] },
  { name: "Minami-sunamachi", lines: ["Tozai"] },
  { name: "Nishi-kasai", lines: ["Tozai"] },
  { name: "Kasai", lines: ["Tozai"] },
  { name: "Urayasu", lines: ["Tozai"] },
  { name: "Minami-gyotoku", lines: ["Tozai"] },
  { name: "Gyotoku", lines: ["Tozai"] },
  { name: "Myoden", lines: ["Tozai"] },
  { name: "Baraki-nakayama", lines: ["Tozai"] },
  { name: "Nishi-funabashi", lines: ["Tozai"] },

  { name: "Yoyogi-uehara", lines: ["Chiyoda"] },
  { name: "Yoyogi-koen", lines: ["Chiyoda"] },
  { name: "Meiji-jingumae", lines: ["Chiyoda", "Fukutoshin"] },
  { name: "Nogizaka", lines: ["Chiyoda"] },
  { name: "Akasaka", lines: ["Chiyoda"] },
  { name: "Nijubashimae", lines: ["Chiyoda"] },
  { name: "Shin-ochanomizu", lines: ["Chiyoda"] },
  { name: "Yushima", lines: ["Chiyoda"] },
  { name: "Nezu", lines: ["Chiyoda"] },
  { name: "Sendagi", lines: ["Chiyoda"] },
  { name: "Nishi-nippori", lines: ["Chiyoda"] },
  { name: "Machiya", lines: ["Chiyoda"] },
  { name: "Ayase", lines: ["Chiyoda"] },
  { name: "Kita-ayase", lines: ["Chiyoda"] },

  { name: "Wakoshi", lines: ["Yurakucho", "Fukutoshin"] },
  { name: "Chikatetsu-narimasu", lines: ["Yurakucho", "Fukutoshin"] },
  { name: "Chikatetsu-akatsuka", lines: ["Yurakucho", "Fukutoshin"] },
  { name: "Heiwadai", lines: ["Yurakucho", "Fukutoshin"] },
  { name: "Hikawadai", lines: ["Yurakucho", "Fukutoshin"] },
  { name: "Kotake-mukaihara", lines: ["Yurakucho", "Fukutoshin"] },
  { name: "Senkawa", lines: ["Yurakucho", "Fukutoshin"] },
  { name: "Kanamecho", lines: ["Yurakucho", "Fukutoshin"] },
  { name: "Higashi-ikebukuro", lines: ["Yurakucho"] },
  { name: "Gokokuji", lines: ["Yurakucho"] },
  { name: "Edogawabashi", lines: ["Yurakucho"] },
  { name: "Ichigaya", lines: ["Yurakucho", "Namboku", "Shinjuku"] },
  { name: "Kojimachi", lines: ["Yurakucho"] },
  { name: "Nagatacho", lines: ["Yurakucho", "Hanzomon", "Namboku"] },
  { name: "Sakuradamon", lines: ["Yurakucho"] },
  { name: "Yurakucho", lines: ["Yurakucho"] },
  { name: "Ginza-itchome", lines: ["Yurakucho"] },
  { name: "Shintomicho", lines: ["Yurakucho"] },
  { name: "Tsukishima", lines: ["Yurakucho", "Oedo"] },
  { name: "Toyosu", lines: ["Yurakucho"] },
  { name: "Tatsumi", lines: ["Yurakucho"] },
  { name: "Shin-kiba", lines: ["Yurakucho"] },

  { name: "Jimbocho", lines: ["Hanzomon", "Mita", "Shinjuku"] },
  { name: "Suitengumae", lines: ["Hanzomon"] },
  { name: "Kiyosumi-shirakawa", lines: ["Hanzomon", "Oedo"] },
  { name: "Sumiyoshi", lines: ["Hanzomon", "Shinjuku"] },
  { name: "Kinshicho", lines: ["Hanzomon"] },
  { name: "Oshiage", lines: ["Hanzomon", "Asakusa"] },

  { name: "Meguro", lines: ["Namboku", "Mita"] },
  { name: "Shirokanedai", lines: ["Namboku", "Mita"] },
  { name: "Shirokane-takanawa", lines: ["Namboku", "Mita"] },
  { name: "Azabu-juban", lines: ["Namboku", "Oedo"] },
  { name: "Roppongi-itchome", lines: ["Namboku"] },
  { name: "Todaimae", lines: ["Namboku"] },
  { name: "Hon-komagome", lines: ["Namboku"] },
  { name: "Komagome", lines: ["Namboku"] },
  { name: "Nishigahara", lines: ["Namboku"] },
  { name: "Oji", lines: ["Namboku"] },
  { name: "Oji-kamiya", lines: ["Namboku"] },
  { name: "Shimo", lines: ["Namboku"] },
  { name: "Akabane-iwabuchi", lines: ["Namboku"] },

  { name: "Zoshigaya", lines: ["Fukutoshin"] },
  { name: "Nishi-waseda", lines: ["Fukutoshin"] },
  { name: "Higashi-shinjuku", lines: ["Fukutoshin", "Oedo"] },
  { name: "Kita-sando", lines: ["Fukutoshin"] },

  { name: "Nishi-magome", lines: ["Asakusa"] },
  { name: "Magome", lines: ["Asakusa"] },
  { name: "Nakanobu", lines: ["Asakusa"] },
  { name: "Togoshi", lines: ["Asakusa"] },
  { name: "Gotanda", lines: ["Asakusa"] },
  { name: "Osaki-hirokoji", lines: ["Asakusa"] },
  { name: "Sengakuji", lines: ["Asakusa"] },
  { name: "Mita", lines: ["Asakusa", "Mita"] },
  { name: "Shibakoen", lines: ["Mita"] },
  { name: "Daimon", lines: ["Asakusa", "Oedo"] },
  { name: "Takaracho", lines: ["Asakusa"] },
  { name: "Higashi-nihombashi", lines: ["Asakusa"] },
  { name: "Asakusabashi", lines: ["Asakusa"] },
  { name: "Kuramae", lines: ["Asakusa", "Oedo"] },
  { name: "Honjo-azumabashi", lines: ["Asakusa"] },

  { name: "Onarimon", lines: ["Mita"] },
  { name: "Uchisaiwaicho", lines: ["Mita"] },
  { name: "Suidobashi", lines: ["Mita"] },
  { name: "Kasuga", lines: ["Mita", "Oedo"] },
  { name: "Hakusan", lines: ["Mita"] },
  { name: "Sengoku", lines: ["Mita"] },
  { name: "Sugamo", lines: ["Mita"] },
  { name: "Nishi-sugamo", lines: ["Mita"] },
  { name: "Shin-itabashi", lines: ["Mita"] },
  { name: "Itabashi-kuyakushomae", lines: ["Mita"] },
  { name: "Itabashi-honcho", lines: ["Mita"] },
  { name: "Moto-hasunuma", lines: ["Mita"] },
  { name: "Shimura-sakaue", lines: ["Mita"] },
  { name: "Shimura-sanchome", lines: ["Mita"] },
  { name: "Hasune", lines: ["Mita"] },
  { name: "Nishidai", lines: ["Mita"] },
  { name: "Takashimadaira", lines: ["Mita"] },
  { name: "Shin-takashimadaira", lines: ["Mita"] },
  { name: "Nishi-takashimadaira", lines: ["Mita"] },

  { name: "Akebonobashi", lines: ["Shinjuku"] },
  { name: "Ogawamachi", lines: ["Shinjuku"] },
  { name: "Iwamotocho", lines: ["Shinjuku"] },
  { name: "Bakuro-yokoyama", lines: ["Shinjuku"] },
  { name: "Hamacho", lines: ["Shinjuku"] },
  { name: "Morishita", lines: ["Shinjuku", "Oedo"] },
  { name: "Kikukawa", lines: ["Shinjuku"] },
  { name: "Nishi-ojima", lines: ["Shinjuku"] },
  { name: "Ojima", lines: ["Shinjuku"] },
  { name: "Higashi-ojima", lines: ["Shinjuku"] },
  { name: "Funabori", lines: ["Shinjuku"] },
  { name: "Ichinoe", lines: ["Shinjuku"] },
  { name: "Mizue", lines: ["Shinjuku"] },
  { name: "Shinozaki", lines: ["Shinjuku"] },
  { name: "Motoyawata", lines: ["Shinjuku"] },

  { name: "Hikarigaoka", lines: ["Oedo"] },
  { name: "Nerima-kasugacho", lines: ["Oedo"] },
  { name: "Toshimaen", lines: ["Oedo"] },
  { name: "Nerima", lines: ["Oedo"] },
  { name: "Shin-egota", lines: ["Oedo"] },
  { name: "Ochiai-minami-nagasaki", lines: ["Oedo"] },
  { name: "Nakai", lines: ["Oedo"] },
  { name: "Higashi-nakano", lines: ["Oedo"] },
  { name: "Nishi-shinjuku-gochome", lines: ["Oedo"] },
  { name: "Tochomae", lines: ["Oedo"] },
  { name: "Shinjuku-nishiguchi", lines: ["Oedo"] },
  { name: "Wakamatsu-kawada", lines: ["Oedo"] },
  { name: "Ushigome-yanagicho", lines: ["Oedo"] },
  { name: "Ushigome-kagurazaka", lines: ["Oedo"] },
  { name: "Ueno-okachimachi", lines: ["Oedo"] },
  { name: "Shin-okachimachi", lines: ["Oedo"] },
  { name: "Ryogoku", lines: ["Oedo"] },
  { name: "Kachidoki", lines: ["Oedo"] },
  { name: "Tsukijishijo", lines: ["Oedo"] },
  { name: "Shiodome", lines: ["Oedo"] },
  { name: "Akabanebashi", lines: ["Oedo"] },
  { name: "Kokuritsu-kyogijo", lines: ["Oedo"] },
  { name: "Yoyogi", lines: ["Oedo"] }
];

function getSnookerColor(line) {
    if (line === "Marunouchi" || line === "Oedo") return "Red";
    if (line === "Ginza" || line === "Yurakucho") return "Yellow";
    if (line === "Chiyoda" || line === "Shinjuku") return "Green";
    if (line === "Fukutoshin" || line === "Hibiya") return "Brown";
    if (line === "Tozai" || line === "Mita") return "Blue";
    if (line === "Asakusa" || line === "Hanzomon") return "Pink";
    if (line === "Namboku") return "Black";
    return "Black";
}

function getPoolColor(line) {
   if (line === "Marunouchi") return "Red (Solid)";
   if (line === "Oedo") return "Red (Stripe)";
   if (line === "Ginza") return "Orange (Solid)";
   if (line === "Yurakucho") return "Yellow (Solid)";
   if (line === "Chiyoda") return "Green (Solid)";
   if (line === "Shinjuku") return "Green (Stripe)";
   if (line === "Fukutoshin") return "Brown (Solid)";
   if (line === "Hibiya") return "Brown (Stripe)";
   if (line === "Tozai") return "Blue (Solid)";
   if (line === "Mita") return "Blue (Stripe)";
   if (line === "Asakusa") return "Purple (Solid)";
   if (line === "Hanzomon") return "Purple (Stripe)";
   if (line === "Namboku") return "Black";
   return "Black";
}

let snookerCSV = "Station Name,Lines Served,Valid for Colours,Zone(s),Times Used (This Game),Currently Locked?,Notes\n";
let poolCSV = "Station Name,Lines Served,Valid for Colours,Borough,Times Used (This Game),Currently Locked?,Notes\n";

stationsWithLines.forEach(st => {
    let linesStr = `"${st.lines.join(', ')}"`;

    let snookerCols = new Set(st.lines.map(getSnookerColor));
    let snookerColStr = `"${Array.from(snookerCols).join(', ')}"`;

    let poolCols = new Set(st.lines.map(getPoolColor));
    let poolColStr = `"${Array.from(poolCols).join(', ')}"`;

    snookerCSV += `"${st.name}",${linesStr},${snookerColStr},1,0,No,\n`;
    poolCSV += `"${st.name}",${linesStr},${poolColStr},Tokyo,0,No,\n`;
});

fs.writeFileSync('tokyo-snooker/data/stations.csv', snookerCSV);
fs.writeFileSync('tokyo-pool/data/stations.csv', poolCSV);
console.log("Regenerated absolutely accurately.");
