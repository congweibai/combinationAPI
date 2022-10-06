export const formatJsonResponse = ({
  statusCode = 200,
  data,
}: {
  statusCode?: number;
  data: any;
}) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};
