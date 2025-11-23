import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: any = null

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
}

export class StorageService {
  private bucketName = 'resources'

  async uploadFile(file: File, path: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`)
    }

    return data
  }

  async getPublicUrl(path: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path)

    return data.publicUrl
  }

  async deleteFile(path: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path])

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }

  async createBucket() {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase.storage.createBucket(this.bucketName, {
      public: false,
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
      fileSizeLimit: 52428800, // 50MB
    })

    if (error && error.message !== 'Bucket already exists') {
      throw new Error(`Failed to create bucket: ${error.message}`)
    }

    return data
  }

  isConfigured() {
    return supabase !== null
  }
}

export const storageService = new StorageService()