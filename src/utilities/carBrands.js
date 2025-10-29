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
    const colors = [
        "#1976d2", // Azul
        "#d32f2f", // Rojo
        "#388e3c", // Verde
        "#f57c00", // Naranja
        "#7b1fa2", // Púrpura
        "#c2185b", // Rosa
        "#00796b", // Verde azulado
        "#303f9f", // Índigo
        "#5d4037", // Marrón
        "#455a64", // Gris azul
        "#e64a19", // Naranja profundo
        "#00acc1" // Cian
    ]

    if (!brand) return colors[0]

    // Crear un hash simple del nombre de la marca para consistencia
    const normalizedBrand = brand.toString().toUpperCase().trim()
    let hash = 0
    for (let i = 0; i < normalizedBrand.length; i++) {
        const char = normalizedBrand.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash // Convertir a 32bit integer
    }

    const index = Math.abs(hash) % colors.length
    return colors[index]
}
