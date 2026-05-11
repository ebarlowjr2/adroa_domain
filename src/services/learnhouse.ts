const LEARNHOUSE_BASE_URL = import.meta.env.VITE_LEARNHOUSE_BASE_URL || 'https://learn.adroadomain.com/api/v1'
const LEARNHOUSE_PUBLIC_URL = import.meta.env.VITE_LEARNHOUSE_PUBLIC_URL || 'https://learn.adroadomain.com'

export interface LearnHouseCourse {
  course_uuid: string
  name: string
  description: string
  thumbnail_image: string | null
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
    const res = await fetch(`${LEARNHOUSE_BASE_URL}/courses/?org_id=1&page=1&limit=50`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}
