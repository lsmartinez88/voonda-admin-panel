import * as XLSX from "xlsx"

class ExcelExportService {
    static prepareExcelData(data) {
        // Columnas requeridas exactamente como las especificaste
        const headers = [
            "patente",
            "kilometros",
            "vehiculo_ano",
            "valor",
            "moneda",
            "publicacion_web",
            "publicacion_api_call",
            "marca",
            "modelo",
            "modelo_ano",
            "version",
            "motorizacion",
            "combustible",
            "caja",
            "traccion",
            "puertas",
            "segmento_modelo",
            "cilindrada",
            "potencia_hp",
            "torque_nm",
            "airbags",
            "abs",
            "control_estabilidad",
            "climatizador",
            "multimedia",
            "frenos",
            "neumaticos",
            "llantas",
            "asistencia_manejo",
            "rendimiento_mixto",
            "capacidad_baul",
            "capacidad_combustible",
            "velocidad_max",
            "largo",
            "ancho",
            "alto",
            "url_ficha",
            "modelo_rag",
            "titulo_legible",
            "ficha_breve"
        ]

        console.log("📊 Preparando datos para Excel con", data.length, "registros")

        // Debug: Mostrar estructura del primer elemento
        if (data.length > 0) {
            console.log("🔍 Estructura del primer elemento:", JSON.stringify(data[0], null, 2))
        }

        const rows = data.map((vehicle, index) => {
            const excelRow = {}

            // Extraer datos del Excel original (de excelData)
            const excelData = vehicle.excelData || {}

            // Extraer datos del matching (de matchData y bestMatch)
            const matchData = vehicle.matchData || vehicle.bestMatch || {}
            const catalogVehicle = matchData.catalogVehicle || {}

            // Extraer datos del enriquecimiento
            const enrichedData = vehicle.enrichedData || {}

            // Extraer datos de OpenAI si están disponibles
            const openaiData = enrichedData.openai || {}

            // Debug para el primer elemento
            if (index === 0) {
                console.log("🔍 ExcelData:", excelData)
                console.log("🔍 MatchData:", matchData)
                console.log("🔍 CatalogVehicle:", catalogVehicle)
                console.log("🔍 EnrichedData:", enrichedData)
                console.log("🔍 OpenAI Data:", openaiData)
            }

            // === DATOS DEL EXCEL ORIGINAL ===
            excelRow.patente = excelData.dominio || excelData.patente || excelData.placa || ""
            excelRow.kilometros = excelData.kilometros || excelData.km || excelData.mileage || ""
            excelRow.vehiculo_ano = excelData.año || excelData.ano || excelData.year || ""
            excelRow.valor = excelData.valor || excelData.precio || excelData.price || ""
            excelRow.moneda = excelData.moneda || "ARS"

            // === URLs Y REFERENCIAS ===
            const apiId = catalogVehicle.id || ""
            excelRow.publicacion_web = apiId ? `https://www.fratelliautomotores.com.ar/catalogo/${apiId}` : ""
            excelRow.publicacion_api_call = apiId ? `https://api.fratelliautomotores.com.ar/api/cars/${apiId}` : ""

            // === DATOS BÁSICOS DEL VEHÍCULO ===
            excelRow.marca = excelData.marca || catalogVehicle.brand || enrichedData.brand || ""
            excelRow.modelo = excelData.modelo || catalogVehicle.model || enrichedData.model || ""
            excelRow.modelo_ano = excelData.año || catalogVehicle.year || enrichedData.year || ""
            excelRow.version = excelData.versión || excelData.version || catalogVehicle.version || enrichedData.version || ""

            // === ESPECIFICACIONES TÉCNICAS ===
            // Prioridad: OpenAI > Catálogo > Enriquecimiento > Excel
            excelRow.motorizacion = openaiData.motorizacion || catalogVehicle.engine || enrichedData.engine || catalogVehicle.motor || ""
            excelRow.combustible = openaiData.combustible || catalogVehicle.fuel || enrichedData.fuel || catalogVehicle.fuelType || ""
            excelRow.caja = openaiData.caja || catalogVehicle.transmission || enrichedData.transmission || ""
            excelRow.traccion = openaiData.traccion || catalogVehicle.drivetrain || enrichedData.drivetrain || ""
            excelRow.puertas = openaiData.puertas || catalogVehicle.doors || enrichedData.doors || ""

            // === SEGMENTACIÓN Y CLASIFICACIÓN ===
            excelRow.segmento_modelo = openaiData.segmento_modelo || catalogVehicle.segment || enrichedData.segment || catalogVehicle.category || ""

            // === ESPECIFICACIONES DEL MOTOR ===
            excelRow.cilindrada = openaiData.cilindrada || catalogVehicle.displacement || enrichedData.displacement || ""
            excelRow.potencia_hp = openaiData.potencia_hp || catalogVehicle.horsepower || enrichedData.horsepower || catalogVehicle.power || ""
            excelRow.torque_nm = openaiData.torque_nm || catalogVehicle.torque || enrichedData.torque || ""

            // === CARACTERÍSTICAS DE SEGURIDAD ===
            excelRow.airbags = openaiData.airbags || catalogVehicle.airbags || enrichedData.airbags || ""
            excelRow.abs = openaiData.abs !== null && openaiData.abs !== undefined ? openaiData.abs : catalogVehicle.abs || enrichedData.abs || ""
            excelRow.control_estabilidad = openaiData.control_estabilidad !== null && openaiData.control_estabilidad !== undefined ? openaiData.control_estabilidad : catalogVehicle.stability_control || enrichedData.stability_control || ""

            // === CONFORT Y EQUIPAMIENTO ===
            excelRow.climatizador = openaiData.climatizador !== null && openaiData.climatizador !== undefined ? openaiData.climatizador : catalogVehicle.air_conditioning || enrichedData.air_conditioning || ""
            excelRow.multimedia = openaiData.multimedia || catalogVehicle.multimedia || enrichedData.multimedia || ""

            // === COMPONENTES ===
            excelRow.frenos = openaiData.frenos || catalogVehicle.brakes || enrichedData.brakes || ""
            excelRow.neumaticos = openaiData.neumaticos || catalogVehicle.tires || enrichedData.tires || ""
            excelRow.llantas = openaiData.llantas || catalogVehicle.wheels || enrichedData.wheels || ""

            // === ASISTENCIAS Y TECNOLOGÍA ===
            excelRow.asistencia_manejo = openaiData.asistencia_manejo || catalogVehicle.driving_assistance || enrichedData.driving_assistance || ""

            // === RENDIMIENTO Y CAPACIDADES ===
            excelRow.rendimiento_mixto = openaiData.rendimiento_mixto || catalogVehicle.fuel_consumption || enrichedData.fuel_consumption || ""
            excelRow.capacidad_baul = openaiData.capacidad_baul || catalogVehicle.trunk_capacity || enrichedData.trunk_capacity || ""
            excelRow.capacidad_combustible = openaiData.capacidad_combustible || catalogVehicle.fuel_capacity || enrichedData.fuel_capacity || ""
            excelRow.velocidad_max = openaiData.velocidad_max || catalogVehicle.max_speed || enrichedData.max_speed || ""

            // === DIMENSIONES ===
            excelRow.largo = openaiData.largo || catalogVehicle.length || enrichedData.length || ""
            excelRow.ancho = openaiData.ancho || catalogVehicle.width || enrichedData.width || ""
            excelRow.alto = openaiData.alto || catalogVehicle.height || enrichedData.height || ""

            // === URLs Y DATOS ADICIONALES ===
            excelRow.url_ficha = openaiData.url_ficha || catalogVehicle.detail_url || enrichedData.detail_url || catalogVehicle.url || ""

            // === DATOS DE ANÁLISIS ===
            excelRow.modelo_rag = openaiData.informacion_rag || this.generateModelRAG(vehicle)
            excelRow.titulo_legible = this.generateReadableTitle(vehicle)
            excelRow.ficha_breve = this.generateBriefSummary(vehicle)

            return excelRow
        })

        return { headers, rows }
    }

    static getValue(data, keys) {
        for (const key of keys) {
            if (data && data[key] !== undefined && data[key] !== null && data[key] !== "") {
                return data[key]
            }
        }
        return ""
    }

    static generateModelRAG(vehicle) {
        const parts = []

        // Datos del Excel original
        const excelData = vehicle.excelData || {}
        if (excelData.marca) parts.push(excelData.marca)
        if (excelData.modelo) parts.push(excelData.modelo)
        if (excelData.año) parts.push(excelData.año)

        // Datos del matching/enriquecimiento
        const matchData = vehicle.matchData || vehicle.bestMatch || {}
        const catalogVehicle = matchData.catalogVehicle || {}
        const enrichedData = vehicle.enrichedData || {}

        if (catalogVehicle.version || enrichedData.version) {
            parts.push(catalogVehicle.version || enrichedData.version)
        }
        if (catalogVehicle.engine || enrichedData.engine) {
            parts.push(catalogVehicle.engine || enrichedData.engine)
        }

        return parts.join(" | ")
    }

    static generateReadableTitle(vehicle) {
        const excelData = vehicle.excelData || {}
        const matchData = vehicle.matchData || vehicle.bestMatch || {}
        const catalogVehicle = matchData.catalogVehicle || {}
        const enrichedData = vehicle.enrichedData || {}

        const brand = excelData.marca || catalogVehicle.brand || enrichedData.brand || ""
        const model = excelData.modelo || catalogVehicle.model || enrichedData.model || ""
        const year = excelData.año || catalogVehicle.year || enrichedData.year || ""
        const version = catalogVehicle.version || enrichedData.version || ""

        let title = `${brand} ${model}`
        if (year) title += ` ${year}`
        if (version) title += ` ${version}`

        return title.trim()
    }

    static generateBriefSummary(vehicle) {
        const excelData = vehicle.excelData || {}
        const matchData = vehicle.matchData || vehicle.bestMatch || {}
        const catalogVehicle = matchData.catalogVehicle || {}
        const enrichedData = vehicle.enrichedData || {}

        const parts = []

        // Especificaciones técnicas
        const engine = catalogVehicle.engine || enrichedData.engine
        if (engine) parts.push(`Motor: ${engine}`)

        const fuel = catalogVehicle.fuel || enrichedData.fuel
        if (fuel) parts.push(`Combustible: ${fuel}`)

        const transmission = catalogVehicle.transmission || enrichedData.transmission
        if (transmission) parts.push(`Transmisión: ${transmission}`)

        // KM y precio del Excel original
        if (excelData.kilometros) parts.push(`${excelData.kilometros} km`)
        if (excelData.valor && excelData.moneda) {
            parts.push(`${excelData.moneda} ${excelData.valor}`)
        }

        return parts.join(" • ")
    }

    static generateExcelFile(data, filename = "vehiculos_export") {
        try {
            const { headers, rows } = this.prepareExcelData(data)

            console.log("📝 Creando archivo Excel con", rows.length, "filas y", headers.length, "columnas")

            // Crear workbook
            const wb = XLSX.utils.book_new()

            // Crear worksheet con los datos
            const wsData = [headers, ...rows.map((row) => headers.map((header) => row[header] || ""))]
            const ws = XLSX.utils.aoa_to_sheet(wsData)

            // Configurar anchos de columna
            const colWidths = headers.map((header) => {
                let maxLength = header.length
                rows.forEach((row) => {
                    const cellValue = String(row[header] || "")
                    if (cellValue.length > maxLength) {
                        maxLength = Math.min(cellValue.length, 50) // Máximo 50 caracteres
                    }
                })
                return { wch: Math.max(10, maxLength + 2) }
            })
            ws["!cols"] = colWidths

            // Agregar worksheet al workbook
            XLSX.utils.book_append_sheet(wb, ws, "Vehículos")

            // Generar archivo
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

            // Crear blob y descargar
            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            })

            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            console.log("✅ Archivo Excel generado y descargado exitosamente")

            return {
                success: true,
                message: `Archivo Excel generado con ${rows.length} registros`,
                filename: link.download,
                stats: {
                    totalRecords: rows.length,
                    totalColumns: headers.length,
                    fileSize: blob.size
                }
            }
        } catch (error) {
            console.error("❌ Error generando archivo Excel:", error)
            return {
                success: false,
                error: error.message
            }
        }
    }
}

export default ExcelExportService
