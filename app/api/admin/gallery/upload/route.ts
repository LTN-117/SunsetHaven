import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const MAX_METADATA_BYTES = 16 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

// POST - Create a short-lived, single-object Storage upload token for an admin-selected image.
export async function POST(request: NextRequest) {
  const contentLength = request.headers.get('content-length')
  if (contentLength) {
    const parsedContentLength = Number(contentLength)
    if (!Number.isFinite(parsedContentLength) || parsedContentLength < 0) {
      return errorResponse('Invalid upload metadata.', 400)
    }
    if (parsedContentLength > MAX_METADATA_BYTES) {
      return errorResponse('Upload metadata is too large.', 413)
    }
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse('Invalid upload metadata.', 400)
  }

  const { fileName, contentType, size } = body as Record<string, unknown>
  if (typeof fileName !== 'string' || fileName.trim().length === 0 || fileName.length > 255) {
    return errorResponse('Please provide a valid image file name.', 400)
  }

  if (typeof contentType !== 'string' || contentType.length === 0 || contentType.length > 100) {
    return errorResponse('Please provide a valid image type.', 400)
  }

  if (typeof size !== 'number' || !Number.isSafeInteger(size) || size <= 0) {
    return errorResponse('Please provide a valid image file size.', 400)
  }
  if (size > MAX_IMAGE_SIZE_BYTES) {
    return errorResponse('Image files must be 10 MB or smaller.', 413)
  }

  const extension = IMAGE_EXTENSIONS[contentType.trim().toLowerCase()]
  if (!extension) {
    return errorResponse('Only JPEG, PNG, WebP, GIF, and AVIF images are supported.', 400)
  }

  // The original file name is deliberately excluded so client-provided metadata cannot
  // influence the Storage key. UUIDs provide collision-resistant object names.
  const path = `gallery/${randomUUID()}.${extension}`

  try {
    const { data, error } = await supabaseAdmin.storage
      .from('gallery-images')
      .createSignedUploadUrl(path, { upsert: false })

    if (error || !data?.token) {
      return errorResponse(error?.message || 'Could not prepare image upload.', 500)
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('gallery-images')
      .getPublicUrl(path)

    return NextResponse.json({
      path,
      token: data.token,
      publicUrl: publicUrlData.publicUrl,
    })
  } catch (error) {
    console.error('Gallery upload token creation failed:', error)
    return errorResponse('Could not prepare image upload. Please try again.', 500)
  }
}
