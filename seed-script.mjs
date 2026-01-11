import { drizzle } from "drizzle-orm/mysql2";
import { experiences, resources, courses, badges } from "./drizzle/schema.js";

const sampleExperiences = [
  {
    name: "Ecoturismo Lacandón",
    description: "Explora la selva lacandona con guías locales de la comunidad maya. Descubre la rica biodiversidad de uno de los ecosistemas más importantes de México, hogar de jaguares, monos aulladores y cientos de especies de aves.",
    shortDescription: "Aventura en la selva lacandona con guías mayas locales",
    state: "Chiapas",
    municipality: "Ocosingo",
    community: "Lacanjá Chansayab",
    latitude: "16.7500",
    longitude: "-91.1167",
    category: "ecoturismo",
    imageUrl: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800",
    contactEmail: "ecoturismo.lacandon@ejemplo.com",
    contactPhone: "+52 919 123 4567",
    isFeatured: true,
  },
  {
    name: "Avistamiento de Ballenas en Baja",
    description: "Vive la experiencia única de observar ballenas grises en su santuario natural con comunidades pesqueras locales.",
    shortDescription: "Observación de ballenas grises con pescadores locales",
    state: "Baja California Sur",
    municipality: "Mulegé",
    community: "San Ignacio",
    latitude: "27.2833",
    longitude: "-112.8667",
    category: "observacion_naturaleza",
    imageUrl: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800",
    contactEmail: "ballenas.sanignacio@ejemplo.com",
    isFeatured: true,
  },
  {
    name: "Ruta del Mezcal Artesanal",
    description: "Conoce el proceso tradicional de elaboración del mezcal en los valles de Oaxaca con maestros mezcaleros.",
    shortDescription: "Experiencia gastronómica y cultural del mezcal oaxaqueño",
    state: "Oaxaca",
    municipality: "Santiago Matatlán",
    community: "San Dionisio Ocotepec",
    latitude: "16.8667",
    longitude: "-96.3833",
    category: "gastronomia",
    imageUrl: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800",
    isFeatured: true,
  },
  {
    name: "Senderismo en la Sierra Gorda",
    description: "Recorre los senderos de la Reserva de la Biosfera Sierra Gorda con guías comunitarios.",
    shortDescription: "Caminatas guiadas en la Reserva de la Biosfera",
    state: "Querétaro",
    municipality: "Jalpan de Serra",
    category: "turismo_aventura",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    isFeatured: false,
  },
  {
    name: "Turismo Rural en la Huasteca",
    description: "Sumérgete en la vida cotidiana de las comunidades teenek y náhuatl de la Huasteca Potosina.",
    shortDescription: "Inmersión cultural en comunidades indígenas de la Huasteca",
    state: "San Luis Potosí",
    municipality: "Aquismón",
    category: "turismo_rural",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    isFeatured: false,
  },
  {
    name: "Observación de Aves en Yucatán",
    description: "Descubre la increíble diversidad de aves de la Península de Yucatán con guías mayas especializados.",
    shortDescription: "Avistamiento de aves con guías mayas especializados",
    state: "Yucatán",
    municipality: "Celestún",
    category: "observacion_naturaleza",
    imageUrl: "https://images.unsplash.com/photo-1480044965905-02098d419e96?w=800",
    isFeatured: true,
  },
  {
    name: "Artesanías Textiles de Oaxaca",
    description: "Aprende las técnicas ancestrales de tejido en telar de cintura con maestras artesanas zapotecas.",
    shortDescription: "Taller de tejido tradicional con artesanas zapotecas",
    state: "Oaxaca",
    municipality: "Teotitlán del Valle",
    category: "turismo_cultural",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    isFeatured: false,
  },
  {
    name: "Kayak en Manglares de Sian Ka'an",
    description: "Navega en kayak por los canales de la Reserva de la Biosfera Sian Ka'an, Patrimonio de la Humanidad.",
    shortDescription: "Aventura en kayak por la Reserva Sian Ka'an",
    state: "Quintana Roo",
    municipality: "Felipe Carrillo Puerto",
    category: "turismo_aventura",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    isFeatured: false,
  },
];

const sampleResources = [
  { title: "Guía de Buenas Prácticas en Turismo Comunitario", description: "Manual completo con lineamientos para implementar prácticas sostenibles.", type: "guia", category: "Turismo Comunitario", author: "SECTUR", isPublic: true },
  { title: "Manual de Conservación de Biodiversidad", description: "Documento técnico sobre conservación en actividades turísticas.", type: "manual", category: "Conservación de Biodiversidad", author: "CONANP", isPublic: true },
  { title: "Infografía: Ecosistemas de México", description: "Material visual sobre ecosistemas mexicanos.", type: "infografia", category: "Conservación de Biodiversidad", author: "SEMARNAT", isPublic: true },
  { title: "Normativa del Turismo de Naturaleza", description: "Compilación de normas y regulaciones.", type: "normativa", category: "Normatividad", author: "SECTUR", isPublic: true },
  { title: "Guía de Comercialización", description: "Estrategias para promocionar experiencias turísticas.", type: "guia", category: "Comercialización", author: "FONATUR", isPublic: true },
];

const sampleCourses = [
  { title: "Introducción al Turismo Comunitario Sostenible", description: "Curso básico sobre fundamentos del turismo comunitario.", shortDescription: "Fundamentos del turismo comunitario", category: "Turismo Comunitario", duration: "8 horas", level: "basico", isFeatured: true },
  { title: "Conservación de Biodiversidad y Turismo", description: "Aprende a integrar criterios de conservación.", shortDescription: "Integra la conservación en tu proyecto", category: "Conservación de Biodiversidad", duration: "12 horas", level: "intermedio", isFeatured: true },
  { title: "Gestión Empresarial para Cooperativas", description: "Herramientas de administración para empresas comunitarias.", shortDescription: "Administración y finanzas", category: "Gestión Empresarial", duration: "16 horas", level: "intermedio", isFeatured: false },
  { title: "Marketing Digital para Turismo Comunitario", description: "Estrategias de promoción digital.", shortDescription: "Promociona tu experiencia en medios digitales", category: "Marketing Digital", duration: "10 horas", level: "basico", isFeatured: true },
  { title: "Guía de Naturaleza Certificado", description: "Programa avanzado para guías especializados.", shortDescription: "Certificación para guías de naturaleza", category: "Conservación de Biodiversidad", duration: "40 horas", level: "avanzado", isFeatured: false },
];

const sampleBadges = [
  { name: "Distintivo Semilla", description: "Reconocimiento inicial para prestadores comprometidos con la sostenibilidad.", level: "semilla", requirements: "Registro completo, documentación verificada, capacitación introductoria", isActive: true },
  { name: "Distintivo Excelencia", description: "Máximo reconocimiento para prestadores con excelencia en turismo sostenible.", level: "excelencia", requirements: "Distintivo Semilla vigente, evaluación aprobada, certificaciones avanzadas", isActive: true },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }
  
  const db = drizzle(process.env.DATABASE_URL);
  
  // Check if already seeded
  const existing = await db.select().from(experiences).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded");
    process.exit(0);
  }
  
  console.log("Seeding database...");
  
  await db.insert(experiences).values(sampleExperiences);
  console.log("Inserted experiences");
  
  await db.insert(resources).values(sampleResources);
  console.log("Inserted resources");
  
  await db.insert(courses).values(sampleCourses);
  console.log("Inserted courses");
  
  await db.insert(badges).values(sampleBadges);
  console.log("Inserted badges");
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
