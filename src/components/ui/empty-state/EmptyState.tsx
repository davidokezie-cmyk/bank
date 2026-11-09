'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { PiggyBank, Layout, Calendar, Users, RefreshCw } from 'lucide-react'

/**
 * EmptyState component with types:
 * portrait, paragraph, image, avatar
 * Each has illustration, title, description, CTA
 * Used when no data is available
 * Accessible: labelled, keyboard navigable
 */
export interface EmptyStateProps {
  /** Empty state type */
  type:
    | 'default'
    | 'no-goals'
    | 'no-pots'
    | 'no-transactions'
    | 'no-contributions'
    | 'no-savings'
    | 'coming-soon'
  /** Title */
  title?: string
  /** Description */
  description?: string
  /** CTA button text */
  ctaText?: string
  /** CTA onClick */
  onCtaClick?: () => void
  /** Whether to show action list */
  showActions?: boolean
  /** Action items */
  actions?: {
    label: string
    onClick: () => void
    shortcut?: string
  }[]
  /** Additional className */
  className?: string
}

const emptyStateIllustrations: Record<
  EmptyStateProps['type'],
  { icon: React.ReactNode; title: string; description: string }
> = {
  default: {
    icon: <Layout className="h-12 w-12 mx-auto text-muted" />,
    title: 'Get started with your finances',
    description: 'Create a salary split, set savings goals, or invite friends to save together.',
  },
  'no-goals': {
    icon: <Calendar className="h-12 w-12 mx-auto text-muted" />,
    title: 'No goals yet',
    description: 'Set a target for something you\'re saving for - rent, car, education, business, or holiday.',
  },
  'no-pots': {
    icon: <PiggyBank className="h-12 w-12 mx-auto text-muted" />,
    title: 'Start a joint savings pot',
    description: 'Invite friends or family to save together toward a shared goal.',
  },
  'no-transactions': {
    icon: <RefreshCw className="h-12 w-12 mx-auto text-muted" />,
    title: 'No transactions yet',
    description: 'Your money activity will appear here as you save, spend, and contribute.',
  },
  'no-contributions': {
    icon: <Users className="h-12 w-12 mx-auto text-muted" />,
    title: 'Start contributing',
    description: 'Set up a salary split or shop & save rule to start building wealth.',
  },
  'no-savings': {
    icon: <PiggyBank className="h-12 w-12 mx-auto text-muted" />,
    title: 'Build your savings',
    description: 'Every ₦ counts. Start with a salary split or enable shop & save on your purchases.',
  },
  'coming-soon': {
    icon: <Calendar className="h-12 w-12 mx-auto text-muted" />,
    title: 'Coming soon',
    description: 'New features are on the way. Stay tuned for more ways to build wealth.',
  },
}

export const EmptyState = (props: EmptyStateProps) => {
  const {
    type = 'default',
    title,
    description,
    ctaText = 'Get started',
    onCtaClick,
    showActions = false,
    actions,
    className,
  } = props

  const illustration = emptyStateIllustrations[type] || emptyStateIllustrations.default

  const hasCta = !!ctaText || onCtaClick

  const classes = cn(
    'text-center py-12',
    className,
  )

  const actionItems = showActions && actions
    ? actions.map((action, index) => (
        <div
          key={index}
          className="p-3 rounded-lg hover:bg-surface/30 transition-colors cursor-pointer"
          onClick={action.onClick}
        >
          <span className="font-medium">{action.label}</span>
        </div>
      ))
    : []

  return (
    <div className={classes}>
      <div className="mx-auto mb-4">
        {illustration.icon}
      </div>
      <h2 className="text-xl font-medium text-title mt-2">{title || illustration.title}</h2>
      <p className="text-muted mt-1 max-w-sm mx-auto">{description || illustration.description}</p>
      {hasCta && (
        <button
          onClick={onCtaClick}
          className="mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary bg-surface hover:bg-surface/30 transition-colors"
        >
          {ctaText}
        </button>
      )}
      {actionItems.length > 0 && (
        <div className="mt-6 space-y-1 text-sm">
          {actionItems}
        </div>
      )}
    </div>
  )
}

EmptyState.displayName = 'EmptyState'