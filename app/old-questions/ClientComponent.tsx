'use client';

import React, { useState, useEffect } from 'react';
import { FacultyMetaData } from '@/types/faculties';
import { SemesterMetaData } from '@/types/semesters';
import { SubjectMetaData } from '@/types/subjects';
import { getSemesters, getSubjects, getQuestionsBySubjectId } from '@/lib/oldQuestionSupabase';
import { QuestionMetaData } from '@/types/questions';
import ClientMdx from '@/components/ClientMdx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ClientComponent({ faculties }: { faculties: FacultyMetaData[] }) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [semesters, setSemesters] = useState<SemesterMetaData[]>([]);
  const [subjects, setSubjects] = useState<SubjectMetaData[]>([]);

  useEffect(() => {
    if (selectedFaculty) {
      console.log('Fetching semesters for faculty:', selectedFaculty);
      const fetchSemesters = async () => {
        const data: SemesterMetaData[] = await getSemesters(selectedFaculty);
        setSemesters(data);
      };
      fetchSemesters();
    } else {
      setSemesters([]);
      setSelectedSemester(null);
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [selectedFaculty]);

  useEffect(() => {
    if (selectedSemester) {
      const fetchSubjects = async () => {
        const data: SubjectMetaData[] = await getSubjects(selectedSemester);
        setSubjects(data);
      };
      fetchSubjects();
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSubject) {
      const fetchQuestions = async () => {
        const data: QuestionMetaData[] = await getQuestionsBySubjectId(selectedSubject);
        setResult(data[0].content);
      }
      fetchQuestions();
    } else {
      setResult(null);
    }
  }, [selectedSubject]);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 p-4">
      <div className="w-full md:w-1/3">
        <div className={`${error ? 'border-red-500 border-2 rounded p-4' : ''}`}>
          <div className="mb-4">
            <Select onValueChange={(value) => setSelectedFaculty(Number(value) || null)}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {faculties.map(faculty => (
                    faculty.id && <SelectItem key={faculty.id} value={faculty.id.toString()}>{faculty.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Select onValueChange={(value) => setSelectedSemester(Number(value) || null)} disabled={!selectedFaculty}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {semesters.map(semester => (
                    semester.id && <SelectItem key={semester.id} value={semester.id.toString()}>{semester.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Select onValueChange={(value) => setSelectedSubject(Number(value) || null)} disabled={!selectedSemester}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {subjects.map(subject => (
                    subject.id && <SelectItem key={subject.id} value={subject.id.toString()}>{subject.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>}
        </div>
      </div>
      <div className="container max-w-3xl">
        {result ? (
          <main className="prose dark:prose-invert">
            <ClientMdx {...JSON.parse(result)} />
          </main>
        ) : (
          <p>
            Select a faculty, semester, and subject to view questions.
          </p>
        )}
      </div>
    </div>
  );
}