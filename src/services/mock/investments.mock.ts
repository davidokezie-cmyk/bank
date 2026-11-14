/**
 * Investments mock service.
 * Interface: investments.ts
 * Mock implementation for demo mode.
 * Label "Partner-powered" and clearly demo.
 * Investments are always visually and textually separate from savings.
 * Risk note shown on investment screens.
 */

// Investment product interface
export interface InvestmentProduct {
  id: string
  name: string
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  returnNote: string
  minimumInvestmentKobo: number
  currentValueKobo: number
  targetAllocationKobo: number
  isPartnerPowered: boolean
  riskNote: string
}

// Mock investment products
export const MOCK_INVESTMENT_PRODUCTS: InvestmentProduct[] = [
  {
    id: 'inv_1',
    name: 'Nigeria Treasury Bills',
    description: 'Government debt securities offered through a regulated partner.',
    riskLevel: 'low',
    returnNote: 'Partner offer documents explain applicable rates, fees, and withdrawal terms. Returns are not guaranteed.',
    minimumInvestmentKobo: nairaToKobo(10000), // ₦10,000
    currentValueKobo: nairaToKobo(12000), // ₦12,000 current value
    targetAllocationKobo: nairaToKobo(10000),
    isPartnerPowered: true,
    riskNote: 'Investment value can go up and down. No guaranteed returns.',
  },
  {
    id: 'inv_2',
    name: 'Fixed Income Fund',
    description: ' diversified basket of bonds and debt instruments',
    riskLevel: 'medium',
    returnNote: 'Partner offer documents explain applicable rates, fees, and withdrawal terms. Returns are not guaranteed.',
    minimumInvestmentKobo: nairaToKobo(20000), // ₦20,000
    currentValueKobo: nairaToKobo(21500), // ₦21,500 current value
    targetAllocationKobo: nairaToKobo(20000),
    isPartnerPowered: true,
    riskNote: 'Investment value can go up and down. No guaranteed returns.',
  },
  {
    id: 'inv_3',
    name: 'Agri-Business Scheme',
    description: 'Investment in agricultural value chain enterprises',
    riskLevel: 'high',
    returnNote: 'Partner offer documents explain applicable rates, fees, and withdrawal terms. Returns are not guaranteed.',
    minimumInvestmentKobo: nairaToKobo(50000), // ₦50,000
    currentValueKobo: nairaToKobo(52000), // ₦52,000 current value
    targetAllocationKobo: nairaToKobo(50000),
    isPartnerPowered: true,
    riskNote: 'High-risk investment. Capital at risk. No guaranteed returns.',
  },
]

/**
 * Get all available investment products (mock).
 */
export function getInvestmentProducts(): InvestmentProduct[] {
  return MOCK_INVESTMENT_PRODUCTS
}

/**
 * Get a specific investment product by ID (mock).
 */
export function getInvestmentProduct(id: string): InvestmentProduct | undefined {
  return MOCK_INVESTMENT_PRODUCTS.find((product) => product.id === id)
}

/**
 * Make an investment contribution (mock).
 * In demo mode, always succeeds and contributes to a mock portfolio.
 */
export function makeInvestmentContribution(
  productId: string,
  amountKobo: number,
  _userId: string
): { success: boolean; newValueKobo: number; message: string } {
  void _userId
  const product = getInvestmentProduct(productId)

  if (!product) {
    return {
      success: false,
      newValueKobo: 0,
      message: 'Investment product not found',
    }
  }

  if (amountKobo < product.minimumInvestmentKobo) {
    return {
      success: false,
      newValueKobo: product.currentValueKobo,
      message: `Minimum investment is ${formatKobo(product.minimumInvestmentKobo)}`,
    }
  }

  // In demo mode, add the contribution to the current value
  const newValueKobo = addKobo(product.currentValueKobo, amountKobo)

  return {
    success: true,
    newValueKobo,
    message: `Investment of ${formatKobo(amountKobo)} in ${product.name} recorded in demo mode`,
  }
}

/**
 * Risk note for investment screens.
 */
export const INVESTMENT_RISK_NOTE: string = (
  'Investment value can go up and down. No guaranteed returns. ' +
  'Your capital is at risk. Past performance does not predict future results. ' +
  'Always read the offer document before investing.'
)
import { addKobo, formatKobo, nairaToKobo } from '@/lib/money'
