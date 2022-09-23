import React from 'react'
import { CopyIcon } from '@chakra-ui/icons'
import './CopiableText.css'
const CopiableText = ({ text }) => {

    const copyToClipboard = (str) => {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(str);
        return Promise.reject('The Clipboard API is not available.');
    };

    return (
        <span className='copiable' 
            onClick={()=>copyToClipboard(text)}>
            {text}<CopyIcon/>
        </span>
    )
}

export default CopiableText