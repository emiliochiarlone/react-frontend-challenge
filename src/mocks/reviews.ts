import type { Review } from '@/types'

export const mockReviews: Review[] = [
  // Producto 1 — Samsung Galaxy S24 Ultra
  {
    id: 1,
    productId: 1,
    userName: 'Carlos M.',
    rating: 5,
    comment: 'Increíble cámara y rendimiento. El S Pen es un plus enorme para tomar notas rápidas.',
    date: '2024-11-15',
  },
  {
    id: 2,
    productId: 1,
    userName: 'Laura G.',
    rating: 4,
    comment:
      'Muy buen teléfono, aunque el precio es elevado. La batería dura todo el día sin problemas.',
    date: '2024-11-20',
  },
  {
    id: 3,
    productId: 1,
    userName: 'Martín R.',
    rating: 5,
    comment: 'El zoom de 5x es impresionante para fotos de paisajes. Mejor Samsung que tuve.',
    date: '2024-12-01',
  },

  // Producto 2 — iPhone 15 Pro Max
  {
    id: 4,
    productId: 2,
    userName: 'Sofía P.',
    rating: 5,
    comment:
      'El titanio se siente premium. La cámara de 48MP saca fotos profesionales sin esfuerzo.',
    date: '2024-10-28',
  },
  {
    id: 5,
    productId: 2,
    userName: 'Diego L.',
    rating: 5,
    comment: 'Por fin USB-C. La Action Button es muy útil. Mejor iPhone de la historia.',
    date: '2024-11-05',
  },
  {
    id: 6,
    productId: 2,
    userName: 'Ana V.',
    rating: 4,
    comment: 'Excelente rendimiento, pero el precio sigue siendo alto. El chip A17 Pro vuela.',
    date: '2024-11-18',
  },

  // Producto 6 — MacBook Air M3
  {
    id: 7,
    productId: 6,
    userName: 'Federico T.',
    rating: 5,
    comment:
      'La laptop más increíble que tuve. Sin ventilador, silenciosa y potente. Edito video 4K sin lag.',
    date: '2024-09-15',
  },
  {
    id: 8,
    productId: 6,
    userName: 'Valentina S.',
    rating: 5,
    comment:
      'La pantalla de 15" es hermosa para trabajar. La batería dura todo un día de universidad.',
    date: '2024-10-02',
  },
  {
    id: 9,
    productId: 6,
    userName: 'Nicolás H.',
    rating: 4,
    comment: 'Excelente construcción. Solo extraño que no tenga más puertos USB-C.',
    date: '2024-10-20',
  },

  // Producto 11 — Samsung Smart TV 55" QLED
  {
    id: 10,
    productId: 11,
    userName: 'Roberto A.',
    rating: 5,
    comment: 'Los colores del QLED son impresionantes. Tizen funciona de maravilla, todo fluido.',
    date: '2024-08-10',
  },
  {
    id: 11,
    productId: 11,
    userName: 'Patricia M.',
    rating: 4,
    comment:
      'Muy buena calidad de imagen por el precio. El audio podría ser mejor, pero para eso hay barra de sonido.',
    date: '2024-09-05',
  },

  // Producto 16 — Sony WH-1000XM5
  {
    id: 12,
    productId: 16,
    userName: 'Lucía F.',
    rating: 5,
    comment: 'La mejor cancelación de ruido que probé. Los uso en la oficina y no escucho nada.',
    date: '2024-07-20',
  },
  {
    id: 13,
    productId: 16,
    userName: 'Tomás B.',
    rating: 5,
    comment:
      'Comodísimos para usar todo el día. El sonido Hi-Res se nota muchísimo con buenas pistas.',
    date: '2024-08-15',
  },
  {
    id: 14,
    productId: 16,
    userName: 'Camila D.',
    rating: 4,
    comment:
      'Excelentes auriculares. El estuche es más grande que el XM4 pero la calidad lo compensa.',
    date: '2024-09-01',
  },

  // Producto 21 — Air Fryer Philips
  {
    id: 15,
    productId: 21,
    userName: 'María E.',
    rating: 5,
    comment:
      'Cambió mi forma de cocinar. Las papas fritas quedan crujientes sin aceite. Fácil de limpiar.',
    date: '2024-06-10',
  },
  {
    id: 16,
    productId: 21,
    userName: 'Jorge K.',
    rating: 4,
    comment:
      'Muy buena air fryer, los 5.5L son suficientes para 4 personas. Los programas son prácticos.',
    date: '2024-07-05',
  },
  {
    id: 17,
    productId: 21,
    userName: 'Silvia R.',
    rating: 5,
    comment: 'La mejor compra que hice este año. Cocino de todo: alitas, verduras, hasta tortas.',
    date: '2024-08-22',
  },

  // Producto 36 — PlayStation 5
  {
    id: 18,
    productId: 36,
    userName: 'Matías G.',
    rating: 5,
    comment:
      'El DualSense es una revolución. Los tiempos de carga con el SSD son inexistentes. Impresionante.',
    date: '2024-05-15',
  },
  {
    id: 19,
    productId: 36,
    userName: 'Agustín C.',
    rating: 5,
    comment:
      'Spider-Man 2 en esta consola es una experiencia cinematográfica. Los gráficos son de otro nivel.',
    date: '2024-06-20',
  },
  {
    id: 20,
    productId: 36,
    userName: 'Florencia N.',
    rating: 4,
    comment:
      'Consola increíble, pero es bastante grande. El catálogo de exclusivos sigue creciendo.',
    date: '2024-07-10',
  },

  // Producto 46 — Guitarra Yamaha FG800
  {
    id: 21,
    productId: 46,
    userName: 'Sebastián W.',
    rating: 5,
    comment:
      'Sonido espectacular para el precio. La tapa de abeto sólido hace la diferencia. Ideal para empezar.',
    date: '2024-04-05',
  },
  {
    id: 22,
    productId: 46,
    userName: 'Julieta O.',
    rating: 4,
    comment:
      'Muy buena guitarra para principiantes y nivel intermedio. Llegó bien afinada y sin defectos.',
    date: '2024-05-18',
  },

  // Producto 51 — Taladro Bosch
  {
    id: 23,
    productId: 51,
    userName: 'Ricardo P.',
    rating: 5,
    comment:
      'Potente y confiable como todo Bosch. Perforé concreto sin problemas. El maletín es un plus.',
    date: '2024-03-20',
  },
  {
    id: 24,
    productId: 51,
    userName: 'Daniel M.',
    rating: 4,
    comment:
      'Buena herramienta para uso hogareño y semi-profesional. La velocidad variable es clave.',
    date: '2024-04-15',
  },

  // Producto 61 — Apple Watch Series 9
  {
    id: 25,
    productId: 61,
    userName: 'Carolina S.',
    rating: 5,
    comment:
      'El doble tap es genial para cuando tenés las manos ocupadas. La pantalla always-on es brillante.',
    date: '2024-11-01',
  },
  {
    id: 26,
    productId: 61,
    userName: 'Pablo J.',
    rating: 5,
    comment:
      'Lo uso para entrenar y monitorear mi salud. Las métricas de sueño son muy detalladas.',
    date: '2024-11-25',
  },
  {
    id: 27,
    productId: 61,
    userName: 'Romina L.',
    rating: 4,
    comment:
      'Muy bueno, aunque la batería podría durar un poco más. El ecosistema Apple es inigualable.',
    date: '2024-12-10',
  },

  // Producto 56 — Escritorio Gamer
  {
    id: 28,
    productId: 56,
    userName: 'Ignacio V.',
    rating: 4,
    comment:
      'Las luces RGB le dan un toque genial al setup. La superficie es amplia para 2 monitores.',
    date: '2024-10-05',
  },
  {
    id: 29,
    productId: 56,
    userName: 'Micaela T.',
    rating: 5,
    comment:
      'Excelente relación calidad-precio. El portavasos y el gancho para auris son detalles que importan.',
    date: '2024-10-28',
  },

  // Producto 34 — DJI Mini 3 Pro
  {
    id: 30,
    productId: 34,
    userName: 'Hernán Q.',
    rating: 5,
    comment:
      'Increíble que un drone tan chico grabe en 4K HDR. Los sensores de obstáculos dan mucha confianza.',
    date: '2024-09-12',
  },
  {
    id: 31,
    productId: 34,
    userName: 'Andrea B.',
    rating: 5,
    comment:
      'El mejor drone para viajar. Pesa menos de 250g así que no necesitás registro en muchos países.',
    date: '2024-10-01',
  },

  // Producto 43 — Monopatín Eléctrico Xiaomi
  {
    id: 32,
    productId: 43,
    userName: 'Gonzalo R.',
    rating: 5,
    comment:
      'Lo uso para ir al trabajo todos los días. La autonomía real es de unos 40km, muy cerca de lo prometido.',
    date: '2024-08-05',
  },
  {
    id: 33,
    productId: 43,
    userName: 'Belén F.',
    rating: 4,
    comment:
      'Práctico y divertido. Los frenos regenerativos funcionan muy bien. Solo pesa un poco para subir escaleras.',
    date: '2024-09-18',
  },
]
