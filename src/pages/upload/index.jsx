import React, { useState, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Paper,
    LinearProgress,
    Alert,
    Stack,
    Card,
    CardContent,
    IconButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Step,
    StepLabel,
    Stepper,
    StepContent
} from '@mui/material'
import { Container } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ProcessIcon from '@mui/icons-material/Settings'
import UploadIcon from '@mui/icons-material/Upload'
import SearchIcon from '@mui/icons-material/Search'
import EnhanceIcon from '@mui/icons-material/AutoFixHigh'
import GetAppIcon from '@mui/icons-material/GetApp'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import EastIcon from '@mui/icons-material/East'
import ExcelProcessingService from '../../services/excelProcessingService'
import VehicleMatchingService from '../../services/vehicleMatchingService'
import ApiEnrichmentService from '../../services/apiEnrichmentService'
import GoogleSheetsService from '../../services/googleSheetsService'
import ExcelExportService from '../../services/excelExportService'

const UploadPage = () => {
    // Estados del archivo y procesamiento
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('info')

    // Estados del pipeline de procesamiento
    const [processedData, setProcessedData] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [matchingData, setMatchingData] = useState(null)
    const [matching, setMatching] = useState(false)
    const [enrichedData, setEnrichedData] = useState(null)
    const [enriching, setEnriching] = useState(false)

    // Estados de exportación
    const [exporting, setExporting] = useState(false)
    const [exportResult, setExportResult] = useState(null)
    const [exportingExcel, setExportingExcel] = useState(false)
    const [excelExportResult, setExcelExportResult] = useState(null)

    // Estados para Google Sheets dialog
    const [showGoogleSheetsDialog, setShowGoogleSheetsDialog] = useState(false)
    const [googleSheetsUrl, setGoogleSheetsUrl] = useState('')
    const [googleSheetsUrlError, setGoogleSheetsUrlError] = useState('')

    // Estado del stepper
    const [activeStep, setActiveStep] = useState(0)

    // Definición de pasos
    const steps = [
        {
            label: 'Subir Excel',
            description: 'Sube tu archivo Excel con datos de vehículos',
            icon: <UploadIcon />,
            component: 'upload'
        },
        {
            label: 'Procesar Datos',
            description: 'Procesamos y validamos los datos del Excel',
            icon: <ProcessIcon />,
            component: 'process'
        },
        {
            label: 'Buscar Coincidencias',
            description: 'Encontramos matches en nuestro catálogo',
            icon: <SearchIcon />,
            component: 'matching'
        },
        {
            label: 'Enriquecer Datos',
            description: 'Agregamos información adicional desde la API',
            icon: <EnhanceIcon />,
            component: 'enrich'
        },
        {
            label: 'Exportar Resultados',
            description: 'Descarga los datos procesados',
            icon: <GetAppIcon />,
            component: 'export'
        }
    ]

    // Navegación del stepper
    const canProceedToNext = () => {
        switch (activeStep) {
            case 0: // Upload
                return files.length > 0 // Solo necesita archivos subidos
            case 1: // Process
                return processedData && processedData.data.filtered && processedData.data.filtered.length > 0
            case 2: // Match
                return matchingData && matchingData.results
            case 3: // Enrich
                return enrichedData && enrichedData.data && enrichedData.data.length > 0
            case 4: // Export
                return true // último paso
            default:
                return false
        }
    }

    const handleNext = () => {
        if (canProceedToNext()) {
            setActiveStep((prevStep) => prevStep + 1)
        }
    }

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1)
    }

    const renderStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return renderUploadStep()
            case 1:
                return renderProcessStep()
            case 2:
                return renderMatchingStep()
            case 3:
                return renderEnrichmentStep()
            case 4:
                return renderExportStep()
            default:
                return null
        }
    }

    const renderUploadStep = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed #cccccc',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragActive ? '#f5f5f5' : 'transparent',
                        '&:hover': {
                            backgroundColor: '#f9f9f9'
                        }
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Arrastra tu archivo Excel aquí
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        O haz clic para seleccionar un archivo (.xlsx, .xlsm, .xls)
                    </Typography>
                </Box>

                {files.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        {files.map((file) => (
                            <Paper key={file.id} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <InsertDriveFileIcon sx={{ mr: 2, color: '#1976d2' }} />
                                    <Box>
                                        <Typography variant="body1">{file.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatFileSize(file.size)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => removeFile(file.id)} size="small">
                                    <DeleteIcon />
                                </IconButton>
                            </Paper>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    )

    const renderProcessStep = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    📄 Procesamiento de Excel
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Procesamos tu archivo Excel para extraer y validar los datos de vehículos
                </Typography>

                {!processedData ? (
                    <Button
                        variant="contained"
                        onClick={() => processExcelFile(files[0])}
                        disabled={processing || files.length === 0}
                        startIcon={processing ? <ProcessIcon /> : <UploadIcon />}
                        size="large"
                    >
                        {processing ? 'Procesando...' : 'Procesar Excel'}
                    </Button>
                ) : (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            ✅ Excel procesado exitosamente: {processedData.stats.finalFiltered} vehículos válidos
                        </Alert>
                        {renderProcessedDataSummary()}
                    </Box>
                )}
            </CardContent>
        </Card>
    )

    const renderMatchingStep = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🔍 Búsqueda de Coincidencias
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Comparamos tus vehículos con nuestro catálogo para encontrar coincidencias
                </Typography>

                {!matchingData ? (
                    <Button
                        variant="contained"
                        onClick={processMatching}
                        disabled={matching || !processedData?.success}
                        startIcon={matching ? <ProcessIcon /> : <SearchIcon />}
                        size="large"
                    >
                        {matching ? 'Buscando...' : 'Iniciar Matching'}
                    </Button>
                ) : (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            🎯 Matching completado: {matchingData.stats.withMatches} coincidencias encontradas
                        </Alert>
                        {renderMatchingDataSummary()}
                    </Box>
                )}
            </CardContent>
        </Card>
    )

    const renderEnrichmentStep = () => (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    📡 Enriquecimiento de Datos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Agregamos información adicional consultando la API externa
                </Typography>

                {!enrichedData ? (
                    <Button
                        variant="contained"
                        onClick={processEnrichment}
                        disabled={enriching || !matchingData?.success}
                        startIcon={enriching ? <ProcessIcon /> : <EnhanceIcon />}
                        size="large"
                    >
                        {enriching ? 'Enriqueciendo...' : 'Enriquecer Datos'}
                    </Button>
                ) : (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            ✅ Enriquecimiento completado: {enrichedData.stats.enrichedSuccessfully} vehículos enriquecidos
                        </Alert>
                        {renderEnrichmentDataSummary()}
                    </Box>
                )}
            </CardContent>
        </Card>
    )

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
                                📄 CSV exportado: {exportResult.recordCount} registros en {exportResult.filename}
                            </Alert>
                        )}

                        {excelExportResult && (
                            <Alert severity="success" sx={{ mb: 1 }}>
                                📊 Excel generado: {excelExportResult.stats.totalRecords} registros, {excelExportResult.stats.totalColumns} columnas
                            </Alert>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    )

    const renderProcessedDataSummary = () => (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                    📄 Ver datos procesados ({processedData.stats.finalFiltered} vehículos válidos)
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Chip label={`Total filas: ${processedData.stats.totalRows}`} size="small" color="info" />
                    <Chip label={`Filas válidas: ${processedData.stats.validRows}`} size="small" color="success" />
                    <Chip label={`Vehículos filtrados: ${processedData.stats.finalFiltered}`} size="small" color="primary" />
                </Stack>

                {processedData.data.filtered?.length > 0 && (
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Marca</TableCell>
                                    <TableCell>Modelo</TableCell>
                                    <TableCell>Año</TableCell>
                                    <TableCell>Kilómetros</TableCell>
                                    <TableCell>Precio</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {processedData.data.filtered.map((vehicle, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{vehicle?.json?.marca || '-'}</TableCell>
                                        <TableCell>{vehicle?.json?.modelo || '-'}</TableCell>
                                        <TableCell>{vehicle?.json?.año || '-'}</TableCell>
                                        <TableCell>{vehicle?.json?.kilometros || '-'}</TableCell>
                                        <TableCell>{vehicle?.json?.valor || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </AccordionDetails>
        </Accordion>
    )

    const renderMatchingDataSummary = () => (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                    🔍 Ver resultados del matching ({matchingData.stats.withMatches} coincidencias)
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Chip label={`Total procesados: ${matchingData.stats.total}`} size="small" color="info" />
                    <Chip label={`Con coincidencias: ${matchingData.stats.withMatches}`} size="small" color="success" />
                    <Chip label={`Alta confianza: ${matchingData.stats.confidenceLevels.alto}`} size="small" color="primary" />
                    <Chip label={`Sin matches: ${matchingData.stats.confidenceLevels.sin_match}`} size="small" color="error" />
                </Stack>

                {matchingData.results?.length > 0 && (
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Vehículo Excel</TableCell>
                                    <TableCell>Mejor Match</TableCell>
                                    <TableCell>Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {matchingData.results.map((result, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Typography variant="caption">
                                                {result?.excelVehicle?.json?.marca || '-'} {result?.excelVehicle?.json?.modelo || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {result.bestMatch ? (
                                                <Typography variant="caption">
                                                    {result.bestMatch.catalogVehicle.brand} {result.bestMatch.catalogVehicle.model}
                                                </Typography>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">Sin match</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {result.bestMatch ? (
                                                <Chip
                                                    label={`${Math.round(result.bestMatch.score * 100)}%`}
                                                    size="small"
                                                    color={result.bestMatch.score >= 0.8 ? 'success' : result.bestMatch.score >= 0.6 ? 'warning' : 'error'}
                                                />
                                            ) : (
                                                <Chip label="0%" size="small" color="error" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </AccordionDetails>
        </Accordion>
    )

    const renderEnrichmentDataSummary = () => (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                    📡 Ver datos enriquecidos ({enrichedData.stats.enrichedSuccessfully} vehículos)
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Chip label={`Total procesados: ${enrichedData.stats.totalProcessed}`} size="small" color="info" />
                    <Chip label={`Exitosamente enriquecidos: ${enrichedData.stats.enrichedSuccessfully}`} size="small" color="success" />
                    <Chip label={`Con errores: ${enrichedData.stats.enrichmentErrors}`} size="small" color="error" />
                </Stack>

                {enrichedData.data?.length > 0 && (
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Vehículo</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Datos Adicionales</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enrichedData.data.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Typography variant="caption">
                                                {item?.excelData?.marca || '-'} {item?.excelData?.modelo || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item?.enrichmentSuccess ? 'Exitoso' : 'Error'}
                                                size="small"
                                                color={item?.enrichmentSuccess ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">
                                                {item?.enrichedData ? `${Object.keys(item.enrichedData).length} campos` : 'N/A'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </AccordionDetails>
        </Accordion>
    )

    // Configuración de dropzone
    const onDrop = useCallback((acceptedFiles) => {
        const excelFiles = acceptedFiles.filter(file =>
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12' ||
            file.type === 'application/vnd.ms-excel' ||
            file.name.toLowerCase().endsWith('.xlsx') ||
            file.name.toLowerCase().endsWith('.xlsm') ||
            file.name.toLowerCase().endsWith('.xls')
        )

        if (excelFiles.length === 0) {
            setMessage('Solo se permiten archivos Excel (.xlsx, .xlsm, .xls)')
            setMessageType('error')
            setTimeout(() => setMessage(''), 3000)
            return
        }

        const newFiles = excelFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            status: 'ready',
            progress: 0,
            error: null,
            processedData: null
        }))

        setFiles(prev => [...prev, ...newFiles])
        setMessage('')
        setProcessedData(null)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm'],
            'application/vnd.ms-excel': ['.xls']
        },
        multiple: false
    })

    // Funciones del pipeline de procesamiento
    const processExcelFile = async (fileItem) => {
        setProcessing(true)
        setMessage('🔄 Procesando archivo Excel...')
        setMessageType('info')

        try {
            console.log('📄 Iniciando procesamiento de Excel:', fileItem.name)

            const result = await ExcelProcessingService.processExcelFile(fileItem.file)

            if (result.success) {
                setProcessedData(result)
                setMessage(`✅ Excel procesado: ${result.stats.totalRows} filas leídas, ${result.stats.finalFiltered} vehículos válidos`)
                setMessageType('success')
            } else {
                setMessage(`❌ Error procesando Excel: ${result.error}`)
                setMessageType('error')
            }
        } catch (error) {
            setMessage(`❌ Error inesperado: ${error.message}`)
            setMessageType('error')
        } finally {
            setProcessing(false)
            setTimeout(() => setMessage(''), 5000)
        }
    }

    const processMatching = async () => {
        if (!processedData?.success || !processedData?.data?.filtered) return

        setMatching(true)
        setMessage('🔍 Buscando coincidencias en catálogo...')
        setMessageType('info')

        try {
            console.log('🔍 Iniciando matching con:', processedData.data.filtered.length, 'vehículos')

            const result = await VehicleMatchingService.processMatching(
                processedData.data.filtered,
                (progress) => {
                    setMessage(`Buscando coincidencias: ${progress.processed}/${progress.total} (${progress.percentage}%)`)
                }
            )

            if (result.success) {
                setMatchingData(result)
                setMessage(`🎯 Matching completado: ${result.stats.withMatches} coincidencias encontradas`)
                setMessageType('success')
            } else {
                setMessage(`❌ Error en matching: ${result.error}`)
                setMessageType('error')
            }
        } catch (error) {
            setMessage(`❌ Error inesperado en matching: ${error.message}`)
            setMessageType('error')
        } finally {
            setMatching(false)
            setTimeout(() => setMessage(''), 5000)
        }
    }

    const processEnrichment = async () => {
        if (!matchingData?.success || !matchingData?.results) return

        setEnriching(true)
        setMessage('📡 Enriqueciendo datos con API...')
        setMessageType('info')

        try {
            console.log('📡 Iniciando enriquecimiento con:', matchingData.results.length, 'resultados')

            const result = await ApiEnrichmentService.enrichMatchingResults(
                matchingData.results,
                (progress) => {
                    setMessage(`Enriqueciendo datos: ${progress.processed}/${progress.total} (${progress.percentage}%)`)
                }
            )

            if (result.success) {
                setEnrichedData(result)
                setMessage(`✅ Enriquecimiento completado: ${result.stats.enrichedSuccessfully} vehículos enriquecidos`)
                setMessageType('success')
            } else {
                setMessage(`❌ Error en enriquecimiento: ${result.error}`)
                setMessageType('error')
            }
        } catch (error) {
            setMessage(`❌ Error inesperado en enriquecimiento: ${error.message}`)
            setMessageType('error')
        } finally {
            setEnriching(false)
            setTimeout(() => setMessage(''), 5000)
        }
    }

    // Funciones de exportación
    const showGoogleSheetsExportDialog = () => {
        setShowGoogleSheetsDialog(true)
        setGoogleSheetsUrl('')
        setGoogleSheetsUrlError('')
    }

    const exportToCSV = async () => {
        if (!enrichedData?.success || !enrichedData?.data) return

        setExporting(true)
        setMessage('📄 Exportando a CSV...')
        setMessageType('info')

        try {
            const result = await GoogleSheetsService.exportToGoogleSheets(
                enrichedData.data,
                processedData.stats,
                {
                    filename: `vehiculos_voonda_${new Date().toISOString().split('T')[0]}.csv`
                }
            )

            if (result.success) {
                setExportResult(result)
                setMessage(`✅ CSV exportado: ${result.recordCount} vehículos en ${result.filename}`)
                setMessageType('success')
            } else {
                setMessage(`❌ Error en exportación CSV: ${result.error}`)
                setMessageType('error')
            }
        } catch (error) {
            setMessage(`❌ Error inesperado en exportación CSV: ${error.message}`)
            setMessageType('error')
        } finally {
            setExporting(false)
            setTimeout(() => setMessage(''), 8000)
        }
    }

    const exportToSpecificGoogleSheet = async () => {
        if (!googleSheetsUrl.trim()) {
            setGoogleSheetsUrlError('Por favor ingresa un link de Google Sheets')
            return
        }

        // Validar URL
        const validation = GoogleSheetsService.validateGoogleSheetUrl(googleSheetsUrl)
        if (!validation.valid) {
            setGoogleSheetsUrlError(validation.error)
            return
        }

        setShowGoogleSheetsDialog(false)
        setExporting(true)
        setMessage('📊 Creando nueva hoja en tu Google Sheets...')
        setMessageType('info')

        try {
            const result = await GoogleSheetsService.exportToSpecificGoogleSheet(
                enrichedData.data,
                processedData.stats,
                googleSheetsUrl
            )

            if (result.success) {
                setExportResult(result)
                if (result.mode === 'simulation') {
                    setMessage(`✅ Datos preparados para Google Sheets. Se creará la hoja "${result.sheetName}" en tu documento. CSV descargado como respaldo: ${result.fallbackFile}`)
                } else {
                    setMessage(`✅ Nueva hoja "${result.sheetName}" creada exitosamente en tu Google Sheets con ${result.recordCount} vehículos`)
                }
                setMessageType('success')
            } else {
                setMessage(`❌ Error exportando a Google Sheets: ${result.error}`)
                setMessageType('error')
            }
        } catch (error) {
            setMessage(`❌ Error inesperado exportando a Google Sheets: ${error.message}`)
            setMessageType('error')
        } finally {
            setExporting(false)
            setTimeout(() => setMessage(''), 10000)
        }
    }

    const exportToExcel = async () => {
        if (!enrichedData || !enrichedData.data) {
            setMessage('❌ No hay datos enriquecidos para exportar')
            setMessageType('error')
            return
        }

        setExportingExcel(true)
        setMessage('📊 Generando archivo Excel...')
        setMessageType('info')

        try {
            const result = ExcelExportService.generateExcelFile(
                enrichedData.data,
                'vehiculos_voonda_export'
            )

            if (result.success) {
                setExcelExportResult(result)
                setMessage(`✅ Excel generado: ${result.filename} (${result.stats.totalRecords} registros, ${result.stats.totalColumns} columnas)`)
                setMessageType('success')
            } else {
                setMessage(`❌ Error generando Excel: ${result.error}`)
                setMessageType('error')
            }
        } catch (error) {
            setMessage(`❌ Error inesperado generando Excel: ${error.message}`)
            setMessageType('error')
        } finally {
            setExportingExcel(false)
            setTimeout(() => setMessage(''), 8000)
        }
    }

    // Funciones auxiliares
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const removeFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId))
        setProcessedData(null)
        setMatchingData(null)
        setEnrichedData(null)
        setExportResult(null)
        setExcelExportResult(null)
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom color="primary">
                    Procesamiento de Vehículos
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Sigue estos pasos para procesar, hacer matching y enriquecer datos de vehículos
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
                                                backgroundColor: index < activeStep ? 'primary.main' : 'transparent',
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
            {(processing || matching || enriching || exporting || exportingExcel || uploading) && (
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
                        Ingresa el link de tu Google Sheets donde quieres que se cree una nueva hoja con los datos procesados.
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        ✨ <strong>¿Qué va a pasar?</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        • Se creará una nueva hoja en tu documento de Google Sheets<br />
                        • La hoja incluirá todos los datos procesados: Excel original + matching + enriquecimiento<br />
                        • Se descargará un CSV como respaldo<br />
                        • El archivo original no se modificará
                    </Typography>

                    <TextField
                        fullWidth
                        label="Link de Google Sheets"
                        placeholder="https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit"
                        value={googleSheetsUrl}
                        onChange={(e) => {
                            setGoogleSheetsUrl(e.target.value)
                            setGoogleSheetsUrlError('')
                        }}
                        error={!!googleSheetsUrlError}
                        helperText={googleSheetsUrlError || 'Pega aquí el link completo de tu Google Sheets'}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="caption" color="text.secondary">
                        💡 <strong>Tip:</strong> Asegúrate de que el Google Sheets esté compartido para que puedas editarlo.
                    </Typography>
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
    )
}

export default UploadPage