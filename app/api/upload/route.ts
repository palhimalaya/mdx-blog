import { analyzeQuestionPaper } from '@/lib/oldQuestionGenerator';
import { NextRequest, NextResponse } from 'next/server';
import PdfParse from 'pdf-parse';


export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll('filepond');
  let responseText = '';

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0];
    if (uploadedFile instanceof File) {
      const uploadedFileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
      const pdfData = await PdfParse(uploadedFileBuffer);
      const textContent = pdfData.text.trim();
      if (!textContent) {
        console.warn("No text extracted from PDF.");
        return null;
    }
    responseText = await analyzeQuestionPaper(textContent);
    } else {
      console.log('Uploaded file is not a valid file.');
      return new NextResponse('Uploaded file is not a valid file.', { status: 400 });
    }
    
  } else {
    console.log('No files found.');
    return new NextResponse('No files found.', { status: 400 });
  }
  const response = new NextResponse(responseText);
  return response;
}