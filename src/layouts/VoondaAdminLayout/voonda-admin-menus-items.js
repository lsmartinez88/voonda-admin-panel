export const getVoondaAdminMenus = (basePath = "/voonda/admin") => {
  return [
    {
      label: "Configuración de Empresa",
      children: [
        {
          label: "Horarios de Atención",
          path: `${basePath}/horarios-atencion`,
          icon: "clock",
        },
      ],
    },
    {
      label: "Configuración",
      children: [
        {
          label: "Prueba",
          path: `${basePath}/prueba`,
          icon: "test",
        },
      ],
    },
  ];
};
