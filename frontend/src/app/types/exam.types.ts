export interface Exam {
  id: number;
  name: string;
  date: Date;
  time: string;
  location: string;
  course: string;
  subject: string;
  semester: string;
  notes?: string;
}

export interface ExamPopupPosition {
  top: string;
  left: string;
  transformOrigin?: string;
}
