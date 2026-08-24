const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(
  file: File,
  folder = 'eternal-bloom/products'
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Image upload failed')

  const data = await res.json()
  return data.secure_url as string
}

export async function uploadMultipleImages(
  files: File[],
  folder = 'eternal-bloom/products'
): Promise<string[]> {
  const uploads = files.map(file => uploadImage(file, folder))
  return Promise.all(uploads)
}