import React from 'react';
import Uploady, { useRequestPreSend } from '@rpldy/uploady';
import UploadButton, { UploadButtonProps } from '@rpldy/upload-button';
import axios from 'axios';

export const SignedUploadButton: React.FC<UploadButtonProps> = (props) => {
  useRequestPreSend(async ({ options }) => {
    const timestamp = Date.now();

    const response = await axios.post('/api/image-sign', {
      ...options.destination.params,
      timestamp: timestamp.toString(),
    });

    const responseJson = response.data;

    return {
      options: {
        destination: {
          params: {
            signature: responseJson.signature as string,
            timestamp: timestamp.toString(),
            api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
          },
        },
      },
    };
  });

  return <UploadButton {...props}>Upload Image</UploadButton>;
};
