import React, { forwardRef, useId } from 'react'

function Input({
    label,
    type="text",
    classsname="",
    ...prop
},ref) {
    const id=useId();
  return (
    <div className='border-1 rounded-2xl flex flex-col '>
        {label &&(
            <label htmlFor={id} className='text-red font-bold '>
                {label}
            </label>
        )}

        <input

        id={id}
        ref={ref}
        {...prop}
        className={`${classsname} outline-none h-10`}
        type={type} />
    </div>
  )
}

export default forwardRef(Input);