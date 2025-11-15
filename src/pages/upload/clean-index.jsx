import React, { useState, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Alert,
    LinearProgress,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Divider,
    Stack,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    CloudUpload as CloudUploadIcon,
    GetApp as GetAppIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    FileUpload as FileUploadIcon,
    Assignment as AssignmentIcon,
    Settings as SettingsIcon,
    FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";

// Importar nuestros servicios
import { excelProcessingService } from "../../services/excelProcessingService";
import { vehicleMatchingService } from "../../services/vehicleMatchingService";
import { apiEnrichmentService } from "../../services/apiEnrichmentService";
import { googleSheetsService } from "../../services/googleSheetsService";
import { excelExportService } from "../../services/excelExportService";

const STEPS = [
    {
        label: "Subir Archivo Excel",
        description: "Seleccionar y procesar archivo de vehículos",
        icon: <FileUploadIcon />,
    },
    {
        label: "Matching de Vehículos",
        description: "Identificar y categorizar vehículos",
        icon: <AssignmentIcon />,
    },
    {
        label: "Enriquecimiento API",
        description: "Obtener datos adicionales de APIs externas",
        icon: <SettingsIcon />,
    },
    {
        label: "Exportar Resultados",
        description: "Descargar datos enriquecidos",
        icon: <FileDownloadIcon />,
    },
];

function UploadPage() {
    // Estados principales
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Estados de datos
    const [excelData, setExcelData] = useState(null);
    const [matchedVehicles, setMatchedVehicles] = useState(null);
    const [enrichedData, setEnrichedData] = useState(null);
    const [statistics, setStatistics] = useState(null);

    // Estados de progreso
    const [uploadProgress, setUploadProgress] = useState(0);
    const [matchingProgress, setMatchingProgress] = useState(0);
    const [enrichmentProgress, setEnrichmentProgress] = useState(0);

    const fileInputRef = useRef(null);

    // Configuración de dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
        },
        maxFiles: 1,
        onDrop: handleFileUpload,
    });

    // Función para manejar la subida de archivos
    async function handleFileUpload(files) {
        if (files.length === 0) return;

        const file = files[0];
        setLoading(true);
        setError(null);
        setUploadProgress(0);

        try {
            // Etapa 1: Procesar Excel
            setUploadProgress(30);
            const result = await excelProcessingService.parseExcelFile(file);

            if (!result || !result.length) {
                throw new Error("No se pudieron procesar los datos del Excel");
            }

            setUploadProgress(100);
            setExcelData(result);
            setActiveStep(1);
            setSuccess(`✅ Archivo procesado: ${result.length} registros encontrados`);

        } catch (err) {
            setError(`❌ Error procesando Excel: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Función para hacer matching de vehículos
    async function handleVehicleMatching() {
        if (!excelData) return;

        setLoading(true);
        setError(null);
        setMatchingProgress(0);

        try {
            const result = await vehicleMatchingService.processVehicles(excelData, (progress) => {
                setMatchingProgress(progress);
            });

            setMatchedVehicles(result.processedVehicles);
            setStatistics(result.statistics);
            setActiveStep(2);
            setSuccess(`✅ Matching completado: ${result.statistics.matched} vehículos identificados`);

        } catch (err) {
            setError(`❌ Error en matching: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Función para enriquecimiento por API
    async function handleApiEnrichment() {
        if (!matchedVehicles) return;

        setLoading(true);
        setError(null);
        setEnrichmentProgress(0);

        try {
            const result = await apiEnrichmentService.enrichVehicles(matchedVehicles, (progress) => {
                setEnrichmentProgress(progress);
            });

            setEnrichedData(result.enrichedVehicles);
            setActiveStep(3);
            setSuccess(`✅ Enriquecimiento completado: ${result.statistics.enriched} vehículos enriquecidos`);

        } catch (err) {
            setError(`❌ Error en enriquecimiento: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Función para exportar a Excel
    async function handleExcelExport() {
        if (!enrichedData) return;

        setLoading(true);
        try {
            await excelExportService.exportToExcel(enrichedData);
            setSuccess("✅ Archivo Excel descargado exitosamente");
        } catch (err) {
            setError(`❌ Error exportando Excel: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Función para exportar a Google Sheets
    async function handleGoogleSheetsExport() {
        if (!enrichedData) return;

        setLoading(true);
        try {
            await googleSheetsService.exportToGoogleSheets(enrichedData);
            setSuccess("✅ Datos exportados a Google Sheets exitosamente");
        } catch (err) {
            setError(`❌ Error exportando a Google Sheets: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Función para resetear el proceso
    const handleReset = () => {
        setActiveStep(0);
        setExcelData(null);
        setMatchedVehicles(null);
        setEnrichedData(null);
        setStatistics(null);
        setError(null);
        setSuccess(null);
        setUploadProgress(0);
        setMatchingProgress(0);
        setEnrichmentProgress(0);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom color="primary">
                    Sistema de Procesamiento de Vehículos
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Sube un archivo Excel y obtén datos enriquecidos de vehículos
                </Typography>
            </Box>

            {/* Mostrar errores y éxitos */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Panel del Stepper */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {/* Paso 1: Subir Archivo */}
                            <Step>
                                <StepLabel
                                    icon={<FileUploadIcon />}
                                    error={activeStep === 0 && error}
                                    completed={activeStep > 0}
                                >
                                    Subir Archivo Excel
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Selecciona un archivo Excel (.xlsx, .xls) con datos de vehículos
                                    </Typography>

                                    <Box
                                        {...getRootProps()}
                                        sx={{
                                            border: "2px dashed",
                                            borderColor: isDragActive ? "primary.main" : "grey.400",
                                            borderRadius: 2,
                                            p: 3,
                                            textAlign: "center",
                                            cursor: "pointer",
                                            bgcolor: isDragActive ? "action.hover" : "background.paper",
                                            transition: "all 0.3s",
                                        }}
                                    >
                                        <input {...getInputProps()} ref={fileInputRef} />
                                        <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                                        <Typography variant="h6" gutterBottom>
                                            {isDragActive
                                                ? "Suelta el archivo aquí"
                                                : "Arrastra un archivo o haz clic para seleccionar"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Formatos soportados: .xlsx, .xls
                                        </Typography>
                                    </Box>

                                    {loading && activeStep === 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={uploadProgress}
                                                sx={{ mb: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                Procesando archivo... {uploadProgress}%
                                            </Typography>
                                        </Box>
                                    )}
                                </StepContent>
                            </Step>

                            {/* Paso 2: Matching */}
                            <Step>
                                <StepLabel
                                    icon={<AssignmentIcon />}
                                    error={activeStep === 1 && error}
                                    completed={activeStep > 1}
                                >
                                    Matching de Vehículos
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Identificar y categorizar vehículos en los datos
                                    </Typography>

                                    {excelData && (
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            📊 Registros para procesar: {excelData.length}
                                        </Typography>
                                    )}

                                    <Button
                                        variant="contained"
                                        onClick={handleVehicleMatching}
                                        disabled={!excelData || loading}
                                        startIcon={<AssignmentIcon />}
                                    >
                                        Iniciar Matching
                                    </Button>

                                    {loading && activeStep === 1 && (
                                        <Box sx={{ mt: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={matchingProgress}
                                                sx={{ mb: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                Procesando vehículos... {matchingProgress}%
                                            </Typography>
                                        </Box>
                                    )}
                                </StepContent>
                            </Step>

                            {/* Paso 3: Enriquecimiento */}
                            <Step>
                                <StepLabel
                                    icon={<SettingsIcon />}
                                    error={activeStep === 2 && error}
                                    completed={activeStep > 2}
                                >
                                    Enriquecimiento API
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Obtener información adicional de APIs externas
                                    </Typography>

                                    {statistics && (
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            🎯 Vehículos identificados: {statistics.matched}
                                        </Typography>
                                    )}

                                    <Button
                                        variant="contained"
                                        onClick={handleApiEnrichment}
                                        disabled={!matchedVehicles || loading}
                                        startIcon={<SettingsIcon />}
                                    >
                                        Enriquecer Datos
                                    </Button>

                                    {loading && activeStep === 2 && (
                                        <Box sx={{ mt: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={enrichmentProgress}
                                                sx={{ mb: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                Enriqueciendo datos... {enrichmentProgress}%
                                            </Typography>
                                        </Box>
                                    )}
                                </StepContent>
                            </Step>

                            {/* Paso 4: Exportar */}
                            <Step>
                                <StepLabel
                                    icon={<FileDownloadIcon />}
                                    error={activeStep === 3 && error}
                                    completed={false}
                                >
                                    Exportar Resultados
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="body2" sx={{ mb: 3 }}>
                                        Descarga los datos procesados y enriquecidos
                                    </Typography>

                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            onClick={handleExcelExport}
                                            disabled={!enrichedData || loading}
                                            startIcon={<GetAppIcon />}
                                        >
                                            Descargar Excel
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            onClick={handleGoogleSheetsExport}
                                            disabled={!enrichedData || loading}
                                            startIcon={<FileDownloadIcon />}
                                        >
                                            Exportar a Sheets
                                        </Button>
                                    </Stack>

                                    <Box sx={{ mt: 3 }}>
                                        <Button
                                            variant="text"
                                            onClick={handleReset}
                                            color="primary"
                                        >
                                            Procesar Nuevo Archivo
                                        </Button>
                                    </Box>
                                </StepContent>
                            </Step>
                        </Stepper>
                    </Paper>
                </Grid>

                {/* Panel de Estadísticas */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, height: "fit-content" }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            📊 Estadísticas del Proceso
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {excelData && (
                            <Card sx={{ mb: 2, bgcolor: "info.50" }}>
                                <CardContent sx={{ py: 2 }}>
                                    <Typography variant="body2" color="info.main">
                                        📄 Registros Cargados
                                    </Typography>
                                    <Typography variant="h4" color="info.dark">
                                        {excelData.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {statistics && (
                            <Card sx={{ mb: 2, bgcolor: "success.50" }}>
                                <CardContent sx={{ py: 2 }}>
                                    <Typography variant="body2" color="success.main">
                                        🎯 Vehículos Identificados
                                    </Typography>
                                    <Typography variant="h4" color="success.dark">
                                        {statistics.matched}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {((statistics.matched / excelData?.length) * 100).toFixed(1)}% de éxito
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {enrichedData && (
                            <Card sx={{ mb: 2, bgcolor: "warning.50" }}>
                                <CardContent sx={{ py: 2 }}>
                                    <Typography variant="body2" color="warning.main">
                                        🚀 Datos Enriquecidos
                                    </Typography>
                                    <Typography variant="h4" color="warning.dark">
                                        {enrichedData.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Listos para exportar
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {activeStep === 0 && (
                            <Alert severity="info">
                                Comienza subiendo un archivo Excel con datos de vehículos
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default UploadPage;