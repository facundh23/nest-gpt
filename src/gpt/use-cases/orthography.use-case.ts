interface Options {
  prompt: string;
}

export const orthographyCheckUsecase = async (options: Options) => {
  const { prompt } = options;
  return {
    prompt: prompt,
    apikey: process.env.OPENAI_API_KEY,
  };
};
