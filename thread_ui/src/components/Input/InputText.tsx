import React from 'react';

interface InputProps {
    type?: string;
    placeholder?: string;
    onChange? : (event : React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = (props) => {
    return (
        <div>
            <input onChange={props.onChange} className="border rounded-md outline-0 w-full px-4 py-3 text-black " type={props.type} placeholder={props.placeholder}></input>
        </div>
    );
};

export default Input;
