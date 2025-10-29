import React, { useEffect, useState } from 'react'
import { supabase } from '../../config/supabase'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'
import { JumboCard } from '@jumbo/components'
import { useJumboDialog } from '@jumbo/components/JumboDialog/hooks/useJumboDialog'
import { Box, Switch, FormControlLabel, Typography, Button, TextField, Chip } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

const AdminBot = () => {
    const [config, setConfig] = useState({
        bot_enabled: true,
        start_time: '08:00',
        end_time: '20:00',
        prompt: '',
        ignore_schedule: false
    })
    const [loading, setLoading] = useState(true)
    const { showDialog } = useJumboDialog()

    // Obtener última configuración al cargar
    useEffect(() => {
        fetchConfig()
    }, [])

    async function fetchConfig() {
        const { data, error } = await supabase
            .from('agent_config')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error) {
            console.error('Error al obtener configuración:', error.message)
            showDialog({
                title: 'Error',
                content: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ErrorIcon color='error' />
                        <Typography>No se pudo obtener la configuración inicial.</Typography>
                    </Box>
                ),
                actions: <Button variant='contained'>Entendido</Button>
            })
        } else if (data) {
            setConfig({
                bot_enabled: data.bot_enabled,
                start_time: data.start_time || '08:00',
                end_time: data.end_time || '20:00',
                prompt: data.prompt || '',
                ignore_schedule: !data.start_time && !data.end_time
            })
        }
        setLoading(false)
    }

    // Guardar nueva configuración
    async function saveConfig() {
        if (!config.prompt.trim()) {
            showDialog({
                title: 'Error',
                content: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ErrorIcon color='error' />
                        <Typography>El prompt no puede estar vacío</Typography>
                    </Box>
                ),
                actions: <Button variant='contained'>Entendido</Button>
            })
            return
        }

        const payload = {
            bot_enabled: config.bot_enabled,
            start_time: config.ignore_schedule ? null : config.start_time,
            end_time: config.ignore_schedule ? null : config.end_time,
            prompt: config.prompt,
            created_by: 'Lucas Martinez', // Valor fijo en esta instancia
            agent_phone: '5491164229109' // Valor fijo en esta instancia
        }

        const { error } = await supabase.from('agent_config').insert([payload])

        if (error) {
            showDialog({
                title: 'Error al guardar',
                content: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ErrorIcon color='error' />
                        <Typography>{error.message}</Typography>
                    </Box>
                ),
                actions: <Button variant='contained'>Entendido</Button>
            })
        } else {
            showDialog({
                title: '¡Guardado exitoso!',
                content: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircleIcon color='success' />
                        <Typography>Configuración actualizada correctamente</Typography>
                    </Box>
                ),
                actions: (
                    <Button variant='contained' color='success'>
                        ¡Perfecto!
                    </Button>
                )
            })
            fetchConfig() // Refresca la UI con la última configuración
        }
    }

    // Función para evaluar si el bot está activo
    function isBotActive() {
        if (!config.bot_enabled) return false
        if (config.ignore_schedule) return true

        const now = new Date()
        const currentMinutes = now.getHours() * 60 + now.getMinutes()

        const [startHour, startMin] = config.start_time.split(':').map(Number)
        const [endHour, endMin] = config.end_time.split(':').map(Number)

        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin

        if (startMinutes <= endMinutes) {
            // Caso normal: dentro del mismo día
            return currentMinutes >= startMinutes && currentMinutes <= endMinutes
        } else {
            // Caso cruzando medianoche
            return currentMinutes >= startMinutes || currentMinutes <= endMinutes
        }
    }

    if (loading) return <div className='p-4'>Cargando configuración...</div>

    return (
        <Box sx={{ maxWidth: '900px', mx: 'auto', p: 2 }}>
            {/* Header Card */}
            <JumboCard
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img src='/assets/images/logo.png' alt='Logo' style={{ height: 40 }} />
                        <Typography variant='h4' component='h1' sx={{ fontWeight: 600 }}>
                            Configuración del Bot
                        </Typography>
                    </Box>
                }
                action={<SettingsIcon sx={{ color: 'text.secondary' }} />}
                contentWrapper
                sx={{ mb: 3 }}
            >
                <Typography variant='body2' color='text.secondary'>
                    Administra el comportamiento y configuración de tu agente de IA
                </Typography>
            </JumboCard>

            {/* Status Alert Card */}
            <JumboCard
                title='Estado del Bot'
                contentWrapper
                sx={{
                    mb: 3,
                    bgcolor: isBotActive() ? 'success.main' : 'error.main',
                    color: 'white'
                }}
                action={
                    <Chip
                        label={isBotActive() ? 'ACTIVO' : 'INACTIVO'}
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                }
            >
                <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {isBotActive()
                        ? 'El bot está ACTIVO y respondiendo automáticamente'
                        : 'El bot está INACTIVO - respuestas manuales requeridas'}
                </Typography>
            </JumboCard>

            {/* Toggle Bot */}
            <JumboCard title='Configuración Principal' action={<SettingsIcon />} contentWrapper sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={config.bot_enabled}
                            onChange={(e) => setConfig({ ...config, bot_enabled: e.target.checked })}
                            color='primary'
                            size='large'
                        />
                    }
                    label={
                        <Box>
                            <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                Bot habilitado
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                Si desactivás esta opción, las respuestas deberán ser manuales ya que el agente de IA no intervendrá más en ninguna conversación.
                            </Typography>
                        </Box>
                    }
                    sx={{ mb: 2, alignItems: 'flex-start' }}
                />
            </JumboCard>

            {config.bot_enabled && (
                <JumboCard title='Configuración de Horarios' action={<AccessTimeIcon />} contentWrapper sx={{ mb: 3 }}>
                    {/* Ignorar horario */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={config.ignore_schedule}
                                onChange={(e) => setConfig({ ...config, ignore_schedule: e.target.checked })}
                                color='primary'
                            />
                        }
                        label={
                            <Box>
                                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                    Siempre activo
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    Si desactivás esta opción, el bot solo funcionará dentro de la franja horaria definida en los campos de inicio y fin.
                                </Typography>
                            </Box>
                        }
                        sx={{ mb: 3, alignItems: 'flex-start' }}
                    />

                    {!config.ignore_schedule && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            {/* Horario inicio */}
                            <Box>
                                <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                                    Horario de inicio
                                </Typography>
                                <Flatpickr
                                    value={config.start_time}
                                    options={{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }}
                                    onChange={(date) =>
                                        setConfig({
                                            ...config,
                                            start_time: date.length
                                                ? date[0].toLocaleTimeString('it-IT', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : ''
                                        })
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                    disabled={config.ignore_schedule}
                                />
                            </Box>

                            {/* Horario fin */}
                            <Box>
                                <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                                    Horario de fin
                                </Typography>
                                <Flatpickr
                                    value={config.end_time}
                                    options={{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }}
                                    onChange={(date) =>
                                        setConfig({
                                            ...config,
                                            end_time: date.length
                                                ? date[0].toLocaleTimeString('it-IT', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : ''
                                        })
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                    disabled={config.ignore_schedule}
                                />
                            </Box>
                        </Box>
                    )}
                </JumboCard>
            )}

            {/* Prompt */}
            <JumboCard
                title='Prompt Principal'
                subheader='Define el comportamiento y personalidad de tu agente de IA'
                action={<EditIcon />}
                contentWrapper
                sx={{ mb: 3 }}
            >
                <TextField
                    multiline
                    rows={6}
                    value={config.prompt}
                    onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
                    placeholder='Escribe aquí las instrucciones para tu agente de IA...'
                    variant='outlined'
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px'
                        }
                    }}
                />
                <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
                    💡 Tip: Sé específico sobre el tono, estilo y información que debe manejar el bot
                </Typography>
            </JumboCard>

            {/* Botón guardar */}
            <Box sx={{ textAlign: 'center' }}>
                <Button
                    onClick={saveConfig}
                    variant='contained'
                    size='large'
                    startIcon={<SaveIcon />}
                    sx={{
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 10px 2px rgba(33, 203, 243, .3)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Guardar configuración
                </Button>
            </Box>
        </Box>
    )
}

export default AdminBot