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
    TextField
} from '@mui/material'
import { Container } from '@mui/material'
import { CONTAINER_MAX_WIDTH } from '@/config/layouts'
import { ContentLayout } from '@/layouts/ContentLayout'
import { PageHeader } from '@/components/PageHeader'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ProcessIcon from '@mui/icons-material/Settings'
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

            const result = await ExcelProcessingService.parseExcelFile(fileItem.file)

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
        if (!processedData?.success || !processedData?.data) return

        setMatching(true)
        setMessage('🔍 Buscando coincidencias en catálogo...')
        setMessageType('info')

        try {
            console.log('🔍 Iniciando matching con:', processedData.data.length, 'vehículos')

            const result = await VehicleMatchingService.findMatches(processedData.data)

            if (result.success) {
                setMatchingData(result)
                setMessage(`🎯 Matching completado: ${result.stats.totalMatches} coincidencias encontradas`)
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
        <ContentLayout>
            <Container maxWidth={CONTAINER_MAX_WIDTH}>
                <PageHeader
                    title="Procesamiento de Vehículos"
                    subheader="Sube un archivo Excel para procesar, hacer matching y enriquecer datos de vehículos"
                />

                {/* Área de subida de archivos */}
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

                        {/* Lista de archivos */}
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {!processedData && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => processExcelFile(file)}
                                                    disabled={processing}
                                                    startIcon={<ProcessIcon />}
                                                >
                                                    {processing ? 'Procesando...' : 'Procesar Excel'}
                                                </Button>
                                            )}
                                            <IconButton onClick={() => removeFile(file.id)} size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Pipeline de procesamiento */}
                {processedData && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                🚀 Pipeline de Procesamiento
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                {/* Paso 1: Excel procesado */}
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Excel Procesado"
                                    color="success"
                                    variant="filled"
                                />

                                {/* Paso 2: Matching */}
                                <Button
                                    onClick={processMatching}
                                    variant={matchingData ? "outlined" : "contained"}
                                    color={matchingData ? "success" : "primary"}
                                    disabled={processing || matching || enriching || exporting || exportingExcel}
                                    startIcon={matchingData ? <CheckCircleIcon /> : <ProcessIcon />}
                                    size="small"
                                >
                                    {matching ? 'Procesando...' : (matchingData ? 'Matching Completado' : 'Iniciar Matching')}
                                </Button>

                                {/* Paso 3: Enriquecimiento */}
                                {matchingData && (
                                    <Button
                                        onClick={processEnrichment}
                                        variant={enrichedData ? "outlined" : "contained"}
                                        color={enrichedData ? "success" : "primary"}
                                        disabled={processing || matching || enriching || exporting || exportingExcel}
                                        startIcon={enrichedData ? <CheckCircleIcon /> : <ProcessIcon />}
                                        size="small"
                                    >
                                        {enriching ? 'Enriqueciendo...' : (enrichedData ? 'Enriquecimiento Completado' : 'Enriquecer Datos')}
                                    </Button>
                                )}

                                {/* Paso 4: Exportación */}
                                {enrichedData && (
                                    <>
                                        <Button
                                            onClick={exportToCSV}
                                            variant="contained"
                                            color="info"
                                            disabled={processing || matching || enriching || exporting || exportingExcel}
                                            startIcon={<VisibilityIcon />}
                                            size="small"
                                        >
                                            {exporting ? 'Exportando CSV...' : 'Exportar CSV'}
                                        </Button>

                                        <Button
                                            onClick={showGoogleSheetsExportDialog}
                                            variant="contained"
                                            color="secondary"
                                            disabled={processing || matching || enriching || exporting || exportingExcel}
                                            startIcon={<VisibilityIcon />}
                                            size="small"
                                        >
                                            Exportar a Google Sheets
                                        </Button>

                                        <Button
                                            onClick={exportToExcel}
                                            variant="contained"
                                            color="success"
                                            disabled={processing || matching || enriching || exporting || exportingExcel}
                                            startIcon={<InsertDriveFileIcon />}
                                            size="small"
                                        >
                                            {exportingExcel ? 'Generando Excel...' : 'Exportar Excel'}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                )}

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

                {/* Resultados de exportación */}
                {(exportResult || excelExportResult) && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                📊 Resultados de Exportación
                            </Typography>

                            {exportResult && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        📄 Exportación CSV/Google Sheets
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        <Chip label={`${exportResult.recordCount} registros`} size="small" color="primary" />
                                        <Chip label={exportResult.filename} size="small" color="success" />
                                    </Stack>
                                </Box>
                            )}

                            {excelExportResult && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        📊 Exportación Excel
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        <Chip label={`${excelExportResult.stats.totalRecords} registros`} size="small" color="primary" />
                                        <Chip label={`${excelExportResult.stats.totalColumns} columnas`} size="small" color="secondary" />
                                        <Chip label={excelExportResult.filename} size="small" color="success" />
                                    </Stack>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
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
        </ContentLayout>
    )
}

export default UploadPage