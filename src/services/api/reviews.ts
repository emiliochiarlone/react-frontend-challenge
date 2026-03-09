import type { Review } from '@/types'

// Reviews simuladas generadas determinísticamente por productId
const reviewTemplates = [
  {
    userName: 'María G.',
    comment: 'Excelente producto, superó mis expectativas. La calidad es increíble.',
  },
  {
    userName: 'Carlos R.',
    comment: 'Muy buena relación calidad-precio. Lo recomiendo totalmente.',
  },
  { userName: 'Ana L.', comment: 'Llegó en perfectas condiciones y funciona de maravilla.' },
  {
    userName: 'Pedro S.',
    comment: 'Cumple con lo prometido. Buen producto para el precio que tiene.',
  },
  {
    userName: 'Laura M.',
    comment: 'Me encantó, es tal cual como se ve en las fotos. Muy conforme.',
  },
  {
    userName: 'Diego F.',
    comment: 'Buena calidad, aunque el envío tardó un poco más de lo esperado.',
  },
  { userName: 'Sofía P.', comment: 'Es un regalo perfecto. A quien se lo di le encantó.' },
  { userName: 'Juan T.', comment: 'Segundo que compro, tan bueno como el primero.' },
]

function generateReviews(productId: number): Review[] {
  const count = ((productId * 3 + 1) % 4) + 1
  const reviews: Review[] = []

  for (let i = 0; i < count; i++) {
    const templateIdx = (productId * 7 + i * 13) % reviewTemplates.length
    const template = reviewTemplates[templateIdx]
    const rating = ((productId * 3 + i * 5) % 3) + 3 // 3 to 5 stars
    const day = ((productId * 11 + i * 7) % 28) + 1
    const month = ((productId * 5 + i * 3) % 12) + 1

    reviews.push({
      id: productId * 100 + i,
      productId,
      userName: template.userName,
      rating,
      comment: template.comment,
      date: `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    })
  }

  return reviews
}

export async function getReviewsByProduct(productId: number): Promise<Review[]> {
  return generateReviews(productId)
}
