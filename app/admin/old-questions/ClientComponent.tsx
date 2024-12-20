'use client';

import React, { useState, useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import CreatableSelect from 'react-select/creatable';
import { FacultyMetaData } from '@/types/faculties';
import { SemesterMetaData } from '@/types/semesters';
import { SubjectMetaData } from '@/types/subjects';
import { OldQuestionFormMetadata } from '@/types/types';
import { getSemesters, getSubjects, getQuestionsBySubjectId, createOrUpdateOldQuestion } from '@/lib/oldQuestionSupabase';
import { QuestionMetaData } from '@/types/questions';
import { toast } from 'sonner';
import ShowMdxContent from '@/components/old-questions/ShowMdxContent';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileEncode, FilePondPluginFileValidateSize);

export default function ClientComponent({ faculties }: { faculties: FacultyMetaData[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<{ value: number; label: string; __isNew__?: boolean } | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<{ value: number; label: string; __isNew__?: boolean } | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<{ value: number; label: string; __isNew__?: boolean } | null>(null);
  const [semesters, setSemesters] = useState<{ value: number; label: string }[]>([]);
  const [subjects, setSubjects] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    if (selectedFaculty && selectedFaculty.value && !selectedFaculty.__isNew__) {
      const fetchSemesters = async () => {
        const data: SemesterMetaData[] = await getSemesters(selectedFaculty.value);
        setSemesters(data.map(semester => ({ value: semester.id!, label: semester.name })));
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
    if (selectedSemester && selectedSemester.value && !selectedSemester.__isNew__) {
      const fetchSubjects = async () => {
        const data: SubjectMetaData[] = await getSubjects(selectedSemester.value);
        setSubjects(data.map(subject => ({ value: subject.id!, label: subject.name })));
      };
      fetchSubjects();
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSubject && selectedSubject.value && !selectedSubject.__isNew__) {
      const fetchQuestions = async () => {
        const data: QuestionMetaData[] = await getQuestionsBySubjectId(selectedSubject.value);
        setResult(data[0]?.content || null);
      }
      fetchQuestions();
    } else {
      setResult(null);
    }
  }, [selectedSubject]);

  const handleAnalyze = () => {
    if (!file) {
      setError('Please select a file');
      console.error('No file selected');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('filepond', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('File upload failed: ' + response.statusText);
        }
      })
      .then(async (text) => {
        setResult(text);
        setLoading(false);
      })
      .catch((error) => {
        toast.error('Error analyzing file: ' + error);
        setLoading(false);
      });
  };

  const handleSubmit = async () => {
    if (!selectedFaculty || !selectedSemester || !selectedSubject || !result) {
      setError('Please fill in all fields and upload a file.');
      return;
    }
    setSubmitting(true);
    const formData: OldQuestionFormMetadata = {
      faculty: selectedFaculty.label,
      semester: selectedSemester.label,
      subject: selectedSubject.label,
      question: result,
    };

    try {
      await createOrUpdateOldQuestion(formData);
      setError(null);
      setSubmitting(false);
      toast.success('Old question submitted successfully');
    } catch (err) {
      setError('Error submitting form: ' + (err as Error).message);
      setSubmitting(false);
      toast.error('Error submitting form');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 p-4">
      <div className="w-full md:w-1/3">
        <div className={`${error ? 'border-red-500 border-2 rounded p-4' : ''} dark:bg-gray-800 dark:border-gray-700 p-4 rounded-lg`}>
          <CreatableSelect
            isClearable
            options={faculties.map(faculty => ({ value: faculty.id!, label: faculty.name }))}
            onChange={setSelectedFaculty}
            placeholder="Select or create faculty"
            className="my-react-select-container"
            classNamePrefix="my-react-select"
          />
          <CreatableSelect
            isClearable
            options={semesters}
            onChange={setSelectedSemester}
            placeholder="Select or create semester"
            isDisabled={!selectedFaculty}
            className="my-react-select-container mt-4"
            classNamePrefix="my-react-select"
          />
          <CreatableSelect
            isClearable
            options={subjects}
            onChange={setSelectedSubject}
            placeholder="Select or create subject"
            isDisabled={!selectedSemester}
            className="my-react-select-container mt-4"
            classNamePrefix="my-react-select"
          />
          <FilePond
            allowMultiple={false}
            acceptedFileTypes={['application/pdf']}
            onupdatefiles={(fileItems) => {
              setFile(fileItems.length > 0 ? (fileItems[0].file as File) : null);
              setError(null);
            }}
            onprocessfile={(error, file) => {
              if (error) {
                setError('Error processing file: ' + error);
              }
            }}
            className="dark:text-gray-300 mt-4"
          />
          {error && <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>}
        </div>
        <button
          onClick={handleAnalyze}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 w-full"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 w-full"
          disabled={loading || !result}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      <div className="container max-w-3xl">
        {loading ? (
          <p className='container'>Analyzing...</p>
        ) : result ? (
          <ShowMdxContent content={result} />
        ) : (
          <p>No analysis result yet.</p>
        )}
      </div>
    </div>
  );
}