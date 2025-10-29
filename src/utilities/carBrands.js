// Marcas de vehículos más reconocidas mundialmente
export const CAR_BRANDS = [
    // Marcas Premium/Lujo
    "Audi",
    "BMW",
    "Mercedes-Benz",
    "Lexus",
    "Acura",
    "Infiniti",
    "Cadillac",
    "Lincoln",

    // Marcas de Lujo/Superautos
    "Ferrari",
    "Lamborghini",
    "Porsche",
    "Maserati",
    "Bentley",
    "Rolls-Royce",
    "Aston Martin",
    "McLaren",

    // Marcas Japonesas
    "Toyota",
    "Honda",
    "Nissan",
    "Mazda",
    "Subaru",
    "Mitsubishi",
    "Suzuki",
    "Isuzu",

    // Marcas Alemanas
    "Volkswagen",
    "Opel",
    "MINI",

    // Marcas Americanas
    "Ford",
    "Chevrolet",
    "Dodge",
    "Chrysler",
    "Jeep",
    "RAM",
    "GMC",
    "Buick",

    // Marcas Coreanas
    "Hyundai",
    "Kia",
    "Genesis",
    "SsangYong",

    // Marcas Francesas
    "Peugeot",
    "Renault",
    "Citroën",
    "DS",

    // Marcas Italianas
    "Fiat",
    "Alfa Romeo",
    "Lancia",

    // Marcas Británicas
    "Land Rover",
    "Range Rover",
    "Jaguar",
    "MINI",

    // Marcas Suecas
    "Volvo",
    "Saab",

    // Marcas Checas
    "Škoda",

    // Marcas Rumanas
    "Dacia",

    // Marcas Españolas
    "SEAT",

    // Marcas Chinas
    "BYD",
    "Geely",
    "Great Wall",
    "Chery",
    "JAC",
    "MG",

    // Marcas de Vehículos Comerciales
    "Iveco",
    "Scania",
    "Volvo Trucks",
    "DAF",
    "MAN",

    // Marcas Tesla y Eléctricos
    "Tesla",
    "Polestar",
    "Lucid",
    "Rivian",

    // Marcas Indias
    "Tata",
    "Mahindra",

    // Marcas Rusas
    "Lada"
]

// Función para obtener el logo de una marca (por ahora retorna un avatar con iniciales)
export const getCarBrandLogo = (brand) => {
    if (!brand) return null

    // Normalizamos el nombre de la marca
    const normalizedBrand = brand.toString().toUpperCase().trim()

    // Retornamos las iniciales para el avatar
    const initials = normalizedBrand
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)

    return {
        initials,
        name: normalizedBrand
        // En el futuro aquí podríamos retornar la URL real del logo
        // logoUrl: `/assets/images/car-brands/${normalizedBrand.toLowerCase().replace(/\s+/g, '-')}.png`
    }
}

// Colores para avatares basados en marca
export const getBrandColor = (brand) => {
    const colors = ["#1976d2", "#d32f2f", "#388e3c", "#f57c00", "#7b1fa2", "#c2185b", "#00796b", "#303f9f", "#5d4037", "#455a64", "#e64a19", "#00acc1"]

    if (!brand) return colors[0]

    const index = brand.toString().length % colors.length
    return colors[index]
}
