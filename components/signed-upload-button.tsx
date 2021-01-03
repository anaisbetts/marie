import React from 'react';

import {
  useItemErrorListener,
  useItemFinishListener,
  useRequestPreSend,
} from '@rpldy/uploady';

import UploadButton, { UploadButtonProps } from '@rpldy/upload-button';

import axios from 'axios';
import { useMutation } from 'draqula';
import gql from 'graphql-tag';

import { useAuth } from './use-firebase';

const UPLOAD_IMAGE = gql`
  mutation UploadImage($image_url: String!, $asset_id: String!) {
    insert_image_uploads_one(
      object: { image_url: $image_url, asset_id: $asset_id }
    ) {
      image_url
      asset_id
    }
  }
`;

export interface UploadedImage {
  id: string;
  imageUrl: string;
}

export interface AuthedUploadButtonProps extends UploadButtonProps {
  onSubmitted?: (image: UploadedImage) => unknown;
  onError?: (errorResponse: any) => unknown;
  children: JSX.Element;
}

export const AuthedUploadButton: React.FC<AuthedUploadButtonProps> = ({
  onSubmitted,
  onError,
  children,
  ...others
}) => {
  const auth = useAuth();
  const { mutate } = useMutation<{ image_url: string; asset_id: string }>(
    UPLOAD_IMAGE
  );
  if (!auth) return null;

  const submit = async (x: SignedUploadedImage) => {
    try {
      await mutate({
        image_url: x.url,
        asset_id: x.asset_id,
      });

      onSubmitted?.({ id: x.asset_id, imageUrl: x.url });
    } catch (e) {
      onError?.(e);
    }
  };

  return (
    <SignedUploadButton onSubmitted={submit} onError={onError} {...others}>
      {children}
    </SignedUploadButton>
  );
};

export interface SignedUploadedImage {
  asset_id: string;
  url: string;
}

const urps: any = useRequestPreSend;

export interface SignedUploadButtonProps extends UploadButtonProps {
  onSubmitted?: (image: SignedUploadedImage) => unknown;
  onError?: (errorResponse: any) => unknown;
}

export const SignedUploadButton: React.FC<SignedUploadButtonProps> = ({
  onSubmitted,
  onError,
  children,
  ...others
}) => {
  urps(async ({ options }) => {
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

  useItemErrorListener((x) => onError?.(x.uploadResponse));
  useItemFinishListener((x) =>
    onSubmitted?.({
      url: x.uploadResponse.data.secure_url,
      asset_id: x.uploadResponse.data.asset_id,
    })
  );

  return <UploadButton {...others}>{children}</UploadButton>;
};
