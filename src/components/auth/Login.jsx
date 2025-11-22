import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Container,
    Link
} from '@mui/material'
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Login as LoginIcon
} from '@mui/icons-material'

const Login = () => {
    const { login, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [loginError, setLoginError] = useState('')

    // Obtener la ruta de redirección o usar la ruta por defecto
    const from = location.state?.from?.pathname || '/vehiculos'

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Limpiar errores cuando el usuario comience a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
        if (loginError) {
            setLoginError('')
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email) {
            newErrors.email = 'El email es requerido'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido'
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida'
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            const result = await login(formData)

            if (result.success) {
                navigate(from, { replace: true })
            } else {
                setLoginError(result.error || 'Error al iniciar sesión')
            }
        } catch (error) {
            setLoginError('Error de conexión. Por favor, intenta nuevamente.')
        }
    }

    // Función para autocompletar con credenciales de prueba (comentada para producción)
    // const fillTestCredentials = () => {
    //     setFormData({
    //         email: 'admin@voonda.com', 
    //         password: 'admin123'
    //     })
    //     setErrors({})
    //     setLoginError('')
    // }

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 2
                    }}
                >
                    {/* Logo/Título */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <img
                            src="/assets/images/voonda-logo.png"
                            alt="Voonda"
                            width={110}
                            height={35}
                            style={{
                                maxWidth: '200px',
                                height: 'auto',
                                marginBottom: '16px'
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            Panel de Administración
                        </Typography>
                    </Box>

                    {/* Mensaje de error */}
                    {loginError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {loginError}
                        </Alert>
                    )}

                    {/* Formulario de login */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isLoading}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isLoading}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                            sx={{
                                py: 1.5,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </Box>

                    {/* Información de conexión API */}
                    <Box sx={{ mt: 4, p: 2, bgcolor: 'info.50', borderRadius: 1, border: 1, borderColor: 'info.200' }}>
                        <Typography variant="caption" color="success.main" sx={{ mb: 1, display: 'block' }}>
                            🔗 Conectado a API: api.fratelli.voonda.net
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                            Usa tus credenciales de Voonda para acceder al sistema
                        </Typography>

                        {/* Botón de credenciales de prueba comentado para producción */}
                        {/* <Button
                            variant="outlined"
                            size="small"
                            onClick={fillTestCredentials}
                            disabled={isLoading}
                            sx={{ mt: 1 }}
                        >
                            Usar credenciales de prueba
                        </Button> */}
                    </Box>

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                            © {new Date().getFullYear()} Voonda. Todos los derechos reservados.
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default Login