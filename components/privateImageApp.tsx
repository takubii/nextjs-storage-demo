'use client';

import { supabase } from '@/utils/supabase/supabase';
import { useEffect, useState } from 'react';

export default function PrivateImageApp() {
  const [urlList, setUrlList] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState('hidden');

  const listAllImage = async () => {
    const tempUrlList: string[] = [];
    setLoadingState('flex justify-center');
    const { data, error } = await supabase.storage.from('private-image-bucket').list('img', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.log(error);
      return;
    }

    const fileList = data;

    for (let index = 0; index < fileList.length; index++) {
      if (fileList[index].name !== '.emptyFolderPlaceholder') {
        const filePath = `img/${fileList[index].name}`;
        const { data, error } = await supabase.storage
          .from('private-image-bucket')
          .createSignedUrl(filePath, 300);

        if (error) {
          console.log(error);
          return;
        }

        tempUrlList.push(data.signedUrl);
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

  return (
    <>
      <div className='w-full max-w-3xl'>
        <button
          onClick={listAllImage}
          className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200'
        >
          リロード
        </button>
        <div className={loadingState} aria-label='読み込み中'>
          <div className='animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent'></div>
        </div>
        <ul className='flex flex-wrap w-full'>
          {urlList.map((item, index) => (
            <li className='w-1/4 h-auto p-1' key={item}>
              <a className='hover:opacity-50' href={item} target='_blank'>
                <img className='object-cover max-h-32 w-full' src={item} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
