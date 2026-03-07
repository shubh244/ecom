const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const data: ApiResponse<T> = await response.json()
      return data.data
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Products
  async getProducts(params?: {
    category?: string
    subcategory?: string
    search?: string
    sort_by?: string
    sort_order?: string
    per_page?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    const query = queryParams.toString()
    return this.request<any[]>(`/products${query ? `?${query}` : ''}`)
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`)
  }

  async getProductsByCategory(category: string) {
    return this.request<any[]>(`/products/category/${category}`)
  }

  async getFeaturedProducts() {
    return this.request<any[]>(`/products/featured`)
  }

  async getHotOffers() {
    return this.request<any[]>(`/products/hot-offers`)
  }

  // Categories
  async getCategories() {
    return this.request<any[]>(`/categories`)
  }

  async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`)
  }

  async getCategoryProducts(id: string) {
    return this.request<any[]>(`/categories/${id}/products`)
  }

  // Cart
  async addToCart(productId: number, quantity: number = 1) {
    return this.request<any>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  }

  async getCart() {
    return this.request<any[]>('/cart')
  }

  async removeFromCart(id: string) {
    return this.request<any>(`/cart/${id}`, {
      method: 'DELETE',
    })
  }

  async updateCartItem(id: string, quantity: number) {
    return this.request<any>(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  async clearCart() {
    return this.request<any>('/cart', {
      method: 'DELETE',
    })
  }

  // Admin
  async adminLogin(email: string, password: string) {
    return this.request<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async adminLogout() {
    const token = localStorage.getItem('admin_token')
    return this.request<any>('/admin/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  private getAdminHeaders() {
    const token = localStorage.getItem('admin_token')
    return {
      'Authorization': `Bearer ${token}`,
    }
  }

  async getAdminDashboard() {
    return this.request<any>('/admin/dashboard', {
      headers: this.getAdminHeaders(),
    })
  }

  async getAdminProducts(params?: any) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    const query = queryParams.toString()
    return this.request<any>(`/admin/products${query ? `?${query}` : ''}`, {
      headers: this.getAdminHeaders(),
    })
  }

  async createAdminProduct(product: any) {
    return this.request<any>('/admin/products', {
      method: 'POST',
      headers: this.getAdminHeaders(),
      body: JSON.stringify(product),
    })
  }

  async updateAdminProduct(id: number, product: any) {
    return this.request<any>(`/admin/products/${id}`, {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify(product),
    })
  }

  async deleteAdminProduct(id: number) {
    return this.request<any>(`/admin/products/${id}`, {
      method: 'DELETE',
      headers: this.getAdminHeaders(),
    })
  }

  async getAdminOrders(params?: any) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    const query = queryParams.toString()
    return this.request<any>(`/admin/orders${query ? `?${query}` : ''}`, {
      headers: this.getAdminHeaders(),
    })
  }

  async getAdminOrder(id: number) {
    return this.request<any>(`/admin/orders/${id}`, {
      headers: this.getAdminHeaders(),
    })
  }

  async updateOrderStatus(id: number, status: string) {
    return this.request<any>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify({ status }),
    })
  }

  // Orders
  async createOrder(orderData: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

