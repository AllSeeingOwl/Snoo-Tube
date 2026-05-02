const lines = [
    { name: "Ginza", color: "Orange" },
    { name: "Marunouchi", color: "Red" },
    { name: "Hibiya", color: "Silver" },
    { name: "Tozai", color: "Sky Blue" },
    { name: "Chiyoda", color: "Green" },
    { name: "Yurakucho", color: "Gold" },
    { name: "Hanzomon", color: "Purple" },
    { name: "Namboku", color: "Emerald" },
    { name: "Fukutoshin", color: "Brown" },
    { name: "Asakusa", color: "Rose" },
    { name: "Mita", color: "Blue" },
    { name: "Shinjuku", color: "Leaf" },
    { name: "Oedo", color: "Ruby" }
];
console.log(lines.map(l => l.name).join(", "));
