import React from 'react'
import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default'
            }}
        >
            <Card sx={{ maxWidth: 600, width: '100%', margin: 3 }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Voonda Admin Panel
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph>
                        Sistema de gestión de vehículos, vendedores y operaciones
                    </Typography>

                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/auth/login-1')}
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/voonda/vehiculos')}
                        >
                            Ver Vehículos
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            Funcionalidades disponibles:
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => navigate('/voonda/vehiculos')}
                            >
                                Vehículos
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => navigate('/voonda/vendedores')}
                            >
                                Vendedores
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => navigate('/voonda/compradores')}
                            >
                                Compradores
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => navigate('/voonda/operaciones')}
                            >
                                Operaciones
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default HomePage