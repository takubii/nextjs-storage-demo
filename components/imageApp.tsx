'use client';

import { supabase } from '@/utils/supabase/supabase';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function ImageApp() {
  const public_url =
    'https://kgslholowdqceepdonwl.supabase.co/storage/v1/object/public/public-image-bucket/img/';
  const [urlList, setUrlList] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState('hidden');

  const listAllImage = async () => {
    const tempUrlList: string[] = [];
    setLoadingState('flex justify-center');
    const { data, error } = await supabase.storage.from('public-image-bucket').list('img', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.log(error);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      if (data[index].name !== '.emptyFolderPlaceholder') {
        tempUrlList.push(data[index].name);
      }
    }
    setUrlList(tempUrlList);
    setLoadingState('hidden');
  };

  useEffect(() => {
    (async () => {
      await listAllImage();
    })();
  }, []);

  const [file, setFile] = useState<File>();

  const handleChangeFile = (e: any) => {
    if (e.target.files.length !== 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (file!!.type.match('image.*')) {
      const fileExtension = file!!.name.split('.').pop();
      const { error } = await supabase.storage
        .from('public-image-bucket')
        .upload(`img/${uuidv4()}.${fileExtension}`, file!!);

      if (error) {
        alert('エラーが発生しました：' + error.message);
        return;
      }

      setFile(undefined);
      await listAllImage();
    } else {
      alert('画像ファイル以外はアップロードできません');
    }
  };

  return (
    <>
      <form className='mb-4 text-center' onSubmit={onSubmit}>
        <input
          className='relative mb-4 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none'
          type='file'
          id='formFile'
          accept='image/*'
          onChange={(e) => {
            handleChangeFile(e);
          }}
        />
        <button
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-25'
          type='submit'
          disabled={file === undefined}
        >
          送信
        </button>
      </form>
      <div className='w-full max-w-3xl'>
        <div className={loadingState} aria-label='読み込み中'>
          <div className='animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent'></div>
        </div>
        <ul className='flex flex-wrap w-full'>
          {urlList.map((item) => (
            <li className='w-1/4 h-auto p-1' key={item}>
              <a className='hover:opacity-50' href={public_url + item} target='_blank'>
                <img className='object-cover max-h-32 w-full' src={public_url + item} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
