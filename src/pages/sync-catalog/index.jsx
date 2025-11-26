import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Alert,
    AlertTitle,
    LinearProgress,
    CircularProgress,
    IconButton,
    Stack,
    Chip,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GetAppIcon from '@mui/icons-material/GetApp';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EastIcon from '@mui/icons-material/East';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import FratelliCatalogService from '../../services/fratelliCatalogService';
import ApiEnrichmentService from '../../services/apiEnrichmentService';
import GoogleSheetsService from '../../services/googleSheetsService';
import ExcelExportService from '../../services/excelExportService';

const SyncCatalogPage = () => {
    // Estados del stepper
    const [activeStep, setActiveStep] = useState(0);

    // Estados de datos
    const [catalogData, setCatalogData] = useState(null);
    const [versionData, setVersionData] = useState(null);
    const [enrichedData, setEnrichedData] = useState(null);

    // Estados de carga
    const [loading, setLoading] = useState(false);
    const [validatingVersions, setValidatingVersions] = useState(false);
    const [enriching, setEnriching] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportingExcel, setExportingExcel] = useState(false);

    // Estados de mensajes
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    // Estados de progreso OpenAI
    const [openaiProgress, setOpenaiProgress] = useState(null);
    const [enableOpenAI, setEnableOpenAI] = useState(true);

    // Estados de exportación
    const [exportResult, setExportResult] = useState(null);
    const [excelExportResult, setExcelExportResult] = useState(null);
    const [showGoogleSheetsDialog, setShowGoogleSheetsDialog] = useState(false);
    const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
    const [googleSheetsUrlError, setGoogleSheetsUrlError] = useState('');

    // Configuración de pasos
    const steps = [
        {
            label: 'Obtener Catálogo',
            description: 'Cargar vehículos desde la API de Fratelli',
            icon: <CloudDownloadIcon />
        },
        {
            label: 'Validar Versiones',
            description: 'Revisar y validar versiones extraídas',
            icon: <AutoAwesomeIcon />
        },
        {
            label: 'Enriquecer Datos',
            description: 'Completar información técnica con OpenAI',
            icon: <AutoAwesomeIcon />
        },
        {
            label: 'Exportar Resultados',
            description: 'Descargar datos procesados',
            icon: <GetAppIcon />
        }
    ];

    // Funciones de navegación
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const canProceedToNext = () => {
        if (activeStep === 0) return catalogData?.success;
        if (activeStep === 1) return versionData?.success;
        if (activeStep === 2) return enrichedData?.success;
        return false;
    };

    // Funciones helper para mensajes
    const showSuccess = (msg) => {
        setMessage(msg);
        setMessageType('success');
        setTimeout(() => setMessage(''), 5000);
    };

    const showError = (msg) => {
        setMessage(msg);
        setMessageType('error');
        setTimeout(() => setMessage(''), 5000);
    };

    const showInfo = (msg) => {
        setMessage(msg);
        setMessageType('info');
    };

    // Paso 1: Obtener Catálogo
    const fetchCatalog = async () => {
        setLoading(true);
        setMessage('📡 Obteniendo catálogo de Fratelli Automotores... (MODO PRUEBA: 5 vehículos)');
        setMessageType('info');

        try {
            const result = await FratelliCatalogService.getCatalogProcessed();

            if (result.success) {
                // 🧪 MODO PRUEBA: Limitar a 5 vehículos
                const limitedResult = {
                    ...result,
                    data: result.data.slice(0, 5),
                    stats: {
                        ...result.stats,
                        total: Math.min(5, result.data.length),
                        withVersion: result.data.slice(0, 5).filter(v => v.version).length,
                        withoutVersion: result.data.slice(0, 5).filter(v => !v.version).length
                    }
                };
                setCatalogData(limitedResult);
                setMessage(`✅ Catálogo cargado: ${limitedResult.stats.total} vehículos (MODO PRUEBA)`);
                setMessageType('success');
            } else {
                setMessage(`❌ Error cargando catálogo: ${result.error}`);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(`❌ Error inesperado: ${error.message}`);
            setMessageType('error');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    // Paso 2: Validar Versiones con OpenAI
    const validateVersions = async () => {
        if (!catalogData?.success || !catalogData?.data) return;

        setValidatingVersions(true);
        showInfo('🤖 Extrayendo versiones con OpenAI...');

        try {
            console.log('🔍 Validando versiones con OpenAI...');
            console.log('   - Total vehículos:', catalogData.data.length);

            const vehiclesWithVersions = [];
            let completed = 0;
            const total = catalogData.data.length;

            // Procesar cada vehículo con OpenAI
            for (const vehicle of catalogData.data) {
                try {
                    // Preparar el prompt para extraer la versión
                    const prompt = `Extraer únicamente la versión del siguiente vehículo. La respuesta debe ser solo la versión, sin texto adicional.

Marca: ${vehicle.brand || 'No disponible'}
Modelo: ${vehicle.model || 'No disponible'}
Año: ${vehicle.year || 'No disponible'}`;

                    console.log(`   - Procesando: ${vehicle.brand} ${vehicle.model} ${vehicle.year}`);
                    console.log('📤 PROMPT ENVIADO:');
                    console.log('─────────────────────────────────────────');
                    console.log(prompt);
                    console.log('─────────────────────────────────────────');

                    // Llamar a OpenAI directamente
                    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o-mini',
                            messages: [
                                {
                                    role: 'user',
                                    content: prompt
                                }
                            ],
                            max_tokens: 50,
                            temperature: 0.3
                        })
                    });

                    let extractedVersion = '';

                    if (response.ok) {
                        const data = await response.json();
                        extractedVersion = data.choices[0]?.message?.content?.trim() || '';
                        console.log('📥 RESPUESTA DE OPENAI:');
                        console.log('─────────────────────────────────────────');
                        console.log('Versión extraída:', extractedVersion);
                        console.log('Respuesta completa:', data);
                        console.log('─────────────────────────────────────────');
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        console.error('❌ ERROR EN OPENAI:');
                        console.error('Status:', response.status);
                        console.error('Error:', errorData);
                        console.warn(`      ✗ Error en OpenAI para ${vehicle.brand} ${vehicle.model}`);
                    }

                    vehiclesWithVersions.push({
                        ...vehicle,
                        extractedVersion: extractedVersion,
                        extractedModel: vehicle.model || vehicle.description || ''
                    });

                    completed++;
                    showInfo(`🤖 Extrayendo versiones: ${completed}/${total}`);

                } catch (vehicleError) {
                    console.error(`      ✗ Error procesando vehículo:`, vehicleError);
                    vehiclesWithVersions.push({
                        ...vehicle,
                        extractedVersion: '',
                        extractedModel: vehicle.model || vehicle.description || ''
                    });
                    completed++;
                }

                // Pequeña pausa para no saturar la API
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            setVersionData({
                success: true,
                data: vehiclesWithVersions,
                total: vehiclesWithVersions.length,
                message: `Versiones validadas correctamente para ${vehiclesWithVersions.length} vehículos`
            });

            showSuccess(`✅ ${vehiclesWithVersions.length} versiones extraídas con OpenAI`);
        } catch (error) {
            console.error('❌ Error validando versiones:', error);
            showError('Error al validar versiones: ' + error.message);
            setVersionData({
                success: false,
                error: error.message
            });
        } finally {
            setValidatingVersions(false);
        }
    };

    // Paso 3: Enriquecer Datos
    const enrichCatalogData = async () => {
        if (!versionData?.success || !versionData?.data) return;

        setEnriching(true);
        showInfo('🔄 Obteniendo detalles completos de cada vehículo...');

        try {
            console.log('📡 Iniciando enriquecimiento...');
            console.log('   - Total vehículos:', versionData.data.length);
            console.log('   - Enriquecimiento con OpenAI:', enableOpenAI ? 'SÍ' : 'NO');

            const enrichedVehicles = [];
            let completed = 0;
            const total = versionData.data.length;

            // PASO 1: Obtener detalles completos de cada vehículo desde la API
            for (const vehicle of versionData.data) {
                try {
                    showInfo(`🔄 Obteniendo detalles: ${completed + 1}/${total}`);

                    console.log(`   - Obteniendo detalle de: ${vehicle.brand} ${vehicle.model} (ID: ${vehicle.id})`);

                    // Obtener detalle completo del vehículo
                    const detailResult = await FratelliCatalogService.fetchVehicleDetail(vehicle.id);

                    let vehicleDetail = vehicle;
                    if (detailResult.success && detailResult.data) {
                        vehicleDetail = { ...vehicle, ...detailResult.data };
                        console.log(`      ✓ Detalle obtenido correctamente`);
                        console.log(`      📋 Campos del detalle:`, Object.keys(detailResult.data));
                        console.log(`      🔍 Detalle completo:`, detailResult.data);
                    } else {
                        console.warn(`      ✗ No se pudo obtener el detalle, usando datos básicos`);
                    }                    // Agregar la versión extraída del paso anterior
                    vehicleDetail.version = vehicle.extractedVersion || vehicle.version || '';

                    enrichedVehicles.push(vehicleDetail);
                    completed++;

                } catch (error) {
                    console.error(`      ✗ Error obteniendo detalle:`, error);
                    // Si falla, usar datos básicos
                    enrichedVehicles.push({
                        ...vehicle,
                        version: vehicle.extractedVersion || vehicle.version || ''
                    });
                    completed++;
                }

                // Pequeña pausa
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // PASO 2 (OPCIONAL): Enriquecer con OpenAI si está habilitado
            let finalEnrichedVehicles = enrichedVehicles;

            if (enableOpenAI) {
                showInfo('🤖 Enriqueciendo con OpenAI...');
                console.log('🤖 Iniciando enriquecimiento con OpenAI...');

                finalEnrichedVehicles = [];
                let openaiCompleted = 0;

                for (const vehicle of enrichedVehicles) {
                    try {
                        const marca = vehicle.brand || 'No disponible';
                        const modelo = vehicle.model || 'No disponible';
                        const version = vehicle.version || 'No disponible';
                        const ano = vehicle.year || 'No disponible';

                        showInfo(`🤖 OpenAI: ${openaiCompleted + 1}/${total}`);

                        // Prompt para obtener ficha técnica completa
                        const prompt = `Proporciona la ficha técnica del siguiente vehículo en formato JSON. Responde ÚNICAMENTE con el objeto JSON, sin texto adicional.

Marca: ${marca}
Modelo: ${modelo}
Versión: ${version}
Año: ${ano}

El JSON debe tener esta estructura (usa null si no tienes el dato):
{
  "combustible": "nafta | diésel | híbrido | eléctrico",
  "cilindrada": "número en cc",
  "potencia_hp": "número en HP",
  "torque_nm": "número en Nm",
  "transmision": "manual | automática",
  "traccion": "delantera | trasera | integral",
  "airbags": "número",
  "abs": true/false,
  "velocidad_maxima": "número en km/h",
  "aceleracion_0_100": "número en segundos",
  "consumo_mixto": "número en km/l",
  "capacidad_tanque": "número en litros",
  "largo": "número en mm",
  "ancho": "número en mm",
  "alto": "número en mm",
  "peso": "número en kg",
  "capacidad_baul": "número en litros",
  "asientos": "número"
}`;

                        console.log(`   - Enriqueciendo con OpenAI: ${marca} ${modelo} ${version}`);

                        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
                        const response = await fetch('https://api.openai.com/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            body: JSON.stringify({
                                model: 'gpt-4o-mini',
                                messages: [{
                                    role: 'user',
                                    content: prompt
                                }],
                                max_tokens: 500,
                                temperature: 0.3
                            })
                        });

                        let technicalData = {};

                        if (response.ok) {
                            const data = await response.json();
                            const content = data.choices[0]?.message?.content?.trim() || '{}';

                            try {
                                const jsonMatch = content.match(/\{[\s\S]*\}/);
                                if (jsonMatch) {
                                    technicalData = JSON.parse(jsonMatch[0]);
                                    console.log(`      ✓ Datos técnicos obtenidos de OpenAI`);
                                }
                            } catch (parseError) {
                                console.warn(`      ✗ Error parseando JSON:`, parseError);
                            }
                        } else {
                            console.warn(`      ✗ Error en OpenAI`);
                        }

                        finalEnrichedVehicles.push({
                            ...vehicle,
                            ...technicalData
                        });

                        openaiCompleted++;
                        setOpenaiProgress({ completed: openaiCompleted, total });

                    } catch (vehicleError) {
                        console.error(`      ✗ Error enriqueciendo con OpenAI:`, vehicleError);
                        finalEnrichedVehicles.push(vehicle);
                        openaiCompleted++;
                    }

                    // Pausa para no saturar la API
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            setEnrichedData({
                success: true,
                data: finalEnrichedVehicles,
                total: finalEnrichedVehicles.length,
                message: `Datos enriquecidos correctamente para ${finalEnrichedVehicles.length} vehículos${enableOpenAI ? ' (con OpenAI)' : ''}`
            });
            console.log('✅ Datos enriquecidos guardados:');
            console.log('   - Total:', finalEnrichedVehicles.length);
            console.log('   - Primer vehículo completo:', finalEnrichedVehicles[0]);
            console.log('   - Campos del primer vehículo:', Object.keys(finalEnrichedVehicles[0]));

            showSuccess(`✅ ${finalEnrichedVehicles.length} vehículos enriquecidos${enableOpenAI ? ' con OpenAI' : ''}`);
        } catch (error) {
            console.error('❌ Error enriqueciendo datos:', error);
            showError('Error al enriquecer datos: ' + error.message);
            setEnrichedData({
                success: false,
                error: error.message
            });
        } finally {
            setEnriching(false);
            setOpenaiProgress(null);
        }
    };

    // Funciones de exportación
    const showGoogleSheetsExportDialog = () => {
        setShowGoogleSheetsDialog(true);
        setGoogleSheetsUrl('');
        setGoogleSheetsUrlError('');
    };

    const exportToCSV = async () => {
        if (!enrichedData?.success || !enrichedData?.data) return;

        setExporting(true);
        setMessage('📄 Exportando a CSV...');
        setMessageType('info');

        try {
            const result = await GoogleSheetsService.exportToGoogleSheets(
                enrichedData.data,
                { totalRecords: enrichedData.data.length },
                {
                    filename: `catalogo_fratelli_${new Date().toISOString().split('T')[0]}.csv`
                }
            );

            if (result.success) {
                setExportResult(result);
                setMessage(`✅ CSV exportado: ${result.recordCount} vehículos en ${result.filename}`);
                setMessageType('success');
            } else {
                setMessage(`❌ Error en exportación CSV: ${result.error}`);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(`❌ Error inesperado en exportación CSV: ${error.message}`);
            setMessageType('error');
        } finally {
            setExporting(false);
            setTimeout(() => setMessage(''), 8000);
        }
    };

    const exportToSpecificGoogleSheet = async () => {
        if (!googleSheetsUrl.trim()) {
            setGoogleSheetsUrlError('Por favor ingresa un link de Google Sheets');
            return;
        }

        const validation = GoogleSheetsService.validateGoogleSheetUrl(googleSheetsUrl);
        if (!validation.valid) {
            setGoogleSheetsUrlError(validation.error);
            return;
        }

        setShowGoogleSheetsDialog(false);
        setExporting(true);
        setMessage('📊 Conectando con Google Sheets...');
        setMessageType('info');

        try {
            const result = await GoogleSheetsService.exportToSpecificGoogleSheet(
                enrichedData.data,
                { totalRecords: enrichedData.data.length },
                googleSheetsUrl
            );

            if (result.success) {
                setExportResult(result);
                setMessage(`✅ ¡Datos exportados exitosamente a Google Sheets!`);
                setMessageType('success');
            } else {
                setMessage(`❌ Error exportando a Google Sheets: ${result.error}`);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(`❌ Error inesperado exportando a Google Sheets: ${error.message}`);
            setMessageType('error');
        } finally {
            setExporting(false);
            setTimeout(() => setMessage(''), 15000);
        }
    };

    const exportToExcel = async () => {
        if (!enrichedData || !enrichedData.data) {
            setMessage('❌ No hay datos enriquecidos para exportar');
            setMessageType('error');
            return;
        }

        setExportingExcel(true);
        setMessage('📊 Generando archivo Excel...');
        setMessageType('info');

        try {
            console.log('📊 Preparando datos para exportación...');
            console.log('📊 Datos enriquecidos disponibles:', enrichedData.data.length);
            console.log('🔍 Primer vehículo antes de transformar:', enrichedData.data[0]);

            // Transformar los datos al formato esperado por ExcelExportService
            // Helper: remove the version text from the model when present
            const sanitizeModel = (model = '', version = '') => {
                if (!model) return '';
                if (!version) return model.trim();
                try {
                    const v = version.toString().trim();
                    const escaped = v.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
                    const re = new RegExp(escaped, 'i');
                    let cleaned = model.replace(re, '').replace(/[-\\/\\|]/g, ' ');
                    cleaned = cleaned.replace(/\\s{2,}/g, ' ').trim();
                    return cleaned || model.trim();
                } catch (e) {
                    return model.trim();
                }
            };

            const dataForExport = enrichedData.data.map((vehicle) => {
                // Mapeo de campos de la API de Fratelli a campos del Excel
                return {
                    enrichedData: {
                        // === MAPEO DIRECTO DE LA API DE FRATELLI ===
                        // id -> id
                        id: vehicle.id || '',

                        // brand -> marca
                        marca: vehicle.brand || '',

                        // model -> modelo (sin versión)
                        modelo: sanitizeModel(vehicle.model, vehicle.version) || '',

                        // year -> vehiculo_ano y modelo_ano
                        vehiculo_ano: vehicle.year || '',
                        modelo_ano: vehicle.year || '',

                        // version (del paso 2 de validación)
                        version: vehicle.version || '',

                        // price -> valor
                        valor: vehicle.price || '',
                        moneda: 'ARS',

                        // mileage -> kilometros
                        kilometros: vehicle.mileage || '',

                        // color -> color
                        color: vehicle.color || '',

                        // description -> ficha_breve
                        ficha_breve: vehicle.description || '',

                        // transmission -> caja
                        caja: vehicle.transmission || '',

                        // fuel -> combustible
                        combustible: vehicle.fuel || '',

                        // doors -> puertas
                        puertas: vehicle.doors || '',

                        // featured -> featured
                        featured: vehicle.featured || false,

                        // favorite -> favorite
                        favorite: vehicle.favorite || false,

                        // Campos de publicación: URLs construidas usando el id
                        publicacion_web: vehicle.id ? `https://www.fratelliautomotores.com.ar/catalogo/${vehicle.id}` : 'si',
                        publicacion_api_call: vehicle.id ? `https://api.fratelliautomotores.com.ar/api/cars/${vehicle.id}` : 'si',

                        // Patente (no viene de la API, dejar vacío)
                        patente: '',

                        // === DATOS TÉCNICOS DE OPENAI (si están disponibles) ===
                        motorizacion: vehicle.motorizacion || '',
                        traccion: vehicle.traccion || '',
                        segmento_modelo: vehicle.segmento_modelo || vehicle.category || '',
                        cilindrada: vehicle.cilindrada || '',
                        potencia_hp: vehicle.potencia_hp || '',
                        torque_nm: vehicle.torque_nm || '',
                        airbags: vehicle.airbags || '',
                        abs: vehicle.abs || '',
                        control_estabilidad: vehicle.control_estabilidad || '',
                        climatizador: vehicle.climatizador || '',
                        multimedia: vehicle.multimedia || '',
                        asistencia_manejo: vehicle.asistencia_manejo || '',
                        frenos: vehicle.frenos || '',
                        neumaticos: vehicle.neumaticos || '',
                        llantas: vehicle.llantas || '',
                        rendimiento_mixto: vehicle.consumo_mixto || vehicle.rendimiento_mixto || '',
                        velocidad_max: vehicle.velocidad_maxima || vehicle.velocidad_max || '',
                        aceleracion_0_100: vehicle.aceleracion_0_100 || '',
                        capacidad_baul: vehicle.capacidad_baul || '',
                        capacidad_combustible: vehicle.capacidad_tanque || vehicle.capacidad_combustible || '',
                        largo: vehicle.largo || '',
                        ancho: vehicle.ancho || '',
                        alto: vehicle.alto || '',
                        peso: vehicle.peso || '',
                        asientos: vehicle.asientos || '',
                        consumo_ciudad: vehicle.consumo_ciudad || '',
                        consumo_ruta: vehicle.consumo_ruta || '',

                        // Metadatos
                        url_ficha: vehicle.url_ficha || '',
                        modelo_rag: vehicle.modelo_rag || '',
                        titulo_legible: vehicle.titulo_legible || ''
                    }
                };
            });

            console.log('📊 Datos transformados:', dataForExport.length, 'vehículos');
            console.log('🔍 Primer vehículo transformado completo:', JSON.stringify(dataForExport[0], null, 2));
            console.log('🔍 EnrichedData del primer vehículo:', dataForExport[0].enrichedData);

            const result = ExcelExportService.generateExcelFile(
                dataForExport,
                'catalogo_fratelli_export'
            );

            if (result.success) {
                setExcelExportResult(result);
                setMessage(`✅ Excel generado: ${result.filename} (${result.stats.totalRecords} registros, ${result.stats.totalColumns} columnas)`);
                setMessageType('success');
            } else {
                setMessage(`❌ Error generando Excel: ${result.error}`);
                setMessageType('error');
            }
        } catch (error) {
            console.error('❌ Error generando Excel:', error);
            setMessage(`❌ Error inesperado generando Excel: ${error.message}`);
            setMessageType('error');
        } finally {
            setExportingExcel(false);
            setTimeout(() => setMessage(''), 8000);
        }
    };

    // Render Paso 2: Validación de Versiones
    const renderVersionValidationStep = () => (
        <Box>
            <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <AutoAwesomeIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Validación de Versiones
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Revisa y valida las versiones extraídas de los vehículos
                        </Typography>
                    </Box>
                </Box>

                {!versionData ? (
                    <Button
                        onClick={validateVersions}
                        variant="contained"
                        disabled={validatingVersions || !catalogData?.success}
                        startIcon={validatingVersions ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                        size="large"
                    >
                        {validatingVersions ? 'Validando Versiones...' : 'Validar Versiones'}
                    </Button>
                ) : (
                    <Box>
                        {versionData.success ? (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                <AlertTitle>Validación Completada</AlertTitle>
                                {versionData.message}
                            </Alert>
                        ) : (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                <AlertTitle>Error en Validación</AlertTitle>
                                {versionData.error}
                            </Alert>
                        )}

                        {versionData.success && versionData.data && (
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">
                                        📊 Versiones Validadas ({versionData.data.length})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Modelo</strong></TableCell>
                                                    <TableCell><strong>Versión Extraída</strong></TableCell>
                                                    <TableCell><strong>Año</strong></TableCell>
                                                    <TableCell><strong>Precio</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {versionData.data.map((vehicle, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{vehicle.extractedModel}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={vehicle.extractedVersion || 'No detectada'}
                                                                size="small"
                                                                color={vehicle.extractedVersion ? 'success' : 'default'}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{vehicle.year || 'N/A'}</TableCell>
                                                        <TableCell>${vehicle.price?.toLocaleString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </Box>
                )}
            </CardContent>
        </Box>
    );

    // Render de cada paso
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return renderCatalogStep();
            case 1:
                return renderVersionValidationStep();
            case 2:
                return renderEnrichmentStep();
            case 3:
                return renderExportStep();
            default:
                return null;
        }
    };

    // Paso 1: Catálogo
    const renderCatalogStep = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    📡 Obtener Catálogo de Vehículos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Descarga todos los vehículos activos desde la API de Fratelli Automotores
                </Typography>

                <Button
                    onClick={fetchCatalog}
                    variant="contained"
                    disabled={loading}
                    startIcon={<SyncIcon />}
                    sx={{ mb: 3 }}
                >
                    {loading ? 'Cargando...' : 'Obtener Catálogo'}
                </Button>

                {catalogData?.success && catalogData?.data && renderCatalogTable()}
            </CardContent>
        </Card>
    );

    // Tabla del catálogo (colapsable)
    const renderCatalogTable = () => (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                    📊 Catálogo ({catalogData.stats.total} vehículos activos)
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Chip label={`Total: ${catalogData.stats.total}`} size="small" color="info" />
                    <Chip label={`Con versión: ${catalogData.stats.withVersion}`} size="small" color="success" />
                    <Chip label={`Sin versión: ${catalogData.stats.withoutVersion}`} size="small" color="warning" />
                </Stack>

                <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Marca</strong></TableCell>
                                <TableCell><strong>Modelo</strong></TableCell>
                                <TableCell><strong>Año</strong></TableCell>
                                <TableCell><strong>Versión</strong></TableCell>
                                <TableCell><strong>Precio</strong></TableCell>
                                <TableCell><strong>Km</strong></TableCell>
                                <TableCell><strong>Combustible</strong></TableCell>
                                <TableCell><strong>Transmisión</strong></TableCell>
                                <TableCell><strong>Featured</strong></TableCell>
                                <TableCell><strong>Favorite</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {catalogData.data.map((vehicle, index) => (
                                <TableRow key={vehicle.id || index}>
                                    <TableCell>{vehicle.brand || '-'}</TableCell>
                                    <TableCell>{vehicle.model || '-'}</TableCell>
                                    <TableCell>{vehicle.year || '-'}</TableCell>
                                    <TableCell>{vehicle.version || '-'}</TableCell>
                                    <TableCell>${vehicle.price?.toLocaleString() || '-'}</TableCell>
                                    <TableCell>{vehicle.mileage?.toLocaleString() || '-'}</TableCell>
                                    <TableCell>{vehicle.fuel || '-'}</TableCell>
                                    <TableCell>{vehicle.transmission || '-'}</TableCell>
                                    <TableCell>{vehicle.featured ? 'Sí' : 'No'}</TableCell>
                                    <TableCell>{vehicle.favorite ? 'Sí' : 'No'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    );

    // Paso 3: Enriquecimiento
    const renderEnrichmentStep = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    ✨ Enriquecer Datos con OpenAI
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Completa la información técnica de los vehículos usando inteligencia artificial
                </Typography>

                <FormControlLabel
                    control={
                        <Switch
                            checked={enableOpenAI}
                            onChange={(e) => setEnableOpenAI(e.target.checked)}
                            disabled={enriching}
                        />
                    }
                    label="Usar OpenAI para enriquecer datos"
                    sx={{ mb: 2 }}
                />

                <Button
                    onClick={enrichCatalogData}
                    variant="contained"
                    disabled={enriching || !versionData?.success}
                    startIcon={<AutoAwesomeIcon />}
                    sx={{ mb: 3 }}
                >
                    {enriching ? 'Enriqueciendo...' : 'Enriquecer Datos'}
                </Button>

                {openaiProgress && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" gutterBottom>
                            Progreso OpenAI: {openaiProgress.completed || 0}/{openaiProgress.total || 0}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={((openaiProgress.completed || 0) / (openaiProgress.total || 1)) * 100}
                        />
                    </Box>
                )}

                {enrichedData?.success && enrichedData?.data && renderEnrichmentTable()}
            </CardContent>
        </Card>
    );

    // Tabla de enriquecimiento (colapsable)
    const renderEnrichmentTable = () => (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                    📡 Datos Enriquecidos ({enrichedData.data?.length || 0} vehículos)
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Chip label={`Total procesados: ${enrichedData.data?.length || 0}`} size="small" color="info" />
                    {enableOpenAI && (
                        <Chip label={`Enriquecidos con OpenAI`} size="small" color="success" />
                    )}
                </Stack>

                <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Vehículo</strong></TableCell>
                                <TableCell><strong>Versión</strong></TableCell>
                                <TableCell><strong>Datos Técnicos</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrichedData.data.map((vehicle, index) => {
                                const hasTechnicalData = vehicle.combustible || vehicle.potencia_hp || vehicle.cilindrada;

                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Typography variant="body2">
                                                <strong>{vehicle.brand || '-'} {vehicle.model || '-'}</strong>
                                                <br />
                                                <Typography variant="caption" color="text.secondary">
                                                    {vehicle.year || '-'}
                                                </Typography>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={vehicle.version || vehicle.extractedVersion || 'N/A'}
                                                size="small"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {hasTechnicalData ? (
                                                <Stack spacing={0.5} sx={{ maxHeight: 100, overflow: 'auto' }}>
                                                    {vehicle.combustible && (
                                                        <Typography variant="caption">• Combustible: {vehicle.combustible}</Typography>
                                                    )}
                                                    {vehicle.cilindrada && (
                                                        <Typography variant="caption">• Cilindrada: {vehicle.cilindrada}cc</Typography>
                                                    )}
                                                    {vehicle.potencia_hp && (
                                                        <Typography variant="caption">• Potencia: {vehicle.potencia_hp}HP</Typography>
                                                    )}
                                                    {vehicle.transmision && (
                                                        <Typography variant="caption">• Transmisión: {vehicle.transmision}</Typography>
                                                    )}
                                                </Stack>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    Sin datos técnicos
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    );

    // Paso 3: Exportación
    const renderExportStep = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    📊 Exportación de Resultados
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Descarga los datos procesados en el formato que prefieras
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                    <Button
                        onClick={exportToCSV}
                        variant="outlined"
                        disabled={!enrichedData?.success || exporting}
                        startIcon={<VisibilityIcon />}
                    >
                        {exporting ? 'Exportando...' : 'Exportar CSV'}
                    </Button>

                    <Button
                        onClick={showGoogleSheetsExportDialog}
                        variant="outlined"
                        disabled={!enrichedData?.success || exporting}
                        startIcon={<VisibilityIcon />}
                        color="secondary"
                    >
                        Exportar a Google Sheets
                    </Button>

                    <Button
                        onClick={exportToExcel}
                        variant="contained"
                        disabled={!enrichedData?.success || exportingExcel}
                        startIcon={<GetAppIcon />}
                        color="success"
                    >
                        {exportingExcel ? 'Generando...' : 'Exportar Excel'}
                    </Button>
                </Stack>

                {(exportResult || excelExportResult) && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            📊 Resultados de Exportación
                        </Typography>

                        {exportResult && (
                            <Alert severity="success" sx={{ mb: 1 }}>
                                📄 CSV exportado: {exportResult.recordCount} registros
                            </Alert>
                        )}

                        {excelExportResult && (
                            <Alert severity="success" sx={{ mb: 1 }}>
                                📊 Excel generado: {excelExportResult.stats.totalRecords} registros, {excelExportResult.stats.totalColumns} columnas
                            </Alert>
                        )}
                    </Box>
                )}

                {enrichedData?.success && enrichedData?.data && renderFinalPreviewTable()}
            </CardContent>
        </Card>
    );

    // Helper disponible para vista previa y exportación: elimina la versión del nombre del modelo
    const sanitizeModel = (model = '', version = '') => {
        if (!model) return '';
        if (!version) return model.trim();
        try {
            const v = version.toString().trim();
            const escaped = v.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
            const re = new RegExp(escaped, 'i');
            let cleaned = model.replace(re, '').replace(/[-\\/\\|]/g, ' ');
            cleaned = cleaned.replace(/\\s{2,}/g, ' ').trim();
            return cleaned || model.trim();
        } catch (e) {
            return model.trim();
        }
    };

    // Vista previa final (colapsable)
    const renderFinalPreviewTable = () => (
        <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                    👀 Vista Previa de Datos Finales ({enrichedData.data.length} registros - 42 columnas)
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Exactamente los mismos datos que se exportarán. Incluye las columnas: featured y favorite.
                </Typography>

                <TableContainer component={Paper} sx={{ maxHeight: 600, overflowX: 'auto' }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 100 }}><strong>patente</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>kilometros</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>vehiculo_ano</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>valor</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>moneda</strong></TableCell>
                                <TableCell sx={{ minWidth: 120 }}><strong>publicacion_web</strong></TableCell>
                                <TableCell sx={{ minWidth: 140 }}><strong>publicacion_api_call</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>marca</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>modelo</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>modelo_ano</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>version</strong></TableCell>
                                <TableCell sx={{ minWidth: 120 }}><strong>motorizacion</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>combustible</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>caja</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>traccion</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>puertas</strong></TableCell>
                                <TableCell sx={{ minWidth: 120 }}><strong>segmento_modelo</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>cilindrada</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>potencia_hp</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>torque_nm</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>airbags</strong></TableCell>
                                <TableCell sx={{ minWidth: 60 }}><strong>abs</strong></TableCell>
                                <TableCell sx={{ minWidth: 140 }}><strong>control_estabilidad</strong></TableCell>
                                <TableCell sx={{ minWidth: 120 }}><strong>climatizador</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>multimedia</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>frenos</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>neumaticos</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>llantas</strong></TableCell>
                                <TableCell sx={{ minWidth: 140 }}><strong>asistencia_manejo</strong></TableCell>
                                <TableCell sx={{ minWidth: 140 }}><strong>rendimiento_mixto</strong></TableCell>
                                <TableCell sx={{ minWidth: 120 }}><strong>capacidad_baul</strong></TableCell>
                                <TableCell sx={{ minWidth: 160 }}><strong>capacidad_combustible</strong></TableCell>
                                <TableCell sx={{ minWidth: 120 }}><strong>velocidad_max</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>largo</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>ancho</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>alto</strong></TableCell>
                                <TableCell sx={{ minWidth: 120 }}><strong>url_ficha</strong></TableCell>
                                <TableCell sx={{ minWidth: 100 }}><strong>modelo_rag</strong></TableCell>
                                <TableCell sx={{ minWidth: 140 }}><strong>titulo_legible</strong></TableCell>
                                <TableCell sx={{ minWidth: 200 }}><strong>ficha_breve</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>featured</strong></TableCell>
                                <TableCell sx={{ minWidth: 80 }}><strong>favorite</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrichedData.data.map((vehicle, index) => {
                                return (
                                    <TableRow key={index} sx={{ height: 64, '& > *': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }}>
                                        <TableCell>{vehicle.patente || ""}</TableCell>
                                        <TableCell>{vehicle.mileage ? vehicle.mileage.toLocaleString() : "-"}</TableCell>
                                        <TableCell>{vehicle.year || "-"}</TableCell>
                                        <TableCell>{vehicle.price ? `$${vehicle.price.toLocaleString()}` : "-"}</TableCell>
                                        <TableCell>ARS</TableCell>
                                        <TableCell>{vehicle.id ? `https://www.fratelliautomotores.com.ar/catalogo/${vehicle.id}` : 'si'}</TableCell>
                                        <TableCell>{vehicle.id ? `https://api.fratelliautomotores.com.ar/api/cars/${vehicle.id}` : 'si'}</TableCell>
                                        <TableCell>{vehicle.brand || "-"}</TableCell>
                                        <TableCell>{sanitizeModel(vehicle.model, vehicle.version) || "-"}</TableCell>
                                        <TableCell>{vehicle.year || "-"}</TableCell>
                                        <TableCell>{vehicle.version || "-"}</TableCell>
                                        <TableCell>{vehicle.motorizacion || "-"}</TableCell>
                                        <TableCell>{vehicle.fuel || vehicle.combustible || "-"}</TableCell>
                                        <TableCell>{vehicle.transmission || vehicle.caja || "-"}</TableCell>
                                        <TableCell>{vehicle.traccion || "-"}</TableCell>
                                        <TableCell>{vehicle.doors || vehicle.puertas || "-"}</TableCell>
                                        <TableCell>{vehicle.segmento_modelo || vehicle.Category?.name || "-"}</TableCell>
                                        <TableCell>{vehicle.cilindrada || "-"}</TableCell>
                                        <TableCell>{vehicle.potencia_hp || "-"}</TableCell>
                                        <TableCell>{vehicle.torque_nm || "-"}</TableCell>
                                        <TableCell>{vehicle.airbags || "-"}</TableCell>
                                        <TableCell>{vehicle.abs ? "Sí" : "-"}</TableCell>
                                        <TableCell>{vehicle.control_estabilidad ? "Sí" : "-"}</TableCell>
                                        <TableCell>{vehicle.climatizador ? "Sí" : "-"}</TableCell>
                                        <TableCell>{vehicle.multimedia || "-"}</TableCell>
                                        <TableCell>{vehicle.frenos || "-"}</TableCell>
                                        <TableCell>{vehicle.neumaticos || "-"}</TableCell>
                                        <TableCell>{vehicle.llantas || "-"}</TableCell>
                                        <TableCell>{vehicle.asistencia_manejo || "-"}</TableCell>
                                        <TableCell>{vehicle.consumo_mixto || vehicle.rendimiento_mixto || "-"}</TableCell>
                                        <TableCell>{vehicle.capacidad_baul || "-"}</TableCell>
                                        <TableCell>{vehicle.capacidad_tanque || vehicle.capacidad_combustible || "-"}</TableCell>
                                        <TableCell>{vehicle.velocidad_maxima || vehicle.velocidad_max || "-"}</TableCell>
                                        <TableCell>{vehicle.largo || "-"}</TableCell>
                                        <TableCell>{vehicle.ancho || "-"}</TableCell>
                                        <TableCell>{vehicle.alto || "-"}</TableCell>
                                        <TableCell>{vehicle.url_ficha || "-"}</TableCell>
                                        <TableCell>{vehicle.modelo_rag || "-"}</TableCell>
                                        <TableCell>{`${vehicle.brand} ${sanitizeModel(vehicle.model, vehicle.version)} ${vehicle.year} ${vehicle.version || ''}`.trim()}</TableCell>
                                        <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {vehicle.description || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={vehicle.featured ? "Sí" : "No"}
                                                size="small"
                                                color={vehicle.featured ? "primary" : "default"}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={vehicle.favorite ? "Sí" : "No"}
                                                size="small"
                                                color={vehicle.favorite ? "secondary" : "default"}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom color="primary">
                    Sincronizar Catálogo Fratelli
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Obtén y enriquece datos del catálogo de vehículos
                </Typography>
            </Box>

            {/* Stepper */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step.label} completed={index < activeStep}>
                                <StepLabel
                                    StepIconComponent={() => (
                                        <IconButton
                                            sx={{
                                                border: 1,
                                                borderRadius: 2,
                                                color: index <= activeStep ? 'primary.main' : 'text.secondary',
                                                backgroundColor: 'transparent',
                                                '&:hover': { backgroundColor: 'transparent' }
                                            }}
                                            size="small"
                                            disabled
                                        >
                                            {step.icon}
                                        </IconButton>
                                    )}
                                >
                                    <Box>
                                        <Typography variant="h6" color={index <= activeStep ? 'primary.main' : 'text.secondary'}>
                                            {step.label}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </StepLabel>
                                <StepContent>
                                    {index === activeStep && (
                                        <Box sx={{ mt: 2, mb: 2 }}>
                                            {renderStepContent(index)}

                                            {/* Navigation buttons */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                                                <Button
                                                    startIcon={<KeyboardBackspaceIcon />}
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    sx={{
                                                        color: 'text.primary',
                                                        '&:hover': { background: 'transparent' },
                                                        textTransform: 'none',
                                                    }}
                                                >
                                                    Atrás
                                                </Button>

                                                {activeStep < steps.length - 1 && (
                                                    <Button
                                                        endIcon={<EastIcon />}
                                                        onClick={handleNext}
                                                        disabled={!canProceedToNext()}
                                                        variant="contained"
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                        }}
                                                    >
                                                        Siguiente
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>

            {/* Mensajes de estado */}
            {message && (
                <Alert severity={messageType} sx={{ mb: 3 }}>
                    {message}
                </Alert>
            )}

            {/* Barra de progreso */}
            {(loading || validatingVersions || enriching || exporting || exportingExcel) && (
                <Box sx={{ mb: 3 }}>
                    <LinearProgress />
                </Box>
            )}

            {/* Dialog para Google Sheets */}
            <Dialog open={showGoogleSheetsDialog} onClose={() => setShowGoogleSheetsDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    📊 Exportar a Google Sheets
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Ingresa el link de tu Google Sheets donde quieres agregar los datos procesados.
                    </Typography>

                    <TextField
                        fullWidth
                        label="Link de Google Sheets"
                        placeholder="https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit"
                        value={googleSheetsUrl}
                        onChange={(e) => {
                            setGoogleSheetsUrl(e.target.value);
                            setGoogleSheetsUrlError('');
                        }}
                        error={!!googleSheetsUrlError}
                        helperText={googleSheetsUrlError || 'Pega aquí el link completo de tu Google Sheets'}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowGoogleSheetsDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={exportToSpecificGoogleSheet}
                        variant="contained"
                        disabled={!googleSheetsUrl.trim()}
                    >
                        Crear Nueva Hoja
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SyncCatalogPage;
