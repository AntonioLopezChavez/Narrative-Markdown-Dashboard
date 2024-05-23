import { useState } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import '../app/globals.css'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { RotateCw, Heart } from 'lucide-react';

function App() {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loadingText, setLoadingText] = useState<boolean>(false)
  const [loadingFile, setLoadingFile] = useState<boolean>(false)
  const [pdfUrl, setPdfUrl] = useState<string>('https://web.seducoahuila.gob.mx/biblioweb/upload/Frankenstein%20o%20el%20moderno%20Prometeo-libro.pdf')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setFile(files[0])
    }
  }

  const onSubmitText = async () => {

    setLoadingText(true);

    if (!text) {
      return;
    }

    const bodyContent = JSON.stringify({
      "text": text,
    });

    try {
      const response = await fetch('https://narrative-markdown-api.onrender.com/generate/text', {
        method: 'POST',
        body: bodyContent,
        headers: {
          'content-Type': "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const result = await response.json();
      console.log('Success:', result);
      setPdfUrl(result.url);
    } catch (error) {
      console.error('Error:', error);
    }

    setLoadingText(false);

  }

  const onsubmitFile = async () => {

    setLoadingFile(true);

    const formData = new FormData();

    if (!file) {
      return;
    }

    formData.append('file', file);

    try {
      const response = await fetch('https://narrative-markdown-api.onrender.com/generate/file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const result = await response.json();
      console.log('Success:', result);
      setPdfUrl(result.url);
    } catch (error) {
      console.error('Error:', error);
    }

    setLoadingFile(false);

  }

  return (
    <>
      <h1 className='text-center text-3xl mt-4 font-bold'>Narrative Markdown Dashboard</h1>
      <h2 className='text-center text-xl font-semibold'>Integrantes del equipo: </h2>
      <p className='text-center'>Romel Vázquez</p>
      <p className='text-center'>Antonio López</p>
      <p className='text-center'>Brenda Saucedo</p>
      <p className='text-center'>Thomas Freund</p>
      <p className='text-center'>Santiago Serarno</p>
      <hr className='mx-4 mt-2' />
      <div className="md:flex h-screen">
        <div className="md:w-1/2 p-4 pr-2">
          <Textarea
            className="w-full md:h-1/2"
            placeholder="Write your text here..."
            value={text}
            onChange={(e) => {
              setFile(null);
              setText(e.target.value);
            }}
            name='Email'
          ></Textarea>
          {loadingText 
            ? <Button className='w-full mt-4' disabled><RotateCw className='animate-spin' /></Button>
            : <Button onClick={onSubmitText} className='w-full mt-4' disabled={text == ''}>Submit text</Button>
          }
          <div className="w-full mt-4 md:h-1/2">
            <Input id="picture" className='' onChange={handleFileChange} type="file" />
            {loadingFile 
              ? <Button className='w-full mt-4' disabled><RotateCw className='animate-spin' /></Button>
              : <Button onClick={onsubmitFile} className='w-full mt-4' disabled={file == null}>Submit file</Button>
            }
          </div>
        </div>
        <div className="md:w-1/2 h-full p-4 pl-2">
          <iframe
            src={pdfUrl}
            className="w-full h-full border border-gray-300 rounded-lg"
            title="PDF Viewer"
          ></iframe>
        </div>
      </div>
      <hr className='mx-4 mt-2' />
      <p className='text-center flex justify-center mt-2 sm:visible invisible'>Dashboard hecho con <Heart className='mx-2' /> por Luis Ángel Guzmán</p>
    </>
  );
}
/*
Romel Vazquez
Antonio López
Brenda Saucedo
Thomas Freund
Santiago Serarno
Juan Daniel Rodríguez
*/
export default App;
