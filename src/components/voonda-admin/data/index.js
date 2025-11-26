// Función para generar las opciones basadas en la ruta base
const getVoondaAdminOptions = (basePath = '/voonda/admin') => [
  {
    label: 'AGENTE',
    children: [
      {
        label: 'Horarios de Atención',
        path: `${basePath}/horarios-atencion`,
        icon: 'schedule',
      },
      {
        label: 'Prueba',
        path: `${basePath}/prueba`,
        icon: 'test',
      },
    ],
  },
];

// Para retrocompatibilidad, exportamos también la versión estática
const voondaAdminOptions = getVoondaAdminOptions();

export { voondaAdminOptions, getVoondaAdminOptions };
