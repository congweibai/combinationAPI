import type { AWS } from '@serverless/typescript';

const functions: AWS['functions'] = {
  functionName: {
    handler: 'src/functions/combinationAPI/index.handler',
  },
};

export default functions;
