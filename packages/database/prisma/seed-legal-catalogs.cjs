const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const provinces = [
  {
    code: "ar-caba",
    name: "Ciudad Autonoma de Buenos Aires",
    province: "CABA",
    country: "Argentina",
    displayOrder: 10
  },
  {
    code: "ar-buenos-aires",
    name: "Buenos Aires",
    province: "Buenos Aires",
    country: "Argentina",
    displayOrder: 20
  },
  {
    code: "ar-catamarca",
    name: "Catamarca",
    province: "Catamarca",
    country: "Argentina",
    displayOrder: 30
  },
  { code: "ar-chaco", name: "Chaco", province: "Chaco", country: "Argentina", displayOrder: 40 },
  { code: "ar-chubut", name: "Chubut", province: "Chubut", country: "Argentina", displayOrder: 50 },
  {
    code: "ar-cordoba",
    name: "Cordoba",
    province: "Cordoba",
    country: "Argentina",
    displayOrder: 60
  },
  {
    code: "ar-corrientes",
    name: "Corrientes",
    province: "Corrientes",
    country: "Argentina",
    displayOrder: 70
  },
  {
    code: "ar-entre-rios",
    name: "Entre Rios",
    province: "Entre Rios",
    country: "Argentina",
    displayOrder: 80
  },
  {
    code: "ar-formosa",
    name: "Formosa",
    province: "Formosa",
    country: "Argentina",
    displayOrder: 90
  },
  { code: "ar-jujuy", name: "Jujuy", province: "Jujuy", country: "Argentina", displayOrder: 100 },
  {
    code: "ar-la-pampa",
    name: "La Pampa",
    province: "La Pampa",
    country: "Argentina",
    displayOrder: 110
  },
  {
    code: "ar-la-rioja",
    name: "La Rioja",
    province: "La Rioja",
    country: "Argentina",
    displayOrder: 120
  },
  {
    code: "ar-mendoza",
    name: "Mendoza",
    province: "Mendoza",
    country: "Argentina",
    displayOrder: 130
  },
  {
    code: "ar-misiones",
    name: "Misiones",
    province: "Misiones",
    country: "Argentina",
    displayOrder: 140
  },
  {
    code: "ar-neuquen",
    name: "Neuquen",
    province: "Neuquen",
    country: "Argentina",
    displayOrder: 150
  },
  {
    code: "ar-rio-negro",
    name: "Rio Negro",
    province: "Rio Negro",
    country: "Argentina",
    displayOrder: 160
  },
  { code: "ar-salta", name: "Salta", province: "Salta", country: "Argentina", displayOrder: 170 },
  {
    code: "ar-san-juan",
    name: "San Juan",
    province: "San Juan",
    country: "Argentina",
    displayOrder: 180
  },
  {
    code: "ar-san-luis",
    name: "San Luis",
    province: "San Luis",
    country: "Argentina",
    displayOrder: 190
  },
  {
    code: "ar-santa-cruz",
    name: "Santa Cruz",
    province: "Santa Cruz",
    country: "Argentina",
    displayOrder: 200
  },
  {
    code: "ar-santa-fe",
    name: "Santa Fe",
    province: "Santa Fe",
    country: "Argentina",
    displayOrder: 210
  },
  {
    code: "ar-santiago-del-estero",
    name: "Santiago del Estero",
    province: "Santiago del Estero",
    country: "Argentina",
    displayOrder: 220
  },
  {
    code: "ar-tierra-del-fuego",
    name: "Tierra del Fuego",
    province: "Tierra del Fuego",
    country: "Argentina",
    displayOrder: 230
  },
  {
    code: "ar-tucuman",
    name: "Tucuman",
    province: "Tucuman",
    country: "Argentina",
    displayOrder: 240
  },
  { code: "ar-federal", name: "Federal", province: null, country: "Argentina", displayOrder: 250 }
];

const forumTemplates = [
  {
    provinceCode: "ar-caba",
    code: "ar-caba-contencioso-administrativo-tributario-consumo",
    name: "Contencioso administrativo, tributario y de relaciones de consumo",
    displayOrder: 10
  },
  { provinceCode: "ar-caba", code: "ar-caba-electoral", name: "Electoral", displayOrder: 20 },
  {
    provinceCode: "ar-caba",
    code: "ar-caba-penal-juvenil-contravencional-faltas",
    name: "Penal, penal juvenil, contravencional y de faltas",
    displayOrder: 30
  },
  {
    provinceCode: "ar-buenos-aires",
    code: "ar-buenos-aires-civil-comercial",
    name: "Civil, comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-buenos-aires",
    code: "ar-buenos-aires-contencioso-administrativo",
    name: "Contencioso administrativo",
    displayOrder: 20
  },
  {
    provinceCode: "ar-buenos-aires",
    code: "ar-buenos-aires-familia",
    name: "De familia",
    displayOrder: 30
  },
  {
    provinceCode: "ar-buenos-aires",
    code: "ar-buenos-aires-responsabilidad-penal-juvenil",
    name: "De responsabilidad penal juvenil",
    displayOrder: 40
  },
  {
    provinceCode: "ar-buenos-aires",
    code: "ar-buenos-aires-justicia-paz",
    name: "Justicia de paz",
    displayOrder: 50
  },
  {
    provinceCode: "ar-buenos-aires",
    code: "ar-buenos-aires-laboral",
    name: "Laboral",
    displayOrder: 60
  },
  {
    provinceCode: "ar-buenos-aires",
    code: "ar-buenos-aires-penal",
    name: "Penal",
    displayOrder: 70
  },
  { provinceCode: "ar-catamarca", code: "ar-catamarca-civil", name: "Civil", displayOrder: 10 },
  {
    provinceCode: "ar-catamarca",
    code: "ar-catamarca-comercial-ejecucion",
    name: "Comercial y de ejecucion",
    displayOrder: 20
  },
  {
    provinceCode: "ar-catamarca",
    code: "ar-catamarca-correccional",
    name: "Correccional",
    displayOrder: 30
  },
  {
    provinceCode: "ar-catamarca",
    code: "ar-catamarca-ejecucion-fiscal",
    name: "Ejecucion fiscal",
    displayOrder: 40
  },
  {
    provinceCode: "ar-catamarca",
    code: "ar-catamarca-ejecucion-penal",
    name: "Ejecucion penal",
    displayOrder: 50
  },
  {
    provinceCode: "ar-catamarca",
    code: "ar-catamarca-electoral-minas",
    name: "Electoral y minas",
    displayOrder: 60
  },
  { provinceCode: "ar-catamarca", code: "ar-catamarca-familia", name: "Familia", displayOrder: 70 },
  {
    provinceCode: "ar-catamarca",
    code: "ar-catamarca-responsabilidad-juvenil",
    name: "Responsabilidad juvenil",
    displayOrder: 80
  },
  { provinceCode: "ar-catamarca", code: "ar-catamarca-trabajo", name: "Trabajo", displayOrder: 90 },
  {
    provinceCode: "ar-chaco",
    code: "ar-chaco-civil-comercial",
    name: "Civil y Comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-chaco",
    code: "ar-chaco-criminal-correccional",
    name: "Criminal y correccional",
    displayOrder: 20
  },
  {
    provinceCode: "ar-chaco",
    code: "ar-chaco-justicia-paz",
    name: "Justicia de paz",
    displayOrder: 30
  },
  { provinceCode: "ar-chaco", code: "ar-chaco-laboral", name: "Laboral", displayOrder: 40 },
  { provinceCode: "ar-chubut", code: "ar-chubut-civil", name: "Civil", displayOrder: 10 },
  { provinceCode: "ar-chubut", code: "ar-chubut-comercial", name: "Comercial", displayOrder: 20 },
  {
    provinceCode: "ar-chubut",
    code: "ar-chubut-contencioso-administrativo",
    name: "Contencioso Administrativo",
    displayOrder: 30
  },
  { provinceCode: "ar-chubut", code: "ar-chubut-ejecucion", name: "Ejecucion", displayOrder: 40 },
  { provinceCode: "ar-chubut", code: "ar-chubut-familia", name: "Familia", displayOrder: 50 },
  { provinceCode: "ar-chubut", code: "ar-chubut-laboral", name: "Laboral", displayOrder: 60 },
  { provinceCode: "ar-chubut", code: "ar-chubut-penal", name: "Penal", displayOrder: 70 },
  {
    provinceCode: "ar-cordoba",
    code: "ar-cordoba-tribunales-sede-capital",
    name: "Tribunales de la sede Capital",
    displayOrder: 10
  },
  {
    provinceCode: "ar-cordoba",
    code: "ar-cordoba-tribunales-sedes-interior",
    name: "Tribunales de las sedes del interior",
    displayOrder: 20
  },
  {
    provinceCode: "ar-corrientes",
    code: "ar-corrientes-civil-comercial",
    name: "Civil y Comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-corrientes",
    code: "ar-corrientes-contencioso-administrativo-electoral",
    name: "Contencioso administrativo y electoral",
    displayOrder: 20
  },
  {
    provinceCode: "ar-corrientes",
    code: "ar-corrientes-criminal-juicio",
    name: "Criminal y de juicio",
    displayOrder: 30
  },
  {
    provinceCode: "ar-corrientes",
    code: "ar-corrientes-paz",
    name: "De paz",
    displayOrder: 40
  },
  {
    provinceCode: "ar-corrientes",
    code: "ar-corrientes-laboral",
    name: "Laboral",
    displayOrder: 50
  },
  {
    provinceCode: "ar-entre-rios",
    code: "ar-entre-rios-civil-comercial",
    name: "Civil y Comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-entre-rios",
    code: "ar-entre-rios-contencioso-administrativo",
    name: "Contencioso Administrativo",
    displayOrder: 20
  },
  {
    provinceCode: "ar-entre-rios",
    code: "ar-entre-rios-familia",
    name: "De Familia",
    displayOrder: 30
  },
  {
    provinceCode: "ar-entre-rios",
    code: "ar-entre-rios-justicia-paz",
    name: "Justicia de Paz",
    displayOrder: 40
  },
  {
    provinceCode: "ar-entre-rios",
    code: "ar-entre-rios-laboral",
    name: "Laboral",
    displayOrder: 50
  },
  { provinceCode: "ar-entre-rios", code: "ar-entre-rios-penal", name: "Penal", displayOrder: 60 },
  { provinceCode: "ar-jujuy", code: "ar-jujuy-ambiental", name: "Ambiental", displayOrder: 10 },
  {
    provinceCode: "ar-jujuy",
    code: "ar-jujuy-civil-comercial-familia",
    name: "Civil, comercial y de familia",
    displayOrder: 20
  },
  {
    provinceCode: "ar-jujuy",
    code: "ar-jujuy-contencioso-administrativo",
    name: "Contencioso administrativo",
    displayOrder: 30
  },
  { provinceCode: "ar-jujuy", code: "ar-jujuy-electoral", name: "Electoral", displayOrder: 40 },
  {
    provinceCode: "ar-jujuy",
    code: "ar-jujuy-justicia-de-paz",
    name: "Justicia de paz",
    displayOrder: 50
  },
  { provinceCode: "ar-jujuy", code: "ar-jujuy-penal", name: "Penal", displayOrder: 60 },
  { provinceCode: "ar-jujuy", code: "ar-jujuy-trabajo", name: "Trabajo", displayOrder: 70 },
  {
    provinceCode: "ar-la-pampa",
    code: "ar-la-pampa-civil-tributario-consumo",
    name: "Civil, tributario y de relaciones de consumo",
    displayOrder: 10
  },
  {
    provinceCode: "ar-la-pampa",
    code: "ar-la-pampa-juzgados-paz",
    name: "Juzgados de paz",
    displayOrder: 20
  },
  { provinceCode: "ar-la-pampa", code: "ar-la-pampa-penal", name: "Penal", displayOrder: 30 },
  {
    provinceCode: "ar-la-rioja",
    code: "ar-la-rioja-civil-comercial-minas-criminal-correccional",
    name: "Civil, comercial, de minas, criminal y correccional",
    displayOrder: 10
  },
  {
    provinceCode: "ar-la-rioja",
    code: "ar-la-rioja-paz-legos",
    name: "Juzgado de Paz Legos",
    displayOrder: 20
  },
  {
    provinceCode: "ar-la-rioja",
    code: "ar-la-rioja-paz-letrados",
    name: "Juzgado de Paz Letrados",
    displayOrder: 30
  },
  { provinceCode: "ar-la-rioja", code: "ar-la-rioja-menores", name: "Menores", displayOrder: 40 },
  { provinceCode: "ar-la-rioja", code: "ar-la-rioja-penal", name: "Penal", displayOrder: 50 },
  { provinceCode: "ar-la-rioja", code: "ar-la-rioja-trabajo", name: "Trabajo", displayOrder: 60 },
  {
    provinceCode: "ar-la-rioja",
    code: "ar-la-rioja-violencia-genero-proteccion-menores",
    name: "Violencia de genero y proteccion integral de menores",
    displayOrder: 70
  },
  { provinceCode: "ar-mendoza", code: "ar-mendoza-civil", name: "Civil", displayOrder: 10 },
  {
    provinceCode: "ar-mendoza",
    code: "ar-mendoza-concursal",
    name: "Concursal",
    displayOrder: 20
  },
  {
    provinceCode: "ar-mendoza",
    code: "ar-mendoza-contravencional-paz",
    name: "Contravencional y de Paz",
    displayOrder: 30
  },
  { provinceCode: "ar-mendoza", code: "ar-mendoza-familia", name: "Familia", displayOrder: 40 },
  { provinceCode: "ar-mendoza", code: "ar-mendoza-laboral", name: "Laboral", displayOrder: 50 },
  { provinceCode: "ar-mendoza", code: "ar-mendoza-paz", name: "Paz", displayOrder: 60 },
  {
    provinceCode: "ar-mendoza",
    code: "ar-mendoza-penal-colegiado",
    name: "Penal Colegiado",
    displayOrder: 70
  },
  {
    provinceCode: "ar-mendoza",
    code: "ar-mendoza-penal-juvenil",
    name: "Penal Juvenil",
    displayOrder: 80
  },
  {
    provinceCode: "ar-mendoza",
    code: "ar-mendoza-tributario",
    name: "Tributario",
    displayOrder: 90
  },
  {
    provinceCode: "ar-misiones",
    code: "ar-misiones-civil-comercial",
    name: "Civil y Comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-misiones",
    code: "ar-misiones-correccionales-menores",
    name: "Correccionales y de menores",
    displayOrder: 20
  },
  { provinceCode: "ar-misiones", code: "ar-misiones-familia", name: "Familia", displayOrder: 30 },
  {
    provinceCode: "ar-misiones",
    code: "ar-misiones-instruccion",
    name: "Instruccion",
    displayOrder: 40
  },
  {
    provinceCode: "ar-misiones",
    code: "ar-misiones-juzgados-paz",
    name: "Juzgados de paz",
    displayOrder: 50
  },
  { provinceCode: "ar-misiones", code: "ar-misiones-laboral", name: "Laboral", displayOrder: 60 },
  {
    provinceCode: "ar-neuquen",
    code: "ar-neuquen-civil-comercial",
    name: "Civil y comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-neuquen",
    code: "ar-neuquen-ejecutivo",
    name: "Ejecutivo",
    displayOrder: 20
  },
  { provinceCode: "ar-neuquen", code: "ar-neuquen-electoral", name: "Electoral", displayOrder: 30 },
  { provinceCode: "ar-neuquen", code: "ar-neuquen-familia", name: "Familia", displayOrder: 40 },
  {
    provinceCode: "ar-neuquen",
    code: "ar-neuquen-justicia-paz",
    name: "Justicia de paz",
    displayOrder: 50
  },
  { provinceCode: "ar-neuquen", code: "ar-neuquen-laboral", name: "Laboral", displayOrder: 60 },
  { provinceCode: "ar-neuquen", code: "ar-neuquen-penal", name: "Penal", displayOrder: 70 },
  {
    provinceCode: "ar-neuquen",
    code: "ar-neuquen-procesal-administrativo",
    name: "Procesal administrativo",
    displayOrder: 80
  },
  {
    provinceCode: "ar-rio-negro",
    code: "ar-rio-negro-civil-comercial-mineria",
    name: "Civil, comercial y de mineria",
    displayOrder: 10
  },
  {
    provinceCode: "ar-rio-negro",
    code: "ar-rio-negro-contencioso-administrativo",
    name: "Contencioso administrativo",
    displayOrder: 20
  },
  {
    provinceCode: "ar-rio-negro",
    code: "ar-rio-negro-familia",
    name: "De familia",
    displayOrder: 30
  },
  {
    provinceCode: "ar-rio-negro",
    code: "ar-rio-negro-ejecucion-penal",
    name: "Ejecucion penal",
    displayOrder: 40
  },
  {
    provinceCode: "ar-rio-negro",
    code: "ar-rio-negro-justicia-paz",
    name: "Justicia de paz",
    displayOrder: 50
  },
  { provinceCode: "ar-rio-negro", code: "ar-rio-negro-laboral", name: "Laboral", displayOrder: 60 },
  { provinceCode: "ar-rio-negro", code: "ar-rio-negro-penal", name: "Penal", displayOrder: 70 },
  { provinceCode: "ar-salta", code: "ar-salta-civil", name: "Civil", displayOrder: 10 },
  { provinceCode: "ar-salta", code: "ar-salta-laboral", name: "Laboral", displayOrder: 20 },
  {
    provinceCode: "ar-salta",
    code: "ar-salta-contencioso-administrativo",
    name: "Contencioso Administrativo",
    displayOrder: 30
  },
  { provinceCode: "ar-salta", code: "ar-salta-penal", name: "Penal", displayOrder: 40 },
  { provinceCode: "ar-san-juan", code: "ar-san-juan-civil", name: "Civil", displayOrder: 10 },
  { provinceCode: "ar-san-juan", code: "ar-san-juan-paz", name: "De Paz", displayOrder: 20 },
  { provinceCode: "ar-san-juan", code: "ar-san-juan-familia", name: "Familia", displayOrder: 30 },
  { provinceCode: "ar-san-juan", code: "ar-san-juan-laboral", name: "Laboral", displayOrder: 40 },
  { provinceCode: "ar-san-juan", code: "ar-san-juan-penal", name: "Penal", displayOrder: 50 },
  {
    provinceCode: "ar-san-luis",
    code: "ar-san-luis-civil-comercial-ambiental",
    name: "Civil, comercial y ambiental",
    displayOrder: 10
  },
  { provinceCode: "ar-san-luis", code: "ar-san-luis-paz", name: "De Paz", displayOrder: 20 },
  {
    provinceCode: "ar-san-luis",
    code: "ar-san-luis-ejecucion-penal",
    name: "Ejecucion penal",
    displayOrder: 30
  },
  {
    provinceCode: "ar-san-luis",
    code: "ar-san-luis-familia-ninez-adolescentes-violencia",
    name: "Familia, ninez, adolescentes y violencia",
    displayOrder: 40
  },
  { provinceCode: "ar-san-luis", code: "ar-san-luis-garantia", name: "Garantia", displayOrder: 50 },
  { provinceCode: "ar-san-luis", code: "ar-san-luis-laboral", name: "Laboral", displayOrder: 60 },
  {
    provinceCode: "ar-san-luis",
    code: "ar-san-luis-penal-juvenil-contravencional",
    name: "Penal juvenil y contravencional",
    displayOrder: 70
  },
  {
    provinceCode: "ar-formosa",
    code: "ar-formosa-civil-comercial",
    name: "Civil y Comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-formosa",
    code: "ar-formosa-instruccion-correccional",
    name: "Instruccion y Correccional",
    displayOrder: 20
  },
  {
    provinceCode: "ar-formosa",
    code: "ar-formosa-justicia-paz",
    name: "Justicia de Paz",
    displayOrder: 30
  },
  {
    provinceCode: "ar-formosa",
    code: "ar-formosa-menores",
    name: "de Menores",
    displayOrder: 40
  },
  {
    provinceCode: "ar-formosa",
    code: "ar-formosa-trabajo",
    name: "del Trabajo",
    displayOrder: 50
  },
  {
    provinceCode: "ar-santa-cruz",
    code: "ar-santa-cruz-civil-comercial-laboral-mineria",
    name: "Civil, comercial, laboral y de mineria",
    displayOrder: 10
  },
  { provinceCode: "ar-santa-cruz", code: "ar-santa-cruz-paz", name: "De paz", displayOrder: 20 },
  {
    provinceCode: "ar-santa-cruz",
    code: "ar-santa-cruz-familia",
    name: "Familia",
    displayOrder: 30
  },
  {
    provinceCode: "ar-santa-cruz",
    code: "ar-santa-cruz-instruccion",
    name: "Instruccion",
    displayOrder: 40
  },
  {
    provinceCode: "ar-santa-cruz",
    code: "ar-santa-cruz-penal-juvenil",
    name: "Penal juvenil",
    displayOrder: 50
  },
  {
    provinceCode: "ar-santa-fe",
    code: "ar-santa-fe-civil-comercial",
    name: "Civil y Comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-santa-fe",
    code: "ar-santa-fe-contencioso-administrativo",
    name: "Contencioso Administrativo",
    displayOrder: 20
  },
  {
    provinceCode: "ar-santa-fe",
    code: "ar-santa-fe-circuito",
    name: "De circuito",
    displayOrder: 30
  },
  {
    provinceCode: "ar-santa-fe",
    code: "ar-santa-fe-extracontractual",
    name: "Extracontractual",
    displayOrder: 40
  },
  {
    provinceCode: "ar-santa-fe",
    code: "ar-santa-fe-familia",
    name: "Familia",
    displayOrder: 50
  },
  {
    provinceCode: "ar-santa-fe",
    code: "ar-santa-fe-jueces-comunitarios-pequenas-causas",
    name: "Jueces comunitarios de las pequenas causas",
    displayOrder: 60
  },
  {
    provinceCode: "ar-santa-fe",
    code: "ar-santa-fe-laboral",
    name: "Laboral",
    displayOrder: 70
  },
  {
    provinceCode: "ar-santa-fe",
    code: "ar-santa-fe-penal",
    name: "Penal",
    displayOrder: 80
  },
  {
    provinceCode: "ar-santiago-del-estero",
    code: "ar-santiago-del-estero-civil-comercial",
    name: "Civil y Comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-santiago-del-estero",
    code: "ar-santiago-del-estero-concursal-societario-registral",
    name: "Concursal, societario y registral",
    displayOrder: 20
  },
  {
    provinceCode: "ar-santiago-del-estero",
    code: "ar-santiago-del-estero-familia",
    name: "De familia",
    displayOrder: 30
  },
  {
    provinceCode: "ar-santiago-del-estero",
    code: "ar-santiago-del-estero-paz-letrado",
    name: "De paz letrado",
    displayOrder: 40
  },
  {
    provinceCode: "ar-santiago-del-estero",
    code: "ar-santiago-del-estero-paz-no-letrado",
    name: "De paz no letrado",
    displayOrder: 50
  },
  {
    provinceCode: "ar-santiago-del-estero",
    code: "ar-santiago-del-estero-penal",
    name: "Penal",
    displayOrder: 60
  },
  {
    provinceCode: "ar-santiago-del-estero",
    code: "ar-santiago-del-estero-trabajo-minas",
    name: "Trabajo y minas",
    displayOrder: 70
  },
  {
    provinceCode: "ar-tierra-del-fuego",
    code: "ar-tierra-del-fuego-civil-comercial",
    name: "Civil y comercial",
    displayOrder: 10
  },
  {
    provinceCode: "ar-tierra-del-fuego",
    code: "ar-tierra-del-fuego-competencia-ampliada",
    name: "Competencia ampliada",
    displayOrder: 20
  },
  {
    provinceCode: "ar-tierra-del-fuego",
    code: "ar-tierra-del-fuego-correccional",
    name: "Correccional",
    displayOrder: 30
  },
  {
    provinceCode: "ar-tierra-del-fuego",
    code: "ar-tierra-del-fuego-criminal",
    name: "Criminal",
    displayOrder: 40
  },
  {
    provinceCode: "ar-tierra-del-fuego",
    code: "ar-tierra-del-fuego-electoral",
    name: "Electoral",
    displayOrder: 50
  },
  {
    provinceCode: "ar-tierra-del-fuego",
    code: "ar-tierra-del-fuego-familia-minoridad",
    name: "Familia y minoridad",
    displayOrder: 60
  },
  {
    provinceCode: "ar-tierra-del-fuego",
    code: "ar-tierra-del-fuego-instruccion",
    name: "Instruccion",
    displayOrder: 70
  },
  {
    provinceCode: "ar-tierra-del-fuego",
    code: "ar-tierra-del-fuego-trabajo",
    name: "Trabajo",
    displayOrder: 80
  },
  {
    provinceCode: "ar-tucuman",
    code: "ar-tucuman-civil-cobros-apremios",
    name: "Civil de cobros y apremios",
    displayOrder: 10
  },
  {
    provinceCode: "ar-tucuman",
    code: "ar-tucuman-civil-trabajo",
    name: "Civil del trabajo",
    displayOrder: 20
  },
  {
    provinceCode: "ar-tucuman",
    code: "ar-tucuman-civil-documentos-locaciones",
    name: "Civil en documentos y locaciones",
    displayOrder: 30
  },
  {
    provinceCode: "ar-tucuman",
    code: "ar-tucuman-civil-familia-sucesiones",
    name: "Civil en familia y sucesiones",
    displayOrder: 40
  },
  {
    provinceCode: "ar-tucuman",
    code: "ar-tucuman-civil-contencioso-administrativo",
    name: "Civil en lo contencioso administrativo",
    displayOrder: 50
  },
  {
    provinceCode: "ar-tucuman",
    code: "ar-tucuman-civil-comercial-comun",
    name: "Civil y comercial comun",
    displayOrder: 60
  },
  { provinceCode: "ar-tucuman", code: "ar-tucuman-paz", name: "De paz", displayOrder: 70 },
  {
    provinceCode: "ar-tucuman",
    code: "ar-tucuman-penal-sistema-adversarial",
    name: "Penal sistema adversarial",
    displayOrder: 80
  },
  {
    provinceCode: "ar-tucuman",
    code: "ar-tucuman-penal-sistema-conclusional",
    name: "Penal sistema conclusional",
    displayOrder: 90
  }
];

async function seedLegalCatalogs() {
  await prisma.$transaction(async (tx) => {
    for (const province of provinces) {
      await tx.province.upsert({
        where: { code: province.code },
        update: {
          active: true,
          country: province.country,
          displayOrder: province.displayOrder,
          name: province.name,
          province: province.province
        },
        create: {
          active: true,
          ...province
        }
      });
    }

    for (const forumTemplate of forumTemplates) {
      const province = await tx.province.findUniqueOrThrow({
        where: { code: forumTemplate.provinceCode }
      });

      await tx.forumTemplate.upsert({
        where: { code: forumTemplate.code },
        update: {
          active: true,
          displayOrder: forumTemplate.displayOrder,
          name: forumTemplate.name,
          provinceId: province.id
        },
        create: {
          active: true,
          code: forumTemplate.code,
          displayOrder: forumTemplate.displayOrder,
          name: forumTemplate.name,
          provinceId: province.id
        }
      });
    }
  });
}

seedLegalCatalogs()
  .then(() => {
    console.log("Legal catalog seed completed.");
  })
  .catch((error) => {
    console.error("Legal catalog seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
