"use server";

import { supabaseServer } from "@/lib/supabase";
import { revalidateTag } from "next/cache";
import { QuestionMetaData } from "@/types/questions";
import { OldQuestionFormMetadata } from "@/types/types";
import { FacultyMetaData } from "@/types/faculties";
import { SemesterMetaData } from "@/types/semesters";
import { SubjectMetaData } from "@/types/subjects";

export const getOldQuestions = async (): Promise<QuestionMetaData[]> => {
  const { data, error } = await supabaseServer.from("old_questions").select("*");
  if (error) {
    console.error("Error fetching old questions:", error);
    throw new Error("Failed to fetch old questions");
  }
  if (!data) {
    throw new Error("Failed to fetch questions");
  }
  if (!data) {
    throw new Error("Failed to fetch faculties");
  }
  return data;
};

const getOrCreateFacultyId = async (faculty: string): Promise<number> => {
  const { data: facultyData, error: facultyError } = await supabaseServer
    .from("faculties")
    .select("id")
    .eq("name", faculty);
  if (facultyError) {
    console.error("Error fetching faculty:", facultyError);
    throw new Error("Failed to fetch faculty");
  }

  if (facultyData.length === 0) {
    const { data, error } = await supabaseServer.from("faculties").insert({ name: faculty }).select("id").single();
    if (error) {
      console.error("Error creating faculty:", error);
      throw new Error("Failed to create faculty");
    }
    return data.id;
  } else {
    return facultyData[0].id;
  }
};

const getOrCreateSemesterId = async (semester: string, facultyId: number): Promise<number> => {
  const { data: semesterData, error: semesterError } = await supabaseServer
    .from("semesters")
    .select("id")
    .eq("name", semester)
    .eq("faculty_id", facultyId);
  if (semesterError) {
    console.error("Error fetching semester:", semesterError);
    throw new Error("Failed to fetch semester");
  }

  if (semesterData.length === 0) {
    const { data, error } = await supabaseServer.from("semesters").insert({ name: semester, faculty_id: facultyId }).select("id").single();
    if (error) {
      console.error("Error creating semester:", error);
      throw new Error("Failed to create semester");
    }
    return data.id;
  } else {
    return semesterData[0].id;
  }
};

const getOrCreateSubjectId = async (subject: string, semesterId: number): Promise<number> => {
  const { data: subjectData, error: subjectError } = await supabaseServer
    .from("subjects")
    .select("id")
    .eq("name", subject)
    .eq("semester_id", semesterId);
  if (subjectError) {
    console.error("Error fetching subject:", subjectError);
    throw new Error("Failed to fetch subject");
  }

  if (subjectData.length === 0) {
    const { data, error } = await supabaseServer.from("subjects").insert({ name: subject, semester_id: semesterId }).select("id").single();
    if (error) {
      console.error("Error creating subject:", error);
      throw new Error("Failed to create subject");
    }
    return data.id;
  } else {
    return subjectData[0].id;
  }
};

export const createOrUpdateOldQuestion = async (formData: OldQuestionFormMetadata): Promise<QuestionMetaData[]> => {
  const { faculty, semester, subject, question } = formData;

  const facultyId = await getOrCreateFacultyId(faculty);
  const semesterId = await getOrCreateSemesterId(semester, facultyId);
  const subjectId = await getOrCreateSubjectId(subject, semesterId);

  const { data: existingQuestions, error: fetchError } = await supabaseServer
    .from("old_questions")
    .select("*")
    .eq("subject_id", subjectId);

  if (fetchError) {
    console.error("Error fetching existing question:", fetchError);
    throw new Error("Failed to fetch existing question");
  }

  let data, error;

  if (existingQuestions && existingQuestions.length > 0) {
    const questionId = existingQuestions[0].id;
    ({ data, error } = await supabaseServer
      .from("old_questions")
      .update({ content: question })
      .eq("id", questionId)
      .select("*"));
  } else {
    ({ data, error } = await supabaseServer
      .from("old_questions")
      .insert({ content: question, subject_id: subjectId })
      .select("*"));
  }

  if (error) {
    console.error("Error creating or updating old question:", error);
    throw new Error("Failed to create or update old question");
  }

  if (!data) {
    throw new Error("Failed to create or update question");
  }

  return data;
};

export const getFaculties = async (): Promise<FacultyMetaData[]> => {
  const { data, error } = await supabaseServer.from("faculties").select("*");
  if (error) {
    console.error("Error fetching faculties:", error);
    throw new Error("Failed to fetch faculties");
  }
  return data;
}

export const getSemesters = async (facultyId: number): Promise<SemesterMetaData[]> => {
  const { data, error } = await supabaseServer.from("semesters").select("*").eq("faculty_id", facultyId);
  if (error) {
    console.error("Error fetching semesters:", error);
    throw new Error("Failed to fetch semesters");
  }
  return data;
};

export const getSubjects = async (semesterId: number): Promise<SubjectMetaData[]> => {
  const { data, error } = await supabaseServer.from("subjects").select("*").eq("semester_id", semesterId);
  if (error) {
    console.error("Error fetching subjects:", error);
    throw new Error("Failed to fetch subjects");
  }
  return data;
};

export const getQuestionsBySubjectId = async (subjectId: number): Promise<QuestionMetaData[]> => {
  const { data, error } = await supabaseServer.from("old_questions").select("*").eq("subject_id", subjectId);
  if (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions");
  }
  return data;
};