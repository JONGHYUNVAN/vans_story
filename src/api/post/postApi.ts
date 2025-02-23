import { Post } from '@/interfaces/post/types'
import { API_URLS } from '../constants/apiUrl'

export const postAPI = {
    getPost: async (id: number): Promise<Post> => {
      const response = await fetch(`${API_URLS.POST.GET}/${id}`)
      if (!response.ok) throw new Error('Failed to fetch post')
      
      const data = await response.json()
      return data
    }
  }