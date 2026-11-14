import { FeaturePage } from '@/components/app/FeaturePage'

export const instant = false

export default async function JointPotPage({
  params,
}: {
  params: Promise<{ potId: string }>
}) {
  const { potId } = await params
  return <FeaturePage screen="joint-detail" potId={potId} />
}
