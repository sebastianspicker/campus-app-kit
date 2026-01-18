export type CourseLink = {
  id: string;
  title: string;
  url: string;
};

export async function fetchCourseLinks(): Promise<CourseLink[]> {
  return [];
}
