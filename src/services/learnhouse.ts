const LEARNHOUSE_BASE_URL = import.meta.env.VITE_LEARNHOUSE_BASE_URL || 'https://learn.adroadomain.com/api/v1'
const LEARNHOUSE_PUBLIC_URL = import.meta.env.VITE_LEARNHOUSE_PUBLIC_URL || 'https://learn.adroadomain.com'

export interface LearnHouseCourse {
  id: number
  course_uuid: string
  name: string
  description: string
  about: string
  tags: string
  thumbnail_image: string | null
  published: boolean
  estimated_minutes?: number
}

export function getCourseUrl(courseUuid: string): string {
  const uuid = courseUuid.replace('course_', '')
  return `${LEARNHOUSE_PUBLIC_URL}/course/${uuid}`
}

export async function fetchCourseMetadata(courseId: string): Promise<LearnHouseCourse | null> {
  try {
    const res = await fetch(`${LEARNHOUSE_BASE_URL}/courses/${courseId}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchCourseList(): Promise<LearnHouseCourse[]> {
  try {
    const res = await fetch(`${LEARNHOUSE_BASE_URL}/courses/org_slug/default/page/1/limit/50`)
    if (!res.ok) return []
    const data: LearnHouseCourse[] = await res.json()
    return data.filter(c => c.published)
  } catch {
    return []
  }
}

export function getCategoryFromTags(tags: string): string {
  const t = tags.toLowerCase()
  if (t.includes('certification')) return 'certification'
  if (t.includes('compliance')) return 'compliance'
  if (t.includes('linux') || t.includes('operational') || t.includes('operations')) return 'technical'
  if (t.includes('framework')) return 'framework'
  return 'awareness'
}

export function estimateMinutesFromAbout(about: string): number {
  const match = about.match(/(\d+)\s*[-–]\s*(\d+)\s*minutes/i)
  if (match) return Math.round((parseInt(match[1]) + parseInt(match[2])) / 2)
  const singleMatch = about.match(/(\d+)\s*minutes/i)
  if (singleMatch) return parseInt(singleMatch[1])
  return 30
}
