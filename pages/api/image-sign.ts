// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import cloudinary from 'cloudinary';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = await cloudinary.v2.utils.api_sign_request(
    req.body,
    process.env.CLOUDINARY_API_SECRET
  );
  res.status(200).json({ ...req.body, signature });
};
