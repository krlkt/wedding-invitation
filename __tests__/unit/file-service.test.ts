/**
 * T068: Unit Tests for File Upload Service
 *
 * Tests for file upload, validation, and management functions.
 */

import {
  uploadGalleryPhoto,
  getGalleryPhotos,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  uploadDressCodePhoto,
  deleteDressCodePhoto,
} from '@/lib/file-service'

// Mock Vercel Blob
jest.mock('@vercel/blob', () => ({
  put: jest.fn().mockResolvedValue({ url: 'https://blob.vercel-storage.com/test.jpg' }),
  del: jest.fn().mockResolvedValue(undefined),
}))

// Mock database
jest.mock('@/lib/database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

import { put, del } from '@vercel/blob'
import { db } from '@/lib/database'

describe('File Upload Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function createMockFile(name: string, size: number, type: string): File {
    const blob = new Blob(['a'.repeat(size)], { type })
    return new File([blob], name, { type })
  }

  describe('uploadGalleryPhoto', () => {
    it('should upload valid image file successfully', async () => {
      const mockFile = createMockFile('wedding.jpg', 1024 * 1024, 'image/jpeg')

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]), // No existing photos
      }

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([
          {
            id: 'photo-123',
            filename: 'gallery-123.jpg',
            weddingConfigId: 'wedding-123',
          },
        ]),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)

      const result = await uploadGalleryPhoto('wedding-123', mockFile, 'Wedding photo')

      expect(put).toHaveBeenCalled()
      expect(result).toMatchObject({
        id: 'photo-123',
        filename: expect.stringContaining('gallery'),
        photoUrl: expect.stringContaining('blob.vercel-storage.com'),
      })
    })

    it('should reject files exceeding 4MB limit', async () => {
      const largeFile = createMockFile('large.jpg', 5 * 1024 * 1024, 'image/jpeg')

      await expect(uploadGalleryPhoto('wedding-123', largeFile)).rejects.toThrow(
        'File size exceeds 4MB limit'
      )

      expect(put).not.toHaveBeenCalled()
    })

    it('should reject invalid file types', async () => {
      const textFile = createMockFile('document.txt', 1024, 'text/plain')

      await expect(uploadGalleryPhoto('wedding-123', textFile)).rejects.toThrow('Invalid file type')

      expect(put).not.toHaveBeenCalled()
    })

    it('should auto-assign order number when not provided', async () => {
      const mockFile = createMockFile('photo.jpg', 1024, 'image/jpeg')

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([
          { id: '1', order: 1 },
          { id: '2', order: 2 },
        ]), // 2 existing photos
      }

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([
          {
            id: 'photo-123',
            filename: 'gallery-123.jpg',
            order: 3, // Should be auto-assigned as 3
          },
        ]),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)

      await uploadGalleryPhoto('wedding-123', mockFile)

      expect(mockInsert.values).toHaveBeenCalledWith(
        expect.objectContaining({
          order: 3,
        })
      )
    })
  })

  describe('getGalleryPhotos', () => {
    it('should retrieve all gallery photos for wedding', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue([
          { id: '1', order: 1 },
          { id: '2', order: 2 },
        ]),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)

      const result = await getGalleryPhotos('wedding-123')

      expect(result).toHaveLength(2)
      expect(mockSelect.orderBy).toHaveBeenCalled()
    })
  })

  describe('updateGalleryPhoto', () => {
    it('should update photo metadata', async () => {
      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([
          {
            id: 'photo-123',
            order: 5,
            alt: 'Updated alt text',
          },
        ]),
      }

      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      const result = await updateGalleryPhoto('photo-123', {
        order: 5,
        alt: 'Updated alt text',
      })

      expect(result).toMatchObject({
        id: 'photo-123',
        order: 5,
        alt: 'Updated alt text',
      })
    })
  })

  describe('deleteGalleryPhoto', () => {
    it('should delete photo from blob storage and database', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'photo-123',
            filename: 'gallery-123.jpg',
          },
        ]),
      }

      const mockDelete = {
        where: jest.fn().mockResolvedValue(undefined),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)
      ;(db.delete as jest.Mock).mockReturnValue(mockDelete)

      await deleteGalleryPhoto('photo-123')

      expect(del).toHaveBeenCalledWith('gallery-123.jpg')
      expect(mockDelete.where).toHaveBeenCalled()
    })

    it('should continue database deletion even if blob deletion fails', async () => {
      ;(del as jest.Mock).mockRejectedValue(new Error('Blob deletion failed'))

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'photo-123',
            filename: 'gallery-123.jpg',
          },
        ]),
      }

      const mockDelete = {
        where: jest.fn().mockResolvedValue(undefined),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)
      ;(db.delete as jest.Mock).mockReturnValue(mockDelete)

      await deleteGalleryPhoto('photo-123')

      // Should still delete from database
      expect(mockDelete.where).toHaveBeenCalled()
    })
  })

  describe('uploadDressCodePhoto', () => {
    it('should upload dress code photo and create/update record', async () => {
      const mockFile = createMockFile('dresscode.jpg', 1024, 'image/jpeg')

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]), // No existing dress code
      }

      const mockInsert = {
        values: jest.fn().mockResolvedValue(undefined),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)

      const result = await uploadDressCodePhoto('wedding-123', mockFile)

      expect(put).toHaveBeenCalled()
      expect(result).toMatchObject({
        photoFilename: expect.stringContaining('dresscode'),
        photoUrl: expect.stringContaining('blob.vercel-storage.com'),
      })
    })

    it('should replace existing dress code photo', async () => {
      const mockFile = createMockFile('new-dresscode.jpg', 1024, 'image/jpeg')

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'dresscode-123',
            photoFilename: 'old-dresscode.jpg',
          },
        ]), // Existing dress code
      }

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(undefined),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      await uploadDressCodePhoto('wedding-123', mockFile)

      // Should delete old blob
      expect(del).toHaveBeenCalledWith('old-dresscode.jpg')
      // Should upload new blob
      expect(put).toHaveBeenCalled()
      // Should update database
      expect(mockUpdate.set).toHaveBeenCalled()
    })
  })

  describe('deleteDressCodePhoto', () => {
    it('should delete dress code photo and clear database fields', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'dresscode-123',
            photoFilename: 'dresscode.jpg',
          },
        ]),
      }

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(undefined),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      await deleteDressCodePhoto('wedding-123')

      expect(del).toHaveBeenCalledWith('dresscode.jpg')
      expect(mockUpdate.set).toHaveBeenCalledWith(
        expect.objectContaining({
          photoFilename: null,
          photoFileSize: null,
          photoMimeType: null,
        })
      )
    })

    it('should throw error if dress code photo not found', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            id: 'dresscode-123',
            photoFilename: null, // No photo
          },
        ]),
      }

      ;(db.select as jest.Mock).mockReturnValue(mockSelect)

      await expect(deleteDressCodePhoto('wedding-123')).rejects.toThrow(
        'Dress code photo not found'
      )
    })
  })
})
