import OpenAI from "openai";

interface Options {
    prompt: string,
    lang:string
}
export const translateUseCase = async (openai: OpenAI, {prompt, lang}: Options) => {
   
    const completion =  await openai.chat.completions.create({
        // stream:true,
        messages: [
            {
                role: 'system', 
                content: `Traduce el siguiente texto al idioma ${ lang }:${ prompt }`},
            // {role: 'user', content: `Idioma: ${lang}, content: ${prompt}` }
        ],
        model:'gpt-3.5-turbo',
        temperature:0.3,
        
      
    })

    const jsonResp = completion.choices[0].message;
   
    return jsonResp;
   
}