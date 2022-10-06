import { formatJsonResponse } from '@libs/apiGateway';
import { APIGatewayProxyEvent } from 'aws-lambda';
import axios from 'axios';

export const handler = async (event: APIGatewayProxyEvent) => {
  //ourUrl/gameDeals?currency=aud

  try {
    const { queryStringParameters = {} } = event;

    const { currency } = queryStringParameters;

    if (!currency) {
      return formatJsonResponse({
        statusCode: 400,
        data: {
          message: 'Missing Query String of currency',
          path: event.path,
        },
      });
    }

    const deals = await axios.get(
      'https://www.cheapshark.com/api/1.0/deals?upperPrice=25&pageSize=5'
    );

    const currencyData = await axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`
    );

    const currencyConversion = currencyData.data[currency];

    const repricedDeals = deals.data.map((deal) => {
      const {
        title,
        storeID,
        salePrice,
        normalPrice,
        savings,
        steamRatingPercent,
        releaseDate,
      } = deal;

      return {
        title,
        storeID,
        steamRatingPercent,
        salePrice: salePrice * currencyConversion,
        normalPrice: normalPrice * currencyConversion,
        savingsPercent: savings,
        releaseDate: new Date(releaseDate * 1000).toDateString(),
      };
    });

    return formatJsonResponse({
      data: repricedDeals,
    });
  } catch (error) {
    console.log('error', error);
    return formatJsonResponse({
      statusCode: 502,
      data: {
        message: error.message,
      },
    });
  }
};
