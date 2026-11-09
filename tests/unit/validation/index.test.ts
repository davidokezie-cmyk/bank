import {
  validateNuban,
  validateNigerianPhone,
  formatNigerianPhone,
  validateSalarySplitPercentages,
  formatAmount,
} from '@/lib/validation/validation'
import { nairaToKobo } from '@/lib/money'

describe('NUBAN & Nigerian Phone Validation', () => {
  describe('validateNuban', () => {
    it('should validate valid NUBAN numbers', () => {
      expect(validateNuban('0123456789').valid).toBe(true)
      expect(validateNuban('0504444444').valid).toBe(true)
    })

    it('should reject invalid NUBAN numbers', () => {
      expect(validateNuban('123456789').valid).toBe(false) // 9 digits
      expect(validateNuban('01234567891').valid).toBe(false) // 11 digits
      expect(validateNuban('abcdefghij').valid).toBe(false) // non-digits
      expect(validateNuban('').valid).toBe(false) // empty
    })

    it('should give appropriate error messages', () => {
      expect(validateNuban('123456789').message).toContain('10 digits')
      expect(validateNuban('').message).toContain('10 digits')
    })
  })

  describe('validateNigerianPhone', () => {
    it('should validate valid Nigerian phone numbers', () => {
      expect(validateNigerianPhone('+2348012345678').valid).toBe(true)
      expect(validateNigerianPhone('+2348023456789').valid).toBe(true)
      expect(validateNigerianPhone('+2348034567890').valid).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validateNigerianPhone('+23412345678').valid).toBe(false) // only 9 digits after +234
      expect(validateNigerianPhone('+23480123456789').valid).toBe(false) // 11 digits after +234
      expect(validateNigerianPhone('08012345678').valid).toBe(false) // missing +234
      expect(validateNigerianPhone('').valid).toBe(false) // empty
      expect(validateNigerianPhone('phone').valid).toBe(false) // non-numeric
    })

    it('should give appropriate error messages', () => {
      expect(validateNigerianPhone('+23412345678').message).toContain('10 digits')
      expect(validateNigerianPhone('08012345678').message).toContain('+234')
    })
  })

  describe('formatNigerianPhone', () => {
    it('should format 10-digit number with +234 prefix', () => {
      const result = formatNigerianPhone('8012345678')
      expect(result.formatted).toBe('+2348012345678')
      expect(result.wasAlreadyValid).toBe(false)
    })

    it('should preserve already-valid format', () => {
      const result = formatNigerianPhone('+2348012345678')
      expect(result.formatted).toBe('+2348012345678')
      expect(result.wasAlreadyValid).toBe(true)
    })

    it('should handle mixed input', () => {
      const result = formatNigerianPhone('2348012345678')
      // Should add the plus sign
      expect(result.formatted).toContain('+234')
      expect(result.wasAlreadyValid).toBe(false)
    })
  })

  describe('validateSalarySplitPercentages', () => {
    it('should validate percentages that total 100%', () => {
      const result = validateSalarySplitPercentages([50, 30, 20])
      expect(result.valid).toBe(true)
      expect(result.corrected).toEqual([50, 30, 20])
    })

    it('should fail when total !== 100%', () => {
      const result = validateSalarySplitPercentages([60, 30])
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('100%'))).toBe(true)
    })

    it('should not auto-correct a split that does not total 100%', () => {
      const result = validateSalarySplitPercentages([40, 30])
      expect(result.valid).toBe(false)
      expect(result.corrected).toEqual([40, 30])
    })

    it('should handle edge case of all zeros', () => {
      const result = validateSalarySplitPercentages([0, 0, 0])
      expect(result.valid).toBe(false)
      expect(result.corrected).toEqual([0, 0, 0])
    })
  })

  describe('formatAmount', () => {
    it('should format kobo as naira currency', () => {
      const result = formatAmount(nairaToKobo(1000))
      expect(result).toContain('₦')
      expect(result).toContain('1,000')
    })

    it('should format zero amount', () => {
      const result = formatAmount(0)
      expect(result).toContain('₦')
    })
  })
})