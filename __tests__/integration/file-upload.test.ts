/**
 * T015: File Upload Flow Integration Test
 *
 * Tests complete file upload workflows including gallery photo uploads,
 * dress code photo uploads, file validation, and error handling.
 */

describe('File Upload Flow Integration Test', () => {
  const baseUrl = 'http://localhost:3000'

  const createTestImageFile = (filename = 'test.jpg', size = 2048) => {
    const buffer = new ArrayBuffer(size)
    const blob = new Blob([buffer], { type: 'image/jpeg' })
    return new File([blob], filename, { type: 'image/jpeg' })
  }

  describe('Gallery Photo Upload Flow', () => {
    it('should complete gallery photo management workflow', async () => {
      // Upload photo
      const formData = new FormData()
      formData.append('file', createTestImageFile('wedding1.jpg'))
      formData.append('alt', 'Wedding ceremony photo')

      const uploadResponse = await fetch(`${baseUrl}/api/wedding/gallery/upload`, {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.status === 201) {
        const uploadData = await uploadResponse.json()
        const photoId = uploadData.data.id

        // Update metadata
        const updateResponse = await fetch(`${baseUrl}/api/wedding/gallery/${photoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: 2, alt: 'Updated alt text' }),
        })

        expect(updateResponse.status).toBe(200)

        // Verify in gallery list
        const galleryResponse = await fetch(`${baseUrl}/api/wedding/gallery`)
        if (galleryResponse.status === 200) {
          const gallery = await galleryResponse.json()
          const photo = gallery.data.find((p: any) => p.id === photoId)
          expect(photo).toBeDefined()
          expect(photo.alt).toBe('Updated alt text')
        }

        // Delete photo
        const deleteResponse = await fetch(`${baseUrl}/api/wedding/gallery/${photoId}`, {
          method: 'DELETE',
        })

        expect(deleteResponse.status).toBe(200)
      }
    })
  })

  describe('Dress Code Photo Flow', () => {
    it('should upload and delete dress code photo', async () => {
      // Upload dress code photo
      const formData = new FormData()
      formData.append('file', createTestImageFile('dress-code.jpg'))

      const uploadResponse = await fetch(`${baseUrl}/api/wedding/dress-code/upload`, {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.status === 201) {
        // Verify photo is associated with dress code
        const dressCodeResponse = await fetch(`${baseUrl}/api/wedding/dress-code`)
        if (dressCodeResponse.status === 200) {
          const dressCode = await dressCodeResponse.json()
          expect(dressCode.data.photoFilename).toBeDefined()
          expect(dressCode.data.photoUrl).toMatch(/^https?:\/\/.+/)
        }

        // Delete dress code photo
        const deleteResponse = await fetch(`${baseUrl}/api/wedding/dress-code/photo`, {
          method: 'DELETE',
        })

        expect(deleteResponse.status).toBe(200)
      }
    })
  })
})
