export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: Rating
  stock: number
  discount: number | null
}

export interface Rating {
  rate: number
  count: number
}

export interface Category {
  id: string
  name: string
  image: string
}

export interface Review {
  id: number
  productId: number
  userName: string
  rating: number
  comment: string
  date: string
}

export interface User {
  id: number
  email: string
  username: string
  name: string
  phone: string
  address: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}
