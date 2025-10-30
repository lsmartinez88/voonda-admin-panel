import fs from "fs"
import { get } from "simple-icons"

const brands = [
    "toyota",
    "volkswagen",
    "fiat",
    "renault",
    "ford",
    "chevrolet",
    "peugeot",
    "nissan",
    "jeep",
    "citroen",
    "mercedes",
    "bmw",
    "audi",
    "kia",
    "hyundai",
    "ram",
    "volvo",
    "mini",
    "porsche",
    "landrover",
    "alfa-romeo",
    "honda",
    "mitsubishi",
    "suzuki",
    "chery",
    "jac",
    "byd",
    "geely",
    "mg",
    "havalmotor",
    "subaru",
    "mazda",
    "seat",
    "cupra",
    "lexus",
    "infiniti",
    "acura",
    "genesis",
    "dodge",
    "chrysler",
    "opel",
    "lancia",
    "saab",
    "smart",
    "dacia",
    "ferrari",
    "lamborghini",
    "bentley",
    "rollsroyce",
    "astonmartin",
    "tata",
    "dongfeng",
    "faw",
    "baic",
    "jetour",
    "omoda",
    "chirey",
    "greatwall",
    "maxus",
    "iveco",
    "scania",
    "man",
    "kenworth",
    "gmc",
    "buick",
    "holden",
    "lincoln",
    "cadillac",
    "pontiac",
    "ssangyong",
    "troller",
    "daewoo",
    "proton",
    "perodua",
    "mahindra",
    "foton",
    "isuzu",
    "maserati",
    "pagani",
    "bugatti",
    "koenigsegg",
    "peugeot-motocycles",
    "bmwmotorrad",
    "ducati",
    "yamaha",
    "triumph",
    "ktm",
    "aprilia",
    "piaggio",
    "vespa",
    "royalenfield",
    "harley-davidson",
    "cfmoto",
    "motomel",
    "zanella",
    "gilera",
    "bajaj",
    "mondial",
    "brava",
    "benelli"
]

const data = []

brands.forEach((name) => {
    try {
        const icon = get(name)
        if (icon) {
            const path = `./logos/${name}.svg`
            fs.writeFileSync(path, icon.svg)
            data.push({
                brand: name,
                title: icon.title,
                slug: icon.slug,
                source: "simple-icons"
            })
            console.log(`✅ ${name}`)
        } else {
            console.warn(`❌ No encontrado: ${name}`)
        }
    } catch (e) {
        console.error(`Error con ${name}`, e)
    }
})

fs.writeFileSync("./brands.json", JSON.stringify(data, null, 2))
console.log("✅ Listo: SVGs y brands.json generados")
