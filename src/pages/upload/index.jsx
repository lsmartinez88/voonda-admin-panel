import React, { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { FaUpload, FaFileExcel, FaCheckCircle, FaExclamationTriangle, FaRocket } from 'react-icons/fa'
import { JumboCard } from '@jumbo/components'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { Box, Button, Typography, LinearProgress, Alert, Chip } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import SyncIcon from '@mui/icons-material/Sync'
import DescriptionIcon from '@mui/icons-material/Description'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

const UploadAutos = () => {
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)
    const { showDialog } = useJumboDialog()

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            setMessage('')
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            setFile(droppedFile)
            setMessage('')
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setMessage('Seleccioná un archivo primero.')
            return
        }

        setUploading(true)
        setUploadProgress(0)
        setMessage('Iniciando subida...')

        // Simular progreso para mejor UX
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 10, 80))
        }, 200)

        const fileExt = file.name.split('.').pop()
        const fileName = `stock_actual.${fileExt}`
        const filePath = `importaciones/${fileName}`

        let { error } = await supabase.storage
            .from('importaciones')
            .update(filePath, file, { contentType: file.type })

        if (error && /Not Found/i.test(error.message)) {
            // Si no existe, lo creamos
            ; ({ error } = await supabase.storage
                .from('importaciones')
                .upload(filePath, file, { contentType: file.type }))
        }

        clearInterval(progressInterval)
        setUploadProgress(90)

        if (error) {
            setMessage(`Error al subir: ${error.message}`)
            setUploading(false)
            setUploadProgress(0)
        } else {
            setUploadProgress(95)
            setMessage('Archivo subido, disparando workflow...')

            try {
                await fetch('https://voonda.app.n8n.cloud/webhook/890afa62-36b0-4eb6-a4d8-ea0c705b72bc', {
                    method: 'GET'
                })
                setUploadProgress(100)
                setMessage('¡Proceso completado exitosamente!')
                showDialog({
                    title: 'Éxito',
                    content: '¡El archivo se procesó correctamente!'
                })
            } catch (e) {
                setUploadProgress(100)
                setMessage(`Archivo subido, pero falló el webhook: ${e.message}`)
                showDialog({
                    title: 'Advertencia',
                    content: `Archivo subido, pero falló el webhook: ${e.message}`
                })
            }
        }

        setUploading(false)

        // Reset after 3 seconds
        setTimeout(() => {
            setUploadProgress(0)
            setFile(null)
        }, 3000)
    }

    const getMessageIcon = () => {
        if (message.includes('Error') || message.includes('falló')) {
            return <FaExclamationTriangle className='text-red-500' />
        } else if (message.includes('completado') || message.includes('correctamente')) {
            return <FaCheckCircle className='text-green-500' />
        } else {
            return <FaRocket className='text-blue-500' />
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 2 }}>
            {/* Header Card */}
            <JumboCard
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CloudUploadIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                        <Typography variant='h4' component='h1' sx={{ fontWeight: 600 }}>
                            Subir Archivo de Vehículos
                        </Typography>
                    </Box>
                }
                subheader='Importa tu inventario desde un archivo Excel'
                contentWrapper
                sx={{ mb: 3 }}
            >
                {/* Instrucciones */}
                <Alert
                    severity='info'
                    sx={{
                        borderRadius: '12px',
                        '& .MuiAlert-message': {
                            width: '100%'
                        }
                    }}
                >
                    <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>
                        📋 Instrucciones:
                    </Typography>
                    <Box component='ul' sx={{ m: 0, pl: 2 }}>
                        <li>Subí un archivo Excel (.xlsx) con los datos de vehículos</li>
                        <li>El archivo se procesará automáticamente con IA</li>
                        <li>Los vehículos se sincronizarán con Google Sheets</li>
                        <li>Tamaño máximo: 10MB</li>
                    </Box>
                </Alert>
            </JumboCard>

            {/* Zona de upload */}
            <JumboCard title='Zona de Upload' action={<DescriptionIcon />} contentWrapper sx={{ mb: 3 }}>
                <Box
                    sx={{
                        border: 2,
                        borderStyle: 'dashed',
                        borderRadius: '16px',
                        p: 6,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        borderColor: dragActive ? 'primary.main' : 'grey.300',
                        backgroundColor: dragActive ? 'primary.50' : 'background.paper',
                        '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'grey.50'
                        }
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {!file ? (
                        <>
                            <CloudUploadIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant='h5' sx={{ fontWeight: 600, mb: 1 }}>
                                Arrastra tu archivo aquí
                            </Typography>
                            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                                O haz clic para seleccionar un archivo Excel
                            </Typography>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant='contained'
                                size='large'
                                startIcon={<FaUpload />}
                                sx={{
                                    borderRadius: '12px',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600
                                }}
                            >
                                Seleccionar Archivo
                            </Button>
                            <input
                                ref={fileInputRef}
                                type='file'
                                accept='.xlsx,.xls'
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <FaFileExcel style={{ fontSize: '64px', color: '#10b981' }} />
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                    {file.name}
                                </Typography>
                                <Chip label={formatFileSize(file.size)} size='small' color='primary' variant='outlined' />
                            </Box>

                            {/* Progress bar */}
                            {uploading && (
                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <LinearProgress
                                        variant='determinate'
                                        value={uploadProgress}
                                        sx={{
                                            height: 8,
                                            borderRadius: '4px',
                                            backgroundColor: 'grey.200'
                                        }}
                                    />
                                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                                        {uploadProgress}% completado
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    variant='contained'
                                    color='success'
                                    size='large'
                                    startIcon={uploading ? null : <FaRocket />}
                                    sx={{
                                        borderRadius: '12px',
                                        px: 4,
                                        fontWeight: 600
                                    }}
                                >
                                    {uploading ? 'Procesando...' : 'Procesar Archivo'}
                                </Button>

                                {!uploading && (
                                    <Button
                                        onClick={() => setFile(null)}
                                        variant='outlined'
                                        size='large'
                                        sx={{
                                            borderRadius: '12px',
                                            px: 3,
                                            fontWeight: 600
                                        }}
                                    >
                                        Cambiar Archivo
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Mensaje de estado */}
                {message && (
                    <Alert
                        severity={
                            message.includes('Error') || message.includes('falló')
                                ? 'error'
                                : message.includes('completado') || message.includes('correctamente')
                                    ? 'success'
                                    : 'info'
                        }
                        icon={getMessageIcon()}
                        sx={{ mt: 3, borderRadius: '12px' }}
                    >
                        <Typography variant='body2' sx={{ fontWeight: 500 }}>
                            {message}
                        </Typography>
                    </Alert>
                )}
            </JumboCard>

            {/* Información adicional */}
            <JumboCard title='🤖 ¿Qué sucede después?' subheader='Proceso automatizado de IA' contentWrapper>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 3
                    }}
                >
                    <JumboCard contentWrapper sx={{ textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2
                            }}
                        >
                            <AutoFixHighIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
                        </Box>
                        <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
                            Procesamiento IA
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Los datos se enriquecen automáticamente con información adicional
                        </Typography>
                    </JumboCard>

                    <JumboCard contentWrapper sx={{ textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2
                            }}
                        >
                            <FaCheckCircle style={{ color: '#22c55e', fontSize: '20px' }} />
                        </Box>
                        <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
                            Validación
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Se verifican y normalizan marcas, modelos y características
                        </Typography>
                    </JumboCard>

                    <JumboCard contentWrapper sx={{ textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'rgba(168, 85, 247, 0.1)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2
                            }}
                        >
                            <SyncIcon sx={{ color: '#a855f7', fontSize: 24 }} />
                        </Box>
                        <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
                            Sincronización
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Los vehículos se actualizan en la base de datos y Google Sheets
                        </Typography>
                    </JumboCard>
                </Box>
            </JumboCard>
        </Box>
    )
}

export default UploadAutos