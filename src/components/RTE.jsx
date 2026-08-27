import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';
import conf from '../conf/conf';

export default function RTE({ name, control, label, defaultValue = "" }) {
  // Config file se key nikalna ya direct fallback string set karna
  const apiKey = conf.tinyMceApiKey || import.meta.env.VITE_TINYMCE_API_KEY || "lgsnhempgxezb06bh2sflrrw2n83w454u742v8wrvm1etmm5";

  return (
    <div className='w-full'> 
      {label && <label className='inline-block mb-1 pl-1 text-black font-medium'>{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey={apiKey}
            initialValue={defaultValue}
            value={value}
            init={{
              initialValue: defaultValue,
              height: 500,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount"
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  )
}