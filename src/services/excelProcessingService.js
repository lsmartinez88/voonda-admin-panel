import * as XLSX from "xlsx"

class ExcelProcessingService {
    // Columnas esperadas del Excel de entrada
    static EXPECTED_COLUMNS = ["Marca", "Modelo", "Version", "Año", "Kilometros", "Dominio", "Fecha ingreso", "Publi Insta", "Publi Face", "Publi Mer. Lib.", "Publi Web", "Publi Mark. P", "Valor", "Pendientes preparacion", "FECHA DE RESERVA", "FECHA DE ENTREGA", "Condicion", "Vendedor"]

    // Estructura de la hoja final de Google Sheets
    static OUTPUT_COLUMNS = [
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

    /**
     * Parsea un archivo Excel y devuelve los datos estructurados
     * @param {File} file - Archivo Excel a procesar (.xlsx, .xlsm, .xls)
     * @returns {Promise<Array>} Array de objetos con los datos del Excel
     */
    static async parseExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result)
                    const workbook = XLSX.read(data, { type: "array" })

                    // Tomar la primera hoja
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]

                    // Convertir a JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                    if (jsonData.length === 0) {
                        throw new Error("El archivo Excel está vacío")
                    }

                    // Primera fila contiene los headers
                    const headers = jsonData[0]
                    const rows = jsonData.slice(1)

                    // Validar que tenga las columnas esperadas
                    const missingColumns = this.validateColumns(headers)
                    if (missingColumns.length > 0) {
                        console.warn("Columnas faltantes:", missingColumns)
                    }

                    // Convertir filas a objetos
                    const result = rows.map((row, index) => ({
                        rowIndex: index + 2, // +2 porque empezamos desde la fila 1 y agregamos el header
                        json: this.rowToObject(headers, row),
                        raw: row
                    }))

                    resolve(result)
                } catch (error) {
                    reject(new Error(`Error al procesar Excel: ${error.message}`))
                }
            }

            reader.onerror = () => reject(new Error("Error al leer el archivo"))
            reader.readAsArrayBuffer(file)
        })
    }

    /**
     * Valida que las columnas del Excel coincidan con las esperadas
     * @param {Array} headers - Headers del Excel
     * @returns {Array} Array de columnas faltantes
     */
    static validateColumns(headers) {
        const normalizedHeaders = headers.map((h) => this.normalizeStr(h))
        const normalizedExpected = this.EXPECTED_COLUMNS.map((col) => this.normalizeStr(col))

        return normalizedExpected.filter((expected) => !normalizedHeaders.some((header) => header === expected))
    }

    /**
     * Convierte una fila de Excel a un objeto con keys basadas en headers
     * @param {Array} headers - Headers del Excel
     * @param {Array} row - Fila de datos
     * @returns {Object} Objeto con datos de la fila
     */
    static rowToObject(headers, row) {
        const obj = {}
        headers.forEach((header, index) => {
            obj[header] = row[index] || ""
        })
        return obj
    }

    /**
     * Normaliza los datos filtros solo filas con condición válida
     * @param {Array} items - Array de objetos parseados del Excel
     * @returns {Array} Array filtrado y normalizado
     */
    static normalizeCondition(items) {
        return (
            items
                // Descartar la primera fila (títulos) - ya se hace en parseExcelFile
                // .slice(1)
                // Descartar las filas donde no hay nada en "Condicion"
                .filter((item) => item.json.Condicion && item.json.Condicion.toString().trim() !== "")
                // Normalizar
                .map((item) => {
                    const estadoOriginal = item.json.Condicion || ""

                    const normalizado = estadoOriginal
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim()

                    item.json.EstadoNormalizado = normalizado
                    return item
                })
        )
    }

    /**
     * Normaliza todos los datos del Excel
     * @param {Array} items - Array de objetos con condición normalizada
     * @returns {Array} Array con datos normalizados
     */
    static normalizeAllData(items) {
        return items
            .map(({ json, rowIndex }) => {
                const { valor: valorNum, moneda } = this.parseValor(json.Valor)

                // Si también querés normalizar imagenes_url cuando venga como string:
                const imgs = json.Imagenes
                    ? String(json.Imagenes)
                          .split(";")
                          .map((s) => s.trim())
                          .filter(Boolean)
                    : []

                return {
                    rowIndex,
                    json: {
                        dominio: json.Dominio,
                        marca: this.toUpper(json.Marca),
                        modelo: this.toUpper(json.Modelo),
                        año: Number(json.Año),
                        versión: this.normalizeStr(json.Version),
                        color: this.normalizeStr(json.Color),
                        color_interior: this.normalizeStr(json["Color interior"]),
                        kilometros: this.toNumber(json.Kilometros),
                        precio_publicado: this.toNumber(json["Precio Publicado"]),
                        precio_contado: this.toNumber(json["Precio Contado"]),
                        valor: valorNum, // <- número ya limpio
                        moneda: moneda, // <- 'pesos' | 'dolares' | null
                        estado: json.EstadoNormalizado, // salon / consignacion
                        ubicacion: this.normalizeStr(json.Ubicacion),
                        categoria: this.normalizeStr(json.Categoria),
                        publicacion_web: json["Publi Web"],
                        publicacion_api_call: this.crearUrlApi(json["Publi Web"]), // <-- NUEVA PROPIEDAD
                        imagenes_url: imgs,
                        detalle_estado: json["Detalle Estado"],
                        revisado_mecanico: json["Revisado Mecánico"]?.toLowerCase() === "si",
                        manuales_seg_llave: json["Manuales y Segunda Llave"]?.toLowerCase() === "si",
                        titular_unico: json["Titular Único"]?.toLowerCase() === "si",
                        tipo_titularidad: this.normalizeStr(json["Tipo Titularidad"]),
                        condicion_iva: this.normalizeStr(json["Condición IVA"]),
                        fecha_ingreso: this.toDate(json["Fecha Ingreso"]),
                        vencimiento_vtv: this.toDate(json["VTV Vencimiento"]),
                        acepta_permuta: json["Acepta Permuta"]?.toLowerCase() === "si",
                        financiable: json.Financiable?.toLowerCase() === "si",
                        anticipo_sugerido: this.toNumber(json["Anticipo Sugerido"]),
                        cuota_estimativa: this.toNumber(json["Cuota Estimativa"])
                    }
                }
            })
            .filter(Boolean)
    }

    /**
     * Filtra solo vehículos en consignación o salón
     * @param {Array} normalizedItems - Items con datos normalizados
     * @returns {Array} Items filtrados
     */
    static filterByCondition(normalizedItems) {
        const validStates = ["salon", "consignacion"]
        return normalizedItems.filter((item) => validStates.includes(item.json.estado))
    }

    /**
     * Detecta moneda por prefijo/símbolo y devuelve número limpio
     * @param {any} raw - Valor crudo del Excel
     * @returns {Object} {valor: number, moneda: string}
     */
    static parseValor(raw) {
        let s = (raw ?? "").toString().trim()
        if (!s) return { valor: null, moneda: "pesos" } // por defecto pesos si está vacío

        const u = s.toUpperCase()

        // Detectar si es dólares
        let moneda = "pesos"
        if (/(U\$S|US\$|USD|DOLARES|DÓLARES)/.test(u)) {
            moneda = "dolares"
        }

        // Extraer solo dígitos
        const digits = u.replace(/[^\d]/g, "")
        const valor = digits ? Number(digits) : null

        return { valor, moneda }
    }

    /**
     * Extrae el UUID de la URL de catálogo y crea la URL de la API
     * @param {string} urlCatalogo - URL del catálogo web
     * @returns {string|null} URL de la API o null si no se encuentra UUID
     */
    static crearUrlApi(urlCatalogo) {
        if (typeof urlCatalogo !== "string" || !urlCatalogo.trim()) {
            return null // Devuelve null si no hay URL de entrada
        }
        // Extrae el UUID del final de la URL con una expresión regular
        const match = urlCatalogo.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
        const uuid = match ? match[0] : null

        if (!uuid) {
            return null // Devuelve null si no se encuentra un UUID
        }
        // Construye la nueva URL de la API
        return `https://api.fratelliautomotores.com.ar/api/cars/${uuid}`
    }

    /**
     * Por si necesitás fallback con columna "Moneda" del Excel
     * @param {string} parsedMoneda - Moneda parseada del valor
     * @param {string} colMoneda - Columna moneda del Excel
     * @returns {string|null} Moneda final
     */
    static chooseMoneda(parsedMoneda, colMoneda) {
        const m = this.toUpper(colMoneda)
        if (parsedMoneda) return parsedMoneda
        if (m === "USD" || m === "U$S" || m === "DOLARES" || m === "DÓLARES") return "dolares"
        if (m === "ARS" || m === "$" || m === "PESOS") return "pesos"
        return null
    }

    // Funciones de utilidad
    static normalizeStr = (s) =>
        (s ?? "")
            .toString()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
    static toUpper = (s) => this.normalizeStr(s).toUpperCase()
    static toNumber = (s) => (s ? Number(String(s).replace(/\./g, "").replace(/,/g, ".")) : null)
    static toDate = (s) => (s ? new Date(s).toISOString().slice(0, 10) : null)

    /**
     * Procesa completamente un archivo Excel
     * @param {File} file - Archivo Excel
     * @returns {Promise<Object>} Resultado del procesamiento
     */
    static async processExcelFile(file) {
        try {
            console.log("🔄 Iniciando procesamiento del archivo Excel...")

            // 1. Parsear archivo
            console.log("📖 Parseando archivo Excel...")
            const rawItems = await this.parseExcelFile(file)

            // 2. Normalizar condición
            console.log("🔧 Normalizando condiciones...")
            const conditionNormalized = this.normalizeCondition(rawItems)

            // 3. Normalizar todos los datos
            console.log("🔧 Normalizando todos los datos...")
            const allNormalized = this.normalizeAllData(conditionNormalized)

            // 4. Filtrar por condición (salón/consignación)
            console.log("🔍 Filtrando por condición...")
            const filtered = this.filterByCondition(allNormalized)

            console.log("✅ Procesamiento completado:", {
                totalRows: rawItems.length,
                withValidCondition: conditionNormalized.length,
                afterNormalization: allNormalized.length,
                finalFiltered: filtered.length
            })

            return {
                success: true,
                data: {
                    raw: rawItems,
                    conditionNormalized,
                    allNormalized,
                    filtered
                },
                stats: {
                    totalRows: rawItems.length,
                    withValidCondition: conditionNormalized.length,
                    afterNormalization: allNormalized.length,
                    finalFiltered: filtered.length
                }
            }
        } catch (error) {
            console.error("❌ Error en procesamiento:", error)
            return {
                success: false,
                error: error.message,
                data: null
            }
        }
    }
}

export default ExcelProcessingService
